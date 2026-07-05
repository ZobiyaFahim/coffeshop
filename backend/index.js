import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// Local MongoDB Connection Fix
mongoose.connect('mongodb://127.0.0.1:27017/coffeeshop')
  .then(() => console.log('✅ Connected to Local MongoDB Successfully!'))
  .catch(err => console.log('⚠️ Local MongoDB Connection Failed (Using Backup Data):', err.message));

// Schema
const coffeeSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number, // Pricing float/number me rakhi hai calc ke liye
  image: String
});
const Coffee = mongoose.model('Coffee', coffeeSchema);

// Backup Hardcoded items agar database background me start na ho
const defaultCoffees = [
  { name: 'Espresso', description: 'Concentrated coffee shot forced under high pressure.', price: 3.50, image: '/espresso.webp' },
  { name: 'Doppio', description: 'Double shot of standard espresso.', price: 4.50, image: '/doppio.jpg' },
  { name: 'Ristretto', description: 'Concentrated espresso made with less water.', price: 3.80, image: '/ristretto.jpg' },
  { name: 'Lungo', description: 'Espresso brewed longer with extra water.', price: 4.00, image: '/Lungo.jfif' },
  { name: 'Americano', description: 'Espresso shot diluted with hot water.', price: 3.99, image: '/Americano.webp' },
  { name: 'Long Black', description: 'Espresso poured over a cup of hot water.', price: 4.20, image: '/Long Black.jfif' }
];

// Seed Route to insert items locally
app.get('/api/seed', async (req, res) => {
  try {
    await Coffee.deleteMany({});
    await Coffee.insertMany(defaultCoffees);
    res.send('Database Seeded Locally!');
  } catch (e) { res.status(500).send(e.message); }
});

// Fetching API
app.get('/api/coffees', async (req, res) => {
  try {
    const dbCoffees = await Coffee.find({});
    if (dbCoffees.length > 0) return res.json(dbCoffees);
    res.json(defaultCoffees); // Backup return
  } catch {
    res.json(defaultCoffees);
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend Server running smoothly on port ${PORT}`));