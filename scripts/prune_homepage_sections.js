import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const uri = 'mongodb+srv://audioenterprisebhuj_db_user:N0csDNfFudsme5RG@jbl-audio.7csuwei.mongodb.net/jbl_audio_db';

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('jbl_audio_db');

  const products = await db.collection('products').find({}).toArray();
  const prodIds = new Set(products.map(p => Number(p.id)));
  console.log(`Found ${prodIds.size} valid product IDs in DB: ${[...prodIds].sort((a,b)=>a-b).join(', ')}`);

  const sections = await db.collection('homepage_sections').find({}).toArray();
  let totalPruned = 0;

  for (const s of sections) {
    if (Array.isArray(s.productIds)) {
      const original = s.productIds;
      const cleaned = original.filter(id => prodIds.has(Number(id)));
      if (cleaned.length !== original.length) {
        totalPruned += (original.length - cleaned.length);
        console.log(`Section "${s.id}" (${s.title}): pruned from ${original.length} [${original.join(',')}] to ${cleaned.length} [${cleaned.join(',')}]`);
        await db.collection('homepage_sections').updateOne(
          { _id: s._id },
          { $set: { productIds: cleaned } }
        );
      }
    }
  }

  console.log(`Total phantom product IDs pruned from MongoDB Atlas: ${totalPruned}`);

  const updated = await db.collection('homepage_sections').find({}).sort({ order: 1 }).toArray();
  const cleanedSections = updated.map(({ _id, ...rest }) => rest);
  const jsonPath = path.join(rootDir, 'src', 'data', 'defaultHomeSections.json');
  fs.writeFileSync(jsonPath, JSON.stringify(cleanedSections, null, 2), 'utf8');
  console.log('Synchronized src/data/defaultHomeSections.json successfully!');

  await client.close();
}

run().catch(console.error);
