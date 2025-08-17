import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useBuildings } from "@/hooks/useBuildings";
import { useToast } from "@/hooks/use-toast";
import { useSaveMaterialRequest, useMaterialRequests, MaterialRequestResponse, useSaveTechnicalCall, useTechnicalCalls } from "@/hooks/useFieldManagement";
import { 
  MessageSquare, 
  Camera, 
  MapPin, 
  Clock, 
  Mail, 
  Plus, 
  Package, 
  Wrench, 
  FileDown, 
  FileUp,
  Send,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Download,
  History,
  X
} from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTranslation } from "react-i18next";
import { exportMaterialRequestsToExcel } from "@/utils/excelExport";

interface MaterialRequest {
  id: string | number;
  title: string;
  building?: string;
  building_id?: number;
  building_name?: string;
  caretaker: string;
  items: MaterialItem[];
  status: 'draft' | 'sent' | 'quoted' | 'approved';
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  quotes?: Quote[];
}

interface MaterialItem {
  id: string;
  productType: string;
  quantity: number;
  observations: string;
}

interface Quote {
  id: string;
  company: string;
  phone: string;
  totalValue: number;
  notes: string;
  submittedAt: string;
}

interface TechnicalCall {
  id: string;
  title: string;
  description: string;
  photos: string[];
  location: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  createdBy: string;
  assignedTo?: string;
  resolvedAt?: string;
  companyEmail?: string;
}

