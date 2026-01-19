import React, { useState } from 'react';

const ConnectWallet = ({ onConnect }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (walletAddress.trim()) {
      onConnect(walletAddress, username);
    }
  };

  // Simulate wallet connection for demo
  const simulateWallet = () => {
    const fakeWallet = `0x${Math.random().toString(16).slice(2, 42)}`;
    setWalletAddress(fakeWallet);
    setUsername(`Planter_${Math.floor(Math.random() * 1000)}`);
  };

  return (
    <div className="connect-wallet">
      <h3>Connect to Godseed</h3>
      
      <button onClick={simulateWallet} className="simulate-btn">
        🦊 Simulate MetaMask Connect
      </button>
      
      <p className="or">- OR -</p>
      
      <form onSubmit={handleSubmit} className="wallet-form">
        <div className="form-group">
          <label>Wallet Address</label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0x..."
            required
          />
        </div>
        
        <div className="form-group">
          <label>Username (optional)</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Planter name"
          />
        </div>
        
        <button type="submit" className="connect-btn">
          🌱 Join Godseed
        </button>
      </form>
      
      <p className="demo-note">
        <small>
          Demo mode: Use any wallet address. 
          Real blockchain integration coming soon.
        </small>
      </p>
    </div>
  );
};

export default ConnectWallet;