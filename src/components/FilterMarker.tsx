import { MapPin, Building, Shield, Fuel } from "lucide-react";

interface FilterMarkerProps {
  poi: {
    id: string;
    name: string;
    position: { lat: number; lng: number };
  };
  type: string;
}

const markerIcons = {
  monuments: Building,
  hospitals: MapPin,
  police: Shield,
  gas: Fuel
};

const markerColors = {
  monuments: "bg-blue-500 text-white",
  hospitals: "bg-green-500 text-white", 
  police: "bg-red-600 text-white",
  gas: "bg-yellow-500 text-white"
};

export function FilterMarker({ poi, type }: FilterMarkerProps) {
  const Icon = markerIcons[type as keyof typeof markerIcons] || MapPin;
  const colorClass = markerColors[type as keyof typeof markerColors] || "bg-gray-500 text-white";
  
  // Convert lat/lng to screen position (simplified positioning for demo)
  const x = ((poi.position.lng + 70.7) * 800) % 100;
  const y = ((poi.position.lat + 33.5) * 600) % 100;
  
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
      style={{
        left: `${25 + (x * 0.5)}%`,
        top: `${25 + (y * 0.5)}%`
      }}
    >
      <div className="group cursor-pointer">
        {/* Marker Icon */}
        <div className={`
          w-6 h-6 rounded-full ${colorClass} 
          flex items-center justify-center shadow-md
          group-hover:scale-110 transition-transform duration-200
        `}>
          <Icon className="h-3 w-3" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-background border border-border rounded px-2 py-1 shadow-lg text-xs font-medium whitespace-nowrap">
            {poi.name}
          </div>
        </div>
      </div>
    </div>
  );
}