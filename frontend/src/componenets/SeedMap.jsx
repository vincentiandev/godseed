import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Location coordinates for demo
const locationCoords = {
  'Kenya': [-1.286389, 36.817223],
  'Gaza': [31.416667, 34.333333],
  'Sudan': [15.5, 32.5],
  'Ukraine': [49, 32],
  'Yemen': [15.5, 47.5],
  'Haiti': [19, -72.5],
  'Other': [20, 0]
};

// Seed type icons
const seedIcons = {
  education: '📚',
  health: '🏥',
  business: '💼',
  community: '🏘️',
  disaster: '🆘'
};

const SeedMap = ({ seeds }) => {
  const [center] = useState([20, 0]);
  const [zoom] = useState(2);

  // Group seeds by location for map display
  const seedsByLocation = seeds.reduce((acc, seed) => {
    if (!acc[seed.location]) {
      acc[seed.location] = [];
    }
    acc[seed.location].push(seed);
    return acc;
  }, {});

  // Calculate total seeds per location
  const locationTotals = Object.entries(seedsByLocation).map(([location, seeds]) => {
    const totalAmount = seeds.reduce((sum, seed) => sum + seed.amountUSD, 0);
    const seedCount = seeds.length;
    return {
      location,
      seeds,
      totalAmount,
      seedCount,
      coordinates: locationCoords[location] || [20, 0]
    };
  });

  return (
    <div className="seed-map">
      <h2>🌍 Global Seed Map</h2>
      <p>Seeds planted around the world. Click to see details.</p>
      
      <div className="map-container">
        <MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {locationTotals.map((loc) => (
            <Marker 
              key={loc.location} 
              position={loc.coordinates}
              icon={L.divIcon({
                className: 'custom-marker',
                html: `<div style="background: #10B981; color: white; padding: 5px 10px; border-radius: 20px; font-weight: bold;">
                        ${seedIcons[loc.seeds[0]?.seedType] || '🌱'} ${loc.seedCount}
                      </div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 40]
              })}
            >
              <Popup>
                <div className="location-popup">
                  <h3>{loc.location}</h3>
                  <p><strong>Total Seeds:</strong> {loc.seedCount}</p>
                  <p><strong>Total Investment:</strong> ${loc.totalAmount}</p>
                  <hr />
                  <h4>Recent Seeds:</h4>
                  <ul>
                    {loc.seeds.slice(0, 3).map(seed => (
                      <li key={seed.id}>
                        {seedIcons[seed.seedType]} ${seed.amountUSD} - {seed.seedType}
                      </li>
                    ))}
                  </ul>
                  {loc.seeds.length > 3 && (
                    <p>...and {loc.seeds.length - 3} more</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      <div className="map-stats">
        <div className="stat">
          <h3>{seeds.length}</h3>
          <p>Total Seeds Planted</p>
        </div>
        <div className="stat">
          <h3>${seeds.reduce((sum, seed) => sum + seed.amountUSD, 0)}</h3>
          <p>Total Value Planted</p>
        </div>
        <div className="stat">
          <h3>{Object.keys(seedsByLocation).length}</h3>
          <p>Countries/Regions</p>
        </div>
      </div>
    </div>
  );
};

export default SeedMap;