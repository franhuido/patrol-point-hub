import { Vehicle, Communication } from "@/pages/VehicleTracker";
import { VehicleMarker } from "./VehicleMarker";
import { FilterMarker } from "./FilterMarker";
import { VehiclePopup } from "./VehiclePopup";
import { HydrantPopup } from "./HydrantPopup";
import { useState, useRef } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapViewProps {
  vehicles: Vehicle[];
  onVehicleClick: (vehicle: Vehicle) => void;
  activeFilters: string[];
  selectedVehicles: Vehicle[];
  onClosePopup: (index: number) => void;
  communications: Communication[];
}

interface SelectedPoi {
  id: string;
  name: string;
  position: { lat: number; lng: number };
  type: string;
}

// Mock points of interest data
const poisData = {
  monuments: [
    { id: "m1", name: "Plaza de Armas", position: { lat: -33.4378, lng: -70.6504 } },
    { id: "m2", name: "Cerro San Cristóbal", position: { lat: -33.4233, lng: -70.6344 } }
  ],
  hospitals: [
    { id: "h1", name: "Hospital Salvador", position: { lat: -33.4441, lng: -70.6344 } },
    { id: "h2", name: "Clínica Las Condes", position: { lat: -33.4059, lng: -70.5689 } }
  ],
  police: [
    { id: "p1", name: "1ª Comisaría", position: { lat: -33.4392, lng: -70.6494 } },
    { id: "p2", name: "Prefectura Central", position: { lat: -33.4489, lng: -70.6589 } }
  ],
  gas: [
    { id: "g1", name: "Copec Plaza Baquedano", position: { lat: -33.4372, lng: -70.6344 } },
    { id: "g2", name: "Shell Las Condes", position: { lat: -33.4159, lng: -70.5889 } }
  ]
};

export function MapView({ vehicles, onVehicleClick, activeFilters, selectedVehicles, onClosePopup, communications }: MapViewProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [selectedPois, setSelectedPois] = useState<SelectedPoi[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);

  const allPois = activeFilters.flatMap(filter => {
    const pois = poisData[filter as keyof typeof poisData] || [];
    return pois.map(poi => ({ ...poi, type: filter }));
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapPosition.x, y: e.clientY - mapPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setMapPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handlePoiClick = (poi: any) => {
    if (poi.type === 'gas') {
      // Check if hydrant is already selected
      const existingIndex = selectedPois.findIndex(sp => sp.id === poi.id);
      if (existingIndex >= 0) {
        // Remove if already selected
        setSelectedPois(prev => prev.filter((_, index) => index !== existingIndex));
      } else {
        // Add new hydrant popup
        setSelectedPois(prev => [...prev, poi]);
      }
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Map Background - Styled to look like a real map */}
      <div 
        ref={mapRef}
        className="w-full h-full bg-map-background relative cursor-grab active:cursor-grabbing"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent)
          `,
          backgroundSize: `${50 * zoom}px ${50 * zoom}px`,
          transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${zoom})`,
          transformOrigin: 'center'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Street Pattern Overlay */}
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-10" viewBox="0 0 1000 800">
            <defs>
              <pattern id="streets" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="none" />
                <path d="M0,50 L100,50" stroke="#666" strokeWidth="1" />
                <path d="M50,0 L50,100" stroke="#666" strokeWidth="1" />
                <path d="M0,25 L100,25" stroke="#999" strokeWidth="0.5" />
                <path d="M25,0 L25,100" stroke="#999" strokeWidth="0.5" />
                <path d="M0,75 L100,75" stroke="#999" strokeWidth="0.5" />
                <path d="M75,0 L75,100" stroke="#999" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#streets)" />
          </svg>
        </div>

        {/* Area Names */}
        <div className="absolute top-20 left-20 text-xs text-muted-foreground font-semibold">
          Las Condes
        </div>
        <div className="absolute top-40 left-1/3 text-xs text-muted-foreground font-semibold">
          Providencia  
        </div>
        <div className="absolute bottom-1/3 left-1/4 text-xs text-muted-foreground font-semibold">
          Santiago Centro
        </div>
        <div className="absolute bottom-20 right-1/3 text-xs text-muted-foreground font-semibold">
          San Miguel
        </div>

        {/* Vehicle Markers */}
        {vehicles.map((vehicle) => {
          return (
            <VehicleMarker
              key={vehicle.id}
              vehicle={vehicle}
              onClick={() => onVehicleClick(vehicle)}
            />
          );
        })}

        {/* Points of Interest */}
        {allPois.map((poi) => (
          <div key={poi.id} onClick={() => handlePoiClick(poi)}>
            <FilterMarker
              poi={poi}
              type={poi.type}
            />
          </div>
        ))}

        {/* Vehicle Popups */}
        {selectedVehicles.map((selectedVehicle, index) => {
          // Calculate popup position based on marker position
          const x = ((selectedVehicle.position.lng + 70.7) * 800) % 100;
          const y = ((selectedVehicle.position.lat + 33.5) * 600) % 100;
          const screenX = 20 + (x * 0.6);
          const screenY = 20 + (y * 0.6);
          
          return (
            <VehiclePopup
              key={`${selectedVehicle.id}-${index}`}
              vehicle={selectedVehicle}
              communications={communications.filter(c => c.vehicleId === selectedVehicle.id)}
              position={{ x: screenX, y: screenY }}
              onClose={() => onClosePopup(index)}
            />
          );
        })}

        {/* Hydrant Popups */}
        {selectedPois.map((selectedPoi, index) => {
          if (selectedPoi.type !== 'gas') return null;
          
          // Calculate popup position based on marker position
          const x = ((selectedPoi.position.lng + 70.7) * 800) % 100;
          const y = ((selectedPoi.position.lat + 33.5) * 600) % 100; 
          const screenX = 20 + (x * 0.6);
          const screenY = 20 + (y * 0.6);
          
          return (
            <HydrantPopup
              key={`${selectedPoi.id}-${index}`}
              hydrant={selectedPoi}
              position={{ x: screenX, y: screenY }}
              onClose={() => setSelectedPois(prev => prev.filter((_, i) => i !== index))}
            />
          );
        })}
      </div>

      {/* Map Controls - Bottom Right */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button
          size="sm"
          onClick={handleZoomIn}
          className="bg-background border border-border rounded p-2 shadow-md hover:bg-muted transition-colors text-foreground"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          onClick={handleZoomOut}
          className="bg-background border border-border rounded p-2 shadow-md hover:bg-muted transition-colors text-foreground"
          variant="outline"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}