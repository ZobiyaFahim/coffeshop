import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// Hardcoded premium aesthetic coffee data (No MongoDB needed)
const coffees = [
  { _id: '1', name: 'Espresso', description: 'Concentrated coffee shot forced under high pressure.', price: '$3.50', image: 'https://unsplash.com' },
  { _id: '2', name: 'Doppio', description: 'Double shot of standard espresso.', price: '$4.50', image: 'https://unsplash.com' },
  { _id: '3', name: 'Ristretto', description: 'Concentrated espresso made with less water.', price: '$3.80', image: 'https://unsplash.com' },
  { _id: '4', name: 'Lungo', description: 'Espresso brewed longer with extra water.', price: '$4.00', image: 'https://unsplash.com' },
  { _id: '5', name: 'Americano', description: 'Espresso shot diluted with hot water.', price: '$3.99', image: 'https://unsplash.com' },
  { _id: '6', name: 'Long Black', description: 'Espresso poured over a cup of hot water.', price: '$4.20', image: 'https://unsplash.com' }
];

app.get('/api/seed', (req, res) => {
  res.send('Aesthetic Coffee items ready in local server memory!');
});

// React UI ke liye API endpoint
app.get('/api/coffees', (req, res) => {
  res.json(coffees);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend Server running smoothly on port ${PORT}`));