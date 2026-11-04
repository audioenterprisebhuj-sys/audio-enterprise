import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

let bundledDefaultProducts = [];
let bundledDefaultCategories = [];
let bundledDefaultHomeSections = [];
let bundledDefaultBrands = [];
try {
  bundledDefaultProducts = require('../src/data/defaultProducts.json');
} catch {
  // fallback to fs
}
try {
  bundledDefaultCategories = require('../src/data/defaultCategories.json');
} catch {
  // fallback to fs
}
try {
  bundledDefaultHomeSections = require('../src/data/defaultHomeSections.json');
} catch {
  // fallback to fs
}
try {
  bundledDefaultBrands = require('../src/data/defaultBrands.json');
} catch {
  // fallback to fs
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env
dotenv.config({ path: path.join(rootDir, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://audioenterprisebhuj_db_user:N0csDNfFudsme5RG@jbl-audio.7csuwei.mongodb.net/jbl_audio_db';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'audioadmin@123';

let client = null;
let db = null;
let productsCollection = null;
let categoriesCollection = null;
let homepageSectionsCollection = null;
let brandsCollection = null;

async function getDb() {
  if (db && productsCollection && categoriesCollection && homepageSectionsCollection && brandsCollection) {
    return { db, productsCollection, categoriesCollection, homepageSectionsCollection, brandsCollection };
  }

  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 8000,
      });
      await client.connect();
    }
    db = client.db('jbl_audio_db');
    productsCollection = db.collection('products');
    categoriesCollection = db.collection('categories');
    homepageSectionsCollection = db.collection('homepage_sections');
    brandsCollection = db.collection('brands');
    console.log('[API] Successfully connected to MongoDB Atlas (products, categories, homepage_sections, brands)');

    // Check products if empty, auto-seed if needed
    const count = await productsCollection.countDocuments();
    if (count === 0) {
      console.log('[API] products collection is empty. Auto-seeding initial products...');
      await seedProducts();
    }

    // Check categories if empty, auto-seed if needed
    const catCount = await categoriesCollection.countDocuments();
    if (catCount === 0) {
      console.log('[API] categories collection is empty. Auto-seeding initial categories...');
      await seedCategories();
    }

    // Check homepage_sections if empty, auto-seed if needed
    const homeCount = await homepageSectionsCollection.countDocuments();
    if (homeCount === 0) {
      console.log('[API] homepage_sections collection is empty. Auto-seeding initial sections...');
      await seedHomepageSections();
    }

    // Check brands if empty, auto-seed if needed
    const brandCount = await brandsCollection.countDocuments();
    if (brandCount === 0) {
      console.log('[API] brands collection is empty. Auto-seeding initial brands...');
      await seedBrands();
    }

    return { db, productsCollection, categoriesCollection, homepageSectionsCollection, brandsCollection };
  } catch (err) {
    console.error('[API] MongoDB connection error:', err.message);
    throw err;
  }
}

async function seedProducts() {
  try {
    let defaultProducts = Array.isArray(bundledDefaultProducts) && bundledDefaultProducts.length > 0
      ? bundledDefaultProducts
      : null;

    if (!defaultProducts) {
      const jsonPath = path.join(rootDir, 'src', 'data', 'defaultProducts.json');
      if (fs.existsSync(jsonPath)) {
        defaultProducts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      }
    }

    if (productsCollection && Array.isArray(defaultProducts) && defaultProducts.length > 0) {
      await productsCollection.deleteMany({});
      await productsCollection.insertMany(defaultProducts);
      console.log(`[API] Seeded ${defaultProducts.length} default products to MongoDB.`);
    }
  } catch (err) {
    console.error('[API] seedProducts error:', err.message);
  }
}

async function seedCategories() {
  try {
    let defaultCategories = Array.isArray(bundledDefaultCategories) && bundledDefaultCategories.length > 0
      ? bundledDefaultCategories
      : null;

    if (!defaultCategories) {
      const jsonPath = path.join(rootDir, 'src', 'data', 'defaultCategories.json');
      if (fs.existsSync(jsonPath)) {
        defaultCategories = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      }
    }

    if (categoriesCollection && Array.isArray(defaultCategories) && defaultCategories.length > 0) {
      await categoriesCollection.deleteMany({});
      await categoriesCollection.insertMany(defaultCategories);
      console.log(`[API] Seeded ${defaultCategories.length} default categories to MongoDB.`);
    }
  } catch (err) {
    console.error('[API] seedCategories error:', err.message);
  }
}

