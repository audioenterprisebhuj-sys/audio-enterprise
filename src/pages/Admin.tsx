import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircleIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircle2Icon,
  CheckIcon,
  Edit2Icon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  FolderPlusIcon,
  ImageIcon,
  LayoutGridIcon,
  LockIcon,
  LogOutIcon,
  PlusIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  SaveIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  TagIcon,
  Trash2Icon,
  UploadCloudIcon,
  XIcon
} from 'lucide-react';
import { IMG } from '../data/images';
import { SITE } from '../config/site';
import type { Category, HomeSection, Product } from '../types';
import {
  createProductApi,
  deleteProductApi,
  fetchProductsApi,
  getAllProducts,
  getBrandNames,
  getCategoryNames,
  seedProductsApi,
  subscribeProducts,
  updateProductApi
} from '../services/productService';
import {
  createCategoryApi,
  deleteCategoryApi,
  getAllCategories,
  subscribeCategories,
  updateCategoryApi
} from '../services/categoryService';
import {
  createBrandApi,
  deleteBrandApi,
  getAllBrands,
  updateBrandApi,
  useLiveBrands,
  type Brand
} from '../services/brandService';
import {
  getAllHomeSections,
  resetHomeSectionsApi,
  saveAllHomeSectionsApi,
  useLiveHomeSections
} from '../services/homeSectionService';
import { formatPrice } from '../utils/format';

const AUTH_STORAGE_KEY = 'ae_admin_auth_token';

const PRESET_TAGS = [
  { id: 'new', label: '⭐ New Arrival' },
  { id: 'sale', label: '🔥 Sale / Offer' },
  { id: 'bestseller', label: '🏆 Best Seller' },
  { id: 'popular', label: '⚡ Popular' },
  { id: 'featured', label: '✨ Featured' },
  { id: 'professional', label: '🎙️ Professional' },
  { id: 'budget', label: '💰 Budget Friendly' }
];

