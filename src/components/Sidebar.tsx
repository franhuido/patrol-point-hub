import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Vehicle, Communication } from "@/pages/VehicleTracker";

interface SidebarProps {
  isOpen: boolean;
  vehicles: Vehicle[];
  communications: Communication[];
  view: "vehicles" | "communications";
  onViewChange: (view: "vehicles" | "communications") => void;
  onVehicleClick: (vehicle: Vehicle) => void;
  onClose: () => void;
}

type SortOption = "alphabetical" | "recent" | "status";

const statusColors = {
  active: "border-status-active bg-status-active/10",
  busy: "border-status-busy bg-status-busy/10",
  standby: "border-status-standby bg-status-standby/10", 
  offline: "border-status-offline bg-status-offline/10",
  emergency: "border-status-emergency bg-status-emergency/10"
};

export function Sidebar({ 
  isOpen, 
  vehicles, 
  communications, 
  view, 
  onViewChange, 
  onVehicleClick,
  onClose 
}: SidebarProps) {
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [expandedNotes, setExpandedNotes] = useState<string[]>([]);

  const toggleNote = (commId: string) => {
    setExpandedNotes(prev => 
      prev.includes(commId) 
        ? prev.filter(id => id !== commId)
        : [...prev, commId]
    );
  };

  const sortedVehicles = [...vehicles].sort((a, b) => {
    switch (sortBy) {
      case "alphabetical":
        return a.name.localeCompare(b.name);
      case "status":
        return a.status.localeCompare(b.status);
      case "recent":
      default:
        return b.lastUpdate.localeCompare(a.lastUpdate);
    }
  });

  const sortedCommunications = [...communications].sort((a, b) => {
    switch (sortBy) {
      case "alphabetical":
        return a.vehicleName.localeCompare(b.vehicleName);
      case "recent":
      default:
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-80 bg-background border-r border-border shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">VIPER GO</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* View Tabs */}
      <div className="flex border-b border-border">
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            view === "vehicles"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => onViewChange("vehicles")}
        >
          Vehículos
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            view === "communications"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => onViewChange("communications")}
        >
          Registro de Comunicaciones
        </button>
      </div>

      {/* Sort Options */}
      <div className="p-4 border-b border-border">
        <label className="text-sm text-muted-foreground mb-2 block">
          Ordenar por
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="w-full p-2 border border-border rounded bg-background text-foreground"
        >
          <option value="recent">Reciente</option>
          <option value="alphabetical">Alfabético</option>
          {view === "vehicles" && <option value="status">Estado</option>}
        </select>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {view === "vehicles" ? (
          <div className="p-4 space-y-2">
            {sortedVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className={`
                  p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${statusColors[vehicle.status]}
                  hover:shadow-md hover:scale-[1.02]
                `}
                onClick={() => onVehicleClick(vehicle)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{vehicle.name}</div>
                    <div className="text-sm text-muted-foreground">{vehicle.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{vehicle.unit}</div>
                    <div className="text-xs text-muted-foreground">{vehicle.lastUpdate}</div>
                  </div>
                </div>
                <div className="mt-2">
                  <span className={`
                    inline-block px-2 py-1 text-xs font-medium rounded
                    ${vehicle.status === 'active' ? 'bg-status-active text-white' :
                      vehicle.status === 'busy' ? 'bg-status-busy text-white' :
                      vehicle.status === 'standby' ? 'bg-status-standby text-white' :
                      vehicle.status === 'offline' ? 'bg-status-offline text-white' :
                      'bg-status-emergency text-white'}
                  `}>
                    {vehicle.status === 'active' ? 'Activo' :
                     vehicle.status === 'busy' ? 'Ocupado' :
                     vehicle.status === 'standby' ? 'En Espera' :
                     vehicle.status === 'offline' ? 'Desconectado' :
                     'Emergencia'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4">
            {sortedCommunications.map((comm) => (
              <div key={comm.id} className="border-b border-border py-3 last:border-b-0">
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="text-muted-foreground">{comm.timestamp}</div>
                  <div className="font-medium">{comm.vehicleName}</div>
                  <div>{comm.code}</div>
                  <div>
                    {comm.note ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleNote(comm.id)}
                        className="h-6 px-2 text-xs"
                      >
                        {expandedNotes.includes(comm.id) ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </div>
                </div>
                {comm.note && expandedNotes.includes(comm.id) && (
                  <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                    {comm.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}