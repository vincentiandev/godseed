const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory database for MVP (we'll replace with PostgreSQL later)
let users = [];
let seeds = [];

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    message: '🌱 Godseed API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 2. Register user
app.post('/api/users/register', (req, res) => {
  const { walletAddress, username } = req.body;
  
  const userExists = users.find(u => u.walletAddress === walletAddress);
  if (userExists) {
    return res.json({ success: true, user: userExists });
  }
  
  const newUser = {
    id: `user_${Date.now()}`,
    walletAddress,
    username: username || `Planter_${walletAddress.slice(0, 6)}`,
    reputation: 0,
    seedsPlanted: 0,
    joinedAt: new Date().toISOString()
  };
  
  users.push(newUser);
  res.json({ success: true, user: newUser });
});

// 3. Plant a seed
app.post('/api/seeds/plant', (req, res) => {
  const { planterAddress, amountUSD, seedType, location, description } = req.body;
  
  // Find user
  const planter = users.find(u => u.walletAddress === planterAddress);
  if (!planter) {
    return res.status(400).json({ error: 'User not found' });
  }
  
  const newSeed = {
    id: `seed_${Date.now()}`,
    planterAddress,
    amountUSD,
    seedType, // 'education', 'health', 'business', 'community'
    location,
    description,
    status: 'planted',
    plantedAt: new Date().toISOString(),
    growthUpdates: [],
    gratitudeReceived: 0
  };
  
  seeds.push(newSeed);
  
  // Update user stats
  planter.reputation += parseInt(amountUSD);
  planter.seedsPlanted += 1;
  
  res.json({ 
    success: true, 
    seed: newSeed,
    message: `Seed planted! ${amountUSD} invested in ${seedType}`
  });
});

// 4. Get user's seeds
app.get('/api/users/:address/seeds', (req, res) => {
  const { address } = req.params;
  const userSeeds = seeds.filter(s => s.planterAddress === address);
  
  res.json({ seeds: userSeeds });
});

// 5. Get all seeds for map
app.get('/api/seeds/map', (req, res) => {
  const seedLocations = seeds.map(seed => ({
    id: seed.id,
    planterAddress: seed.planterAddress,
    seedType: seed.seedType,
    amountUSD: seed.amountUSD,
    location: seed.location,
    status: seed.status,
    plantedAt: seed.plantedAt
  }));
  
  res.json({ seeds: seedLocations });
});

// 6. Give gratitude
app.post('/api/seeds/:seedId/gratitude', (req, res) => {
  const { seedId } = req.params;
  const { fromAddress, amountUSD, message } = req.body;
  
  const seed = seeds.find(s => s.id === seedId);
  if (!seed) {
    return res.status(404).json({ error: 'Seed not found' });
  }
  
  seed.gratitudeReceived += parseInt(amountUSD);
  seed.growthUpdates.push({
    type: 'gratitude',
    from: fromAddress,
    amount: amountUSD,
    message,
    timestamp: new Date().toISOString()
  });
  
  // Update planter's reputation
  const planter = users.find(u => u.walletAddress === seed.planterAddress);
  if (planter) {
    planter.reputation += parseInt(amountUSD) * 0.1; // 10% of gratitude adds to reputation
  }
  
  res.json({ 
    success: true, 
    message: `Gratitude of $${amountUSD} given to seed ${seedId}`,
    newTotalGratitude: seed.gratitudeReceived
  });
});

app.listen(PORT, () => {
  console.log(`
  🌱 GODSEED BACKEND STARTED 🌱
  ==============================
  Local: http://localhost:${PORT}
  Health: http://localhost:${PORT}/api/health
  
  Ready to plant seeds of gratitude!
  `);
});