import { Search, MapPin, Building, Shield, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VehicleDropdown } from "./VehicleDropdown";
import { Vehicle } from "@/pages/VehicleTracker";

interface HeaderProps {
  vehicles: Vehicle[];
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
  searchQuery, 
  onSearchChange, 
  activeFilters, 
  onFilterToggle,
  onVehicleClick
}: HeaderProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between">
      {/* Left Side - Logo, Menu and Search */}
      <div className="flex items-center gap-3">
        <VehicleDropdown vehicles={vehicles} onVehicleClick={onVehicleClick} />
        
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-sm px-3 py-2">
          <span className="text-lg font-bold">
            <span className="text-foreground">VIPER</span>
            <span className="text-primary">GO</span>
          </span>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-64 bg-background/95 backdrop-blur-sm border shadow-sm"
          />
        </div>
      </div>

      {/* Right Side - Filters */}
      <div className="flex items-center gap-2 bg-background/95 backdrop-blur-sm border rounded-lg shadow-sm p-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilters.includes(filter.id);
          
          return (
            <Button
              key={filter.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterToggle(filter.id)}
              className={`gap-2 ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "bg-background/50 hover:bg-primary/10 hover:border-primary hover:text-primary"
              }`}
            >
              <Icon className="h-4 w-4" />
              {filter.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}