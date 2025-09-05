import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/pages/VehicleTracker";

interface VehicleDropdownProps {
  vehicles: Vehicle[];
  onVehicleClick: (vehicle: Vehicle) => void;
}

export function VehicleDropdown({ vehicles, onVehicleClick }: VehicleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleVehicleClick = (vehicle: Vehicle) => {
    onVehicleClick(vehicle);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-background/95 backdrop-blur-sm border shadow-sm hover:bg-background"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            <div className="text-sm font-medium text-muted-foreground mb-2 px-2">
              Vehículos
            </div>
            <div className="space-y-1">
              {vehicles.map((vehicle) => (
                <button
                  key={vehicle.id}
                  onClick={() => handleVehicleClick(vehicle)}
                  className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted/50 transition-colors"
                >
                  {vehicle.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}