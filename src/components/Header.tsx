import { Search, MapPin, Building, Shield, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EnhancedVehicleDropdown } from "./EnhancedVehicleDropdown";
import { Vehicle, Communication } from "@/pages/VehicleTracker";

interface HeaderProps {
  vehicles: Vehicle[];
  communications: Communication[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
  onVehicleClick: (vehicle: Vehicle) => void;
}

const filters = [
  { id: "monuments", label: "Monumentos", icon: Building },
  { id: "hospitals", label: "Hospitales", icon: MapPin },
  { id: "police", label: "Carabineros", icon: Shield },
  { id: "gas", label: "Grifos", icon: Fuel },
];

export function Header({ 
  vehicles,
  communications,
  searchQuery, 
  onSearchChange, 
  activeFilters, 
  onFilterToggle,
  onVehicleClick
}: HeaderProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-40">
      {/* Left Side - Main Tab with Logo, Menu and Search */}
      <div className="flex justify-between items-start">
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-sm p-3 w-fit">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-lg font-bold">
              <span className="text-foreground">VIPER</span>
              <span className="text-primary">GO</span>
            </span>
            <EnhancedVehicleDropdown 
              vehicles={vehicles} 
              communications={communications}
              onVehicleClick={onVehicleClick} 
            />
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        {/* Right Side - Filter Tabs */}
        <div className="flex items-center gap-2">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilters.includes(filter.id);
            
            return (
              <div key={filter.id} className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-sm">
                <Button
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFilterToggle(filter.id)}
                  className={`gap-2 border-0 ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "bg-transparent hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {filter.label}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}