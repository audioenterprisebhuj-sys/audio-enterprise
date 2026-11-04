import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://audioenterprisebhuj_db_user:N0csDNfFudsme5RG@jbl-audio.7csuwei.mongodb.net/jbl_audio_db';

async function inspectDb() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('jbl_audio_db');
    const products = await db.collection('products').find({}).toArray();
    console.log('Current DB products count:', products.length);
    for (const p of products) {
      console.log(`ID: ${p.id}, Name: ${p.name}, Slug: ${p.slug}`);
    }
  } finally {
    await client.close();
  }
}

inspectDb();
