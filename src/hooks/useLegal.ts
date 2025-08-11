import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import legalApi, { TemplateData, TemplateResponse } from '@/lib/legal';
import { useToast } from '@/hooks/use-toast';

// Query key for legal templates
export const LEGAL_TEMPLATES_QUERY_KEY = ['legal', 'templates'];

// Hook to fetch all legal templates
export const useLegalTemplates = () => {
  return useQuery({
    queryKey: LEGAL_TEMPLATES_QUERY_KEY,
    queryFn: () => legalApi.getTemplates(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to fetch a single legal template
export const useLegalTemplate = (id: string | undefined) => {
  return useQuery({
    queryKey: [...LEGAL_TEMPLATES_QUERY_KEY, id],
    queryFn: () => legalApi.getTemplate(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook to create a legal template
export const useCreateLegalTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (templateData: TemplateData) => legalApi.createTemplate(templateData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: LEGAL_TEMPLATES_QUERY_KEY });
      toast({
        title: "Success",
        description: "Legal obligation template created successfully",
      });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Failed to create legal template";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

// Hook to update a legal template
export const useUpdateLegalTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TemplateData> }) => 
      legalApi.updateTemplate(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: LEGAL_TEMPLATES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...LEGAL_TEMPLATES_QUERY_KEY, variables.id] });
      toast({
        title: "Success",
        description: "Legal obligation template updated successfully",
      });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Failed to update legal template";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

// Hook to delete a legal template
export const useDeleteLegalTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => legalApi.deleteTemplate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: LEGAL_TEMPLATES_QUERY_KEY });
      toast({
        title: "Success",
        description: "Legal obligation template deleted successfully",
      });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete legal template";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};