import React, { useState, useEffect } from 'react';
import './App.css';

// Components
import ConnectWallet from './components/ConnectWallet';
import PlantSeedForm from './components/PlantSeedForm';
import SeedMap from './components/SeedMap';
import UserProfile from './components/UserProfile';

function App() {
  const [user, setUser] = useState(null);
  const [seeds, setSeeds] = useState([]);
  const [activeTab, setActiveTab] = useState('map');

  // Check if user is already connected
  useEffect(() => {
    const savedUser = localStorage.getItem('godseed_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Load seeds for map
    fetchSeeds();
  }, []);

  const fetchSeeds = async () => {
    try {
      const response = await fetch('/api/seeds/map');
      const data = await response.json();
      setSeeds(data.seeds || []);
    } catch (error) {
      console.error('Error fetching seeds:', error);
    }
  };

  const handleConnect = async (walletAddress) => {
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress })
      });
      
      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('godseed_user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const handlePlantSeed = async (seedData) => {
    try {
      const response = await fetch('/api/seeds/plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seedData)
      });
      
      const data = await response.json();
      if (data.success) {
        alert('🌱 Seed planted successfully!');
        fetchSeeds(); // Refresh seeds
        // Update user stats
        setUser(prev => ({
          ...prev,
          reputation: prev.reputation + parseInt(seedData.amountUSD),
          seedsPlanted: prev.seedsPlanted + 1
        }));
      }
    } catch (error) {
      console.error('Error planting seed:', error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌱 GODSEED</h1>
        <p className="tagline">Plant seeds. Grow forests of goodwill.</p>
        
        {user ? (
          <div className="user-info">
            <span>Welcome, {user.username}</span>
            <span>Reputation: {user.reputation} 🌟</span>
            <span>Seeds: {user.seedsPlanted}</span>
          </div>
        ) : (
          <ConnectWallet onConnect={handleConnect} />
        )}
      </header>

      <nav className="app-nav">
        <button 
          className={activeTab === 'map' ? 'active' : ''}
          onClick={() => setActiveTab('map')}
        >
          🌍 Seed Map
        </button>
        <button 
          className={activeTab === 'plant' ? 'active' : ''}
          onClick={() => setActiveTab('plant')}
        >
          🪴 Plant Seed
        </button>
        <button 
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          👤 My Profile
        </button>
        <button 
          className={activeTab === 'forest' ? 'active' : ''}
          onClick={() => setActiveTab('forest')}
        >
          🌳 My Forest
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'map' && <SeedMap seeds={seeds} />}
        {activeTab === 'plant' && user && <PlantSeedForm user={user} onPlant={handlePlantSeed} />}
        {activeTab === 'profile' && user && <UserProfile user={user} />}
        {activeTab === 'forest' && user && (
          <div className="forest-view">
            <h2>Your Forest</h2>
            <p>Seeds you've planted will appear here as they grow.</p>
            {/* Will show growth progress */}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>🌱 The Economy of Gratitude • Plant today, harvest tomorrow</p>
        <p className="beta">Beta v1.0 • Made with ❤️ for humanity</p>
      </footer>
    </div>
  );
}

export default App;