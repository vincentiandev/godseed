import React, { useState } from 'react';

const PlantSeedForm = ({ user, onPlant }) => {
  const [formData, setFormData] = useState({
    seedType: 'education',
    amountUSD: '100',
    location: 'Kenya',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const seedData = {
      planterAddress: user.walletAddress,
      ...formData,
      amountUSD: parseInt(formData.amountUSD)
    };
    
    onPlant(seedData);
    
    // Reset form
    setFormData({
      seedType: 'education',
      amountUSD: '100',
      location: 'Kenya',
      description: ''
    });
  };

  return (
    <div className="plant-seed-form">
      <h2>🌱 Plant a New Seed</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>What type of seed?</label>
          <select 
            name="seedType" 
            value={formData.seedType}
            onChange={handleChange}
          >
            <option value="education">📚 Education</option>
            <option value="health">🏥 Health & Medicine</option>
            <option value="business">💼 Business Startup</option>
            <option value="community">🏘️ Community Project</option>
            <option value="disaster">🆘 Disaster Relief</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Amount (USD)</label>
          <input
            type="number"
            name="amountUSD"
            value={formData.amountUSD}
            onChange={handleChange}
            min="10"
            max="100000"
            required
          />
          <small>Minimum: $10</small>
        </div>
        
        <div className="form-group">
          <label>Location</label>
          <select 
            name="location" 
            value={formData.location}
            onChange={handleChange}
          >
            <option value="Kenya">Kenya</option>
            <option value="Gaza">Gaza</option>
            <option value="Sudan">Sudan</option>
            <option value="Ukraine">Ukraine</option>
            <option value="Yemen">Yemen</option>
            <option value="Haiti">Haiti</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What will this seed help achieve? (e.g., 'School fees for 1 year', 'Clean water well')"
            rows="3"
          />
        </div>
        
        <div className="seed-summary">
          <h4>Seed Summary</h4>
          <p>Type: {formData.seedType}</p>
          <p>Amount: ${formData.amountUSD}</p>
          <p>Location: {formData.location}</p>
          <p>Your reputation will increase by: {formData.amountUSD} points</p>
        </div>
        
        <button type="submit" className="plant-btn">
          🌱 Plant This Seed
        </button>
      </form>
    </div>
  );
};

export default PlantSeedForm;