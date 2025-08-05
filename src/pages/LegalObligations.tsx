import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Calendar, FileText, Upload, Bell, Plus, Building2, Edit, Trash2, Mail, Clock, Check, X } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

// Mock data for legal obligation templates
const mockObligationTemplates = [
  {
    id: 1,
    name: "AVCB (Auto de Vistoria do Corpo de Bombeiros)",
    description: "Certificado de segurança contra incêndio e pânico",
    buildingTypes: ["residential", "commercial"],
    frequency: "annual",
    daysBeforeExpiry: 30,
    requiresQuote: true,
    active: true
  },
  {
    id: 2,
    name: "Inspeção Elétrica",
    description: "Verificação da instalação elétrica do edifício",
    buildingTypes: ["residential", "commercial"],
    frequency: "biannual",
    daysBeforeExpiry: 45,
    requiresQuote: true,
    active: true
  },
  {
    id: 3,
    name: "Medição de Qualidade do Ar",
    description: "Medição anual da qualidade do ar para edifícios comerciais com ar condicionado central",
    buildingTypes: ["commercial"],
    frequency: "annual",
    daysBeforeExpiry: 60,
    requiresQuote: true,
    active: true,
    conditions: "Apenas para edifícios com ar condicionado central"
  },
  {
    id: 4,
    name: "Limpeza de Caixa d'Água",
    description: "Limpeza e desinfecção semestral das caixas d'água",
    buildingTypes: ["residential", "commercial"],
    frequency: "biannual",
    daysBeforeExpiry: 15,
    requiresQuote: true,
    active: true
  },
  {
    id: 5,
    name: "Manutenção de Elevadores",
    description: "Manutenção mensal dos elevadores",
    buildingTypes: ["residential", "commercial"],
    frequency: "monthly",
    daysBeforeExpiry: 7,
    requiresQuote: true,
    active: true
  }
];

// Mock data for buildings
const mockBuildings = [
  {
    id: 1,
    name: "Edifício Residencial Solar",
    type: "residential",
    address: "Rua das Flores, 123",
    hasAirConditioning: false
  },
  {
    id: 2,
    name: "Torre Comercial Centro",
    type: "commercial",
    address: "Av. Paulista, 456",
    hasAirConditioning: true
  },
  {
    id: 3,
    name: "Condomínio Residencial Vista Verde",
    type: "residential",
    address: "Rua dos Pinheiros, 789",
    hasAirConditioning: false
  }
];

// Mock data for building obligations
const mockBuildingObligations = [
  {
    id: 1,
    buildingId: 1,
    obligationId: 1,
    nextDueDate: "2024-03-15",
    status: "active",
    autoEmail: true,
    emailSent: false,
    notes: ""
  },
  {
    id: 2,
    buildingId: 1,
    obligationId: 2,
    nextDueDate: "2024-04-20",
    status: "active",
    autoEmail: true,
    emailSent: false,
    notes: ""
  },
  {
    id: 3,
    buildingId: 2,
    obligationId: 1,
    nextDueDate: "2024-02-28",
    status: "pending_quotes",
    autoEmail: true,
    emailSent: true,
    notes: "Cotações solicitadas em 15/01/2024"
  },
  {
    id: 4,
    buildingId: 2,
    obligationId: 3,
    nextDueDate: "2024-05-10",
    status: "active",
    autoEmail: true,
    emailSent: false,
    notes: "Aplicável por ter ar condicionado central"
  }
];

