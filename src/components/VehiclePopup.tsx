import { useState } from "react";
import { X, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vehicle, Communication } from "@/pages/VehicleTracker";

interface VehiclePopupProps {
  vehicle: Vehicle;
  communications: Communication[];
  onClose: () => void;
  position?: { x: number; y: number };
}

export function VehiclePopup({ vehicle, communications, onClose, position }: VehiclePopupProps) {
  const [showCommunications, setShowCommunications] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState<string[]>([]);

  const toggleNote = (commId: string) => {
    setExpandedNotes(prev => 
      prev.includes(commId) 
        ? prev.filter(id => id !== commId)
        : [...prev, commId]
    );
  };

  const statusColors = {
    active: "bg-status-active",
    busy: "bg-status-busy",
    standby: "bg-status-standby", 
    offline: "bg-status-offline",
    emergency: "bg-status-emergency"
  };

  const statusLabels = {
    active: "Activo",
    busy: "Ocupado",
    standby: "En Espera",
    offline: "Desconectado",
    emergency: "Emergencia"
  };

  const popupStyle = position 
    ? { 
        position: 'absolute' as const,
        left: `${position.x}px`, 
        top: `${Math.max(position.y - 200, 10)}px`,
        transform: 'translate(-50%, 0)',
        zIndex: 50 
      }
    : { 
        position: 'fixed' as const,
        top: '20%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        zIndex: 50 
      };

  return (
    <Card className="w-80 max-h-[60vh] overflow-hidden shadow-xl border-2" style={popupStyle}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${statusColors[vehicle.status]}`} />
              {vehicle.unit}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Vehicle Info */}
          <div className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Vehículo:</span>
              <p className="font-medium">{vehicle.name}</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Tipo:</span>
              <p>{vehicle.type}</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Estado:</span>
              <span className={`
                inline-block ml-2 px-2 py-1 text-xs font-medium text-white rounded
                ${statusColors[vehicle.status]}
              `}>
                {statusLabels[vehicle.status]}
              </span>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Última comunicación:</span>
              <p>{vehicle.lastUpdate}</p>
            </div>
          </div>

          {/* Communications Toggle */}
          <div className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setShowCommunications(!showCommunications)}
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Registro de Comunicaciones ({communications.length})
              </span>
              {showCommunications ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Communications List */}
          {showCommunications && (
            <div className="max-h-60 overflow-y-auto space-y-2 border rounded p-2">
              {communications.length > 0 ? (
                communications.map((comm) => (
                  <div key={comm.id} className="border-b border-border pb-2 last:border-b-0">
                    <div className="flex justify-between items-start text-sm">
                      <div className="flex-1">
                        <div className="text-muted-foreground text-xs">{comm.timestamp}</div>
                        <div className="font-medium">{comm.code}</div>
                      </div>
                      {comm.note && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleNote(comm.id)}
                          className="h-6 px-2 text-xs ml-2"
                        >
                          {expandedNotes.includes(comm.id) ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                    {comm.note && expandedNotes.includes(comm.id) && (
                      <div className="mt-1 p-2 bg-muted/50 rounded text-xs">
                        {comm.note}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay comunicaciones registradas
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
  );
}