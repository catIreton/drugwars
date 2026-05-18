import React, { useEffect, useRef, useCallback } from 'react';

import { styled } from '@mui/material/styles';
import { useGame } from '../../GameContext';

import Northtown from '../../../images/northtown.jpg';
import Plaza from '../../../images/plaza.jpg';
import Downtown from '../../../images/downtown.jpg';
import Westport from '../../../images/westport.jfif';
import Brookside from '../../../images/brookside.jpg';
import MartinCity from '../../../images/martincity.jpg';
import Independence from '../../../images/independence.jpg';
import JOCO from '../../../images/joco.jpg';

const MapContainer = styled('div')({
  position: 'relative',
  width: '100%',
  height: '500px',
  border: '2px solid #667eea',
  borderRadius: '8px',
  overflow: 'hidden',
});

const MapWrapper = styled('div')({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  gap: '12px',
});

const MapElement = styled('div')({
  flex: 1,
  width: '100%',
  height: '100%',
  borderRadius: '6px',
  overflow: 'hidden',
});

const LegendContainer = styled('div')({
  flex: '0 0 150px',
  overflow: 'auto',
  backgroundColor: '#f8f9fa',
  borderLeft: '1px solid #ddd',
  padding: '12px',
  fontSize: '0.85rem',
});

const CurrentLocContainer = styled('div')({
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

// Real Kansas City coordinates (lat, lng)
const LOCATION_COORDINATES = {
  'Northtown': { lat: 39.1140, lng: -94.5797 },
  'Plaza': { lat: 39.0433, lng: -94.5910 },
  'Downtown': { lat: 39.0997, lng: -94.5786 },
  'Westport': { lat: 39.0553, lng: -94.5859 },
  'Martin City': { lat: 38.9853, lng: -94.6180 },
  'Brookside': { lat: 39.0315, lng: -94.5415 },
  'Independence': { lat: 39.0934, lng: -94.4162 },
  'JOCO': { lat: 38.9633, lng: -94.7230 },
};

const LOCATION_COLORS = {
  'Northtown': '#8B4513',
  'Plaza': '#D4AF37',
  'Downtown': '#2C3E50',
  'Westport': '#E74C3C',
  'Brookside': '#27AE60',
  'Martin City': '#7D3C0C',
  'Independence': '#9B59B6',
  'JOCO': '#3498DB',
};

const LOCATIONS = [
  { name: 'Northtown', src: Northtown, ButtonComponent: 'primary' },
  { name: 'Plaza', src: Plaza, ButtonComponent: 'secondary' },
  { name: 'Downtown', src: Downtown, ButtonComponent: 'primary' },
  { name: 'Westport', src: Westport, ButtonComponent: 'secondary' },
  { name: 'Brookside', src: Brookside, ButtonComponent: 'secondary' },
  { name: 'Martin City', src: MartinCity, ButtonComponent: 'primary' },
  { name: 'Independence', src: Independence, ButtonComponent: 'secondary' },
  { name: 'JOCO', src: JOCO, ButtonComponent: 'primary' },
];

function CurrentLoc() {
  const { game } = useGame();
  const locationColor = LOCATION_COLORS[game?.location] || '#000000';
  const imageSrc = game?.locationSrc || LOCATIONS.find(l => l.name === game?.location)?.src;

  return (
    <CurrentLocContainer>
      <h1 style={{ margin: '0 0 2px 0', fontSize: '1.1rem' }}>Kansas City, MO</h1>
      <h2 style={{ margin: '0 0 10px 0', color: locationColor, fontSize: '1.3rem' }}>{game?.location}</h2>
      <img
        style={imageSrc ? { height: '150px', width: '150px', borderRadius: '8px' } : { display: 'none' }}
        src={imageSrc}
        alt={game?.location}
      />
    </CurrentLocContainer>
  );
}

function Travel() {
  const { updateGame } = useGame();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const handleTravel = useCallback((name, src) => {
    updateGame(prev => ({ ...prev, location: name, locationSrc: src, day: (prev.day || 0) + 1 }));
  }, [updateGame]);

  const createBusStopIcon = useCallback((number, name) => {
    const bgColor = LOCATION_COLORS[name] || '#667eea';
    const svg = `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="${bgColor}" stroke="white" stroke-width="2"/>
      <circle cx="20" cy="20" r="16" fill="${bgColor}"/>
      <text x="20" y="26" font-size="18" font-weight="bold" text-anchor="middle" fill="white">${number}</text>
    </svg>`;

    if (window.google && window.google.maps) {
      return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
        scaledSize: new window.google.maps.Size(40, 40),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(20, 40),
      };
    }

    return { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}` };
  }, []);

  const initializeMap = useCallback(() => {
    if (!window.google || !window.google.maps) return;

    const kcCenter = { lat: 39.0997, lng: -94.5786 };

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 11,
      center: kcCenter,
      styles: [
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#667eea' }],
        },
        {
          featureType: 'water',
          elementType: 'geometry.fill',
          stylers: [{ color: '#b3d9ff' }],
        },
      ],
    });

    mapInstanceRef.current = map;
    markersRef.current = [];

    LOCATIONS.forEach(({ name, src, ButtonComponent }, index) => {
      const coords = LOCATION_COORDINATES[name];

      const marker = new window.google.maps.Marker({
        position: coords,
        map: map,
        title: name,
        icon: createBusStopIcon(index + 1, name),
      });

      marker.addListener('click', () => {
        handleTravel(name, src);
      });

      markersRef.current.push(marker);
    });
  }, [createBusStopIcon, handleTravel]);

  useEffect(() => {
    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        const checkGoogle = setInterval(() => {
          if (window.google && window.google.maps) {
            initializeMap();
            clearInterval(checkGoogle);
          }
        }, 100);
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          setTimeout(() => {
            if (window.google && window.google.maps) initializeMap();
          }, 100);
        };
        script.onerror = () => console.error('Failed to load Google Maps API');
        document.head.appendChild(script);
      }
    }
  }, [initializeMap]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <h2 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#667eea' }}>Kansas City Transit Map</h2>
      <MapContainer>
        <MapWrapper>
          <MapElement ref={mapRef} />
          <LegendContainer>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#667eea' }}>Bus Stops</div>
            {LOCATIONS.map(({ name, src }, index) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(102, 126, 234, 0.05)',
                }}
                onClick={() => {
                  const coords = LOCATION_COORDINATES[name];
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.panTo(coords);
                    mapInstanceRef.current.setZoom(13);
                  }
                  handleTravel(name, src);
                }}
              >
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: LOCATION_COLORS[name], flexShrink: 0 }} />
                <div style={{ flex: 1 }}>{name}</div>
              </div>
            ))}
          </LegendContainer>
        </MapWrapper>
      </MapContainer>
    </div>
  );
}

export { Travel, CurrentLoc };
