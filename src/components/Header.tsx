import { Search, MapPin, Building, Shield, Fuel, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vehicle, Communication } from "@/pages/VehicleTracker";
import { useState } from "react";

function CommunicationRow({ comm, vehicle, formatDate }: { comm: Communication, vehicle?: Vehicle, formatDate: (date: string) => string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="py-1 border-b border-border/50">
      <div className="grid grid-cols-4 gap-2 text-xs">
        <span className="text-muted-foreground">
          {formatDate(comm.timestamp).split(' ')[0]}
        </span>
        <span>{vehicle?.unit || 'N/A'}</span>
        <span>{comm.code}</span>
        <div className="text-muted-foreground">
          {comm.note ? (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:text-primary/80 underline text-xs"
            >
              {isExpanded ? "Ocultar nota" : "Ver nota"}
            </button>
          ) : (
            "-"
          )}
        </div>
      </div>
      {isExpanded && comm.note && (
        <div className="mt-2 p-2 bg-muted/50 rounded text-xs border col-span-4">
          {comm.note}
        </div>
      )}
    </div>
  );
}
interface HeaderProps {
  vehicles: Vehicle[];
  communications: Communication[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
  onVehicleClick: (vehicle: Vehicle) => void;
}
const filters = [{
  id: "monuments",
  label: "Monumentos",
  icon: Building
}, {
  id: "hospitals",
  label: "Hospitales",
  icon: MapPin
}, {
  id: "police",
  label: "Carabineros",
  icon: Shield
}, {
  id: "gas",
  label: "Grifos",
  icon: Fuel
}];
const statusColors = {
  activo: "bg-status-active",
  en_ruta: "bg-status-busy",
  inactivo: "bg-status-offline",
  mantenimiento: "bg-status-standby",
  disponible: "bg-status-standby"
};
export function Header({
  vehicles,
  communications,
  searchQuery,
  onSearchChange,
  activeFilters,
  onFilterToggle,
  onVehicleClick
}: HeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeView, setActiveView] = useState<"vehicles" | "communications">("vehicles");
  const [sortBy, setSortBy] = useState<"recent" | "alphabetical" | "status">("recent");
  const getSortedVehicles = () => {
    const sorted = [...vehicles];
    switch (sortBy) {
      case "alphabetical":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "status":
        return sorted.sort((a, b) => a.status.localeCompare(b.status));
      case "recent":
      default:
        return sorted.sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());
    }
  };
  const getSortedCommunications = () => {
    const sorted = [...communications];
    switch (sortBy) {
      case "alphabetical":
        return sorted.sort((a, b) => {
          const vehicleA = vehicles.find(v => v.id === a.vehicleId)?.name || "";
          const vehicleB = vehicles.find(v => v.id === b.vehicleId)?.name || "";
          return vehicleA.localeCompare(vehicleB);
        });
      case "recent":
      default:
        return sorted.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  };
  const handleVehicleClick = (vehicle: Vehicle) => {
    onVehicleClick(vehicle);
    setIsExpanded(false);
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };
  return <div className="absolute top-4 left-4 right-4 z-40">
      <div className="flex justify-between items-start">
        {/* Left Side - Main Expandable Tab */}
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-sm overflow-hidden">
          <div className="p-3">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-lg font-bold">
                <span className="text-foreground">VIPER</span>
                <span className="text-primary">GO</span>
              </span>
              <Button variant="secondary" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="bg-transparent border-0 hover:bg-background/50">
                {isExpanded ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="text" placeholder="Buscar" value={searchQuery} onChange={e => onSearchChange(e.target.value)} className="pl-10 w-64" />
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && <div className="border-t">
              {/* Header with tabs */}
              <div className="flex border-b">
                <button onClick={() => setActiveView("vehicles")} className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeView === "vehicles" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                  🚗 Vehículos
                </button>
                <button onClick={() => setActiveView("communications")} className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeView === "communications" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                  📋 Registro de Comunicaciones
                </button>
              </div>

              {/* Sort dropdown */}
              <div className="p-3 border-b">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Ordenar por</span>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Reciente</SelectItem>
                      <SelectItem value="alphabetical">Alfabético</SelectItem>
                      {activeView === "vehicles" && <SelectItem value="status">Estado</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Content */}
              <div className="max-h-80 overflow-y-auto">
                {activeView === "vehicles" ? <div className="p-2">
                    <div className="grid grid-cols-4 gap-2">
                      {getSortedVehicles().map(vehicle => <button key={vehicle.id} onClick={() => handleVehicleClick(vehicle)} className="flex flex-col items-center p-2 hover:bg-muted/50 transition-colors rounded-full text-base border-2 border-muted">
                          <div className="flex items-center gap-1 mb-1">
                            <div className={`w-2 h-2 rounded-full ${statusColors[vehicle.status as keyof typeof statusColors] || 'bg-status-offline'}`} />
                            <span className="text-xs font-medium">{vehicle.unit}</span>
                          </div>
                        </button>)}
                    </div>
                  </div> : <div className="p-3">
                    <div className="space-y-2">
                      <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground border-b pb-2">
                        <span>Fecha</span>
                        <span>Vehículo</span>
                        <span>Clave</span>
                        <span>Nota</span>
                      </div>
                      {getSortedCommunications().map(comm => {
                  const vehicle = vehicles.find(v => v.id === comm.vehicleId);
                  return <CommunicationRow key={comm.id} comm={comm} vehicle={vehicle} formatDate={formatDate} />;
                })}
                    </div>
                  </div>}
              </div>
            </div>}
        </div>

        {/* Right Side - Filter Tabs */}
        <div className="flex items-center gap-2">
          {filters.map(filter => {
          const Icon = filter.icon;
          const isActive = activeFilters.includes(filter.id);
          return <div key={filter.id} className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-sm">
                <Button variant={isActive ? "default" : "outline"} size="sm" onClick={() => onFilterToggle(filter.id)} className={`gap-2 border-0 ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "bg-transparent hover:bg-primary/10 hover:text-primary"}`}>
                  <Icon className="h-4 w-4" />
                  {filter.label}
                </Button>
              </div>;
        })}
        </div>
      </div>
    </div>;
}