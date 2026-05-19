import React, { useCallback, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './travel.css';
import { useGame } from '../../GameContext';

import Northtown from '../../../images/northtown.jpg';
import Plaza from '../../../images/plaza.jpg';
import Downtown from '../../../images/downtown.jpg';
import Westport from '../../../images/westport.jfif';
import Brookside from '../../../images/brookside.jpg';
import MartinCity from '../../../images/martincity.jpg';
import Independence from '../../../images/independence.jpg';
import JOCO from '../../../images/joco.jpg';

const MapCard = styled('div')({
  position: 'relative',
  width: '100%',
  height: '520px',
  border: '2px solid #667eea',
  borderRadius: '8px',
  overflow: 'hidden',
  display: 'flex',
});

const LegendContainer = styled('div')({
  flex: '0 0 168px',
  overflowY: 'auto',
  backgroundColor: '#f5f0e8',
  borderLeft: '1px solid #c8bfa8',
  padding: '10px',
  fontSize: '0.82rem',
  zIndex: 1000,
});

const CurrentLocContainer = styled('div')({
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

// ── Location data ──────────────────────────────────────────────────────────────
const LOCATION_COLORS = {
  'Northtown':    '#8B4513',
  'Plaza':        '#b8860b',
  'Downtown':     '#2563eb',
  'Westport':     '#dc2626',
  'Brookside':    '#16a34a',
  'Martin City':  '#92400e',
  'Independence': '#7c3aed',
  'JOCO':         '#0369a1',
  'Crossroads':   '#4338ca',
  'Midtown':      '#0e7490',
  'Raytown':      '#a16207',
  'Lenexa':       '#15803d',
};

const LOCATIONS = [
  { name: 'Northtown',    src: Northtown    },
  { name: 'Plaza',        src: Plaza        },
  { name: 'Downtown',     src: Downtown     },
  { name: 'Westport',     src: Westport     },
  { name: 'Brookside',    src: Brookside    },
  { name: 'Martin City',  src: MartinCity   },
  { name: 'Independence', src: Independence },
  { name: 'JOCO',         src: JOCO         },
  { name: 'Crossroads',   src: null         },
  { name: 'Midtown',      src: null         },
  { name: 'Raytown',      src: null         },
  { name: 'Lenexa',       src: null         },
];

const LOCATION_COORDS = {
  'Northtown':    [39.110, -94.543],
  'Downtown':     [39.096, -94.578],
  'Crossroads':   [39.083, -94.578],
  'Midtown':      [39.063, -94.570],
  'Westport':     [39.046, -94.592],
  'Plaza':        [39.037, -94.599],
  'Brookside':    [39.022, -94.576],
  'Martin City':  [38.934, -94.592],
  'Independence': [39.091, -94.414],
  'JOCO':         [38.982, -94.669],
  'Raytown':      [39.012, -94.463],
  'Lenexa':       [38.963, -94.734],
};

// ── Map fly-to controller (must live inside MapContainer) ─────────────────────
function MapFlyTo({ location }) {
  const map = useMap();
  const firstRender = useRef(true);

  useEffect(() => {
    if (!location || !LOCATION_COORDS[location]) return;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    map.flyTo(LOCATION_COORDS[location], 14, { duration: 0.55 });
  }, [location, map]);

  return null;
}

// ── Travel component ──────────────────────────────────────────────────────────
function Travel() {
  const { game, travel } = useGame();

  const handleTravel = useCallback((name, src) => {
    travel(name, src);
  }, [travel]);

  const initialCenter = LOCATION_COORDS[game.location] || [39.07, -94.58];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <h2 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#667eea' }}>Kansas City</h2>
      <MapCard>
        {/* Leaflet map */}
        <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
          <MapContainer
            center={initialCenter}
            zoom={13}
            style={{ width: '100%', height: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <MapFlyTo location={game.location} />

            {LOCATIONS.map(({ name, src }) => {
              const coords = LOCATION_COORDS[name];
              if (!coords) return null;
              const isHere    = name === game.location;
              const color     = LOCATION_COLORS[name];
              const rivalLvl  = game.rivals?.[name]?.level ?? 0;
              const showRival = game.scannerActive && rivalLvl > 0;

              return (
                <CircleMarker
                  key={name}
                  center={coords}
                  radius={isHere ? 11 : 8}
                  pathOptions={{
                    color:        isHere ? 'white' : color,
                    fillColor:    isHere ? color   : 'white',
                    fillOpacity:  1,
                    weight:       isHere ? 3 : 2,
                  }}
                  eventHandlers={{ click: () => handleTravel(name, src) }}
                >
                  <Tooltip permanent direction="bottom" offset={[0, 6]}
                    className="kc-pin-label">
                    <span style={{
                      color:      color,
                      fontWeight: isHere ? 700 : 500,
                      fontSize:   '11px',
                      whiteSpace: 'nowrap',
                    }}>
                      {name}{showRival ? ' ' + (rivalLvl >= 4 ? '🔒' : '👊') : ''}
                    </span>
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* Sidebar legend */}
        <LegendContainer>
          <div style={{ fontWeight: 700, marginBottom: '8px', color: '#444', fontSize: '0.78rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Neighborhoods
          </div>
          {LOCATIONS.map(({ name, src }, index) => {
            const isHere     = name === game.location;
            const rivalLevel = game.rivals?.[name]?.level ?? 0;
            const showRival  = game.scannerActive && rivalLevel > 0;
            return (
              <div
                key={name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  marginBottom: '6px',
                  cursor: 'pointer',
                  padding: '3px 5px',
                  borderRadius: '4px',
                  backgroundColor: isHere ? `${LOCATION_COLORS[name]}22` : 'transparent',
                  border: isHere ? `1px solid ${LOCATION_COLORS[name]}66` : '1px solid transparent',
                  fontWeight: isHere ? 700 : 400,
                }}
                onClick={() => handleTravel(name, src)}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'white', border: `2px solid ${LOCATION_COLORS[name]}`,
                  flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.55rem', color: LOCATION_COLORS[name], fontWeight: 700,
                  fontFamily: 'Arial, sans-serif',
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1, fontSize: '0.78rem', color: '#222' }}>{name}</div>
                {showRival && (
                  <span style={{ fontSize: '0.6rem', color: rivalLevel >= 4 ? '#dc2626' : '#ea580c', fontWeight: 700 }}>
                    {rivalLevel >= 4 ? '🔒' : '👊'}
                  </span>
                )}
              </div>
            );
          })}
        </LegendContainer>
      </MapCard>
    </div>
  );
}

// ── Current location display ───────────────────────────────────────────────────
function CurrentLoc() {
  const { game } = useGame();
  const locationColor = LOCATION_COLORS[game?.location] || '#333';
  const imageSrc = LOCATIONS.find(l => l.name === game?.location)?.src;

  return (
    <CurrentLocContainer>
      <h1 style={{ margin: '0 0 2px 0', fontSize: '1.1rem' }}>Kansas City, MO</h1>
      <h2 style={{ margin: '0 0 10px 0', color: locationColor, fontSize: '1.3rem' }}>{game?.location}</h2>
      <img
        style={imageSrc
          ? { width: '100%', maxWidth: '180px', aspectRatio: '1', objectFit: 'cover', borderRadius: '8px', display: 'block' }
          : { display: 'none' }}
        src={imageSrc}
        alt={game?.location}
      />
    </CurrentLocContainer>
  );
}

export { Travel, CurrentLoc };