export default function FieldManagement() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('materials');
  const [selectedRequest, setSelectedRequest] = useState<MaterialRequestResponse | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Fetch buildings data for the building selector
  const { data: buildings = [], isLoading: isLoadingBuildings } = useBuildings();
  
  // Material request mutation
  const saveMaterialRequestMutation = useSaveMaterialRequest();
  
  // Technical call mutation
  const saveTechnicalCallMutation = useSaveTechnicalCall();
  
  // Fetch material requests when Materials & Services tab is active
  const { data: materialRequests = [], isLoading: isLoadingRequests } = useMaterialRequests();
  
  // Fetch technical calls when Technical tab is active
  const { data: technicalCallsData = [], isLoading: isLoadingTechnicalCalls } = useTechnicalCalls();
  const [localTechnicalCalls, setLocalTechnicalCalls] = useState<TechnicalCall[]>([]);
  const [currentMaterialRequest, setCurrentMaterialRequest] = useState<MaterialRequest>({
    id: '',
    title: '',
    building: '',
    caretaker: '',
    items: [],
    status: 'draft',
    createdAt: new Date().toISOString(),
  });

  const [currentTechnicalCall, setCurrentTechnicalCall] = useState<TechnicalCall>({
    id: '',
    title: '',
    description: '',
    photos: [],
    location: '',
    priority: 'medium',
    status: 'open',
    createdAt: new Date().toISOString(),
    createdBy: 'Current User',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addMaterialItem = () => {
    const newItem: MaterialItem = {
      id: Date.now().toString(),
      productType: '',
      quantity: 1,
      observations: ''
    };
    setCurrentMaterialRequest(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeMaterialItem = (itemId: string) => {
    setCurrentMaterialRequest(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const updateMaterialItem = (itemId: string, field: keyof MaterialItem, value: string | number) => {
    setCurrentMaterialRequest(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  const saveMaterialRequest = async () => {
    // Validate required fields
    if (!currentMaterialRequest.title) {
      toast({
        title: "Error",
        description: "Material Request Title is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!currentMaterialRequest.building) {
      toast({
        title: "Error", 
        description: "Building Name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!currentMaterialRequest.caretaker) {
      toast({
        title: "Error",
        description: "Caretaker/Responsible Name is required", 
        variant: "destructive",
      });
      return;
    }
    
    if (currentMaterialRequest.items.length === 0) {
      toast({
        title: "Error",
        description: "At least one item must be added to the materials list",
        variant: "destructive",
      });
      return;
    }
    
    // Validate that all items have required fields
    const incompleteItems = currentMaterialRequest.items.filter(item => 
      !item.productType || !item.quantity || !item.observations
    );
    
    if (incompleteItems.length > 0) {
      toast({
        title: "Error",
        description: "All items must have Product Type, Quantity, and Observations filled",
        variant: "destructive",
      });
      return;
    }

    try {
      // Prepare data for API
      const requestData = {
        title: currentMaterialRequest.title,
        building_id: parseInt(currentMaterialRequest.building), // Convert string ID to number
        caretaker: currentMaterialRequest.caretaker,
        items: currentMaterialRequest.items.map(item => ({
          productType: item.productType,
          quantity: item.quantity,
          observations: item.observations
        }))
      };

      // Send to backend
      await saveMaterialRequestMutation.mutateAsync(requestData);

      // Reset form on success
      setCurrentMaterialRequest({
        id: '',
        title: '',
        building: '',
        caretaker: '',
        items: [],
        status: 'draft',
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      // Error is already handled by the mutation hook
      console.error('Failed to save material request:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setCurrentTechnicalCall(prev => ({
            ...prev,
            photos: [...prev.photos, imageUrl]
          }));
        };
        reader.readAsDataURL(file);
      }
    }
    // Reset the input value to allow uploading the same file again
    if (event.target) {
      event.target.value = '';
    }
  };

  const removePhoto = (index: number) => {
    setCurrentTechnicalCall(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const takePhoto = async () => {
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      // Create video element to capture frame
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });
      
      // Create canvas to capture frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw current frame to canvas
        ctx.drawImage(video, 0, 0);
        
        // Convert to base64 image
        const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // Add to photos
        setCurrentTechnicalCall(prev => ({
          ...prev,
          photos: [...prev.photos, imageUrl]
        }));
      }
      
      // Stop camera stream
      stream.getTracks().forEach(track => track.stop());
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Fallback to file upload if camera access fails
      alert('Camera access denied or unavailable. Please use the Upload button instead.');
    }
  };

  const saveTechnicalCall = async () => {
    // Validate required fields
    if (!currentTechnicalCall.title) {
      toast({
        title: "Error",
        description: "Call title is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!currentTechnicalCall.description) {
      toast({
        title: "Error",
        description: "Problem description is required",
        variant: "destructive",
      });
      return;
    }

    // Create a new technical call object with current timestamp
    const newCall: TechnicalCall = {
      ...currentTechnicalCall,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
    };

    // Immediately add to local state (optimistic update)
    setLocalTechnicalCalls(prev => [newCall, ...prev]);

    // Reset form immediately
    setCurrentTechnicalCall({
      id: '',
      title: '',
      description: '',
      photos: [],
      location: '',
      priority: 'medium',
      status: 'open',
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
    });

    try {
      // Prepare data for API
      const callData = {
        title: newCall.title,
        description: newCall.description,
        photos: newCall.photos,
        location: newCall.location,
        priority: newCall.priority,
        companyEmail: newCall.companyEmail,
      };

      // Send to backend (in background)
      saveTechnicalCallMutation.mutate(callData);
    } catch (error) {
      // Error is already handled by the mutation hook
      console.error('Failed to save technical call:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-700', text: t('draft') },
      sent: { color: 'bg-blue-100 text-blue-700', text: t('sent') },
      quoted: { color: 'bg-yellow-100 text-yellow-700', text: t('quoted') },
      approved: { color: 'bg-green-100 text-green-700', text: t('approved') },
      open: { color: 'bg-red-100 text-red-700', text: t('open') },
      in_progress: { color: 'bg-yellow-100 text-yellow-700', text: t('inProgress') },
      resolved: { color: 'bg-green-100 text-green-700', text: t('resolved') },
      closed: { color: 'bg-gray-100 text-gray-700', text: t('closed') },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={t("adminSindipro")} />
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-purple-500" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{t("fieldManagementRequests")}</h1>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="materials" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                {t("materialsAndServices")}
              </TabsTrigger>
              <TabsTrigger value="technical" className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                {t("technicalCalls")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="materials" className="space-y-6">
              {/* Materials Request Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    {t("newMaterialRequest")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="request-title">{t("materialRequestTitle")}</Label>
                      <Input 
                        id="request-title" 
                        placeholder={t("materialRequestTitlePlaceholder")}
                        value={currentMaterialRequest.title}
                        onChange={(e) => setCurrentMaterialRequest(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="building">{t("buildingName")}</Label>
                      <Select 
                        value={currentMaterialRequest.building} 
                        onValueChange={(value) => setCurrentMaterialRequest(prev => ({ ...prev, building: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectBuilding")} />
                        </SelectTrigger>
                        <SelectContent>
                          {buildings.map((building) => (
                            <SelectItem key={building.id} value={building.id.toString()}>
                              {building.building_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="caretaker">{t("caretakerName")}</Label>
                    <Input 
                      id="caretaker" 
                      placeholder={t("caretakerNamePlaceholder")}
                      value={currentMaterialRequest.caretaker}
                      onChange={(e) => setCurrentMaterialRequest(prev => ({ ...prev, caretaker: e.target.value }))}
                    />
                  </div>
                  
                  {/* Spreadsheet-like table for materials */}
                  <div className="border rounded-lg">
                    <div className="p-4 bg-muted border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{t("materialsList")}</h3>
                        <Button onClick={addMaterialItem} size="sm" className="gap-2">
                          <Plus className="w-4 h-4" />
                          {t("addItem")}
                        </Button>
                      </div>
                    </div>
                    {currentMaterialRequest.items.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t("productType")}</TableHead>
                            <TableHead className="w-24">{t("quantity")}</TableHead>
                            <TableHead>{t("observations")}</TableHead>
                            <TableHead className="w-16">{t("actions")}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentMaterialRequest.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <Input 
                                  placeholder={t("productTypePlaceholder")}
                                  value={item.productType}
                                  onChange={(e) => updateMaterialItem(item.id, 'productType', e.target.value)}
                                />
                              </TableCell>
                              <TableCell>
                                <Input 
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateMaterialItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                                />
                              </TableCell>
                              <TableCell>
                                <Input 
                                  placeholder={t("observationsPlaceholder")}
                                  value={item.observations}
                                  onChange={(e) => updateMaterialItem(item.id, 'observations', e.target.value)}
                                />
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeMaterialItem(item.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>{t("noItemsAdded")}</p>
                        <p className="text-sm">{t("clickAddToStart")}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={saveMaterialRequest} 
                      className="gap-2"
                      disabled={saveMaterialRequestMutation.isPending}
                    >
                      <Send className="w-4 h-4" />
                      {saveMaterialRequestMutation.isPending ? t("saving") || "Saving..." : t("saveRequest")}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => {
                        if (materialRequests && materialRequests.length > 0) {
                          exportMaterialRequestsToExcel(materialRequests, 'material_requests');
                          toast({
                            title: "Success",
                            description: "Excel file downloaded successfully",
                          });
                        } else {
                          toast({
                            title: "No data",
                            description: "No material requests to export",
                            variant: "destructive",
                          });
                        }
                      }}
                      disabled={isLoadingRequests || materialRequests.length === 0}
                    >
                      <FileDown className="w-4 h-4" />
                      {t("exportExcel")}
                    </Button>
                  </div>
                </CardContent>
              </Card>


              {/* Material Requests History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="w-5 h-5" />
                      {t("requestHistory")}
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      {t("export")}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingRequests ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                      <p className="text-muted-foreground">{t("loadingRequests") || "Loading requests..."}</p>
                    </div>
                  ) : materialRequests.length > 0 ? (
                    <div className="space-y-4">
                      {materialRequests.map((request) => (
                        <div key={request.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold">{request.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {request.building_name || request.building} - {request.caretaker}
                              </p>
                            </div>
                            {getStatusBadge(request.status || 'sent')}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span>{request.items.length} {t("items")}</span>
                            <span>{t("createdOn")}: {new Date(request.created_at || request.createdAt || '').toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2"
                              onClick={() => {
                                setSelectedRequest(request);
                                setIsDetailsModalOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                              {t("viewDetails")}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>{t("noMaterialRequests")}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Material Request Details Modal */}
              <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{t("requestDetails")}</DialogTitle>
                  </DialogHeader>
                  {selectedRequest && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground">{t("requestId")}</Label>
                          <p className="font-medium">{selectedRequest.id}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">{t("status")}</Label>
                          <div className="mt-1">
                            {getStatusBadge(selectedRequest.status || 'sent')}
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">{t("title")}</Label>
                          <p className="font-medium">{selectedRequest.title}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">{t("building")}</Label>
                          <p className="font-medium">{selectedRequest.building_name}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">{t("caretaker")}</Label>
                          <p className="font-medium">{selectedRequest.caretaker}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">{t("createdDate")}</Label>
                          <p className="font-medium">{new Date(selectedRequest.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-muted-foreground mb-2">{t("items")}</Label>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t("item")}</TableHead>
                              <TableHead>{t("productType")}</TableHead>
                              <TableHead>{t("quantity")}</TableHead>
                              <TableHead>{t("observations")}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedRequest.items.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.productType}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.observations}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="technical" className="space-y-6">
              {/* Technical Call Form */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t("openTechnicalCall")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="call-title">{t("callTitle")}</Label>
                      <Input 
                        id="call-title" 
                        placeholder={t("callTitlePlaceholder")}
                        value={currentTechnicalCall.title}
                        onChange={(e) => setCurrentTechnicalCall(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="call-location">{t("callLocation")}</Label>
                      <Input 
                        id="call-location" 
                        placeholder={t("callLocationPlaceholder")}
                        value={currentTechnicalCall.location}
                        onChange={(e) => setCurrentTechnicalCall(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="call-priority">{t("priority")}</Label>
                      <Select 
                        value={currentTechnicalCall.priority} 
                        onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setCurrentTechnicalCall(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">{t("low")}</SelectItem>
                          <SelectItem value="medium">{t("medium")}</SelectItem>
                          <SelectItem value="high">{t("high")}</SelectItem>
                          <SelectItem value="urgent">{t("urgent")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="company-email" className="text-sm">{t("companyEmail")}</Label>
                      <Input 
                        id="company-email" 
                        type="email"
                        placeholder={t("companyEmailPlaceholder")}
                        className="text-sm"
                        value={currentTechnicalCall.companyEmail || ''}
                        onChange={(e) => setCurrentTechnicalCall(prev => ({ ...prev, companyEmail: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="call-description">{t("problemDescription")}</Label>
                    <Textarea 
                      id="call-description" 
                      placeholder={t("problemDescriptionPlaceholder")}
                      rows={4}
                      value={currentTechnicalCall.description}
                      onChange={(e) => setCurrentTechnicalCall(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <Label>{t("problemPhotos")}</Label>
                    
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-muted rounded-lg p-4 sm:p-6 lg:p-8 text-center">
                      <Camera className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-2 sm:mb-3 lg:mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm">{t("addPhotosToDocument")}</p>
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <Button 
                          variant="outline" 
                          className="gap-1 sm:gap-2 text-xs sm:text-sm px-3 py-2"
                          onClick={takePhoto}
                          type="button"
                        >
                          <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                          {t("takePhoto")}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="gap-1 sm:gap-2 text-xs sm:text-sm px-3 py-2"
                          onClick={() => fileInputRef.current?.click()}
                          type="button"
                        >
                          <FileUp className="w-3 h-3 sm:w-4 sm:h-4" />
                          {t("upload")}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Photo Preview Grid */}
                    {currentTechnicalCall.photos.length > 0 && (
                      <div className="mt-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {currentTechnicalCall.photos.map((photo, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={photo} 
                                alt={`Problem photo ${index + 1}`}
                                className="w-full h-24 sm:h-32 object-cover rounded-lg border"
                              />
                              <button
                                onClick={() => removePhoto(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                type="button"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <Button 
                      onClick={saveTechnicalCall} 
                      className="gap-1 sm:gap-2 text-xs sm:text-sm px-3 py-2"
                      disabled={saveTechnicalCallMutation.isPending}
                    >
                      <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                      {saveTechnicalCallMutation.isPending ? t("sending") || "Sending..." : t("send")}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Calls List */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-base sm:text-lg">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      {t("technicalCallsList")}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">{t("emailList")}</span>
                        <span className="xs:hidden">{t("email")}</span>
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                        {t("report")}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-2 mb-4">
                    <div className="grid grid-cols-2 sm:flex gap-2">
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">{t("all")}</Button>
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">{t("open")}</Button>
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">{t("inProgress")}</Button>
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">{t("resolved")}</Button>
                    </div>
                  </div>
                  
                  {isLoadingTechnicalCalls ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                      <p className="text-muted-foreground">{t("loadingCalls") || "Loading technical calls..."}</p>
                    </div>
                  ) : (technicalCallsData.length > 0 || localTechnicalCalls.length > 0) ? (
                    <div className="space-y-4">
                      {/* Show local calls first, then API calls */}
                      {[...localTechnicalCalls, ...technicalCallsData].map((call: any) => (
                        <div key={call.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold">{call.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {t("createdBy")}: {call.createdBy || call.created_by} - {call.location}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {getStatusBadge(call.status || 'open')}
                              <Badge className={`${
                                call.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                call.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                call.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {call.priority === 'urgent' ? t('urgent') :
                                 call.priority === 'high' ? t('high') :
                                 call.priority === 'medium' ? t('medium') : t('low')}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm mb-3">{call.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span><Clock className="w-3 h-3 inline mr-1" />
                              {new Date(call.createdAt || call.created_at).toLocaleDateString()}
                            </span>
                            {call.photos && call.photos.length > 0 && (
                              <span><Camera className="w-3 h-3 inline mr-1" />
                                {call.photos.length} {t("photos")}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button variant="outline" size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              {t("viewDetails")}
                            </Button>
                            {call.status === 'open' && (
                              <Button variant="outline" size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden xs:inline">{t("markAsResolved")}</span>
                                <span className="xs:hidden">{t("resolved")}</span>
                              </Button>
                            )}
                            <Button variant="outline" size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden xs:inline">{t("sendUpdate")}</span>
                              <span className="xs:hidden">{t("update")}</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>{t("noTechnicalCalls")}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  );
}