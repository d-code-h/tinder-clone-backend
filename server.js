import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
const app = express();
const url = process.env.DB_URL;

const dbName = 'txinder-clone';
const client = new MongoClient(url);
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

// API Endpoints
http: app.get('/', (req, res) => {
  res.status(200).send('I am live!!');
});

app.post('/tinder/cards', async (req, res) => {
  console.log(req.body);
  const dbCard = req.body;
  try {
    const db = client.db(dbName);
    const store = await db.collection('cards').insertOne(dbCard);
    console.log(store);
    res.status(201).send('Card added');
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  } finally {
    await client.close();
  }
});

app.get('/tinder/cards', async (req, res) => {
  try {
    await client.connect();
    console.log('Connected Successfully to DB');
    const db = client.db(dbName);
    const store = await db.collection('cards').find({}).toArray();
    console.log(store);
    res.status(200).send(store);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  } finally {
    await client.close();
  }
});

app.delete('/tinder/cards', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const deleted = await db.collection('cards').deleteMany({});
    console.log(deleted);
    res.status(200).send(deleted);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  } finally {
    await client.close();
  }
});

// Listener

(async () => {
  try {
    await client.connect();
    console.log('Connected Successfully to DB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
})();
