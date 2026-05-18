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

const ThirdRowContainer = styled('div')({
  height: '120px', // Set the height of the third row of cards
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#2C3E50', // Retro dark blue background
  color: '#D4AF37', // Gold text for retro feel
  fontFamily: 'Courier New, Courier, monospace', // Retro font
  fontSize: '1rem',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  animation: 'scrollText 10s linear infinite',

  '@keyframes scrollText': {
    '0%': { transform: 'translateX(100%)' },
    '100%': { transform: 'translateX(-100%)' },
  },
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
  'Northtown': '#8B4513',    // Brown - street/urban
  'Plaza': '#D4AF37',         // Gold - high-end market
  'Downtown': '#2C3E50',      // Dark blue - business district
  'Westport': '#E74C3C',      // Red - party scene
  'Brookside': '#27AE60',     // Green - local/nature
  'Martin City': '#7D3C0C',   // Dark brown - street life
  'Independence': '#9B59B6',  // Purple - suburban
  'JOCO': '#3498DB',          // Light blue - wealthy suburbs
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

  return (
    <CurrentLocContainer>
      <h1 style={{ margin: '0 0 2px 0', fontSize: '1.1rem' }}>Kansas City, MO</h1>
      <h2 style={{ margin: '0 0 10px 0', color: locationColor, fontSize: '1.3rem' }}>{game?.location}</h2>
      <img
        style={game?.locationSrc ? { height: '150px', width: '150px', borderRadius: '8px' } : { display: 'none' }}
        src={game?.locationSrc}
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

  const createBusStopIcon = useCallback((number, isPrimary) => {
    const bgColor = isPrimary ? '#667eea' : '#059669';
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

    // Kansas City center
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

    // Create markers for each location
    LOCATIONS.forEach(({ name, src, ButtonComponent }, index) => {
      const coords = LOCATION_COORDINATES[name];

      // Create custom marker with bus stop styling
      const marker = new window.google.maps.Marker({
        position: coords,
        map: map,
        title: name,
        icon: createBusStopIcon(index + 1, ButtonComponent === 'primary'),
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
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB3MI9WQIf_LCU2DHj5uN0IWjXwN86dHag`;
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

  // Render UI
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
                <div style={{ width: 24, height: 24, borderRadius: 12, background: LOCATION_COLORS[name] }} />
                <div style={{ flex: 1 }}>{name}</div>
              </div>
            ))}
          </LegendContainer>
        </MapWrapper>
      </MapContainer>

      <ThirdRowContainer>
        <div style={{ display: 'inline-block', paddingLeft: '100%' }}>
          {['TODAY: Transit delays on I-35', 'EVENT: Downtown street fair 6pm', 'NOTE: New bus routes added'].join(' \u00A0 \u00A0 • \u00A0 \u00A0 ')}
        </div>
      </ThirdRowContainer>
    </div>
  );
}

export { Travel, CurrentLoc };
