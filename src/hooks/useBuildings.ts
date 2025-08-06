import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import buildingApi, { BuildingData, BuildingResponse, UnitData, UnitResponse } from '@/lib/building';
import { useToast } from '@/hooks/use-toast';

// Query key for buildings
export const BUILDINGS_QUERY_KEY = ['buildings'];

// Hook to fetch all buildings
export const useBuildings = () => {
  return useQuery({
    queryKey: BUILDINGS_QUERY_KEY,
    queryFn: () => buildingApi.getBuildings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to fetch a single building
export const useBuilding = (id: string | undefined) => {
  return useQuery({
    queryKey: [...BUILDINGS_QUERY_KEY, id],
    queryFn: () => buildingApi.getBuilding(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook to create a building
export const useCreateBuilding = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (buildingData: BuildingData) => buildingApi.createBuilding(buildingData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: BUILDINGS_QUERY_KEY });
      toast({
        title: "Success",
        description: "Building created successfully",
      });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Failed to create building";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

// Hook to update a building
export const useUpdateBuilding = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BuildingData> }) => 
      buildingApi.updateBuilding(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: BUILDINGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...BUILDINGS_QUERY_KEY, variables.id] });
      toast({
        title: "Success",
        description: "Building updated successfully",
      });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Failed to update building";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

// Hook to delete a building
export const useDeleteBuilding = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => buildingApi.deleteBuilding(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: BUILDINGS_QUERY_KEY });
      toast({
        title: "Success",
        description: "Building deleted successfully",
      });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete building";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

// Hook to create a unit
export const useCreateUnit = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ buildingId, unitData }: { buildingId: number; unitData: UnitData }) => 
      buildingApi.createUnit(buildingId, unitData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: BUILDINGS_QUERY_KEY });
      toast({
        title: "Success",
        description: "Unit created successfully",
      });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Failed to create unit";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};