import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

// Fix for leaflet default icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ position, setPosition, setAddress }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      fetchAddress(e.latlng.lat, e.latlng.lng);
    },
  });

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      setAddress(data.display_name);
    } catch (error) {
      setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  return position === null ? null : (
    <Marker position={position} />
  );
};

const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, 15);
  return null;
};

const MapComponent = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const latlng = { lat: latitude, lng: longitude };
          setPosition(latlng);
          fetchAddress(latitude, longitude);
          setLoading(false);
        },
        () => {
          setLoading(false);
          alert('Could not get your location. Please select on map.');
        }
      );
    }
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      setAddress(data.display_name);
    } catch (error) {
      setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  const handleSaveLocation = async () => {
    if (position && address) {
      try {
        const response = await api.post('/location', {
          latitude: position.lat,
          longitude: position.lng,
          address: address
        });
        toast.success('Location saved!');
        onLocationSelect(response.data);
      } catch (error) {
        console.error('Error saving location:', error);
        toast.error('Failed to save location');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-800 flex items-center">
          <MapPin className="w-5 h-5 text-primary-600 mr-2" />
          Select Delivery Location
        </h3>
        <button 
          onClick={getCurrentLocation}
          disabled={loading}
          className="flex items-center space-x-2 text-sm font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Navigation className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Locating...' : 'Use Current'}</span>
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden shadow-inner border border-slate-200">
        <MapContainer 
          center={position || [20.5937, 78.9629]} 
          zoom={5} 
          className="h-[350px] w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {position && <ChangeView center={position} />}
          <LocationMarker position={position} setPosition={setPosition} setAddress={setAddress} />
        </MapContainer>
      </div>

      {address && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Selected Address</p>
          <p className="text-slate-700 text-sm font-medium leading-relaxed mb-3">{address}</p>
          <button 
            onClick={handleSaveLocation}
            className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
          >
            Confirm Location
          </button>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
