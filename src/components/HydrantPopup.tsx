import { useState } from "react";
import { X, ChevronDown, ChevronUp, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HydrantData {
  id: string;
  name: string;
  position: { lat: number; lng: number };
  modelo: string;
  diametroGrifo: string;
  diametroCañeria: string;
  empresa: string;
  direccion: string;
  comuna: string;
  region: string;
  año: string;
}

interface HydrantPopupProps {
  hydrant: {
    id: string;
    name: string;
    position: { lat: number; lng: number };
    type: string;
  };
  onClose: () => void;
  position?: { x: number; y: number };
}

// Mock hydrant data
const getHydrantData = (id: string, name: string): HydrantData => ({
  id,
  name,
  position: { lat: 0, lng: 0 }, // Will be overridden
  modelo: "Modelo GF-150",
  diametroGrifo: "150mm",
  diametroCañeria: "200mm", 
  empresa: "Aguas Metropolitanas S.A.",
  direccion: "Av. Las Condes 1234",
  comuna: "Las Condes",
  region: "Región Metropolitana",
  año: "2019"
});

export function HydrantPopup({ hydrant, onClose, position }: HydrantPopupProps) {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  
  const hydrantData = getHydrantData(hydrant.id, hydrant.name);

  const popupStyle = position 
    ? { 
        position: 'absolute' as const,
        left: `${position.x}%`, 
        top: `${Math.max(position.y - 30, 5)}%`,
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
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <Droplet className="h-4 w-4 text-blue-500" />
            Grifo Contra Incendio
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div className="space-y-2">
          <div>
            <span className="text-sm text-muted-foreground">Ubicación:</span>
            <p className="font-medium">{hydrant.name}</p>
          </div>
          
          <div>
            <span className="text-sm text-muted-foreground">Modelo de grifo:</span>
            <p>{hydrantData.modelo}</p>
          </div>
          
          <div>
            <span className="text-sm text-muted-foreground">Diámetro de grifo:</span>
            <p>{hydrantData.diametroGrifo}</p>
          </div>
          
          <div>
            <span className="text-sm text-muted-foreground">Diámetro de cañería:</span>
            <p>{hydrantData.diametroCañeria}</p>
          </div>
        </div>

        {/* More Information Toggle */}
        <div className="border-t pt-4">
          <Button
            variant="outline"
            onClick={() => setShowMoreInfo(!showMoreInfo)}
            className="w-full justify-between"
          >
            <span>Más información</span>
            {showMoreInfo ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Additional Information */}
        {showMoreInfo && (
          <div className="space-y-2 border rounded p-3 bg-muted/20">
            <div>
              <span className="text-sm text-muted-foreground">Empresa:</span>
              <p className="font-medium">{hydrantData.empresa}</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Dirección:</span>
              <p>{hydrantData.direccion}</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Comuna:</span>
              <p>{hydrantData.comuna}</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Región:</span>
              <p>{hydrantData.region}</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Año de instalación:</span>
              <p>{hydrantData.año}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}