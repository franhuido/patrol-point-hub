import { Vehicle } from "@/pages/VehicleTracker";

interface VehicleMarkerProps {
  vehicle: Vehicle;
  onClick: () => void;
}

const statusColors = {
  active: "bg-status-active border-status-active",
  busy: "bg-status-busy border-status-busy", 
  standby: "bg-status-standby border-status-standby",
  offline: "bg-status-offline border-status-offline",
  emergency: "bg-status-emergency border-status-emergency"
};

export function VehicleMarker({ vehicle, onClick }: VehicleMarkerProps) {
  // Convert lat/lng to screen position (simplified positioning for demo)
  const x = ((vehicle.position.lng + 70.7) * 800) % 100;
  const y = ((vehicle.position.lat + 33.5) * 600) % 100;
  
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
      style={{
        left: `${20 + (x * 0.6)}%`,
        top: `${20 + (y * 0.6)}%`
      }}
      onClick={onClick}
    >
      {/* Marker Pin */}
      <div className="relative">
        {/* Pin Shadow */}
        <div className="absolute top-1 left-1 w-8 h-8 bg-black/20 rounded-full blur-sm" />
        
        {/* Main Pin */}
        <div className={`
          w-8 h-8 rounded-full border-4 ${statusColors[vehicle.status]}
          shadow-lg transform transition-all duration-200
          group-hover:scale-110 group-hover:shadow-xl
          flex items-center justify-center
        `}>
          {/* Center Dot */}
          <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
        </div>
        
        {/* Pin Stem */}
        <div className={`
          absolute top-6 left-1/2 transform -translate-x-1/2
          w-1 h-3 ${statusColors[vehicle.status].replace('bg-', 'bg-')}
          clip-path-triangle
        `} style={{ 
          clipPath: 'polygon(0 0, 100% 0, 50% 100%)' 
        }} />
        
        {/* Vehicle Label */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className="bg-background/90 backdrop-blur-sm border border-border rounded px-2 py-1 shadow-md text-xs font-medium">
            {vehicle.unit}
          </div>
        </div>

        {/* Status Pulse Animation for Emergency */}
        {vehicle.status === 'emergency' && (
          <div className={`
            absolute inset-0 w-8 h-8 rounded-full border-4 border-status-emergency
            animate-ping opacity-75
          `} />
        )}
      </div>
    </div>
  );
}