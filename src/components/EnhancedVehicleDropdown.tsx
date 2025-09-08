import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vehicle, Communication } from "@/pages/VehicleTracker";

interface EnhancedVehicleDropdownProps {
  vehicles: Vehicle[];
  communications: Communication[];
  onVehicleClick: (vehicle: Vehicle) => void;
}

const statusColors = {
  activo: "bg-green-500",
  en_ruta: "bg-orange-500", 
  inactivo: "bg-red-500",
  mantenimiento: "bg-blue-500",
  disponible: "bg-yellow-500"
};

export function EnhancedVehicleDropdown({ vehicles, communications, onVehicleClick }: EnhancedVehicleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-transparent border-0 hover:bg-background/50"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg z-50">
          {/* Header with tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveView("vehicles")}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeView === "vehicles"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              🚗 Vehículos
            </button>
            <button
              onClick={() => setActiveView("communications")}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeView === "communications"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
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
            {activeView === "vehicles" ? (
              <div className="p-2">
                <div className="grid grid-cols-4 gap-2">
                  {getSortedVehicles().map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => handleVehicleClick(vehicle)}
                      className="flex flex-col items-center p-2 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <div className={`w-2 h-2 rounded-full ${statusColors[vehicle.status as keyof typeof statusColors] || 'bg-gray-500'}`} />
                        <span className="text-xs font-medium">{vehicle.unit}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3">
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground border-b pb-2">
                    <span>Fecha</span>
                    <span>Vehículo</span>
                    <span>Clave</span>
                    <span>Nota</span>
                  </div>
                  {getSortedCommunications().map((comm) => {
                    const vehicle = vehicles.find(v => v.id === comm.vehicleId);
                    return (
                      <div key={comm.id} className="grid grid-cols-4 gap-2 text-xs py-1 border-b border-border/50">
                        <span className="text-muted-foreground">
                          {formatDate(comm.timestamp).split(' ')[0]}
                        </span>
                        <span>{vehicle?.unit || 'N/A'}</span>
                        <span>{comm.code}</span>
                        <span className="text-muted-foreground truncate">
                          {comm.note ? "Sample text" : "-"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}