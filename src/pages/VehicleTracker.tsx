import { useState } from "react";
import { MapView } from "@/components/MapView";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { VehiclePopup } from "@/components/VehiclePopup";

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  status: "active" | "busy" | "standby" | "offline" | "emergency";
  position: { lat: number; lng: number };
  lastUpdate: string;
  unit: string;
}

export interface Communication {
  id: string;
  vehicleId: string;
  vehicleName: string;
  timestamp: string;
  code: string;
  note?: string;
}

// Mock data for demonstration
const mockVehicles: Vehicle[] = [
  {
    id: "1",
    name: "Super Tango 2",
    type: "Ambulancia",
    status: "active",
    position: { lat: -33.4489, lng: -70.6693 },
    lastUpdate: "16:47:22",
    unit: "B16"
  },
  {
    id: "2", 
    name: "Rescue Unit 1",
    type: "Bomberos",
    status: "busy",
    position: { lat: -33.4372, lng: -70.6506 },
    lastUpdate: "16:45:10",
    unit: "H17"
  },
  {
    id: "3",
    name: "Patrol Alpha",
    type: "Carabineros", 
    status: "standby",
    position: { lat: -33.4569, lng: -70.6483 },
    lastUpdate: "16:50:15",
    unit: "BX19"
  },
  {
    id: "4",
    name: "Emergency Response 3",
    type: "Ambulancia",
    status: "emergency",
    position: { lat: -33.4424, lng: -70.6394 },
    lastUpdate: "16:52:30",
    unit: "B21"
  }
];

const mockCommunications: Communication[] = [
  {
    id: "1",
    vehicleId: "1",
    vehicleName: "Super Tango 2", 
    timestamp: "01-31-2025 16:47:22",
    code: "En el Lugar",
    note: "Paciente estabilizado, trasladando a hospital más cercano"
  },
  {
    id: "2",
    vehicleId: "2",
    vehicleName: "Rescue Unit 1",
    timestamp: "01-31-2025 16:45:10", 
    code: "En Ruta",
  },
  {
    id: "3",
    vehicleId: "1",
    vehicleName: "Super Tango 2",
    timestamp: "01-31-2025 16:44:33",
    code: "Recibido"
  },
  {
    id: "4",
    vehicleId: "3", 
    vehicleName: "Patrol Alpha",
    timestamp: "01-31-2025 16:42:18",
    code: "Disponible",
    note: "Esperando órdenes en el cuartel"
  }
];

const VehicleTracker = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarView, setSidebarView] = useState<"vehicles" | "communications">("vehicles");
  
  const filteredVehicles = mockVehicles.filter(vehicle => 
    vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.unit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleFilterToggle = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilters={activeFilters}
        onFilterToggle={handleFilterToggle}
      />
      
      <div className="flex-1 relative">
        <MapView 
          vehicles={filteredVehicles}
          onVehicleClick={handleVehicleClick}
          activeFilters={activeFilters}
        />
        
        <Sidebar
          isOpen={isSidebarOpen}
          vehicles={mockVehicles}
          communications={mockCommunications}
          view={sidebarView}
          onViewChange={setSidebarView}
          onVehicleClick={handleVehicleClick}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        {selectedVehicle && (
          <VehiclePopup
            vehicle={selectedVehicle}
            communications={mockCommunications.filter(c => c.vehicleId === selectedVehicle.id)}
            onClose={() => setSelectedVehicle(null)}
          />
        )}
      </div>
    </div>
  );
};

export default VehicleTracker;