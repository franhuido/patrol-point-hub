import { Vehicle } from "@/pages/VehicleTracker";
import { VehicleMarker } from "./VehicleMarker";
import { FilterMarker } from "./FilterMarker";

interface MapViewProps {
  vehicles: Vehicle[];
  onVehicleClick: (vehicle: Vehicle) => void;
  activeFilters: string[];
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

export function MapView({ vehicles, onVehicleClick, activeFilters }: MapViewProps) {
  const allPois = activeFilters.flatMap(filter => {
    const pois = poisData[filter as keyof typeof poisData] || [];
    return pois.map(poi => ({ ...poi, type: filter }));
  });

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Map Background - Styled to look like a real map */}
      <div 
        className="w-full h-full bg-map-background relative"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '50px 50px'
        }}
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
        {vehicles.map((vehicle) => (
          <VehicleMarker
            key={vehicle.id}
            vehicle={vehicle}
            onClick={() => onVehicleClick(vehicle)}
          />
        ))}

        {/* Points of Interest */}
        {allPois.map((poi) => (
          <FilterMarker
            key={poi.id}
            poi={poi}
            type={poi.type}
          />
        ))}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="bg-background border border-border rounded p-2 shadow-md hover:bg-muted transition-colors">
          <span className="text-lg font-bold">+</span>
        </button>
        <button className="bg-background border border-border rounded p-2 shadow-md hover:bg-muted transition-colors">
          <span className="text-lg font-bold">-</span>
        </button>
      </div>
    </div>
  );
}