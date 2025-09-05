import { Search, Menu, MapPin, Building, Shield, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onMenuClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
}

const filters = [
  { id: "monuments", label: "Monumentos", icon: Building },
  { id: "hospitals", label: "Hospitales", icon: MapPin },
  { id: "police", label: "Carabineros", icon: Shield },
  { id: "gas", label: "Grifos", icon: Fuel },
];

export function Header({ 
  onMenuClick, 
  searchQuery, 
  onSearchChange, 
  activeFilters, 
  onFilterToggle 
}: HeaderProps) {
  return (
    <header className="bg-background border-b border-border p-4 z-10">
      <div className="flex items-center justify-between">
        {/* Left Side - Logo and Search */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="hover:bg-primary/10"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">
              <span className="text-foreground">VIPER</span>
              <span className="text-primary">GO</span>
            </span>
          </div>
          
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar vehículo..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-muted/50 border-border focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Right Side - Filters */}
        <div className="flex items-center gap-2">
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
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-primary/10 hover:border-primary hover:text-primary"
                }`}
              >
                <Icon className="h-4 w-4" />
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>
    </header>
  );
}