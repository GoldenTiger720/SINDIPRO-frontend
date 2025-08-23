import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredUser } from '@/lib/auth';

export interface Building {
  id: number;
  building_name: string;
}

interface BuildingContextType {
  selectedBuilding: Building | null;
  setSelectedBuilding: (building: Building | null) => void;
  buildingId: number | null;
  refreshBuildingData: () => void;
}

const BuildingContext = createContext<BuildingContextType | undefined>(undefined);

export const useBuildingContext = () => {
  const context = useContext(BuildingContext);
  if (!context) {
    throw new Error('useBuildingContext must be used within a BuildingProvider');
  }
  return context;
};

interface BuildingProviderProps {
  children: React.ReactNode;
}

export const BuildingProvider: React.FC<BuildingProviderProps> = ({ children }) => {
  const [selectedBuilding, setSelectedBuildingState] = useState<Building | null>(null);

  // Function to load building data from localStorage
  const refreshBuildingData = () => {
    const user = getStoredUser();
    if (user?.building_id && user?.building_name) {
      setSelectedBuildingState({
        id: user.building_id,
        building_name: user.building_name
      });
    } else {
      setSelectedBuildingState(null);
    }
  };

  // Load building data from localStorage on component mount
  useEffect(() => {
    refreshBuildingData();
  }, []);

  const setSelectedBuilding = (building: Building | null) => {
    setSelectedBuildingState(building);
    
    // Update user data in localStorage to include building info
    const user = getStoredUser();
    if (user && building) {
      const updatedUser = {
        ...user,
        building_id: building.id,
        building_name: building.building_name
      };
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  };

  const buildingId = selectedBuilding?.id || null;

  const value = {
    selectedBuilding,
    setSelectedBuilding,
    buildingId,
    refreshBuildingData
  };

  return (
    <BuildingContext.Provider value={value}>
      {children}
    </BuildingContext.Provider>
  );
};