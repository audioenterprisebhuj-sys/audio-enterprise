import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { About } from './pages/About';
import { Admin } from './pages/Admin';
import { AllProducts } from './pages/AllProducts';
import { Branches } from './pages/Branches';
import { Brands } from './pages/Brands';
import { CategoryPage } from './pages/CategoryPage';
import { Contact } from './pages/Contact';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { ProductDetail } from './pages/ProductDetail';
import { Sitemap } from './pages/Sitemap';

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.toLowerCase().startsWith('/admin');

  return (
    <div className={`flex w-full flex-col bg-surface ${isAdmin ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      {!isAdmin && <AnnouncementBar />}
      <Navbar />
      <main className={`flex-1 ${isAdmin ? 'overflow-hidden flex flex-col' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sitemap" element={<Sitemap />} />
          {/* Protected admin management routes */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/Admin/*" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingWhatsApp />}
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout />
    </BrowserRouter>
  );
}