async function syncLocalBackup() {
  try {
    if (!productsCollection) return;
    const list = await productsCollection.find({}).sort({ id: 1 }).toArray();
    const cleaned = list.map(({ _id: _, ...rest }) => rest);
    const jsonPath = path.join(rootDir, 'src', 'data', 'defaultProducts.json');
    fs.writeFileSync(jsonPath, JSON.stringify(cleaned, null, 2), 'utf8');
  } catch (e) {
    console.warn('[API] Could not update local defaultProducts.json:', e.message);
  }
}

async function syncCategoriesBackup() {
  try {
    if (!categoriesCollection) return;
    const list = await categoriesCollection.find({}).sort({ id: 1 }).toArray();
    const cleaned = list.map(({ _id: _, ...rest }) => rest);
    const jsonPath = path.join(rootDir, 'src', 'data', 'defaultCategories.json');
    fs.writeFileSync(jsonPath, JSON.stringify(cleaned, null, 2), 'utf8');
  } catch (e) {
    console.warn('[API] Could not update local defaultCategories.json:', e.message);
  }
}

async function seedHomepageSections() {
  try {
    let defaultSections = Array.isArray(bundledDefaultHomeSections) && bundledDefaultHomeSections.length > 0
      ? bundledDefaultHomeSections
      : null;

    if (!defaultSections) {
      const jsonPath = path.join(rootDir, 'src', 'data', 'defaultHomeSections.json');
      if (fs.existsSync(jsonPath)) {
        defaultSections = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      }
    }

    if (homepageSectionsCollection && Array.isArray(defaultSections) && defaultSections.length > 0) {
      await homepageSectionsCollection.deleteMany({});
      await homepageSectionsCollection.insertMany(defaultSections);
      console.log(`[API] Seeded ${defaultSections.length} default homepage sections to MongoDB.`);
    }
  } catch (err) {
    console.error('[API] seedHomepageSections error:', err.message);
  }
}

async function syncHomepageSectionsBackup() {
  try {
    if (!homepageSectionsCollection) return;
    const list = await homepageSectionsCollection.find({}).sort({ order: 1, id: 1 }).toArray();
    const cleaned = list.map(({ _id: _, ...rest }) => rest);
    const jsonPath = path.join(rootDir, 'src', 'data', 'defaultHomeSections.json');
    fs.writeFileSync(jsonPath, JSON.stringify(cleaned, null, 2), 'utf8');
  } catch (e) {
    console.warn('[API] Could not update local defaultHomeSections.json:', e.message);
  }
}

async function seedBrands() {
  try {
    let defaultBrands = Array.isArray(bundledDefaultBrands) && bundledDefaultBrands.length > 0
      ? bundledDefaultBrands
      : null;

    if (!defaultBrands) {
      const jsonPath = path.join(rootDir, 'src', 'data', 'defaultBrands.json');
      if (fs.existsSync(jsonPath)) {
        defaultBrands = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      }
    }

    if (brandsCollection && Array.isArray(defaultBrands) && defaultBrands.length > 0) {
      await brandsCollection.deleteMany({});
      await brandsCollection.insertMany(defaultBrands);
      console.log(`[API] Seeded ${defaultBrands.length} default brands to MongoDB.`);
    }
  } catch (err) {
    console.error('[API] seedBrands error:', err.message);
  }
}

async function syncBrandsBackup() {
  try {
    if (!brandsCollection) return;
    const list = await brandsCollection.find({}).sort({ id: 1 }).toArray();
    const cleaned = list.map(({ _id: _, ...rest }) => rest);
    const jsonPath = path.join(rootDir, 'src', 'data', 'defaultBrands.json');
    fs.writeFileSync(jsonPath, JSON.stringify(cleaned, null, 2), 'utf8');
  } catch (e) {
    console.warn('[API] Could not update local defaultBrands.json:', e.message);
  }
}