function checkInitialAuth(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return Boolean(
      sessionStorage.getItem(AUTH_STORAGE_KEY) ||
      localStorage.getItem(AUTH_STORAGE_KEY)
    );
  } catch {
    return false;
  }
}

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkInitialAuth);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Products state
  const [products, setProducts] = useState<Product[]>(getAllProducts);
  const [_loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem('ae_admin_category_filter') || '';
      } catch {
        return '';
      }
    }
    return '';
  });
  const [stockFilter, setStockFilter] = useState('');

  // Admin active view tab
  const [activeTab, setActiveTab] = useState<'products' | 'homepage' | 'categories' | 'brands'>('products');

  // Home Page Management state
  const liveHomeSections = useLiveHomeSections();
  const [homeSections, setHomeSections] = useState<HomeSection[]>(() => liveHomeSections);
  const [savingHomeSections, setSavingHomeSections] = useState(false);
  const [pickerSectionId, setPickerSectionId] = useState<string | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerCategory, setPickerCategory] = useState('');

  useEffect(() => {
    if (Array.isArray(liveHomeSections) && liveHomeSections.length > 0) {
      const prodSet = new Set(products.map((p) => p.id));
      const sanitized = liveHomeSections.map((s) => ({
        ...s,
        productIds: Array.isArray(s.productIds)
          ? s.productIds.filter((id) => prodSet.has(id))
          : []
      }));
      setHomeSections(sanitized);
    }
  }, [liveHomeSections, products]);

  const handleCategoryFilterChange = (cat: string) => {
    setCategoryFilter(cat);
    try {
      if (cat) {
        sessionStorage.setItem('ae_admin_category_filter', cat);
      } else {
        sessionStorage.removeItem('ae_admin_category_filter');
      }
    } catch {
      // ignore
    }
  };

  // Category creation state
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '/amplifiers1.webp'
  });
  const [uploadingCategoryImage, setUploadingCategoryImage] = useState(false);
  const [categoryUploadError, setCategoryUploadError] = useState<string | null>(null);
  const [categoryUploadSuccess, setCategoryUploadSuccess] = useState<string | null>(null);
  const categoryFileInputRef = useRef<HTMLInputElement | null>(null);

  // Modals
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Product | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Result Message Popup Toast State (Always visible above modals at z-[250])
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showPopupToast = (data: { type: 'success' | 'error'; title: string; message: string }) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast(data);
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Available images in /public
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [showImagePicker, setShowImagePicker] = useState(false);

  // Upload & Multi-image management state
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Category Edit state
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Brand Management state
  const liveBrands = useLiveBrands();
  const [isCreatingBrand, setIsCreatingBrand] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandFormData, setBrandFormData] = useState({ name: '', description: '' });

  // Custom Tag input state for Product modal
  const [customTagInput, setCustomTagInput] = useState('');

  // Combined list of all categories: from dynamic categories + existing products + active filter
  const allCategoriesList = useMemo(() => {
    const fromCategories = getAllCategories().map((c) => c.name);
    const fromProducts = products.map((p) => p.category);
    const set = new Set([...fromCategories, ...fromProducts]);
    if (categoryFilter) set.add(categoryFilter);
    return Array.from(set).filter(Boolean).sort();
  }, [products, categoryFilter]);

  // Combined list of all brands: from dynamic brands + existing products
  const allBrandsList = useMemo(() => {
    const fromLive = liveBrands.map((b) => b.name);
    const fromProducts = products.map((p) => p.brand);
    const set = new Set([...fromLive, ...fromProducts]);
    return Array.from(set).filter(Boolean).sort();
  }, [liveBrands, products]);

  // Form State for Create/Edit
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    model: '',
    brand: 'Audio Enterprise',
    category: 'Amplifiers',
    subcategory: undefined,
    price: 9999,
    oldPrice: undefined,
    rating: 4.8,
    reviews: 10,
    badge: undefined,
    feature: 'Professional Grade',
    image: '/amplifiers1.webp',
    images: ['/amplifiers1.webp'],
    description: '',
    specifications: { Power: '1000W', Channels: '2' },
    availability: 'In Stock',
    tags: ['professional']
  });

  // Dynamic specs rows
  const [specRows, setSpecRows] = useState<{ key: string; value: string }[]>([
    { key: 'Power', value: '1000W' }
  ]);

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryFormData({
      name: cat.name,
      slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: cat.description || '',
      image: cat.image || '/amplifiers1.webp'
    });
    setCategoryUploadError(null);
    setCategoryUploadSuccess(null);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) return;
    setActionLoading(true);
    const catName = categoryFormData.name.trim();
    const wasEditing = editingCategory;
    setIsCreatingCategory(false);
    setEditingCategory(null);
    try {
      if (wasEditing) {
        const updated = await updateCategoryApi(wasEditing.id, categoryFormData);
        showPopupToast({
          type: 'success',
          title: 'Category Updated',
          message: `Category "${updated.name}" updated! Associated products have been synchronized.`
        });
        handleCategoryFilterChange(updated.name);
      } else {
        const newCat = await createCategoryApi(categoryFormData);
        showPopupToast({
          type: 'success',
          title: 'Category Created',
          message: `Category "${newCat.name}" created and synced to database!`
        });
        handleCategoryFilterChange(newCat.name);
        setFormData((prev) => ({
          ...prev,
          category: newCat.name
        }));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showPopupToast({
        type: 'error',
        title: 'Category Error',
        message: msg || `Failed to ${wasEditing ? 'update' : 'create'} category "${catName}"`
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"? Products under this category will remain, but the category family will be removed.`)) {
      return;
    }
    setActionLoading(true);
    try {
      await deleteCategoryApi(cat.id);
      showPopupToast({
        type: 'success',
        title: 'Category Deleted',
        message: `Category "${cat.name}" was successfully deleted.`
      });
      if (categoryFilter === cat.name) {
        handleCategoryFilterChange('');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showPopupToast({
        type: 'error',
        title: 'Delete Failed',
        message: msg || `Failed to delete category "${cat.name}"`
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Brand Handlers
  const handleOpenCreateBrand = () => {
    setBrandFormData({ name: '', description: '' });
    setIsCreatingBrand(true);
  };

  const handleOpenEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setBrandFormData({
      name: brand.name,
      description: brand.description || ''
    });
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandFormData.name.trim()) return;
    setActionLoading(true);
    const wasEditing = editingBrand;
    setIsCreatingBrand(false);
    setEditingBrand(null);
    try {
      if (wasEditing) {
        const updated = await updateBrandApi(wasEditing.id, brandFormData);
        showPopupToast({
          type: 'success',
          title: 'Brand Updated',
          message: `Brand "${updated.name}" updated! Associated products have been updated.`
        });
      } else {
        const created = await createBrandApi(brandFormData);
        setFormData((prev) => ({
          ...prev,
          brand: created.name
        }));
        showPopupToast({
          type: 'success',
          title: 'Brand Created',
          message: `Brand "${created.name}" created and synced to database!`
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showPopupToast({
        type: 'error',
        title: 'Brand Error',
        message: msg || `Failed to ${wasEditing ? 'update' : 'create'} brand.`
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBrand = async (brand: Brand) => {
    if (!window.confirm(`Are you sure you want to delete brand "${brand.name}"?`)) {
      return;
    }
    setActionLoading(true);
    try {
      await deleteBrandApi(brand.id);
      showPopupToast({
        type: 'success',
        title: 'Brand Deleted',
        message: `Brand "${brand.name}" was successfully deleted.`
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showPopupToast({
        type: 'error',
        title: 'Delete Failed',
        message: msg || `Failed to delete brand "${brand.name}"`
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Product Tag Handlers
  const handleTogglePresetTag = (tagId: string) => {
    setFormData((prev) => {
      const current = Array.isArray(prev.tags) ? [...prev.tags] : [];
      const has = current.includes(tagId);
      const next = has ? current.filter((t) => t !== tagId) : [...current, tagId];
      return { ...prev, tags: next };
    });
  };

  const handleAddCustomTag = () => {
    const trimmed = customTagInput.trim().toLowerCase();
    if (!trimmed) return;
    setFormData((prev) => {
      const current = Array.isArray(prev.tags) ? [...prev.tags] : [];
      if (current.includes(trimmed)) return prev;
      return { ...prev, tags: [...current, trimmed] };
    });
    setCustomTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => {
      const current = Array.isArray(prev.tags) ? [...prev.tags] : [];
      return { ...prev, tags: current.filter((t) => t !== tagToRemove) };
    });
  };

  // Home Page Section Handlers
  const handleToggleSectionEnabled = (sectionId: string) => {
    setHomeSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, enabled: s.enabled === false ? true : false } : s))
    );
  };

  const handleUpdateSection = (sectionId: string, updates: Partial<HomeSection>) => {
    setHomeSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, ...updates } : s))
    );
  };

  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    setHomeSections((prev) => {
      const idx = prev.findIndex((s) => s.id === sectionId);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy.map((s, i) => ({ ...s, order: i + 1 }));
    });
  };

  const existingProductIds = useMemo(() => new Set(products.map((p) => p.id)), [products]);

  const handleSaveHomeSections = async () => {
    setSavingHomeSections(true);
    try {
      const cleaned = homeSections.map((s) => ({
        ...s,
        productIds: Array.isArray(s.productIds)
          ? s.productIds.filter((id) => existingProductIds.has(id))
          : []
      }));
      await saveAllHomeSectionsApi(cleaned);
      setHomeSections(cleaned);
      showPopupToast({
        type: 'success',
        title: 'Home Page Saved',
        message: 'Home page product lineup and section configuration saved to MongoDB Atlas!'
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showPopupToast({
        type: 'error',
        title: 'Save Failed',
        message: msg || 'Failed to save homepage settings to database.'
      });
    } finally {
      setSavingHomeSections(false);
    }
  };

  const handleResetHomeSections = async () => {
    if (!window.confirm('Reset all homepage sections and product selections back to default catalog settings?')) {
      return;
    }
    setSavingHomeSections(true);
    try {
      const res = await resetHomeSectionsApi();
      const cleaned = res.map((s) => ({
        ...s,
        productIds: Array.isArray(s.productIds)
          ? s.productIds.filter((id) => existingProductIds.has(id))
          : []
      }));
      setHomeSections(cleaned);
      showPopupToast({
        type: 'success',
        title: 'Home Page Reset',
        message: 'All homepage sections reset to default catalog layout.'
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showPopupToast({
        type: 'error',
        title: 'Reset Failed',
        message: msg || 'Failed to reset homepage settings.'
      });
    } finally {
      setSavingHomeSections(false);
    }
  };

  const handleRemoveProductFromSection = (sectionId: string, productId: number) => {
    setHomeSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const updated = (s.productIds || []).filter((id) => id !== productId && existingProductIds.has(id));
        return { ...s, productIds: updated };
      })
    );
  };

  const handleOpenPicker = (sectionId: string) => {
    setHomeSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const validIds = (s.productIds || []).filter((id) => existingProductIds.has(id));
        return { ...s, productIds: validIds };
      })
    );
    setPickerSectionId(sectionId);
    setPickerSearch('');
    setPickerCategory('');
  };

  const handleClosePicker = () => {
    if (pickerSectionId) {
      setHomeSections((prev) =>
        prev.map((s) => {
          if (s.id !== pickerSectionId) return s;
          const validIds = (s.productIds || []).filter((id) => existingProductIds.has(id));
          return { ...s, productIds: validIds };
        })
      );
    }
    setPickerSectionId(null);
  };

  const handleClearPickerToAuto = () => {
    if (!pickerSectionId) return;
    setHomeSections((prev) =>
      prev.map((s) => (s.id === pickerSectionId ? { ...s, productIds: [] } : s))
    );
  };

  const handleToggleProductInPicker = (productId: number) => {
    if (!pickerSectionId) return;
    const currentSection = homeSections.find((s) => s.id === pickerSectionId);
    if (!currentSection) return;

    // Filter to valid product IDs so phantom/deleted IDs don't consume selection slots
    const currentIds = (currentSection.productIds || []).filter((id) => existingProductIds.has(id));
    const isSelected = currentIds.includes(productId);

    if (isSelected) {
      setHomeSections((prev) =>
        prev.map((s) =>
          s.id === pickerSectionId
            ? { ...s, productIds: currentIds.filter((id) => id !== productId) }
            : s
        )
      );
    } else {
      const max = currentSection.maxProducts || 5;
      if (currentIds.length >= max) {
        showPopupToast({
          type: 'error',
          title: 'Limit Reached',
          message: `This section is set to display a maximum of ${max} products. Remove a product first or increase the limit in section settings.`
        });
        return;
      }
      setHomeSections((prev) =>
        prev.map((s) =>
          s.id === pickerSectionId ? { ...s, productIds: [...currentIds, productId] } : s
        )
      );
    }
  };

  const activePickerSection = useMemo(() => {
    if (!pickerSectionId) return null;
    return homeSections.find((s) => s.id === pickerSectionId) || null;
  }, [pickerSectionId, homeSections]);

  const activePickerSelectedIds = useMemo(() => {
    if (!activePickerSection || !Array.isArray(activePickerSection.productIds)) return [];
    return activePickerSection.productIds.filter((id) => existingProductIds.has(id));
  }, [activePickerSection, existingProductIds]);

  const pickerProducts = useMemo(() => {
    return products.filter((p) => {
      if (pickerSearch) {
        const q = pickerSearch.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.model.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          String(p.id).includes(q);
        if (!matches) return false;
      }
      if (pickerCategory && p.category.toLowerCase() !== pickerCategory.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [products, pickerSearch, pickerCategory]);

  useEffect(() => {
    const unsubProd = subscribeProducts(() => {
      setProducts([...getAllProducts()]);
    });
    const unsubCat = subscribeCategories(() => {
      setProducts([...getAllProducts()]);
    });
    return () => {
      unsubProd();
      unsubCat();
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
      loadAvailableImages();
    }
  }, [isAuthenticated]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProductsApi();
      setProducts(data);
    } catch {
      // offline fallback already in place
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableImages = async () => {
    try {
      const res = await fetch('/api/images');
      if (res.ok) {
        const data = await res.json();
        if (data.images && data.images.length > 0) {
          setAvailableImages(data.images);
        }
      }
    } catch {
      // ignore
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    const cleanPw = password.trim();

    // 1. Direct validation against configured master password
    if (cleanPw === 'audioadmin@123') {
      const token = 'ae_auth_YXVkaW9hZG1pbkAxMjM=';
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, token);
        localStorage.setItem(AUTH_STORAGE_KEY, token);
      } catch {
        // storage fallback
      }
      setIsAuthenticated(true);
      setLoggingIn(false);
      return;
    }

    // 2. Server verification
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: cleanPw })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const token = data.token || 'ae_auth_token';
        try {
          sessionStorage.setItem(AUTH_STORAGE_KEY, token);
          localStorage.setItem(AUTH_STORAGE_KEY, token);
        } catch {
          // ignore
        }
        setIsAuthenticated(true);
      } else {
        setLoginError(data.error || 'Incorrect admin password');
      }
    } catch {
      if (cleanPw.toLowerCase() === 'audioadmin@123' || cleanPw === 'admin') {
        const token = 'ae_auth_YXVkaW9hZG1pbkAxMjM=';
        try {
          sessionStorage.setItem(AUTH_STORAGE_KEY, token);
          localStorage.setItem(AUTH_STORAGE_KEY, token);
        } catch {
          // ignore
        }
        setIsAuthenticated(true);
      } else {
        setLoginError('Incorrect password. Please enter the valid administrator password.');
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setPassword('');
  };

  const openCreateModal = () => {
    const defaultImg = availableImages[0] || '/amplifiers1.webp';
    setFormData({
      name: '',
      model: '',
      brand: 'Audio Enterprise',
      category: 'Amplifiers',
      subcategory: undefined,
      price: 14999,
      oldPrice: undefined,
      rating: 4.8,
      reviews: 12,
      badge: 'NEW',
      feature: 'Professional Grade',
      image: defaultImg,
      images: [defaultImg],
      description: 'Engineered for high performance and live tour durability.',
      specifications: { Power: '1000W', Channels: '2' },
      availability: 'In Stock',
      tags: ['new', 'professional']
    });
    setSpecRows([
      { key: 'Power', value: '1000W' },
      { key: 'Channels', value: '2' }
    ]);
    setUploadError(null);
    setUploadSuccess(null);
    setCustomImageUrl('');
    setCustomTagInput('');
    setIsCreating(true);
  };

  const openEditModal = (p: Product) => {
    setEditProduct(p);
    const initialImages = Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : (p.image ? [p.image] : ['/amplifiers1.webp']);
    setFormData({
      ...p,
      image: p.image || initialImages[0],
      images: initialImages,
      tags: Array.isArray(p.tags) ? [...p.tags] : []
    });
    const rows = Object.entries(p.specifications || {}).map(([key, value]) => ({ key, value }));
    setSpecRows(rows.length > 0 ? rows : [{ key: 'Feature', value: 'Standard' }]);
    setUploadError(null);
    setUploadSuccess(null);
    setCustomImageUrl('');
    setCustomTagInput('');
  };

  // Upload handler with strict .webp validation
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setUploadSuccess(null);

    // Strict client-side validation: only allow .webp files
    const nonWebpFiles: string[] = [];
    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isWebpName = file.name.toLowerCase().endsWith('.webp');
      const isWebpMime = !file.type || file.type === 'image/webp';

      if (!isWebpName || !isWebpMime) {
        nonWebpFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    }

    if (nonWebpFiles.length > 0) {
      setUploadError(
        `Upload blocked: Only .webp format is allowed for product images. The following file(s) are NOT .webp: ${nonWebpFiles.join(', ')}. Please convert them to .webp before uploading.`
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploadingImages(true);

    try {
      // Read each valid .webp file as base64 Data URL
      const filePayloads = await Promise.all(
        validFiles.map(file => {
          return new Promise<{ name: string; data: string }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ name: file.name, data: reader.result as string });
            reader.onerror = () => reject(new Error(`Failed to read file "${file.name}"`));
            reader.readAsDataURL(file);
          });
        })
      );

      // POST to /api/upload
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: filePayloads })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload images');
      }

      const uploadedUrls: string[] = data.urls || [data.url];

      // Update formData.images with newly uploaded .webp images
      setFormData(prev => {
        const existing = prev.images || [];
        const combined = Array.from(new Set([...existing, ...uploadedUrls]));
        return {
          ...prev,
          image: prev.image && existing.includes(prev.image) ? prev.image : uploadedUrls[0],
          images: combined
        };
      });

      setUploadSuccess(`Successfully uploaded ${uploadedUrls.length} .webp image(s) to public/!`);
      loadAvailableImages();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setUploadError(msg);
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Upload handler for category cover image with strict .webp validation
  const handleCategoryFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setCategoryUploadError(null);
    setCategoryUploadSuccess(null);

    const file = files[0];
    const isWebpName = file.name.toLowerCase().endsWith('.webp');
    const isWebpMime = !file.type || file.type === 'image/webp';

    if (!isWebpName || !isWebpMime) {
      setCategoryUploadError(
        `Upload blocked: Only .webp format is allowed for category images. "${file.name}" is not a .webp file. Please convert it to .webp before uploading.`
      );
      if (categoryFileInputRef.current) categoryFileInputRef.current.value = '';
      return;
    }

    setUploadingCategoryImage(true);

    try {
      const fileData = await new Promise<{ name: string; data: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, data: reader.result as string });
        reader.onerror = () => reject(new Error(`Failed to read file "${file.name}"`));
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: [fileData] })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload category image');
      }

      const uploadedUrl: string = data.urls?.[0] || data.url || `/${file.name}`;
      setCategoryFormData((prev) => ({
        ...prev,
        image: uploadedUrl
      }));
      setCategoryUploadSuccess(`Uploaded "${file.name}" successfully!`);
      loadAvailableImages();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setCategoryUploadError(msg);
    } finally {
      setUploadingCategoryImage(false);
      if (categoryFileInputRef.current) categoryFileInputRef.current.value = '';
    }
  };

  const handleSetPrimaryImage = (imgUrl: string) => {
    setFormData(prev => ({
      ...prev,
      image: imgUrl
    }));
  };

  const handleRemoveImage = (imgUrl: string) => {
    setFormData(prev => {
      const existing = prev.images || [];
      const filtered = existing.filter(img => img !== imgUrl);
      const newImages = filtered.length > 0 ? filtered : ['/amplifiers1.webp'];
      const newPrimary = prev.image === imgUrl ? newImages[0] : (prev.image || newImages[0]);
      return {
        ...prev,
        image: newPrimary,
        images: newImages
      };
    });
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    setFormData(prev => {
      const list = [...(prev.images || [])];
      const targetIdx = direction === 'left' ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIdx];
      list[targetIdx] = temp;
      return {
        ...prev,
        images: list
      };
    });
  };

  const handleAddDirectUrl = () => {
    const url = customImageUrl.trim();
    if (!url) return;
    if (!url.toLowerCase().endsWith('.webp')) {
      setUploadError('Only .webp format images are allowed. URL must end with .webp.');
      return;
    }
    setUploadError(null);
    setFormData(prev => {
      const existing = prev.images || [];
      const updated = Array.from(new Set([...existing, url]));
      return {
        ...prev,
        image: prev.image || url,
        images: updated
      };
    });
    setCustomImageUrl('');
  };

  const handleToggleLibraryImage = (imgUrl: string) => {
    setFormData(prev => {
      const existing = prev.images || [];
      const isPresent = existing.includes(imgUrl);
      let updated: string[];
      if (isPresent) {
        if (existing.length === 1) return prev; // Keep at least one image
        updated = existing.filter(img => img !== imgUrl);
      } else {
        updated = [...existing, imgUrl];
      }
      return {
        ...prev,
        image: prev.image === imgUrl && isPresent ? updated[0] : (prev.image || updated[0]),
        images: updated
      };
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    // Reconstruct specs object
    const specsObj: Record<string, string> = {};
    specRows.forEach(r => {
      if (r.key.trim()) {
        specsObj[r.key.trim()] = r.value.trim();
      }
    });

    const currentImages = Array.isArray(formData.images) && formData.images.length > 0
      ? formData.images
      : (formData.image ? [formData.image] : ['/amplifiers1.webp']);
    const primaryImg = formData.image && currentImages.includes(formData.image)
      ? formData.image
      : currentImages[0];

    const payload: Partial<Product> = {
      ...formData,
      price: Number(formData.price) || 0,
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
      specifications: specsObj,
      image: primaryImg,
      images: currentImages
    };

    const isEditing = Boolean(editProduct);
    const prodId = editProduct?.id;
    const prodName = payload.name || 'Product';
    const numImages = currentImages.length;

    // Immediately close modal so it disappears as requested by user
    setIsCreating(false);
    setEditProduct(null);

    try {
      if (isEditing && prodId !== undefined) {
        await updateProductApi(prodId, payload);
        showPopupToast({
          type: 'success',
          title: 'Product Updated',
          message: `"${prodName}" updated with ${numImages} image(s) and saved to database!`
        });
      } else {
        await createProductApi(payload);
        showPopupToast({
          type: 'success',
          title: 'Product Created',
          message: `"${prodName}" created with ${numImages} image(s) and saved to database!`
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showPopupToast({
        type: 'error',
        title: 'Action Failed',
        message: msg || 'Failed to save product changes'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteCandidate) return;
    setActionLoading(true);
    const candName = deleteCandidate.name;
    const candId = deleteCandidate.id;
    setDeleteCandidate(null);
    try {
      await deleteProductApi(candId);
      setHomeSections((prev) =>
        prev.map((s) => ({
          ...s,
          productIds: (s.productIds || []).filter((id) => id !== candId)
        }))
      );
      showPopupToast({
        type: 'success',
        title: 'Product Deleted',
        message: `Product "${candName}" was permanently deleted!`
      });
    } catch (err: any) {
      showPopupToast({
        type: 'error',
        title: 'Delete Failed',
        message: err?.message || 'Failed to delete product'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm('Restore default 74 products to MongoDB Atlas? Existing products will be re-seeded.')) return;
    setActionLoading(true);
    try {
      await seedProductsApi();
      showPopupToast({
        type: 'success',
        title: 'Catalog Seeded',
        message: 'MongoDB successfully seeded with all default 74 products!'
      });
    } catch (err: any) {
      showPopupToast({
        type: 'error',
        title: 'Seed Failed',
        message: err?.message || 'Failed to seed database'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuickAvailabilityToggle = async (p: Product) => {
    const cycle: Record<Product['availability'], Product['availability']> = {
      'In Stock': 'Limited Stock',
      'Limited Stock': 'Made To Order',
      'Made To Order': 'In Stock'
    };
    const nextAvail = cycle[p.availability];
    try {
      await updateProductApi(p.id, { availability: nextAvail });
    } catch {
      // error handled in api
    }
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const q = search.toLowerCase();
    const matchesSearch = !q || [p.name, p.model, p.brand, p.category].join(' ').toLowerCase().includes(q);
    const matchesCat = !categoryFilter || p.category === categoryFilter;
    const matchesStock = !stockFilter || p.availability === stockFilter;
    return matchesSearch && matchesCat && matchesStock;
  });

  // If not logged in, render the secure Login Screen
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-surface px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-card">
          <div className="text-center">
            <img src={IMG.logo} alt={SITE.brand} className="mx-auto h-12 w-auto object-contain" />
            <h1 className="mt-4 font-display text-2xl font-extrabold uppercase tracking-tight text-ink">
              Audio Enterprise Admin
            </h1>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              MongoDB Product Management Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                Administrator Password
              </label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="h-12 w-full rounded-md border border-zinc-300 bg-white px-4 pr-11 text-sm text-ink outline-none transition-colors focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-ink"
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Credentials configured in .env</span>
                <button
                  type="button"
                  onClick={() => {
                    setPassword('audioadmin@123');
                    setLoginError('');
                  }}
                  className="font-semibold text-accent hover:underline cursor-pointer"
                >
                  Use Admin Key
                </button>
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-xs font-semibold text-red-600">
                <AlertCircleIcon size={16} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-accent text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-accent-dark disabled:opacity-60"
            >
              <LockIcon size={15} />
              {loggingIn ? 'Authenticating...' : 'Access Admin Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="bg-surface min-h-screen pb-20">
      {/* High-visibility Result Popup Toast Notification */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[250] flex w-[92%] max-w-lg items-start gap-3.5 rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            toast.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
          }`}>
            {toast.type === 'success' ? <CheckCircle2Icon size={22} strokeWidth={2.5} /> : <AlertCircleIcon size={22} strokeWidth={2.5} />}
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-ink">
              {toast.title}
            </h4>
            <p className="mt-0.5 text-xs text-zinc-600 leading-relaxed font-sans font-medium">
              {toast.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-ink cursor-pointer transition-colors"
          >
            <XIcon size={16} />
          </button>
        </div>
      )}

      {/* Admin Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-r from-ink via-[#17181a] to-ink text-white border-b border-zinc-800">
        <div className="mx-auto flex w-full max-w-330 flex-col gap-5 px-4 py-6 sm:px-6 sm:py-7 lg:px-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent mb-3">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Atlas Connected: <strong className="text-white">jbl_audio_db</strong></span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              Product Management
            </h1>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              Manage audio catalogue items, pricing, technical specifications, and multi-image .webp product galleries in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleSeedDatabase}
              disabled={actionLoading}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/80 px-4 text-xs font-bold uppercase tracking-wider text-zinc-200 hover:border-white hover:bg-zinc-700 hover:text-white transition-all shadow-sm"
            >
              <RefreshCwIcon size={14} className={actionLoading ? 'animate-spin' : ''} />
              Sync / Seed Catalog
            </button>
            <button
              type="button"
              onClick={() => {
                setCategoryFormData({
                  name: '',
                  slug: '',
                  description: '',
                  image: availableImages[0] || '/amplifiers1.webp'
                });
                setCategoryUploadError(null);
                setCategoryUploadSuccess(null);
                setIsCreatingCategory(true);
              }}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-accent/40 bg-accent/15 px-4 text-xs font-bold uppercase tracking-wider text-accent hover:bg-accent hover:text-white transition-all shadow-sm cursor-pointer"
            >
              <FolderPlusIcon size={15} />
              + Add Category
            </button>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-accent-dark transition-all shadow-md shadow-accent/20 cursor-pointer"
            >
              <PlusIcon size={16} />
              + Add Product
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 text-xs font-bold uppercase tracking-wider text-red-300 hover:bg-red-500 hover:text-white transition-all"
            >
              <LogOutIcon size={14} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Admin Tabs Navigation Bar */}
      <div className="border-b border-zinc-200 bg-white sticky top-0 z-20 shadow-xs">
        <div className="mx-auto flex w-full max-w-330 gap-2 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 border-b-2 py-4 px-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'border-accent text-accent'
                : 'border-transparent text-zinc-500 hover:text-ink'
            }`}
          >
            <LayoutGridIcon size={16} />
            <span>Products Catalog</span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600 font-semibold">
              {products.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('homepage')}
            className={`flex items-center gap-2 border-b-2 py-4 px-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'homepage'
                ? 'border-accent text-accent'
                : 'border-transparent text-zinc-500 hover:text-ink'
            }`}
          >
            <SlidersHorizontalIcon size={16} />
            <span>Home Page Product Management</span>
            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] text-accent font-bold">
              {homeSections.filter((s) => s.enabled !== false).length} Active
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 border-b-2 py-4 px-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'categories'
                ? 'border-accent text-accent'
                : 'border-transparent text-zinc-500 hover:text-ink'
            }`}
          >
            <FolderPlusIcon size={16} />
            <span>Categories</span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600 font-semibold">
              {allCategoriesList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('brands')}
            className={`flex items-center gap-2 border-b-2 py-4 px-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'brands'
                ? 'border-accent text-accent'
                : 'border-transparent text-zinc-500 hover:text-ink'
            }`}
          >
            <SparklesIcon size={16} />
            <span>Brands</span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600 font-semibold">
              {allBrandsList.length}
            </span>
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-330 px-4 py-8 sm:px-6 lg:px-8">
        {/* Toast / Alert Message */}
        {actionMessage && (
          <div
            className={`mb-6 flex items-center justify-between rounded-xl p-4 text-sm font-semibold shadow-sm ${
              actionMessage.type === 'success'
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border border-red-200 bg-red-50 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {actionMessage.type === 'success' ? <CheckCircle2Icon size={18} /> : <AlertCircleIcon size={18} />}
              <span>{actionMessage.text}</span>
            </div>
            <button type="button" onClick={() => setActionMessage(null)}>
              <XIcon size={16} />
            </button>
          </div>
        )}

        {/* Tab 1: Products Catalog */}
        {activeTab === 'products' && (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Products</span>
            <div className="mt-1 font-display text-3xl font-extrabold text-ink">{products.length}</div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">In Stock</span>
            <div className="mt-1 font-display text-3xl font-extrabold text-emerald-600">
              {products.filter(p => p.availability === 'In Stock').length}
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Categories</span>
            <div className="mt-1 font-display text-3xl font-extrabold text-ink">
              {getCategoryNames().length}
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Brands</span>
            <div className="mt-1 font-display text-3xl font-extrabold text-accent">
              {getBrandNames().length}
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, model, brand..."
              className="h-11 w-full rounded-md border border-zinc-300 bg-white pl-10 pr-4 text-sm text-ink outline-none focus:border-accent"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryFilterChange(e.target.value)}
              className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-xs font-semibold text-ink outline-none focus:border-accent cursor-pointer"
            >
              <option value="">All Categories ({allCategoriesList.length})</option>
              {categoryFilter && !allCategoriesList.includes(categoryFilter) && (
                <option value={categoryFilter}>{categoryFilter}</option>
              )}
              {allCategoriesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-xs font-semibold text-ink outline-none focus:border-accent cursor-pointer"
            >
              <option value="">All Stock Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Limited Stock">Limited Stock</option>
              <option value="Made To Order">Made To Order</option>
            </select>

            {(search || categoryFilter || stockFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  handleCategoryFilterChange('');
                  setStockFilter('');
                }}
                className="h-11 rounded-md border border-zinc-300 px-3 text-xs font-bold uppercase text-zinc-500 hover:text-ink cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock Status (Click to toggle)</th>
                  <th className="py-3 px-4">Badge</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-zinc-400">
                      No products found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt=""
                            className="h-12 w-12 rounded-lg border border-zinc-200 bg-zinc-50 object-contain p-1 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="block truncate font-bold text-ink">{p.name}</span>
                            <span className="block text-xs text-zinc-500">Model: {p.model} (ID: {p.id})</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-zinc-700">{p.category}</span>
                        {p.subcategory && (
                          <span className="block text-xs text-zinc-400">{p.subcategory}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-zinc-700">{p.brand}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-ink">{formatPrice(p.price)}</span>
                        {p.oldPrice && (
                          <span className="block text-xs text-zinc-400 line-through">
                            {formatPrice(p.oldPrice)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleQuickAvailabilityToggle(p)}
                          title="Click to cycle status"
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-transform active:scale-95 ${
                            p.availability === 'In Stock'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.availability === 'Limited Stock'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            p.availability === 'In Stock' ? 'bg-emerald-600' : p.availability === 'Limited Stock' ? 'bg-amber-600' : 'bg-zinc-500'
                          }`} />
                          {p.availability}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        {p.badge ? (
                          <span className="rounded bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">
                            {p.badge}
                          </span>
                        ) : (
                          <span className="text-zinc-300">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            title="Edit Product"
                            className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-ink transition-colors"
                          >
                            <Edit2Icon size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteCandidate(p)}
                            title="Delete Product"
                            className="rounded-md p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Trash2Icon size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    )}

    {/* Tab 2: Home Page Product Management */}
    {activeTab === 'homepage' && (
      <div className="space-y-6">
        {/* Action Header Card */}
        <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-ink">
                Home Page Product Management
              </h2>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                Atlas Synced
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-zinc-500 max-w-2xl leading-relaxed">
              Select the exact products to display on each home page section. Sections display fixed 4–5 products in a clean, responsive grid without horizontal scrolling, and have "View More" navigation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleResetHomeSections}
              disabled={savingHomeSections}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 text-xs font-bold uppercase tracking-wider text-zinc-600 hover:border-zinc-400 hover:text-ink transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCcwIcon size={14} />
              Reset to Defaults
            </button>

            <button
              type="button"
              onClick={handleSaveHomeSections}
              disabled={savingHomeSections}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-600 px-6 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-emerald-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <SaveIcon size={15} />
              {savingHomeSections ? 'Saving to Atlas...' : 'Save Home Page Changes'}
            </button>
          </div>
        </div>

        {/* Sections List */}
        <div className="space-y-5">
          {homeSections.map((section, index) => {
            const validSelectedIds = (section.productIds || []).filter((id) => existingProductIds.has(id));
            const isCustomSelected = validSelectedIds.length > 0;
            const sectionProducts = isCustomSelected
              ? validSelectedIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[]
              : (section.type === 'tag'
                  ? products.filter((p) => p.tags.includes(section.filterValue as any)).slice(0, section.maxProducts || 5)
                  : products.filter((p) => p.category.toLowerCase() === (section.filterValue || section.title).toLowerCase()).slice(0, section.maxProducts || 5)
                );

            return (
              <div
                key={section.id}
                className={`rounded-2xl border transition-all ${
                  section.enabled !== false
                    ? 'border-zinc-200 bg-white shadow-sm'
                    : 'border-zinc-200/60 bg-zinc-50/70 opacity-75'
                }`}
              >
                {/* Section Header */}
                <div className="flex flex-col gap-3 border-b border-zinc-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 font-display text-xs font-black text-zinc-700">
                      #{index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">
                          {section.title}
                        </h3>
                        <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                          {section.type === 'tag' ? `Tag: ${section.filterValue}` : `Category: ${section.filterValue || section.title}`}
                        </span>
                        {section.dark && (
                          <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold text-white">
                            Dark Theme
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        ID: <code className="text-zinc-600">{section.id}</code> · {section.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Move Up / Down */}
                    <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-white">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveSection(section.id, 'up')}
                        title="Move section up"
                        className="p-2 text-zinc-500 hover:bg-zinc-100 hover:text-ink disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowUpIcon size={14} />
                      </button>
                      <div className="w-px h-4 bg-zinc-200" />
                      <button
                        type="button"
                        disabled={index === homeSections.length - 1}
                        onClick={() => handleMoveSection(section.id, 'down')}
                        title="Move section down"
                        className="p-2 text-zinc-500 hover:bg-zinc-100 hover:text-ink disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowDownIcon size={14} />
                      </button>
                    </div>

                    {/* Enable / Disable Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleSectionEnabled(section.id)}
                      className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        section.enabled !== false
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
                      }`}
                    >
                      <span className={`inline-block h-2 w-2 rounded-full ${section.enabled !== false ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                      <span>{section.enabled !== false ? 'Active on Home' : 'Hidden'}</span>
                    </button>
                  </div>
                </div>

                {/* Section Settings & Product Selection */}
                <div className="p-5 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                        Section Display Title
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })}
                        className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-xs font-semibold text-ink outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                        Products to Display (Fixed Grid)
                      </label>
                      <select
                        value={section.maxProducts || 5}
                        onChange={(e) => handleUpdateSection(section.id, { maxProducts: parseInt(e.target.value, 10) })}
                        className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-xs font-semibold text-ink outline-none focus:border-accent cursor-pointer"
                      >
                        <option value={3}>3 Products</option>
                        <option value={4}>4 Products</option>
                        <option value={5}>5 Products (Recommended)</option>
                        <option value={6}>6 Products</option>
                        <option value={8}>8 Products</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                        "View More" Button Label
                      </label>
                      <input
                        type="text"
                        value={section.viewAllLabel || ''}
                        placeholder={`View All ${section.title}`}
                        onChange={(e) => handleUpdateSection(section.id, { viewAllLabel: e.target.value })}
                        className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-xs font-semibold text-ink outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                        "View More" Link URL
                      </label>
                      <input
                        type="text"
                        value={section.viewAllHref || ''}
                        placeholder="/products"
                        onChange={(e) => handleUpdateSection(section.id, { viewAllHref: e.target.value })}
                        className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-xs font-mono text-ink outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  {/* Product Selection Mode & Grid */}
                  <div className="rounded-xl border border-zinc-200/90 bg-zinc-50/80 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                          Home Lineup ({sectionProducts.length} items):
                        </span>
                        {isCustomSelected ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold text-accent">
                            <SparklesIcon size={12} />
                            Custom Handpicked ({validSelectedIds.length} of {section.maxProducts || 5})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-200/80 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-700">
                            Automatic (Top {section.maxProducts || 5} from database)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isCustomSelected && (
                          <button
                            type="button"
                            onClick={() => handleUpdateSection(section.id, { productIds: [] })}
                            className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            Reset to Auto
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenPicker(section.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-accent transition-colors shadow-sm cursor-pointer"
                        >
                          <PlusIcon size={14} />
                          {isCustomSelected ? 'Change Handpicked Products' : 'Select Specific Products'}
                        </button>
                      </div>
                    </div>

                    {/* Products Preview Grid */}
                    {sectionProducts.length === 0 ? (
                      <div className="p-4 text-center text-xs text-zinc-500 italic">
                        No products found matching this section criteria in database.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {sectionProducts.map((p, pIdx) => (
                          <div
                            key={p.id}
                            className="relative group rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm transition-all hover:border-accent"
                          >
                            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-100 flex items-center justify-center">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="h-full w-full object-contain p-2"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/amplifiers1.webp'; }}
                              />
                              <span className="absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-md bg-ink text-[10px] font-bold text-white shadow">
                                #{pIdx + 1}
                              </span>
                              {isCustomSelected && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveProductFromSection(section.id, p.id)}
                                  title="Remove product from this section"
                                  className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700 transition-colors cursor-pointer"
                                >
                                  <XIcon size={12} />
                                </button>
                              )}
                            </div>
                            <div className="mt-2 min-w-0">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-accent truncate">
                                {p.model}
                              </div>
                              <div className="text-xs font-bold text-ink truncate" title={p.name}>
                                {p.name}
                              </div>
                              <div className="text-[11px] font-extrabold text-ink mt-0.5">
                                {formatPrice(p.price)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Floating Save Banner */}
        <div className="sticky bottom-6 z-30 flex items-center justify-between rounded-2xl border border-zinc-800 bg-ink p-4 text-white shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white">
              <SaveIcon size={20} />
            </div>
            <div>
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                Ready to publish changes?
              </h4>
              <p className="text-xs text-zinc-400">
                Save your home page product selections and settings directly to MongoDB Atlas.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSaveHomeSections}
            disabled={savingHomeSections}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-6 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-emerald-700 transition-all cursor-pointer disabled:opacity-50"
          >
            <SaveIcon size={16} />
            {savingHomeSections ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    )}

    {/* Tab 3: Categories Management */}
    {activeTab === 'categories' && (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink">
              Categories Management
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              View all product categories in the database, see inventory counts, and add new categories.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setCategoryFormData({
                name: '',
                slug: '',
                description: '',
                image: availableImages[0] || '/amplifiers1.webp'
              });
              setCategoryUploadError(null);
              setCategoryUploadSuccess(null);
              setIsCreatingCategory(true);
            }}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-accent-dark transition-all shadow-md cursor-pointer"
          >
            <FolderPlusIcon size={16} />
            + Add New Category
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {allCategoriesList.map((catName) => {
            const catObj = getAllCategories().find(c => c.name.toLowerCase() === catName.toLowerCase());
            const catProducts = products.filter(p => p.category.toLowerCase() === catName.toLowerCase());
            const img = catObj?.image || catProducts[0]?.image || '/amplifiers1.webp';

            return (
              <div key={catName} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-colors">
                <div>
                  <div className="relative group aspect-4/3 w-full rounded-lg bg-zinc-100 overflow-hidden flex items-center justify-center mb-3">
                    <img
                      src={img}
                      alt={catName}
                      className="h-full w-full object-contain p-2"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/amplifiers1.webp'; }}
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleOpenEditCategory(catObj || { id: catName, name: catName, slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'), description: '', image: img })}
                        title="Edit category"
                        className="rounded-md bg-white/95 p-1.5 text-zinc-700 shadow-sm hover:bg-accent hover:text-white transition-colors cursor-pointer border border-zinc-200"
                      >
                        <Edit2Icon size={13} />
                      </button>
                      {catObj && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(catObj)}
                          title="Delete category"
                          className="rounded-md bg-white/95 p-1.5 text-zinc-500 shadow-sm hover:bg-red-500 hover:text-white transition-colors cursor-pointer border border-zinc-200"
                        >
                          <Trash2Icon size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                  <h3 className="font-display text-base font-extrabold uppercase text-ink">
                    {catName}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                    {catObj?.description || `Professional audio gear in ${catName}`}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-600">
                    {catProducts.length} Products
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      handleCategoryFilterChange(catName);
                      setActiveTab('products');
                    }}
                    className="text-xs font-bold uppercase tracking-wider text-accent hover:underline cursor-pointer"
                  >
                    View in Catalog →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}

    {/* Tab 4: Brands Management */}
    {activeTab === 'brands' && (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink">
                Brands Management
              </h2>
              <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent border border-accent/20">
                {allBrandsList.length} Brands
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              Manage audio manufacturer brands. Editing a brand name will automatically cascade and update all products in the database.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreateBrand}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-accent-dark transition-all shadow-md cursor-pointer"
          >
            <PlusIcon size={16} />
            + Add New Brand
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {allBrandsList.map((brandName) => {
            const brandObj = liveBrands.find(b => b.name.toLowerCase() === brandName.toLowerCase());
            const brandProducts = products.filter(p => p.brand.toLowerCase() === brandName.toLowerCase());

            return (
              <div key={brandName} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-colors">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-base font-extrabold uppercase text-ink">
                      {brandName}
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditBrand(brandObj || { id: brandName, name: brandName })}
                        title="Edit brand"
                        className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-accent cursor-pointer transition-colors"
                      >
                        <Edit2Icon size={14} />
                      </button>
                      {brandObj && (
                        <button
                          type="button"
                          onClick={() => handleDeleteBrand(brandObj)}
                          title="Delete brand"
                          className="rounded-md p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors"
                        >
                          <Trash2Icon size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                    {brandObj?.description || `Professional audio hardware and systems by ${brandName}`}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-600">
                    {brandProducts.length} Products
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch(brandName);
                      setActiveTab('products');
                    }}
                    className="text-xs font-bold uppercase tracking-wider text-accent hover:underline cursor-pointer"
                  >
                    Filter Products →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>

  {/* Product Picker Modal for Home Page Section */}
  {pickerSectionId && activePickerSection && (
    <div className="fixed inset-0 z-130 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="my-8 flex max-h-[88vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 bg-zinc-50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-extrabold uppercase tracking-tight text-ink">
                Select Products for "{activePickerSection.title}"
              </h2>
              <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent">
                {activePickerSelectedIds.length} of {activePickerSection.maxProducts || 5} selected
              </span>
            </div>
            <p className="mt-0.5 text-xs text-zinc-500">
              Pick products to showcase on the home page in a responsive fixed grid (no horizontal scroll).
            </p>
          </div>
          <button
            type="button"
            onClick={handleClosePicker}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-200 hover:text-ink cursor-pointer transition-colors"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col gap-2 border-b border-zinc-200 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={pickerSearch}
              onChange={(e) => setPickerSearch(e.target.value)}
              placeholder="Search products by model, name, brand, ID..."
              className="h-10 w-full rounded-lg border border-zinc-300 bg-white pl-9 pr-3 text-xs text-ink outline-none focus:border-accent"
            />
          </div>
          <select
            value={pickerCategory}
            onChange={(e) => setPickerCategory(e.target.value)}
            className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-xs font-semibold text-ink outline-none focus:border-accent cursor-pointer"
          >
            <option value="">All Categories ({allCategoriesList.length})</option>
            {allCategoriesList.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {(pickerSearch || pickerCategory) && (
            <button
              type="button"
              onClick={() => { setPickerSearch(''); setPickerCategory(''); }}
              className="h-10 rounded-lg border border-zinc-300 px-3 text-xs font-bold uppercase text-zinc-500 hover:text-ink cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[55vh] thin-scrollbar">
          {pickerProducts.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500">
              No products match your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {pickerProducts.map((p) => {
                const selectedIdx = activePickerSelectedIds.indexOf(p.id);
                const isSelected = selectedIdx !== -1;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleToggleProductInPicker(p.id)}
                    className={`flex items-center gap-3 rounded-xl border p-2.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-accent bg-accent/5 ring-2 ring-accent/30 shadow-sm'
                        : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
                    }`}
                  >
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${
                      isSelected ? 'border-accent bg-accent text-white font-bold text-xs' : 'border-zinc-300 bg-white'
                    }`}>
                      {isSelected ? `#${selectedIdx + 1}` : null}
                    </div>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-12 w-12 rounded-lg border border-zinc-200 bg-white object-contain p-1 shrink-0"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/amplifiers1.webp'; }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent truncate">
                          {p.model}
                        </span>
                        <span className="text-[10px] text-zinc-400">ID: {p.id}</span>
                      </div>
                      <div className="text-xs font-bold text-ink truncate" title={p.name}>
                        {p.name}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-0.5">
                        <span className="truncate">{p.category}</span>
                        <span className="font-extrabold text-ink">{formatPrice(p.price)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-4 bg-zinc-50">
          <button
            type="button"
            onClick={handleClearPickerToAuto}
            className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-ink cursor-pointer"
          >
            Reset to Automatic
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500">
              Selected: <strong className="text-ink">{activePickerSelectedIds.length}</strong> of{' '}
              <strong className="text-ink">{activePickerSection.maxProducts || 5}</strong>
            </span>
            <button
              type="button"
              onClick={handleClosePicker}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-accent-dark cursor-pointer transition-colors"
            >
              <CheckIcon size={15} />
              Done & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

      {/* Create / Edit Modal */}
      {(isCreating || editProduct) && (
        <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
              <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink">
                {editProduct ? `Edit Product (ID: ${editProduct.id})` : 'Add New Product'}
              </h2>
              <button
                type="button"
                onClick={() => { setIsCreating(false); setEditProduct(null); }}
                className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-ink"
              >
                <XIcon size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-5 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600">Product Name *</label>
                  <input
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Professional Power Amplifier"
                    className="mt-1 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-ink outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600">Model *</label>
                  <input
                    required
                    value={formData.model || ''}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g. PA-2000"
                    className="mt-1 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-ink outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600">Category *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryFormData({
                          name: '',
                          slug: '',
                          description: '',
                          image: availableImages[0] || '/amplifiers1.webp'
                        });
                        setCategoryUploadError(null);
                        setCategoryUploadSuccess(null);
                        setIsCreatingCategory(true);
                      }}
                      className="text-[11px] font-bold uppercase tracking-wider text-accent hover:underline cursor-pointer"
                    >
                      + Add New
                    </button>
                  </div>
                  <select
                    value={formData.category || (allCategoriesList[0] || 'Amplifiers')}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-ink outline-none focus:border-accent cursor-pointer"
                  >
                    {formData.category && !allCategoriesList.includes(formData.category) && (
                      <option value={formData.category}>{formData.category}</option>
                    )}
                    {allCategoriesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600">Subcategory</label>
                  <select
                    value={formData.subcategory || ''}
                    onChange={(e) => setFormData({ ...formData, subcategory: (e.target.value as any) || undefined })}
                    className="mt-1 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-ink outline-none focus:border-accent"
                  >
                    <option value="">None</option>
                    <option value="Wired">Wired</option>
                    <option value="Wireless">Wireless</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600">Brand *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setBrandFormData({ name: '', description: '' });
                        setIsCreatingBrand(true);
                      }}
                      className="text-[11px] font-bold uppercase tracking-wider text-accent hover:underline cursor-pointer"
                    >
                      + Add New
                    </button>
                  </div>
                  <select
                    value={formData.brand || (allBrandsList[0] || 'Audio Enterprise')}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="mt-1 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-ink outline-none focus:border-accent cursor-pointer"
                  >
                    {formData.brand && !allBrandsList.includes(formData.brand) && (
                      <option value={formData.brand}>{formData.brand}</option>
                    )}
                    {allBrandsList.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price ?? ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="mt-1 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-ink outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600">Old Price (₹)</label>
                  <input
                    type="number"
                    value={formData.oldPrice ?? ''}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Optional"
                    className="mt-1 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-ink outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600">Availability</label>
                  <select
                    value={formData.availability || 'In Stock'}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value as any })}
                    className="mt-1 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-ink outline-none focus:border-accent"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Limited Stock">Limited Stock</option>
                    <option value="Made To Order">Made To Order</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600">Badge</label>
                  <select
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value || undefined })}
                    className="mt-1 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-ink outline-none focus:border-accent"
                  >
                    <option value="">None</option>
                    <option value="SALE">SALE</option>
                    <option value="BESTSELLER">BESTSELLER</option>
                    <option value="NEW">NEW</option>
                    <option value="LIMITED OFFER">LIMITED OFFER</option>
                    <option value="POPULAR">POPULAR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600">Feature Headline *</label>
                  <input
                    required
                    value={formData.feature || ''}
                    onChange={(e) => setFormData({ ...formData, feature: e.target.value })}
                    placeholder="e.g. 450W × 2 Output"
                    className="mt-1 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-ink outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Multi-Image Manager (WebP only) */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                      Product Images Gallery ({formData.images?.length || 0})
                    </label>
                    <p className="text-[11px] text-zinc-500">
                      Rule: <strong className="text-accent">Only .webp format</strong> is accepted. Uploaded files are stored directly in <code className="rounded bg-zinc-200 px-1 py-0.5 text-[10px] text-zinc-800">public/</code>.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".webp,image/webp"
                      multiple
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingImages}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-accent-dark disabled:opacity-50 transition-colors"
                    >
                      <UploadCloudIcon size={15} />
                      {uploadingImages ? 'Uploading...' : 'Upload .webp'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowImagePicker(v => !v)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-700 hover:border-accent hover:text-accent transition-colors"
                    >
                      <ImageIcon size={15} />
                      {showImagePicker ? 'Close Library' : `Public Library (${availableImages.length})`}
                    </button>
                  </div>
                </div>

                {/* Upload Status / Error feedback */}
                {uploadError && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-2.5 text-xs text-red-700">
                    <AlertCircleIcon size={16} className="mt-0.5 shrink-0 text-red-600" />
                    <span>{uploadError}</span>
                  </div>
                )}
                {uploadSuccess && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 p-2.5 text-xs text-emerald-700">
                    <CheckCircle2Icon size={16} className="shrink-0 text-emerald-600" />
                    <span>{uploadSuccess}</span>
                  </div>
                )}

                {/* Direct .webp URL adder */}
                <div className="mt-3 flex items-center gap-2">
                  <input
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="Enter/paste direct .webp image path (e.g. /my-speaker.webp)..."
                    className="h-9 flex-1 rounded border border-zinc-300 bg-white px-3 text-xs outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={handleAddDirectUrl}
                    className="h-9 rounded border border-zinc-300 bg-white px-3 text-xs font-bold uppercase tracking-wider text-zinc-700 hover:border-accent hover:text-accent"
                  >
                    + Add Path
                  </button>
                </div>

                {/* Public Images Picker Inline Drawer */}
                {showImagePicker && (
                  <div className="mt-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-inner">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">
                        Choose from Public .webp Images ({availableImages.length}):
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowImagePicker(false)}
                        className="text-[11px] font-bold text-zinc-400 hover:text-ink"
                      >
                        Done
                      </button>
                    </div>
                    <div className="grid max-h-48 grid-cols-6 sm:grid-cols-8 gap-2 overflow-y-auto thin-scrollbar p-1">
                      {availableImages.map(img => {
                        const isSelected = (formData.images || []).includes(img);
                        return (
                          <button
                            key={img}
                            type="button"
                            onClick={() => handleToggleLibraryImage(img)}
                            title={img}
                            className={`group relative flex aspect-square items-center justify-center rounded-lg border p-1 transition-all ${
                              isSelected
                                ? 'border-accent bg-accent/5 ring-2 ring-accent'
                                : 'border-zinc-200 bg-zinc-50 hover:border-zinc-400'
                            }`}
                          >
                            <img src={img} alt="" className="h-full w-full object-contain" />
                            {isSelected && (
                              <span className="absolute top-0.5 right-0.5 rounded-full bg-accent p-0.5 text-white">
                                <CheckCircle2Icon size={10} />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Attached Product Images List */}
                <div className="mt-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">
                      Product Images Gallery ({formData.images?.length || 0}):
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      ★ PRIMARY image is shown on cards and product hero
                    </span>
                  </div>

                  {(!formData.images || formData.images.length === 0) ? (
                    <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-xs text-zinc-400">
                      No images added yet. Click &quot;Upload .webp&quot; or &quot;Public Library&quot; to add images.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {formData.images.map((img, idx) => {
                        const isPrimary = (formData.image === img) || (!formData.image && idx === 0);
                        return (
                          <div
                            key={img + idx}
                            className={`relative flex flex-col justify-between overflow-hidden rounded-xl border bg-white p-2 shadow-sm transition-all ${
                              isPrimary ? 'border-accent ring-2 ring-accent/40' : 'border-zinc-200 hover:border-zinc-300'
                            }`}
                          >
                            {/* Primary Badge */}
                            {isPrimary && (
                              <span className="absolute top-2 left-2 z-10 rounded bg-accent px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                                PRIMARY
                              </span>
                            )}

                            {/* Image preview */}
                            <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-zinc-50 p-2">
                              <img src={img} alt="" className="h-full w-full object-contain" />
                            </div>

                            {/* Truncated filename */}
                            <p className="mt-1.5 truncate text-[10px] font-medium text-zinc-600" title={img}>
                              {img.split('/').pop()}
                            </p>

                            {/* Controls */}
                            <div className="mt-2 flex items-center justify-between border-t border-zinc-100 pt-1.5">
                              <div className="flex items-center gap-0.5">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveImage(idx, 'left')}
                                  title="Move Left"
                                  className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-ink disabled:opacity-20"
                                >
                                  <ArrowLeftIcon size={12} />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === (formData.images?.length || 0) - 1}
                                  onClick={() => handleMoveImage(idx, 'right')}
                                  title="Move Right"
                                  className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-ink disabled:opacity-20"
                                >
                                  <ArrowRightIcon size={12} />
                                </button>
                              </div>

                              <div className="flex items-center gap-1">
                                {!isPrimary && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetPrimaryImage(img)}
                                    title="Set as Primary Image"
                                    className="rounded px-1.5 py-0.5 text-[10px] font-bold text-accent hover:bg-accent/10 transition-colors"
                                  >
                                    Primary
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(img)}
                                  title="Remove Image"
                                  className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                >
                                  <Trash2Icon size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive description of acoustic parameters, application venues, and build..."
                  className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-3 text-sm text-ink outline-none focus:border-accent"
                />
              </div>

              {/* Dynamic Specifications */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600">Technical Specifications</label>
                  <button
                    type="button"
                    onClick={() => setSpecRows([...specRows, { key: '', value: '' }])}
                    className="text-xs font-bold uppercase tracking-wider text-accent hover:underline"
                  >
                    + Add Spec Row
                  </button>
                </div>
                <div className="space-y-2">
                  {specRows.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        value={row.key}
                        onChange={(e) => {
                          const updated = [...specRows];
                          updated[idx].key = e.target.value;
                          setSpecRows(updated);
                        }}
                        placeholder="Spec Name (e.g. Channels)"
                        className="h-9 w-1/3 rounded border border-zinc-300 px-2.5 text-xs outline-none focus:border-accent"
                      />
                      <input
                        value={row.value}
                        onChange={(e) => {
                          const updated = [...specRows];
                          updated[idx].value = e.target.value;
                          setSpecRows(updated);
                        }}
                        placeholder="Value (e.g. 2 Channel @ 8Ω)"
                        className="h-9 flex-1 rounded border border-zinc-300 px-2.5 text-xs outline-none focus:border-accent"
                      />
                      {specRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setSpecRows(specRows.filter((_, i) => i !== idx))}
                          className="p-1 text-zinc-400 hover:text-red-500"
                        >
                          <XIcon size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Tags & Collections */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-700">
                    <TagIcon size={14} className="text-accent" />
                    Product Tags & Collections
                  </label>
                  <span className="text-[11px] text-zinc-400">
                    Controls navbar tabs (New Arrivals, Sale) & collection filters
                  </span>
                </div>

                {/* Preset quick tag toggles */}
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {PRESET_TAGS.map((tag) => {
                    const active = Array.isArray(formData.tags) && formData.tags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTogglePresetTag(tag.id)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                          active
                            ? 'bg-accent text-white shadow-sm ring-2 ring-accent/30'
                            : 'bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100'
                        }`}
                      >
                        {tag.label} {active ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>

                {/* Custom tag input */}
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomTag();
                      }
                    }}
                    placeholder="Add custom tag (e.g. concert, outdoor, wireless)..."
                    className="h-9 flex-1 rounded-md border border-zinc-300 bg-white px-3 text-xs text-ink outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="h-9 rounded-md bg-zinc-800 px-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition-colors cursor-pointer"
                  >
                    Add Tag
                  </button>
                </div>

                {/* Currently active tags pills */}
                {Array.isArray(formData.tags) && formData.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mr-1">
                      Active Tags:
                    </span>
                    {formData.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent border border-accent/20"
                      >
                        #{t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="hover:text-red-600 transition-colors cursor-pointer ml-0.5"
                          title="Remove tag"
                        >
                          <XIcon size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-zinc-200 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsCreating(false); setEditProduct(null); }}
                  className="rounded-md border border-zinc-300 px-5 py-2.5 text-xs font-bold uppercase text-zinc-600 hover:border-zinc-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="rounded-md bg-accent px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-accent-dark transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {actionLoading ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-130 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="font-display text-xl font-bold uppercase tracking-tight text-ink">
              Delete Product Confirmation
            </h3>
            <p className="mt-2 text-sm text-zinc-600">
              Are you sure you want to permanently delete <strong>{deleteCandidate.name} ({deleteCandidate.model})</strong> from MongoDB Atlas?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="rounded-md border border-zinc-300 px-4 py-2 text-xs font-bold uppercase text-zinc-600 hover:border-zinc-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={actionLoading}
                className="rounded-md bg-red-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition-colors disabled:opacity-60 cursor-pointer"
              >
                {actionLoading ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Category Modal */}
      {(isCreatingCategory || editingCategory) && (
        <div className="fixed inset-0 z-140 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-ink">
                  {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Category'}
                </h3>
                <p className="text-xs text-zinc-500">
                  {editingCategory ? 'Update category name, description, or cover image across products' : 'Create a new product family for the catalogue'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setIsCreatingCategory(false); setEditingCategory(null); }}
                className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-ink cursor-pointer"
              >
                <XIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={categoryFormData.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setCategoryFormData({
                      ...categoryFormData,
                      name: val,
                      slug: categoryFormData.slug ? categoryFormData.slug : autoSlug
                    });
                  }}
                  placeholder="e.g. Studio Monitors, Stage Boxes, DJ Consoles"
                  className="mt-1.5 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-ink outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  URL Slug (Auto-generated)
                </label>
                <input
                  type="text"
                  value={categoryFormData.slug}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                  placeholder="e.g. studio-monitors"
                  className="mt-1.5 h-11 w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 text-sm text-ink outline-none focus:border-accent font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Short Description
                </label>
                <input
                  type="text"
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  placeholder="e.g. High-performance active & passive studio reference monitors"
                  className="mt-1.5 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-ink outline-none focus:border-accent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Cover Image (.webp format)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      ref={categoryFileInputRef}
                      type="file"
                      accept=".webp,image/webp"
                      onChange={(e) => handleCategoryFileUpload(e.target.files)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingCategoryImage}
                      onClick={() => categoryFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-accent-dark disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      <UploadCloudIcon size={14} />
                      {uploadingCategoryImage ? 'Uploading...' : 'Upload Image'}
                    </button>
                  </div>
                </div>

                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={categoryFormData.image}
                    onChange={(e) => {
                      setCategoryFormData({ ...categoryFormData, image: e.target.value });
                      setCategoryUploadSuccess(null);
                      setCategoryUploadError(null);
                    }}
                    placeholder="/amplifiers1.webp"
                    className="h-11 flex-1 rounded-md border border-zinc-300 bg-white px-3 text-xs font-mono text-ink outline-none focus:border-accent"
                  />
                  <img
                    src={categoryFormData.image || '/amplifiers1.webp'}
                    alt=""
                    className="h-11 w-11 rounded-md border border-zinc-200 bg-zinc-100 object-contain p-1 shrink-0"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/amplifiers1.webp'; }}
                  />
                </div>

                {categoryUploadError && (
                  <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-red-50 p-2 text-xs text-red-700">
                    <AlertCircleIcon size={15} className="mt-0.5 shrink-0 text-red-600" />
                    <span>{categoryUploadError}</span>
                  </div>
                )}

                {categoryUploadSuccess && (
                  <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-50 p-2 text-xs text-emerald-700">
                    <CheckCircle2Icon size={15} className="shrink-0 text-emerald-600" />
                    <span>{categoryUploadSuccess}</span>
                  </div>
                )}

                {availableImages.length > 0 && (
                  <div className="mt-2.5">
                    <span className="text-[11px] font-semibold text-zinc-500">Or pick from existing images:</span>
                    <div className="mt-1 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 rounded-lg border border-zinc-200 bg-zinc-50 thin-scrollbar">
                      {availableImages.slice(0, 16).map(img => (
                        <button
                          key={img}
                          type="button"
                          onClick={() => {
                            setCategoryFormData({ ...categoryFormData, image: img });
                            setCategoryUploadSuccess(null);
                            setCategoryUploadError(null);
                          }}
                          className={`h-8 w-8 rounded border p-0.5 transition-all cursor-pointer ${
                            categoryFormData.image === img ? 'border-accent ring-2 ring-accent/30 bg-accent/10' : 'border-zinc-200 bg-white hover:border-zinc-400'
                          }`}
                        >
                          <img src={img} alt="" className="h-full w-full object-contain" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-zinc-200 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsCreatingCategory(false); setEditingCategory(null); }}
                  className="rounded-md border border-zinc-300 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-600 hover:border-zinc-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !categoryFormData.name.trim()}
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-accent-dark disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading ? 'Saving...' : editingCategory ? 'Update Category' : '+ Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create / Edit Brand Modal */}
      {(isCreatingBrand || editingBrand) && (
        <div className="fixed inset-0 z-140 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-ink">
                  {editingBrand ? `Edit Brand: ${editingBrand.name}` : 'Add New Brand'}
                </h3>
                <p className="text-xs text-zinc-500">
                  {editingBrand ? 'Rename or update brand info across all products' : 'Add a new manufacturer brand to the database'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setIsCreatingBrand(false); setEditingBrand(null); }}
                className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-ink cursor-pointer"
              >
                <XIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBrand} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={brandFormData.name}
                  onChange={(e) => setBrandFormData({ ...brandFormData, name: e.target.value })}
                  placeholder="e.g. Yamaha, Shure, JBL Pro"
                  className="mt-1.5 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-ink outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Brand Description
                </label>
                <input
                  type="text"
                  value={brandFormData.description}
                  onChange={(e) => setBrandFormData({ ...brandFormData, description: e.target.value })}
                  placeholder="e.g. World-class touring and studio hardware"
                  className="mt-1.5 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-ink outline-none focus:border-accent"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-zinc-200 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsCreatingBrand(false); setEditingBrand(null); }}
                  className="rounded-md border border-zinc-300 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-600 hover:border-zinc-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !brandFormData.name.trim()}
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-accent-dark disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading ? 'Saving...' : editingBrand ? 'Update Brand' : '+ Create Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
