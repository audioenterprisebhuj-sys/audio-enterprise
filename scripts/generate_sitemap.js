import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://audioenterprisebhuj_db_user:N0csDNfFudsme5RG@jbl-audio.7csuwei.mongodb.net/jbl_audio_db';
const BASE_URL = 'https://ssaudio.in';

async function generate() {
  let products = [];
  let categories = [];
  let brands = [];

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('jbl_audio_db');
    products = await db.collection('products').find({}).toArray();
    categories = await db.collection('categories').find({}).toArray();
    brands = await db.collection('brands').find({}).toArray();
    await client.close();
    console.log(`Fetched from MongoDB: ${products.length} products, ${categories.length} categories, ${brands.length} brands`);
  } catch (err) {
    console.warn('MongoDB connection failed, falling back to local files:', err.message);
  }

  if (products.length === 0) {
    try {
      products = JSON.parse(fs.readFileSync(path.join(rootDir, 'src', 'data', 'defaultProducts.json'), 'utf8'));
    } catch {}
  }
  if (categories.length === 0) {
    try {
      categories = JSON.parse(fs.readFileSync(path.join(rootDir, 'src', 'data', 'defaultCategories.json'), 'utf8'));
    } catch {}
  }
  if (brands.length === 0) {
    try {
      brands = JSON.parse(fs.readFileSync(path.join(rootDir, 'src', 'data', 'defaultBrands.json'), 'utf8'));
    } catch {}
  }

  const today = new Date().toISOString().split('T')[0];

  const urls = [
    { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${BASE_URL}/products`, priority: '0.9', changefreq: 'daily' },
    { loc: `${BASE_URL}/products?tag=new`, priority: '0.8', changefreq: 'daily' },
    { loc: `${BASE_URL}/products?tag=sale`, priority: '0.8', changefreq: 'daily' },
    { loc: `${BASE_URL}/brands`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${BASE_URL}/branches`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${BASE_URL}/about`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${BASE_URL}/contact`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${BASE_URL}/sitemap`, priority: '0.6', changefreq: 'weekly' }
  ];

  // Category URLs
  categories.forEach((cat) => {
    if (cat.slug) {
      urls.push({
        loc: `${BASE_URL}/category/${cat.slug}`,
        priority: '0.8',
        changefreq: 'weekly'
      });
    }
  });

  // Product URLs
  products.forEach((prod) => {
    if (prod.slug) {
      urls.push({
        loc: `${BASE_URL}/product/${prod.slug}`,
        priority: '0.7',
        changefreq: 'weekly'
      });
    }
  });

  const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`),
    '</urlset>'
  ];

  const sitemapXml = xmlLines.join('\n');
  const targetPath = path.join(rootDir, 'public', 'sitemap.xml');
  fs.writeFileSync(targetPath, sitemapXml, 'utf8');
  console.log(`Successfully generated ${targetPath} with ${urls.length} URLs!`);
}

generate().catch(console.error);