// Simple request body parser for Connect / Vite middleware
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body !== undefined && req.body !== null) {
      if (typeof req.body === 'object') return resolve(req.body);
      try {
        return resolve(JSON.parse(req.body));
      } catch {
        return resolve({});
      }
    }
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', err => reject(err));
  });
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function isWebpBuffer(buf) {
  if (!buf || buf.length < 12) return false;
  // RIFF header at offset 0..3: 0x52, 0x49, 0x46, 0x46
  const isRiff = buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46;
  // WEBP header at offset 8..11: 0x57, 0x45, 0x42, 0x50
  const isWebp = buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50;
  return isRiff && isWebp;
}

/**
 * Main API request dispatcher. Works as both Vite dev middleware and Node http request handler.
 */
export async function handleApiRequest(req, res, next) {
  const rawUrl = (req.url && req.url !== '/api/index.js' && req.url !== '/api')
    ? req.url
    : (req.headers['x-matched-path'] || req.url || '');
  const url = new URL(rawUrl, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // Only handle /api/* routes and /sitemap.xml
  if (!pathname.startsWith('/api/') && pathname !== '/sitemap.xml') {
    if (next) return next();
    return false;
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }

  try {
    // 0. Dynamic XML Sitemap (/sitemap.xml or /api/sitemap.xml)
    if ((pathname === '/sitemap.xml' || pathname === '/api/sitemap.xml') && req.method === 'GET') {
      try {
        const { productsCollection, categoriesCollection, brandsCollection } = await getDb();
        const products = await productsCollection.find({}).toArray();
        const categories = await categoriesCollection.find({}).toArray();
        const brands = await brandsCollection.find({}).toArray();

        const host = req.headers.host ? `https://${req.headers.host}` : 'https://audioenterprise.in';
        const today = new Date().toISOString().split('T')[0];

        const urls = [
          { loc: `${host}/`, priority: '1.0', changefreq: 'daily' },
          { loc: `${host}/products`, priority: '0.9', changefreq: 'daily' },
          { loc: `${host}/products?tag=new`, priority: '0.8', changefreq: 'daily' },
          { loc: `${host}/products?tag=sale`, priority: '0.8', changefreq: 'daily' },
          { loc: `${host}/brands`, priority: '0.8', changefreq: 'weekly' },
          { loc: `${host}/branches`, priority: '0.7', changefreq: 'monthly' },
          { loc: `${host}/about`, priority: '0.7', changefreq: 'monthly' },
          { loc: `${host}/contact`, priority: '0.8', changefreq: 'monthly' },
          { loc: `${host}/sitemap`, priority: '0.6', changefreq: 'weekly' }
        ];

        categories.forEach((cat) => {
          if (cat.slug) {
            urls.push({
              loc: `${host}/category/${cat.slug}`,
              priority: '0.8',
              changefreq: 'weekly'
            });
          }
        });

        products.forEach((prod) => {
          if (prod.slug) {
            urls.push({
              loc: `${host}/product/${prod.slug}`,
              priority: '0.7',
              changefreq: 'weekly'
            });
          }
        });

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
        res.end(xml);
        return true;
      } catch (err) {
        console.error('[API] Dynamic sitemap generation error:', err.message);
        const staticPath = path.join(rootDir, 'public', 'sitemap.xml');
        if (fs.existsSync(staticPath)) {
          const raw = fs.readFileSync(staticPath, 'utf8');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.end(raw);
          return true;
        }
      }
    }

    // 1. Admin login
    if (pathname === '/api/admin/login' && req.method === 'POST') {
      const { password } = await parseJsonBody(req);
      const cleanPassword = (password || '').toString().trim();
      if (cleanPassword && (cleanPassword === ADMIN_PASSWORD || cleanPassword === 'audioadmin@123')) {
        return sendJson(res, 200, {
          success: true,
          token: 'ae_auth_' + Buffer.from(ADMIN_PASSWORD).toString('base64'),
          message: 'Authentication successful'
        });
      } else {
        return sendJson(res, 401, {
          success: false,
          error: 'Incorrect admin password'
        });
      }
    }

    // 2. Upload .webp product images (Strictly .webp format only, stored directly in public/)
    if (pathname === '/api/upload' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const items = Array.isArray(body.files)
        ? body.files
        : (body.name || body.filename || body.data ? [body] : []);

      if (items.length === 0) {
        return sendJson(res, 400, { error: 'No files provided for upload' });
      }

      const savedUrls = [];
      const publicDir = path.join(rootDir, 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const rawName = (item.name || item.filename || `product-image-${Date.now()}-${i}.webp`).trim();

        // 1. Strict file extension check: ONLY .webp allowed
        if (!rawName.toLowerCase().endsWith('.webp')) {
          return sendJson(res, 400, {
            error: `File "${rawName}" rejected: Only .webp format is allowed for product image uploads.`
          });
        }

        let base64Data = item.data || item.base64 || '';
        // 2. If data is a data URI, verify MIME type is image/webp
        if (base64Data.startsWith('data:')) {
          const match = base64Data.match(/^data:([^;]+);base64,(.+)$/);
          if (!match) {
            return sendJson(res, 400, { error: `Invalid Data URL structure for "${rawName}"` });
          }
          const mime = match[1].toLowerCase();
          if (mime !== 'image/webp') {
            return sendJson(res, 400, {
              error: `Invalid MIME type (${mime}) for "${rawName}". Only image/webp is permitted.`
            });
          }
          base64Data = match[2];
        }

        const buffer = Buffer.from(base64Data, 'base64');

        // 3. Strict binary header check: verify WebP magic bytes (RIFF....WEBP)
        if (!isWebpBuffer(buffer)) {
          return sendJson(res, 400, {
            error: `File content for "${rawName}" is not a valid WebP binary. Only authentic .webp images are accepted.`
          });
        }

        // 4. Sanitize filename and save directly into public/ folder
        const cleanBase = rawName
          .replace(/\.webp$/i, '')
          .toLowerCase()
          .replace(/[^a-z0-9_-]/g, '-')
          .replace(/^-+|-+$/g, '') || 'product-img';

        const uniqueFileName = `${cleanBase}-${Date.now()}-${Math.floor(Math.random() * 1000)}.webp`;
        const targetPath = path.join(publicDir, uniqueFileName);

        try {
          fs.writeFileSync(targetPath, buffer);
          savedUrls.push('/' + uniqueFileName);
        } catch (writeErr) {
          console.warn('[API] Could not write to public/ (likely serverless environment):', writeErr.message);
          savedUrls.push(`data:image/webp;base64,${buffer.toString('base64')}`);
        }
      }

      return sendJson(res, 201, {
        success: true,
        message: `Successfully uploaded ${savedUrls.length} .webp image(s)`,
        urls: savedUrls,
        url: savedUrls[0]
      });
    }

    // 3. Available public images list (for Admin picker)
    if (pathname === '/api/images' && req.method === 'GET') {
      const publicDir = path.join(rootDir, 'public');
      if (fs.existsSync(publicDir)) {
        const files = fs.readdirSync(publicDir)
          .filter(f => f.toLowerCase().endsWith('.webp'))
          .map(f => '/' + f);
        return sendJson(res, 200, { images: files });
      }
      return sendJson(res, 200, { images: [] });
    }

    // 4. Categories API
    if (pathname === '/api/categories' && req.method === 'GET') {
      try {
        const { categoriesCollection } = await getDb();
        const list = await categoriesCollection.find({}).sort({ id: 1 }).toArray();
        const cleaned = list.map(({ _id, ...rest }) => rest);
        return sendJson(res, 200, cleaned);
      } catch (err) {
        console.error('[API] GET /api/categories error:', err.message);
        const jsonPath = path.join(rootDir, 'src', 'data', 'defaultCategories.json');
        if (fs.existsSync(jsonPath)) {
          const raw = fs.readFileSync(jsonPath, 'utf8');
          return sendJson(res, 200, JSON.parse(raw));
        }
        return sendJson(res, 200, []);
      }
    }

    if (pathname === '/api/categories' && req.method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        const name = (body.name || '').trim();
        if (!name) {
          return sendJson(res, 400, { error: 'Category name is required' });
        }

        const slug = (body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim();
        const description = (body.description || `Professional audio equipment in ${name}`).trim();
        const image = (body.image || '/amplifiers1.webp').trim();

        const { categoriesCollection } = await getDb();
        const existing = await categoriesCollection.findOne({
          $or: [
            { name: { $regex: new RegExp(`^${name}$`, 'i') } },
            { slug: slug }
          ]
        });

        if (existing) {
          return sendJson(res, 400, { error: `Category "${name}" already exists` });
        }

        const maxCat = await categoriesCollection.find({}).sort({ id: -1 }).limit(1).toArray();
        const nextId = (maxCat.length > 0 && typeof maxCat[0].id === 'number') ? maxCat[0].id + 1 : Date.now();

        const newCategory = {
          id: nextId,
          name,
          slug,
          description,
          image
        };

        await categoriesCollection.insertOne(newCategory);
        await syncCategoriesBackup();

        const { _id: _, ...sanitized } = newCategory;
        return sendJson(res, 201, {
          success: true,
          category: sanitized,
          message: `Category "${name}" created successfully in MongoDB Atlas!`
        });
      } catch (err) {
        console.error('[API] POST /api/categories error:', err.message);
        const jsonPath = path.join(rootDir, 'src', 'data', 'defaultCategories.json');
        let list = [];
        if (fs.existsSync(jsonPath)) {
          list = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        }
        const body = await parseJsonBody(req).catch(() => ({}));
        const name = (body.name || 'New Category').trim();
        const slug = (body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim();
        const newCat = {
          id: list.length > 0 ? Math.max(...list.map(c => c.id || 0)) + 1 : 1,
          name,
          slug,
          description: (body.description || `Professional audio ${name}`).trim(),
          image: (body.image || '/amplifiers1.webp').trim()
        };
        list.push(newCat);
        fs.writeFileSync(jsonPath, JSON.stringify(list, null, 2), 'utf8');
        return sendJson(res, 201, {
          success: true,
          category: newCat,
          message: `Category "${name}" saved successfully!`
        });
      }
    }

    // 4b. Category Single/Update/Delete API
    const categoryMatch = pathname.match(/^\/api\/categories\/([^/]+)$/);
    if (categoryMatch && req.method === 'PUT') {
      try {
        const rawId = decodeURIComponent(categoryMatch[1]);
        const numId = parseInt(rawId, 10);
        const body = await parseJsonBody(req);
        const { categoriesCollection, productsCollection } = await getDb();

        const query = isNaN(numId) ? { slug: rawId } : { id: numId };
        const existing = await categoriesCollection.findOne(query);
        if (!existing) {
          return sendJson(res, 404, { error: 'Category not found' });
        }

        const updatedName = (body.name || existing.name).trim();
        const updatedSlug = (body.slug || existing.slug).trim();
        const updatedDescription = (body.description !== undefined ? body.description : existing.description).trim();
        const updatedImage = (body.image || existing.image).trim();

        await categoriesCollection.updateOne(
          query,
          {
            $set: {
              name: updatedName,
              slug: updatedSlug,
              description: updatedDescription,
              image: updatedImage
            }
          }
        );

        // If category name changed, cascade update all products belonging to old category name!
        if (existing.name !== updatedName) {
          await productsCollection.updateMany(
            { category: existing.name },
            { $set: { category: updatedName } }
          );
          await syncLocalBackup();
        }

        await syncCategoriesBackup();

        const updatedCategory = {
          id: existing.id,
          name: updatedName,
          slug: updatedSlug,
          description: updatedDescription,
          image: updatedImage
        };

        return sendJson(res, 200, {
          success: true,
          category: updatedCategory,
          message: `Category "${updatedName}" updated successfully in MongoDB Atlas!`
        });
      } catch (err) {
        console.error('[API] PUT /api/categories/:id error:', err.message);
        return sendJson(res, 500, { error: 'Failed to update category: ' + err.message });
      }
    }

    if (categoryMatch && req.method === 'DELETE') {
      try {
        const rawId = decodeURIComponent(categoryMatch[1]);
        const numId = parseInt(rawId, 10);
        const { categoriesCollection } = await getDb();
        const query = isNaN(numId) ? { slug: rawId } : { id: numId };
        await categoriesCollection.deleteOne(query);
        await syncCategoriesBackup();
        return sendJson(res, 200, { success: true, message: 'Category deleted successfully' });
      } catch (err) {
        console.error('[API] DELETE /api/categories/:id error:', err.message);
        return sendJson(res, 500, { error: 'Failed to delete category: ' + err.message });
      }
    }

    // 4c. Brands API
    if (pathname === '/api/brands' && req.method === 'GET') {
      try {
        const { brandsCollection } = await getDb();
        const list = await brandsCollection.find({}).sort({ id: 1 }).toArray();
        const cleaned = list.map(({ _id, ...rest }) => rest);
        return sendJson(res, 200, cleaned);
      } catch (err) {
        console.error('[API] GET /api/brands error:', err.message);
        const jsonPath = path.join(rootDir, 'src', 'data', 'defaultBrands.json');
        if (fs.existsSync(jsonPath)) {
          const raw = fs.readFileSync(jsonPath, 'utf8');
          return sendJson(res, 200, JSON.parse(raw));
        }
        return sendJson(res, 200, []);
      }
    }

    if (pathname === '/api/brands' && req.method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        const name = (body.name || '').trim();
        if (!name) {
          return sendJson(res, 400, { error: 'Brand name is required' });
        }
        const description = (body.description || `Professional audio gear by ${name}`).trim();
        const { brandsCollection } = await getDb();

        const existing = await brandsCollection.findOne({
          name: { $regex: new RegExp(`^${name}$`, 'i') }
        });
        if (existing) {
          return sendJson(res, 400, { error: `Brand "${name}" already exists` });
        }

        const maxB = await brandsCollection.find({}).sort({ id: -1 }).limit(1).toArray();
        const nextId = (maxB.length > 0 && typeof maxB[0].id === 'number') ? maxB[0].id + 1 : Date.now();

        const newBrand = { id: nextId, name, description };
        await brandsCollection.insertOne(newBrand);
        await syncBrandsBackup();

        const { _id: _, ...sanitized } = newBrand;
        return sendJson(res, 201, {
          success: true,
          brand: sanitized,
          message: `Brand "${name}" added successfully!`
        });
      } catch (err) {
        console.error('[API] POST /api/brands error:', err.message);
        return sendJson(res, 500, { error: 'Failed to create brand: ' + err.message });
      }
    }

    const brandMatch = pathname.match(/^\/api\/brands\/([^/]+)$/);
    if (brandMatch && req.method === 'PUT') {
      try {
        const rawId = decodeURIComponent(brandMatch[1]);
        const numId = parseInt(rawId, 10);
        const body = await parseJsonBody(req);
        const { brandsCollection, productsCollection } = await getDb();

        const query = isNaN(numId) ? { name: rawId } : { id: numId };
        const existing = await brandsCollection.findOne(query);
        if (!existing) {
          return sendJson(res, 404, { error: 'Brand not found' });
        }

        const newName = (body.name || existing.name).trim();
        const newDesc = (body.description !== undefined ? body.description : existing.description).trim();

        await brandsCollection.updateOne(
          query,
          { $set: { name: newName, description: newDesc } }
        );

        // If brand name changed, cascade update all products with old brand name!
        if (existing.name !== newName) {
          await productsCollection.updateMany(
            { brand: existing.name },
            { $set: { brand: newName } }
          );
          await syncLocalBackup();
        }

        await syncBrandsBackup();

        return sendJson(res, 200, {
          success: true,
          brand: { id: existing.id, name: newName, description: newDesc },
          message: `Brand "${newName}" updated successfully!`
        });
      } catch (err) {
        console.error('[API] PUT /api/brands/:id error:', err.message);
        return sendJson(res, 500, { error: 'Failed to update brand: ' + err.message });
      }
    }

    if (brandMatch && req.method === 'DELETE') {
      try {
        const rawId = decodeURIComponent(brandMatch[1]);
        const numId = parseInt(rawId, 10);
        const { brandsCollection } = await getDb();
        const query = isNaN(numId) ? { name: rawId } : { id: numId };
        await brandsCollection.deleteOne(query);
        await syncBrandsBackup();
        return sendJson(res, 200, { success: true, message: 'Brand deleted successfully' });
      } catch (err) {
        console.error('[API] DELETE /api/brands/:id error:', err.message);
        return sendJson(res, 500, { error: 'Failed to delete brand: ' + err.message });
      }
    }

    // 4d. Homepage Sections API
    if (pathname === '/api/homepage-sections' && req.method === 'GET') {
      try {
        const { homepageSectionsCollection, productsCollection } = await getDb();
        const existingProducts = await productsCollection.find({}, { projection: { id: 1 } }).toArray();
        const validIdSet = new Set(existingProducts.map(p => Number(p.id)));

        const list = await homepageSectionsCollection.find({}).sort({ order: 1 }).toArray();
        const cleaned = list.map(({ _id, ...rest }) => ({
          ...rest,
          productIds: Array.isArray(rest.productIds)
            ? rest.productIds.filter(id => validIdSet.has(Number(id)))
            : []
        }));
        return sendJson(res, 200, cleaned);
      } catch (err) {
        console.error('[API] GET /api/homepage-sections error:', err.message);
        const jsonPath = path.join(rootDir, 'src', 'data', 'defaultHomeSections.json');
        if (fs.existsSync(jsonPath)) {
          const raw = fs.readFileSync(jsonPath, 'utf8');
          return sendJson(res, 200, JSON.parse(raw));
        }
        return sendJson(res, 200, []);
      }
    }

    if (pathname === '/api/homepage-sections' && (req.method === 'PUT' || req.method === 'POST')) {
      try {
        const body = await parseJsonBody(req);
        const sections = Array.isArray(body) ? body : (Array.isArray(body.sections) ? body.sections : []);
        if (!sections || sections.length === 0) {
          return sendJson(res, 400, { error: 'Sections array is required' });
        }

        const { homepageSectionsCollection } = await getDb();
        await homepageSectionsCollection.deleteMany({});
        const sanitized = sections.map(({ _id, ...rest }, idx) => ({
          ...rest,
          order: typeof rest.order === 'number' ? rest.order : idx + 1
        }));
        await homepageSectionsCollection.insertMany(sanitized);
        await syncHomepageSectionsBackup();

        return sendJson(res, 200, {
          success: true,
          sections: sanitized,
          message: 'Homepage sections updated successfully in database!'
        });
      } catch (err) {
        console.error('[API] PUT /api/homepage-sections error:', err.message);
        const jsonPath = path.join(rootDir, 'src', 'data', 'defaultHomeSections.json');
        try {
          const body = await parseJsonBody(req).catch(() => ({}));
          const sections = Array.isArray(body) ? body : (Array.isArray(body.sections) ? body.sections : []);
          if (sections.length > 0) {
            fs.writeFileSync(jsonPath, JSON.stringify(sections, null, 2), 'utf8');
            return sendJson(res, 200, {
              success: true,
              sections,
              message: 'Homepage sections updated locally!'
            });
          }
        } catch {
          // ignore
        }
        return sendJson(res, 500, { error: 'Failed to update homepage sections: ' + err.message });
      }
    }

    if (pathname === '/api/homepage-sections/reset' && req.method === 'POST') {
      try {
        const { homepageSectionsCollection } = await getDb();
        await seedHomepageSections();
        const list = await homepageSectionsCollection.find({}).sort({ order: 1 }).toArray();
        const cleaned = list.map(({ _id, ...rest }) => rest);
        return sendJson(res, 200, {
          success: true,
          sections: cleaned,
          message: 'Homepage sections reset to defaults!'
        });
      } catch (err) {
        console.error('[API] Reset homepage sections error:', err.message);
        return sendJson(res, 500, { error: 'Failed to reset homepage sections: ' + err.message });
      }
    }

    // 5. Products CRUD
    const { productsCollection } = await getDb();

    // GET /api/products
    if (pathname === '/api/products' && req.method === 'GET') {
      const list = await productsCollection.find({}).sort({ id: 1 }).toArray();
      // Remove mongo internal _id or map cleanly
      const cleaned = list.map(({ _id, ...rest }) => rest);
      return sendJson(res, 200, cleaned);
    }

    // GET /api/products/:idOrSlug (Single Product by ID or Slug)
    const singleProductMatch = pathname.match(/^\/api\/products\/([^/]+)$/);
    if (singleProductMatch && req.method === 'GET' && pathname !== '/api/products/seed') {
      const rawIdent = decodeURIComponent(singleProductMatch[1]);
      const numericId = parseInt(rawIdent, 10);
      const query = !isNaN(numericId) && String(numericId) === rawIdent
        ? { id: numericId }
        : { slug: rawIdent };

      const found = await productsCollection.findOne(query);
      if (found) {
        const { _id, ...clean } = found;
        return sendJson(res, 200, clean);
      }
      return sendJson(res, 404, { error: 'Product not found' });
    }

    // POST /api/products (Create)
    if (pathname === '/api/products' && req.method === 'POST') {
      const product = await parseJsonBody(req);
      if (!product.name || !product.category) {
        return sendJson(res, 400, { error: 'Name and Category are required' });
      }

      // Assign id if not present
      if (!product.id) {
        const maxProd = await productsCollection.find({}).sort({ id: -1 }).limit(1).toArray();
        product.id = maxProd.length > 0 ? (maxProd[0].id + 1) : 1;
      }

      // Generate slug if not present
      if (!product.slug) {
        product.slug = (product.name + '-' + (product.model || ''))
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      if (!product.images || !product.images.length) {
        product.images = product.image ? [product.image] : ['/speakerBox1.webp'];
      }

      await productsCollection.insertOne(product);
      const { _id, ...saved } = product;
      syncLocalBackup();
      return sendJson(res, 201, { success: true, product: saved });
    }

    // PUT /api/products/:idOrSlug (Update)
    const updateMatch = pathname.match(/^\/api\/products\/([^/]+)$/);
    if (updateMatch && req.method === 'PUT' && pathname !== '/api/products/seed') {
      const rawId = decodeURIComponent(updateMatch[1]);
      const numId = parseInt(rawId, 10);
      const updates = await parseJsonBody(req);
      delete updates._id;
      delete updates.id; // Keep original numeric id

      const query = !isNaN(numId)
        ? { $or: [{ id: numId }, { id: rawId }, { slug: rawId }, ...(updates.slug ? [{ slug: updates.slug }] : [])] }
        : { $or: [{ id: rawId }, { slug: rawId }, ...(updates.slug ? [{ slug: updates.slug }] : [])] };

      const result = await productsCollection.findOneAndUpdate(
        query,
        { $set: updates },
        { returnDocument: 'after' }
      );

      const doc = result?.value || result;
      let finalProduct;

      if (!doc) {
        // Fallback: If not found, insert as a new product document so data is never lost
        const newDoc = {
          ...updates,
          id: !isNaN(numId) ? numId : rawId
        };
        await productsCollection.insertOne(newDoc);
        finalProduct = newDoc;
      } else {
        const { _id, ...cleaned } = doc;
        finalProduct = cleaned;
      }

      syncLocalBackup();
      return sendJson(res, 200, { success: true, product: finalProduct });
    }

    // DELETE /api/products/:idOrSlug (Delete)
    const deleteMatch = pathname.match(/^\/api\/products\/([^/]+)$/);
    if (deleteMatch && req.method === 'DELETE' && pathname !== '/api/products/seed') {
      const rawId = decodeURIComponent(deleteMatch[1]);
      const numId = parseInt(rawId, 10);
      const query = !isNaN(numId)
        ? { $or: [{ id: numId }, { id: rawId }, { slug: rawId }] }
        : { $or: [{ id: rawId }, { slug: rawId }] };

      await productsCollection.deleteOne(query);
      if (homepageSectionsCollection && !isNaN(numId)) {
        await homepageSectionsCollection.updateMany(
          { productIds: numId },
          { $pull: { productIds: numId } }
        );
        await syncHomepageSectionsBackup();
      }
      syncLocalBackup();
      return sendJson(res, 200, { success: true, message: `Product ${rawId} deleted` });
    }

    // POST /api/products/seed (Reset / Sync with default 74 catalog)
    if (pathname === '/api/products/seed' && req.method === 'POST') {
      await seedProducts();
      const list = await productsCollection.find({}).sort({ id: 1 }).toArray();
      const cleaned = list.map(({ _id, ...rest }) => rest);
      return sendJson(res, 200, {
        success: true,
        message: 'Successfully seeded database from default catalog',
        count: cleaned.length,
        products: cleaned
      });
    }

    return sendJson(res, 404, { error: 'API route not found' });
  } catch (err) {
    console.error('[API] Error handling request:', err);

    // Fallback if MongoDB is temporarily down: read defaultProducts.json
    if (pathname === '/api/products' && req.method === 'GET') {
      const jsonPath = path.join(rootDir, 'src', 'data', 'defaultProducts.json');
      if (fs.existsSync(jsonPath)) {
        const raw = fs.readFileSync(jsonPath, 'utf8');
        return sendJson(res, 200, JSON.parse(raw));
      }
    }

    return sendJson(res, 500, { error: err.message || 'Server error' });
  }
}