export default function LegalObligations() {
  const { t } = useTranslation();
  
  // State management
  const [obligationTemplates, setObligationTemplates] = useState(mockObligationTemplates);
  const [buildings, setBuildings] = useState(mockBuildings);
  const [buildingObligations, setBuildingObligations] = useState(mockBuildingObligations);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [activeTab, setActiveTab] = useState("templates");
  
  // Template management state
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    buildingTypes: [],
    frequency: "annual",
    daysBeforeExpiry: 30,
    requiresQuote: true,
    active: true,
    conditions: ""
  });
  
  // Building obligation management state
  const [selectedObligations, setSelectedObligations] = useState([]);
  const [obligationDates, setObligationDates] = useState({});
  
  // Get obligations for selected building
  const getBuildingObligations = (buildingId) => {
    return buildingObligations.filter(bo => bo.buildingId === buildingId);
  };
  
  // Get available templates for building type
  const getAvailableTemplates = (buildingType, hasAirConditioning = false) => {
    return obligationTemplates.filter(template => {
      if (!template.active) return false;
      if (!template.buildingTypes.includes(buildingType)) return false;
      
      // Special condition for air quality - only show for commercial buildings with AC
      if (template.name.includes("Qualidade do Ar")) {
        return buildingType === "commercial" && hasAirConditioning;
      }
      
      return true;
    });
  };
  
  // Calculate days until due
  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Get status color
  const getStatusColor = (status, daysUntil) => {
    if (status === "pending_quotes") return "orange";
    if (daysUntil <= 7) return "red";
    if (daysUntil <= 30) return "yellow";
    return "green";
  };
  
  // Handle template creation/editing
  const handleSaveTemplate = () => {
    if (editingTemplate) {
      setObligationTemplates(prev => prev.map(t => 
        t.id === editingTemplate.id ? { ...newTemplate, id: editingTemplate.id } : t
      ));
      setEditingTemplate(null);
    } else {
      const template = {
        ...newTemplate,
        id: Date.now()
      };
      setObligationTemplates(prev => [...prev, template]);
    }
    
    setNewTemplate({
      name: "",
      description: "",
      buildingTypes: [],
      frequency: "annual",
      daysBeforeExpiry: 30,
      requiresQuote: true,
      active: true,
      conditions: ""
    });
    setIsCreatingTemplate(false);
  };
  
  // Handle building obligation assignment
  const handleAssignObligations = () => {
    if (!selectedBuilding) return;
    
    const newObligations = selectedObligations.map(templateId => {
      const template = obligationTemplates.find(t => t.id === templateId);
      const dueDate = obligationDates[templateId] || new Date().toISOString().split('T')[0];
      
      return {
        id: Date.now() + Math.random(),
        buildingId: selectedBuilding.id,
        obligationId: templateId,
        nextDueDate: dueDate,
        status: "active",
        autoEmail: true,
        emailSent: false,
        notes: ""
      };
    });
    
    setBuildingObligations(prev => [...prev, ...newObligations]);
    setSelectedObligations([]);
    setObligationDates({});
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={t("adminSindipro")} />
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{t("legalObligationsAndDocuments")}</h1>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="templates" className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 text-[10px] sm:text-sm px-1 sm:px-3 py-1 sm:py-2">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Template Matrix</span>
                <span className="sm:hidden leading-tight">Templates</span>
              </TabsTrigger>
              <TabsTrigger value="buildings" className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 text-[10px] sm:text-sm px-1 sm:px-3 py-1 sm:py-2">
                <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Building Setup</span>
                <span className="sm:hidden leading-tight">Buildings</span>
              </TabsTrigger>
              <TabsTrigger value="agenda" className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 text-[10px] sm:text-sm px-1 sm:px-3 py-1 sm:py-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Agenda</span>
                <span className="sm:hidden leading-tight">Agenda</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 text-[10px] sm:text-sm px-1 sm:px-3 py-1 sm:py-2">
                <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Notifications</span>
                <span className="sm:hidden leading-tight">Notify</span>
              </TabsTrigger>
            </TabsList>

            {/* Template Matrix Tab */}
            <TabsContent value="templates" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-lg">Obligation Template Matrix</span>
                    </CardTitle>
                    <Button onClick={() => setIsCreatingTemplate(true)} className="gap-2 w-full sm:w-auto text-sm">
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Add Template</span>
                      <span className="sm:hidden">Add</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                    Manage the master list of legal obligations that can be assigned to buildings based on their type.
                  </p>
                  
                  <div className="space-y-4">
                    {obligationTemplates.map((template) => (
                      <div key={template.id} className="p-3 sm:p-4 border rounded-lg">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                          <div className="flex-1 w-full">
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                              <h3 className="text-sm sm:text-base font-semibold break-words">{template.name}</h3>
                              <Badge variant={template.active ? "default" : "secondary"} className="text-xs">
                                {template.active ? "Active" : "Inactive"}
                              </Badge>
                              {template.buildingTypes.map(type => (
                                <Badge key={type} variant="outline" className="text-xs">
                                  {type === "residential" ? "Residential" : "Commercial"}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-2 break-words">{template.description}</p>
                            {template.conditions && (
                              <p className="text-xs sm:text-sm text-orange-600 mb-2 break-words">
                                <strong>Conditions:</strong> {template.conditions}
                              </p>
                            )}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                              <span>Frequency: {template.frequency}</span>
                              <span>Alert: {template.daysBeforeExpiry} days before</span>
                              <span className="break-words">Quotes: {template.requiresQuote ? "Required" : "Not required"}</span>
                            </div>
                          </div>
                          <div className="flex gap-1 sm:gap-2 w-full sm:w-auto justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 sm:h-9 sm:w-auto px-2 sm:px-3"
                              onClick={() => {
                                setEditingTemplate(template);
                                setNewTemplate({ ...template });
                                setIsCreatingTemplate(true);
                              }}
                            >
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline ml-1">Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 sm:h-9 sm:w-auto px-2 sm:px-3"
                              onClick={() => {
                                setObligationTemplates(prev => prev.filter(t => t.id !== template.id));
                              }}
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline ml-1">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Building Setup Tab */}
            <TabsContent value="buildings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Building Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-lg">Select Building</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {buildings.map((building) => (
                      <div
                        key={building.id}
                        className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedBuilding?.id === building.id ? "border-primary bg-primary/10" : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedBuilding(building)}
                      >
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
                          <div className="flex-1 w-full">
                            <h3 className="text-sm sm:text-base font-semibold break-words">{building.name}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground break-words">{building.address}</p>
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {building.type === "residential" ? "Residential" : "Commercial"}
                              </Badge>
                              {building.hasAirConditioning && (
                                <Badge variant="secondary" className="text-xs">Air Conditioning</Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right w-full sm:w-auto">
                            <p className="text-xs sm:text-sm font-medium">
                              {getBuildingObligations(building.id).length} obligations
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Obligation Assignment */}
                {selectedBuilding && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-lg">Assign Obligations</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-4 break-words">
                        Available obligations for <strong>{selectedBuilding.name}</strong> ({selectedBuilding.type}):
                      </div>
                      
                      {getAvailableTemplates(selectedBuilding.type, selectedBuilding.hasAirConditioning).map((template) => {
                        const isAssigned = getBuildingObligations(selectedBuilding.id).some(bo => bo.obligationId === template.id);
                        const isSelected = selectedObligations.includes(template.id);
                        
                        return (
                          <div key={template.id} className="space-y-2">
                            <div className="flex items-start gap-3">
                              <Checkbox
                                id={`template-${template.id}`}
                                checked={isSelected}
                                disabled={isAssigned}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedObligations(prev => [...prev, template.id]);
                                  } else {
                                    setSelectedObligations(prev => prev.filter(id => id !== template.id));
                                    setObligationDates(prev => {
                                      const newDates = { ...prev };
                                      delete newDates[template.id];
                                      return newDates;
                                    });
                                  }
                                }}
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor={`template-${template.id}`}
                                  className={`text-sm font-medium cursor-pointer ${
                                    isAssigned ? "text-muted-foreground" : ""
                                  }`}
                                >
                                  {template.name}
                                  {isAssigned && (
                                    <Badge variant="secondary" className="ml-2">Already Assigned</Badge>
                                  )}
                                </Label>
                                <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                                {template.conditions && (
                                  <p className="text-xs text-orange-600 mt-1">{template.conditions}</p>
                                )}
                              </div>
                            </div>
                            
                            {isSelected && (
                              <div className="ml-6">
                                <Label htmlFor={`date-${template.id}`} className="text-xs">
                                  Next Due Date:
                                </Label>
                                <Input
                                  id={`date-${template.id}`}
                                  type="date"
                                  className="h-8"
                                  value={obligationDates[template.id] || ""}
                                  onChange={(e) => {
                                    setObligationDates(prev => ({
                                      ...prev,
                                      [template.id]: e.target.value
                                    }));
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                      
                      {selectedObligations.length > 0 && (
                        <Button onClick={handleAssignObligations} className="w-full mt-4 gap-2">
                          <Plus className="w-4 h-4" />
                          Assign {selectedObligations.length} Obligation{selectedObligations.length > 1 ? 's' : ''}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Current Building Obligations */}
              {selectedBuilding && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-lg break-words">Current Obligations for {selectedBuilding.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getBuildingObligations(selectedBuilding.id).map((bo) => {
                        const template = obligationTemplates.find(t => t.id === bo.obligationId);
                        const daysUntil = getDaysUntilDue(bo.nextDueDate);
                        const statusColor = getStatusColor(bo.status, daysUntil);
                        
                        return (
                          <div key={bo.id} className="p-3 sm:p-4 border rounded-lg">
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                              <div className="flex-1 w-full">
                                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                                  <h4 className="text-sm sm:text-base font-medium break-words">{template?.name}</h4>
                                  <Badge
                                    variant={statusColor === "red" ? "destructive" : statusColor === "yellow" ? "secondary" : "default"}
                                    className="text-xs"
                                  >
                                    {daysUntil <= 0 ? "Overdue" : daysUntil <= 7 ? "Urgent" : daysUntil <= 30 ? "Soon" : "Active"}
                                  </Badge>
                                  {bo.status === "pending_quotes" && (
                                    <Badge variant="outline" className="text-xs">Quotes Requested</Badge>
                                  )}
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground mb-2 break-words">{template?.description}</p>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm">
                                  <span>Due: {new Date(bo.nextDueDate).toLocaleDateString()}</span>
                                  <span className={`font-medium break-words ${
                                    daysUntil <= 0 ? "text-red-600" :
                                    daysUntil <= 7 ? "text-red-500" :
                                    daysUntil <= 30 ? "text-yellow-600" : "text-green-600"
                                  }`}>
                                    {daysUntil <= 0 ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days remaining`}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    <span className={bo.autoEmail ? "text-green-600" : "text-muted-foreground"}>
                                      Auto Email: {bo.autoEmail ? "ON" : "OFF"}
                                    </span>
                                  </div>
                                </div>
                                {bo.notes && (
                                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 break-words">
                                    <strong>Notes:</strong> {bo.notes}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-1 sm:gap-2 w-full sm:w-auto justify-end">
                                {template?.requiresQuote && bo.status === "active" && daysUntil <= 30 && (
                                  <Button size="sm" variant="outline" className="gap-1 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3">
                                    <Mail className="w-3 h-3" />
                                    <span className="hidden sm:inline">Request Quotes</span>
                                    <span className="sm:hidden">Quote</span>
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 sm:h-9 sm:w-auto px-2 sm:px-3"
                                  onClick={() => {
                                    setBuildingObligations(prev => prev.filter(item => item.id !== bo.id));
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span className="hidden sm:inline ml-1 text-xs sm:text-sm">Delete</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {getBuildingObligations(selectedBuilding.id).length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No obligations assigned to this building yet.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Agenda Tab */}
            <TabsContent value="agenda" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Legal Obligations Agenda
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Overdue */}
                      <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-red-600" />
                          <span className="font-semibold text-red-800">Overdue</span>
                        </div>
                        <div className="space-y-2">
                          {buildingObligations.filter(bo => getDaysUntilDue(bo.nextDueDate) <= 0).map(bo => {
                            const template = obligationTemplates.find(t => t.id === bo.obligationId);
                            const building = buildings.find(b => b.id === bo.buildingId);
                            return (
                              <div key={bo.id} className="text-sm">
                                <div className="font-medium">{template?.name}</div>
                                <div className="text-red-600">{building?.name}</div>
                                <div className="text-xs text-red-500">
                                  {Math.abs(getDaysUntilDue(bo.nextDueDate))} days overdue
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* This Week */}
                      <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                          <span className="font-semibold text-orange-800">This Week</span>
                        </div>
                        <div className="space-y-2">
                          {buildingObligations.filter(bo => {
                            const days = getDaysUntilDue(bo.nextDueDate);
                            return days > 0 && days <= 7;
                          }).map(bo => {
                            const template = obligationTemplates.find(t => t.id === bo.obligationId);
                            const building = buildings.find(b => b.id === bo.buildingId);
                            return (
                              <div key={bo.id} className="text-sm">
                                <div className="font-medium">{template?.name}</div>
                                <div className="text-orange-600">{building?.name}</div>
                                <div className="text-xs text-orange-500">
                                  {getDaysUntilDue(bo.nextDueDate)} days left
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* This Month */}
                      <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-yellow-600" />
                          <span className="font-semibold text-yellow-800">This Month</span>
                        </div>
                        <div className="space-y-2">
                          {buildingObligations.filter(bo => {
                            const days = getDaysUntilDue(bo.nextDueDate);
                            return days > 7 && days <= 30;
                          }).map(bo => {
                            const template = obligationTemplates.find(t => t.id === bo.obligationId);
                            const building = buildings.find(b => b.id === bo.buildingId);
                            return (
                              <div key={bo.id} className="text-sm">
                                <div className="font-medium">{template?.name}</div>
                                <div className="text-yellow-600">{building?.name}</div>
                                <div className="text-xs text-yellow-500">
                                  {getDaysUntilDue(bo.nextDueDate)} days left
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Future */}
                      <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-800">Future</span>
                        </div>
                        <div className="space-y-2">
                          {buildingObligations.filter(bo => getDaysUntilDue(bo.nextDueDate) > 30).map(bo => {
                            const template = obligationTemplates.find(t => t.id === bo.obligationId);
                            const building = buildings.find(b => b.id === bo.buildingId);
                            return (
                              <div key={bo.id} className="text-sm">
                                <div className="font-medium">{template?.name}</div>
                                <div className="text-green-600">{building?.name}</div>
                                <div className="text-xs text-green-500">
                                  {getDaysUntilDue(bo.nextDueDate)} days left
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Email Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="notification-email">Default Notification Email</Label>
                    <Input
                      id="notification-email"
                      type="email"
                      placeholder="admin@condominio.com"
                      defaultValue="admin@condominio.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cc-emails">CC Recipients (comma separated)</Label>
                    <Input
                      id="cc-emails"
                      type="email"
                      placeholder="manager@condominio.com, finance@condominio.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Email Templates</Label>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium mb-2">Quote Request Email</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Automatically sent when requesting quotes for legal obligations
                        </p>
                        <Textarea
                          placeholder="Enter email template..."
                          defaultValue="Dear Provider,\n\nWe would like to request a quote for the following service:\n\n[OBLIGATION_NAME] for [BUILDING_NAME]\nDue Date: [DUE_DATE]\n\nPlease send your proposal to this email.\n\nBest regards,\n[MANAGER_NAME]"
                          className="h-32"
                        />
                      </div>
                      
                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium mb-2">Deadline Reminder Email</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Sent automatically based on configured alert days
                        </p>
                        <Textarea
                          placeholder="Enter email template..."
                          defaultValue="Dear Manager,\n\nThis is a reminder that the following legal obligation is approaching its deadline:\n\n[OBLIGATION_NAME] for [BUILDING_NAME]\nDue Date: [DUE_DATE] ([DAYS_LEFT] days remaining)\n\nPlease ensure this obligation is fulfilled on time.\n\nBest regards,\nSINDIPRO System"
                          className="h-32"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full gap-2">
                    <Bell className="w-4 h-4" />
                    Save Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Template Creation/Edit Dialog */}
      <Dialog open={isCreatingTemplate} onOpenChange={setIsCreatingTemplate}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Obligation Template" : "Create New Obligation Template"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-name">Obligation Name</Label>
              <Input
                id="template-name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="e.g., AVCB Renewal"
              />
            </div>
            
            <div>
              <Label htmlFor="template-description">Description</Label>
              <Textarea
                id="template-description"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                placeholder="Describe what this obligation involves..."
              />
            </div>
            
            <div>
              <Label>Building Types</Label>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="residential"
                    checked={newTemplate.buildingTypes.includes("residential")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setNewTemplate({
                          ...newTemplate,
                          buildingTypes: [...newTemplate.buildingTypes, "residential"]
                        });
                      } else {
                        setNewTemplate({
                          ...newTemplate,
                          buildingTypes: newTemplate.buildingTypes.filter(t => t !== "residential")
                        });
                      }
                    }}
                  />
                  <Label htmlFor="residential">Residential</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="commercial"
                    checked={newTemplate.buildingTypes.includes("commercial")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setNewTemplate({
                          ...newTemplate,
                          buildingTypes: [...newTemplate.buildingTypes, "commercial"]
                        });
                      } else {
                        setNewTemplate({
                          ...newTemplate,
                          buildingTypes: newTemplate.buildingTypes.filter(t => t !== "commercial")
                        });
                      }
                    }}
                  />
                  <Label htmlFor="commercial">Commercial</Label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={newTemplate.frequency} onValueChange={(value) => setNewTemplate({ ...newTemplate, frequency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="biannual">Biannual</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="alert-days">Alert Days Before Expiry</Label>
                <Input
                  id="alert-days"
                  type="number"
                  value={newTemplate.daysBeforeExpiry}
                  onChange={(e) => setNewTemplate({ ...newTemplate, daysBeforeExpiry: parseInt(e.target.value) })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="conditions">Special Conditions (Optional)</Label>
              <Input
                id="conditions"
                value={newTemplate.conditions}
                onChange={(e) => setNewTemplate({ ...newTemplate, conditions: e.target.value })}
                placeholder="e.g., Only for buildings with central air conditioning"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requires-quote"
                checked={newTemplate.requiresQuote}
                onCheckedChange={(checked) => setNewTemplate({ ...newTemplate, requiresQuote: checked })}
              />
              <Label htmlFor="requires-quote">Requires Quote Request</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={newTemplate.active}
                onCheckedChange={(checked) => setNewTemplate({ ...newTemplate, active: checked })}
              />
              <Label htmlFor="active">Active Template</Label>
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button onClick={handleSaveTemplate} className="flex-1">
              {editingTemplate ? "Update Template" : "Create Template"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreatingTemplate(false);
                setEditingTemplate(null);
                setNewTemplate({
                  name: "",
                  description: "",
                  buildingTypes: [],
                  frequency: "annual",
                  daysBeforeExpiry: 30,
                  requiresQuote: true,
                  active: true,
                  conditions: ""
                });
              }}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}