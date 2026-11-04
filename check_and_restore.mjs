import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uri = 'mongodb+srv://audioenterprisebhuj_db_user:N0csDNfFudsme5RG@jbl-audio.7csuwei.mongodb.net/jbl_audio_db';

async function check() {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas!');
    const db = client.db('jbl_audio_db');
    const productsCollection = db.collection('products');
    
    const count = await productsCollection.countDocuments();
    console.log('Current product count in MongoDB Atlas:', count);

    const existingProducts = await productsCollection.find({}).toArray();
    console.log('Existing product IDs in MongoDB:', existingProducts.map(p => p.id));

    // Read defaultProducts.json
    const defaultJsonPath = path.join(__dirname, 'src', 'data', 'defaultProducts.json');
    let defaultProducts = [];
    if (fs.existsSync(defaultJsonPath)) {
      defaultProducts = JSON.parse(fs.readFileSync(defaultJsonPath, 'utf8'));
      console.log('defaultProducts.json has', defaultProducts.length, 'products');
    }

    return { existingProducts, defaultProducts };
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.close();
  }
}

check();
