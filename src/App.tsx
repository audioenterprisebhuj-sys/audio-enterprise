import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { About } from './pages/About';
import { AllProducts } from './pages/AllProducts';
import { Branches } from './pages/Branches';
import { CategoryPage } from './pages/CategoryPage';
import { Contact } from './pages/Contact';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { ProductDetail } from './pages/ProductDetail';

export function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen w-full flex-col bg-surface">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<AllProducts />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </BrowserRouter>);

}