import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import equipmentApi, { EquipmentData, MaintenanceRecordData, EquipmentResponse, MaintenanceRecordResponse } from '@/lib/equipment';
import { useToast } from '@/hooks/use-toast';

// Query keys for equipment operations
export const EQUIPMENT_QUERY_KEY = ['equipment'];
export const MAINTENANCE_QUERY_KEY = ['maintenance'];

// Hook to fetch all equipment
export const useEquipment = () => {
  return useQuery({
    queryKey: EQUIPMENT_QUERY_KEY,
    queryFn: () => equipmentApi.getEquipment(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to fetch a single equipment by ID
export const useEquipmentById = (id: string | undefined) => {
  return useQuery({
    queryKey: [...EQUIPMENT_QUERY_KEY, id],
    queryFn: () => equipmentApi.getEquipmentById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook to create equipment
export const useCreateEquipment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (equipmentData: EquipmentData) => equipmentApi.createEquipment(equipmentData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: EQUIPMENT_QUERY_KEY });
      toast({
        title: "Success",
        description: "Equipment created successfully",
      });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Failed to create equipment";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

// Hook to update equipment
export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EquipmentData> }) => 
      equipmentApi.updateEquipment(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: EQUIPMENT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...EQUIPMENT_QUERY_KEY, variables.id] });
      toast({
        title: "Success",
        description: "Equipment updated successfully",
      });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Failed to update equipment";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

// Hook to delete equipment
export const useDeleteEquipment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => equipmentApi.deleteEquipment(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: EQUIPMENT_QUERY_KEY });
      toast({
        title: "Success",
        description: "Equipment deleted successfully",
      });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete equipment";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

// Hook to add maintenance record
export const useAddMaintenanceRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ equipmentId, data }: { equipmentId: string; data: MaintenanceRecordData }) => 
      equipmentApi.addMaintenanceRecord(equipmentId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: EQUIPMENT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...EQUIPMENT_QUERY_KEY, variables.equipmentId] });
      queryClient.invalidateQueries({ queryKey: [...MAINTENANCE_QUERY_KEY, variables.equipmentId] });
      toast({
        title: "Success",
        description: "Maintenance record added successfully",
      });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Failed to add maintenance record";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

// Hook to fetch maintenance records for equipment
export const useMaintenanceRecords = (equipmentId: string | undefined) => {
  return useQuery({
    queryKey: [...MAINTENANCE_QUERY_KEY, equipmentId],
    queryFn: () => equipmentApi.getMaintenanceRecords(equipmentId!),
    enabled: !!equipmentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};