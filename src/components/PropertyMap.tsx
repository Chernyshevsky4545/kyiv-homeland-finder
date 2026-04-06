import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl, useMap, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { type Listing } from '@/types/listing';
import { formatPrice } from '@/lib/format';
import { metroStations, type MetroStation } from '@/data/metroStations';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

interface MapProps {
  listings: Listing[];
  onMarkerClick: (id: number) => void;
  selectedId: number | null;
}

const METRO_LINE_COLORS: Record<string, string> = {
  red: 'hsl(0, 75%, 50%)',
  blue: 'hsl(220, 75%, 50%)',
  green: 'hsl(142, 71%, 40%)',
};

function createMetroIcon(line: string) {
  const color = METRO_LINE_COLORS[line] || '#888';
  const html = `
    <div style="
      width:28px;height:28px;border-radius:50%;
      background:${color};border:3px solid white;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      font-weight:900;font-size:14px;color:white;
      font-family:'Outfit',sans-serif;
    ">M</div>
  `;
  return L.divIcon({
    html,
    className: 'metro-marker-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function MapFocusHandler({ selectedId, listings }: { selectedId: number | null; listings: Listing[] }) {
  const map = useMap();

  useEffect(() => {
    if (selectedId) {
      const listing = listings.find((l) => l.id === selectedId);
      if (listing) {
        map.setView([listing.lat, listing.lng], 15, { animate: true, duration: 0.5 });
      }
    }
  }, [selectedId, listings, map]);

  return null;
}

const KYIV_BOUNDS = { minLat: 50.30, maxLat: 50.60, minLng: 30.20, maxLng: 30.85 };

function isValidCoord(lat: number, lng: number): boolean {
  return lat >= KYIV_BOUNDS.minLat && lat <= KYIV_BOUNDS.maxLat &&
         lng >= KYIV_BOUNDS.minLng && lng <= KYIV_BOUNDS.maxLng;
}

export function PropertyMap({ listings, onMarkerClick, selectedId }: MapProps) {
  const defaultCenter: [number, number] = [50.4501, 30.5234];
  const defaultZoom = 12;

  const validListings = useMemo(() => {
    return listings.filter(l => {
      if (!isValidCoord(l.lat, l.lng)) {
        console.warn(`[Map] Skipping listing #${l.id} — invalid coords: ${l.lat}, ${l.lng}`);
        return false;
      }
      return true;
    });
  }, [listings]);

  const validMetro = useMemo(() => {
    return metroStations.filter(s => {
      if (!isValidCoord(s.lat, s.lng)) {
        console.warn(`[Map] Skipping metro "${s.name}" — invalid coords: ${s.lat}, ${s.lng}`);
        return false;
      }
      return true;
    });
  }, []);

  const createCustomIcon = (listing: Listing, isSelected: boolean) => {
    const isApartment = listing.type === 'apartment';
    const bgClass = isApartment ? 'background: hsl(200, 85%, 35%);' : 'background: hsl(142, 71%, 45%);';
    const ringStyle = isSelected
      ? `box-shadow: 0 0 0 4px ${isApartment ? 'hsla(200, 85%, 35%, 0.3)' : 'hsla(142, 71%, 45%, 0.3)'};`
      : '';
    const scale = isSelected ? 'transform: scale(1.1);' : '';

    const html = `
      <div style="cursor:pointer;transition:transform 0.3s;transform-origin:bottom;${scale}">
        <div style="${bgClass}color:white;font-weight:700;padding:4px 10px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:2px solid white;white-space:nowrap;font-size:13px;font-family:'Outfit',sans-serif;${ringStyle}">
          ${formatPrice(listing.price)}
        </div>
        <div style="position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid white;"></div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-marker-wrapper',
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  };

  const metroIcons = useMemo(() => {
    const map = new Map<string, L.DivIcon>();
    for (const line of ['red', 'blue', 'green']) {
      map.set(line, createMetroIcon(line));
    }
    return map;
  }, []);

  return (
    <div className="w-full h-full relative bg-muted z-0">
      <MapContainer center={defaultCenter} zoom={defaultZoom} className="w-full h-full" zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <MapFocusHandler selectedId={selectedId} listings={listings} />

        {/* Metro station markers with radius circles */}
        {metroStations.map((station) => (
          <React.Fragment key={station.name}>
            <Circle
              center={[station.lat, station.lng]}
              radius={600}
              pathOptions={{
                color: METRO_LINE_COLORS[station.line],
                fillColor: METRO_LINE_COLORS[station.line],
                fillOpacity: 0.07,
                weight: 1,
                opacity: 0.3,
              }}
            />
            <Marker
              position={[station.lat, station.lng]}
              icon={metroIcons.get(station.line)!}
              zIndexOffset={2000}
            >
              <Tooltip direction="top" offset={[0, -16]} opacity={0.95}>
                <span className="font-display font-bold text-sm">{station.name}</span>
              </Tooltip>
            </Marker>
          </React.Fragment>
        ))}

        {/* Listing markers */}
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            position={[listing.lat, listing.lng]}
            icon={createCustomIcon(listing, selectedId === listing.id)}
            eventHandlers={{ click: () => onMarkerClick(listing.id) }}
            zIndexOffset={selectedId === listing.id ? 1000 : 0}
          />
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-[400] bg-card/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-border">
        <h4 className="font-display font-bold text-sm mb-2 text-foreground">Легенда карти</h4>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary border-2 border-card shadow-sm"></div>
            <span className="text-xs font-medium text-muted-foreground">Квартири</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-accent border-2 border-card shadow-sm"></div>
            <span className="text-xs font-medium text-muted-foreground">Будинки</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-primary-foreground" style={{ background: 'hsl(0, 75%, 50%)' }}>M</div>
            <span className="text-xs font-medium text-muted-foreground">Метро</span>
          </div>
        </div>
      </div>
    </div>
  );
}
