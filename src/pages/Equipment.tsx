import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Wrench, MapPin, Calendar, Plus, Bell, Building2, Phone, Clock, History, Edit, Trash2, FileText, Grid3x3, List } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface MaintenanceRecord {
  id: string;
  date: Date;
  type: string;
  description: string;
  technician: string;
  cost?: number;
  notes?: string;
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  purchaseDate: Date;
  contractorName: string;
  contractorPhone: string;
  maintenanceFrequency: string;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  status: 'operational' | 'maintenance' | 'repair' | 'inactive';
  condominium: string;
  maintenanceHistory: MaintenanceRecord[];
}

export default function Equipment() {
  const { t } = useTranslation();
  const [selectedCondominium, setSelectedCondominium] = useState<string>("all");
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Form states
  const [equipmentForm, setEquipmentForm] = useState({
    name: '',
    type: '',
    location: '',
    purchaseDate: '',
    contractorName: '',
    contractorPhone: '',
    maintenanceFrequency: 'monthly',
    condominium: '',
    status: 'operational' as const
  });

  const [maintenanceForm, setMaintenanceForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    description: '',
    technician: '',
    cost: '',
    notes: ''
  });

  // Mock data with updated structure
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([
    {
      id: "1",
      name: t("socialElevator"),
      type: "Elevator",
      location: t("mainHall"),
      purchaseDate: new Date("2020-01-15"),
      contractorName: "Elevadores ABC Ltda",
      contractorPhone: "(11) 3333-4444",
      maintenanceFrequency: "monthly",
      lastMaintenance: new Date("2024-02-15"),
      nextMaintenance: new Date("2024-03-15"),
      status: "operational",
      condominium: "Edifício Central",
      maintenanceHistory: [
        {
          id: "m1",
          date: new Date("2024-02-15"),
          type: "Preventive Maintenance",
          description: "Monthly inspection and lubrication",
          technician: "João Silva",
          cost: 450,
          notes: "All systems functioning normally"
        },
        {
          id: "m2",
          date: new Date("2024-01-15"),
          type: "Preventive Maintenance",
          description: "Monthly inspection",
          technician: "João Silva",
          cost: 450
        }
      ]
    },
    {
      id: "2",
      name: t("recirculationPump"),
      type: "Pump",
      location: t("machineRoom"),
      purchaseDate: new Date("2019-06-20"),
      contractorName: "Hidráulica Total",
      contractorPhone: "(11) 4444-5555",
      maintenanceFrequency: "quarterly",
      lastMaintenance: new Date("2023-12-22"),
      nextMaintenance: new Date("2024-03-22"),
      status: "maintenance",
      condominium: "Edifício Central",
      maintenanceHistory: [
        {
          id: "m3",
          date: new Date("2023-12-22"),
          type: "Corrective Maintenance",
          description: "Bearing replacement",
          technician: "Carlos Mendes",
          cost: 850,
          notes: "Requires monitoring for next 30 days"
        }
      ]
    },
    {
      id: "3",
      name: "Generator",
      type: "Generator",
      location: "Basement",
      purchaseDate: new Date("2021-03-10"),
      contractorName: "Geradores Power",
      contractorPhone: "(11) 5555-6666",
      maintenanceFrequency: "monthly",
      lastMaintenance: new Date("2024-02-01"),
      nextMaintenance: new Date("2024-03-01"),
      status: "operational",
      condominium: "Residencial Park",
      maintenanceHistory: [
        {
          id: "m4",
          date: new Date("2024-02-01"),
          type: "Battery Replacement",
          description: "Changed generator batteries",
          technician: "Roberto Alves",
          cost: 1200,
          notes: "New batteries installed, 2-year warranty"
        },
        {
          id: "m5",
          date: new Date("2024-01-01"),
          type: "Preventive Maintenance",
          description: "Monthly test and inspection",
          technician: "Roberto Alves",
          cost: 300
        }
      ]
    }
  ]);

  // Available condominiums (in real app, this would come from an API)
  const condominiums = [
    { value: "all", label: t("allCondominiums") || "All Condominiums" },
    { value: "Edifício Central", label: "Edifício Central" },
    { value: "Residencial Park", label: "Residencial Park" },
    { value: "Torre Sul", label: "Torre Sul" }
  ];

  // Filter equipment by selected condominium
  const filteredEquipment = selectedCondominium === "all" 
    ? equipmentList 
    : equipmentList.filter(eq => eq.condominium === selectedCondominium);

  const maintenanceTypes = [
    { value: "preventive", label: t("preventiveMaintenance") || "Preventive Maintenance" },
    { value: "corrective", label: t("correctiveMaintenance") || "Corrective Maintenance" },
    { value: "battery-replacement", label: t("batteryReplacement") || "Battery Replacement" },
    { value: "parts-replacement", label: t("partsReplacement") || "Parts Replacement" },
    { value: "inspection", label: t("inspection") || "Inspection" },
    { value: "cleaning", label: t("cleaning") || "Cleaning" },
    { value: "calibration", label: t("calibration") || "Calibration" },
    { value: "other", label: t("other") || "Other" }
  ];

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'repair':
        return 'bg-orange-500';
      case 'inactive':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: Equipment['status']) => {
    switch (status) {
      case 'operational':
        return t("operatingNormally") || "Operating Normally";
      case 'maintenance':
        return t("maintenanceRequired") || "Under Maintenance";
      case 'repair':
        return t("underRepair") || "Under Repair";
      case 'inactive':
        return t("inactive") || "Inactive";
      default:
        return status;
    }
  };

  const handleAddEquipment = () => {
    const newEquipment: Equipment = {
      id: Date.now().toString(),
      name: equipmentForm.name,
      type: equipmentForm.type,
      location: equipmentForm.location,
      purchaseDate: new Date(equipmentForm.purchaseDate),
      contractorName: equipmentForm.contractorName,
      contractorPhone: equipmentForm.contractorPhone,
      maintenanceFrequency: equipmentForm.maintenanceFrequency,
      status: equipmentForm.status,
      condominium: equipmentForm.condominium,
      maintenanceHistory: []
    };

    setEquipmentList([...equipmentList, newEquipment]);
    setIsAddEquipmentOpen(false);
    setEquipmentForm({
      name: '',
      type: '',
      location: '',
      purchaseDate: '',
      contractorName: '',
      contractorPhone: '',
      maintenanceFrequency: 'monthly',
      condominium: '',
      status: 'operational'
    });
  };

  const handleAddMaintenanceRecord = () => {
    if (!selectedEquipment) return;

    const newRecord: MaintenanceRecord = {
      id: Date.now().toString(),
      date: new Date(maintenanceForm.date),
      type: maintenanceForm.type,
      description: maintenanceForm.description,
      technician: maintenanceForm.technician,
      cost: maintenanceForm.cost ? parseFloat(maintenanceForm.cost) : undefined,
      notes: maintenanceForm.notes
    };

    const updatedEquipment = equipmentList.map(eq => {
      if (eq.id === selectedEquipment.id) {
        return {
          ...eq,
          maintenanceHistory: [newRecord, ...eq.maintenanceHistory],
          lastMaintenance: new Date(maintenanceForm.date)
        };
      }
      return eq;
    });

    setEquipmentList(updatedEquipment);
    setIsMaintenanceDialogOpen(false);
    setMaintenanceForm({
      date: new Date().toISOString().split('T')[0],
      type: '',
      description: '',
      technician: '',
      cost: '',
      notes: ''
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={t("adminSindipro")} />
      <div className="p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with condominium selector */}
          <div className="flex flex-col gap-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">{t("equipmentAndMaintenance")}</h1>
            </div>
            
            <div className="w-full">
              <Select value={selectedCondominium} onValueChange={setSelectedCondominium}>
                <SelectTrigger className="w-full sm:w-[250px]">
                  <Building2 className="w-4 h-4 mr-2" />
                  <SelectValue placeholder={t("selectCondominium")} />
                </SelectTrigger>
                <SelectContent>
                  {condominiums.map(condo => (
                    <SelectItem key={condo.value} value={condo.value}>
                      {condo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats Cards - Responsive Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{t("totalEquipment") || "Total Equipment"}</p>
                    <p className="text-xl sm:text-2xl font-bold">{filteredEquipment.length}</p>
                  </div>
                  <Wrench className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground opacity-50" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{t("operational") || "Operational"}</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-600">
                      {filteredEquipment.filter(eq => eq.status === 'operational').length}
                    </p>
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{t("underMaintenance") || "Under Maintenance"}</p>
                    <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                      {filteredEquipment.filter(eq => eq.status === 'maintenance').length}
                    </p>
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{t("scheduledThisMonth") || "Scheduled This Month"}</p>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">
                      {filteredEquipment.filter(eq => {
                        if (!eq.nextMaintenance) return false;
                        const now = new Date();
                        return eq.nextMaintenance.getMonth() === now.getMonth() && 
                               eq.nextMaintenance.getFullYear() === now.getFullYear();
                      }).length}
                    </p>
                  </div>
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="equipment" className="space-y-4">
            {/* Responsive Tab List */}
            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
              <TabsTrigger value="equipment" className="text-xs sm:text-sm px-2 py-1.5 sm:py-2 data-[state=active]:text-xs sm:data-[state=active]:text-sm">
                <span className="hidden sm:inline">{t("equipmentList") || "Equipment List"}</span>
                <span className="sm:hidden">{t("equipment") || "Equipment"}</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="text-xs sm:text-sm px-2 py-1.5 sm:py-2 data-[state=active]:text-xs sm:data-[state=active]:text-sm">
                <span className="hidden sm:inline">{t("maintenanceSchedule") || "Maintenance Schedule"}</span>
                <span className="sm:hidden">{t("schedule") || "Schedule"}</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs sm:text-sm px-2 py-1.5 sm:py-2 data-[state=active]:text-xs sm:data-[state=active]:text-sm">
                <span className="hidden sm:inline">{t("maintenanceHistory") || "Maintenance History"}</span>
                <span className="sm:hidden">{t("history") || "History"}</span>
              </TabsTrigger>
            </TabsList>

            {/* Equipment List Tab */}
            <TabsContent value="equipment" className="space-y-4">
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="p-2 sm:px-3"
                  >
                    <Grid3x3 className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Grid</span>
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="p-2 sm:px-3"
                  >
                    <List className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">List</span>
                  </Button>
                </div>

                {/* Add Equipment Dialog */}
                <Dialog open={isAddEquipmentOpen} onOpenChange={setIsAddEquipmentOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1 sm:gap-2 px-3 sm:px-4">
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">{t("addEquipment")}</span>
                      <span className="sm:hidden">{t("add") || "Add"}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-base sm:text-lg">{t("addNewEquipment") || "Add New Equipment"}</DialogTitle>
                      <DialogDescription className="text-xs sm:text-sm">
                        {t("fillEquipmentDetails") || "Fill in the equipment details below"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <Label htmlFor="eq-name" className="text-xs sm:text-sm">{t("equipmentName")}</Label>
                          <Input
                            id="eq-name"
                            value={equipmentForm.name}
                            onChange={(e) => setEquipmentForm({...equipmentForm, name: e.target.value})}
                            placeholder={t("equipmentNamePlaceholder")}
                            className="h-8 sm:h-10 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="eq-type" className="text-xs sm:text-sm">{t("equipmentType")}</Label>
                          <Input
                            id="eq-type"
                            value={equipmentForm.type}
                            onChange={(e) => setEquipmentForm({...equipmentForm, type: e.target.value})}
                            placeholder={t("equipmentTypePlaceholder")}
                            className="h-8 sm:h-10 text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <Label htmlFor="eq-location" className="text-xs sm:text-sm">{t("location")}</Label>
                          <Input
                            id="eq-location"
                            value={equipmentForm.location}
                            onChange={(e) => setEquipmentForm({...equipmentForm, location: e.target.value})}
                            placeholder={t("locationPlaceholder")}
                            className="h-8 sm:h-10 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="eq-condominium" className="text-xs sm:text-sm">{t("condominium") || "Condominium"}</Label>
                          <Select 
                            value={equipmentForm.condominium} 
                            onValueChange={(value) => setEquipmentForm({...equipmentForm, condominium: value})}
                          >
                            <SelectTrigger className="h-8 sm:h-10 text-sm">
                              <SelectValue placeholder={t("selectCondominium")} />
                            </SelectTrigger>
                            <SelectContent>
                              {condominiums.slice(1).map(condo => (
                                <SelectItem key={condo.value} value={condo.value}>
                                  {condo.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <Label htmlFor="eq-purchase" className="text-xs sm:text-sm">{t("purchaseDate")}</Label>
                          <Input
                            id="eq-purchase"
                            type="date"
                            value={equipmentForm.purchaseDate}
                            onChange={(e) => setEquipmentForm({...equipmentForm, purchaseDate: e.target.value})}
                            className="h-8 sm:h-10 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="eq-frequency" className="text-xs sm:text-sm">{t("maintenanceFrequency")}</Label>
                          <Select 
                            value={equipmentForm.maintenanceFrequency} 
                            onValueChange={(value) => setEquipmentForm({...equipmentForm, maintenanceFrequency: value})}
                          >
                            <SelectTrigger className="h-8 sm:h-10 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">{t("monthly")}</SelectItem>
                              <SelectItem value="quarterly">{t("quarterly")}</SelectItem>
                              <SelectItem value="semiannual">{t("semiannual")}</SelectItem>
                              <SelectItem value="annual">{t("annual")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium mb-2 text-sm sm:text-base">{t("maintenanceCompanyInfo") || "Maintenance Company Information"}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <Label htmlFor="contractor-name" className="text-xs sm:text-sm">{t("companyName") || "Company Name"}</Label>
                            <Input
                              id="contractor-name"
                              value={equipmentForm.contractorName}
                              onChange={(e) => setEquipmentForm({...equipmentForm, contractorName: e.target.value})}
                              placeholder={t("contractorPlaceholder")}
                              className="h-8 sm:h-10 text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor="contractor-phone" className="text-xs sm:text-sm">{t("companyPhone") || "Company Phone"}</Label>
                            <Input
                              id="contractor-phone"
                              value={equipmentForm.contractorPhone}
                              onChange={(e) => setEquipmentForm({...equipmentForm, contractorPhone: e.target.value})}
                              placeholder="(11) 9999-9999"
                              className="h-8 sm:h-10 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="eq-status" className="text-xs sm:text-sm">{t("status")}</Label>
                        <Select 
                          value={equipmentForm.status} 
                          onValueChange={(value: Equipment['status']) => setEquipmentForm({...equipmentForm, status: value})}
                        >
                          <SelectTrigger className="h-8 sm:h-10 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="operational">{t("operatingNormally") || "Operational"}</SelectItem>
                            <SelectItem value="maintenance">{t("underMaintenance") || "Under Maintenance"}</SelectItem>
                            <SelectItem value="repair">{t("underRepair") || "Under Repair"}</SelectItem>
                            <SelectItem value="inactive">{t("inactive") || "Inactive"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter className="gap-2">
                      <Button 
                        type="submit" 
                        onClick={handleAddEquipment}
                        disabled={!equipmentForm.name || !equipmentForm.type || !equipmentForm.condominium}
                        className="w-full sm:w-auto"
                      >
                        {t("save")}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Equipment Grid/List */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredEquipment.map((equipment) => (
                    <Card key={equipment.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2 sm:pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Wrench className={cn("w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0", getStatusColor(equipment.status).replace('bg-', 'text-'))} />
                            <CardTitle className="text-sm sm:text-base truncate">{equipment.name}</CardTitle>
                          </div>
                          <Badge className={cn("text-[10px] sm:text-xs flex-shrink-0", getStatusColor(equipment.status))}>
                            {getStatusLabel(equipment.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 sm:space-y-3">
                        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building2 className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{equipment.condominium}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{equipment.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{equipment.contractorPhone}</span>
                          </div>
                          {equipment.nextMaintenance && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{t("nextMaintenance")}: {equipment.nextMaintenance.toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] sm:text-xs text-muted-foreground">
                            {equipment.maintenanceHistory.length} {t("maintenanceRecords") || "maintenance records"}
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedEquipment(equipment);
                              setIsMaintenanceDialogOpen(true);
                            }}
                            className="h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs"
                          >
                            <Plus className="w-3 h-3 mr-0.5 sm:mr-1" />
                            <span className="hidden sm:inline">{t("addMaintenance") || "Add Maintenance"}</span>
                            <span className="sm:hidden">{t("add") || "Add"}</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Add Equipment Card */}
                  <Card className="border-2 border-dashed hover:bg-muted/50 cursor-pointer" onClick={() => setIsAddEquipmentOpen(true)}>
                    <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] sm:min-h-[250px]">
                      <Plus className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-muted-foreground" />
                      <span className="text-xs sm:text-sm text-muted-foreground">{t("addEquipment")}</span>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b">
                          <tr>
                            <th className="text-left p-2 sm:p-4 text-xs sm:text-sm">{t("equipment") || "Equipment"}</th>
                            <th className="text-left p-2 sm:p-4 text-xs sm:text-sm hidden md:table-cell">{t("condominium") || "Condominium"}</th>
                            <th className="text-left p-2 sm:p-4 text-xs sm:text-sm hidden lg:table-cell">{t("location")}</th>
                            <th className="text-left p-2 sm:p-4 text-xs sm:text-sm hidden sm:table-cell">{t("contractor") || "Contractor"}</th>
                            <th className="text-left p-2 sm:p-4 text-xs sm:text-sm">{t("status")}</th>
                            <th className="text-left p-2 sm:p-4 text-xs sm:text-sm hidden lg:table-cell">{t("nextMaintenance")}</th>
                            <th className="text-left p-2 sm:p-4 text-xs sm:text-sm">{t("actions") || "Actions"}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredEquipment.map((equipment) => (
                            <tr key={equipment.id} className="border-b hover:bg-muted/50">
                              <td className="p-2 sm:p-4">
                                <div>
                                  <p className="font-medium text-xs sm:text-sm">{equipment.name}</p>
                                  <p className="text-[10px] sm:text-xs text-muted-foreground">{equipment.type}</p>
                                  <p className="text-[10px] sm:text-xs text-muted-foreground md:hidden">{equipment.condominium}</p>
                                </div>
                              </td>
                              <td className="p-2 sm:p-4 hidden md:table-cell text-xs sm:text-sm">{equipment.condominium}</td>
                              <td className="p-2 sm:p-4 hidden lg:table-cell text-xs sm:text-sm">{equipment.location}</td>
                              <td className="p-2 sm:p-4 hidden sm:table-cell">
                                <div>
                                  <p className="text-xs sm:text-sm">{equipment.contractorName}</p>
                                  <p className="text-[10px] sm:text-xs text-muted-foreground">{equipment.contractorPhone}</p>
                                </div>
                              </td>
                              <td className="p-2 sm:p-4">
                                <Badge className={cn("text-[10px] sm:text-xs", getStatusColor(equipment.status))}>
                                  {getStatusLabel(equipment.status)}
                                </Badge>
                              </td>
                              <td className="p-2 sm:p-4 hidden lg:table-cell text-xs sm:text-sm">
                                {equipment.nextMaintenance?.toLocaleDateString()}
                              </td>
                              <td className="p-2 sm:p-4">
                                <div className="flex gap-1 sm:gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedEquipment(equipment);
                                      setIsMaintenanceDialogOpen(true);
                                    }}
                                    className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                  <Button variant="outline" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Maintenance Schedule Tab */}
            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">{t("upcomingMaintenance") || "Upcoming Maintenance"}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {t("scheduledMaintenanceNext30Days") || "Scheduled maintenance for the next 30 days"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] sm:h-[400px]">
                    <div className="space-y-3 sm:space-y-4">
                      {filteredEquipment
                        .filter(eq => eq.nextMaintenance)
                        .sort((a, b) => (a.nextMaintenance?.getTime() || 0) - (b.nextMaintenance?.getTime() || 0))
                        .map((equipment) => {
                          const daysUntil = equipment.nextMaintenance 
                            ? Math.ceil((equipment.nextMaintenance.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                            : 0;
                          
                          return (
                            <div key={equipment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-sm sm:text-base">{equipment.name}</h4>
                                  <Badge variant="outline" className="text-[10px] sm:text-xs">
                                    {equipment.condominium}
                                  </Badge>
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                  {equipment.type} • {equipment.location}
                                </p>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {equipment.contractorPhone}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {equipment.nextMaintenance?.toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <Badge 
                                variant={daysUntil <= 7 ? "destructive" : daysUntil <= 14 ? "default" : "secondary"}
                                className="text-xs self-start sm:self-center"
                              >
                                {daysUntil === 0 ? t("today") : daysUntil === 1 ? t("tomorrow") : `${daysUntil} ${t("days")}`}
                              </Badge>
                            </div>
                          );
                        })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Maintenance History Tab */}
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">{t("maintenanceHistory") || "Maintenance History"}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {t("completeMaintenanceRecords") || "Complete maintenance records for all equipment"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] sm:h-[500px]">
                    <div className="space-y-4 sm:space-y-6">
                      {filteredEquipment.map((equipment) => (
                        <div key={equipment.id} className="space-y-2 sm:space-y-3">
                          <div className="flex items-start sm:items-center justify-between gap-2">
                            <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                              <Wrench className="w-3 h-3 sm:w-4 sm:h-4" />
                              {equipment.name}
                              <Badge variant="outline" className="ml-1 sm:ml-2 text-[10px] sm:text-xs">
                                {equipment.condominium}
                              </Badge>
                            </h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedEquipment(equipment);
                                setIsMaintenanceDialogOpen(true);
                              }}
                              className="h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs"
                            >
                              <Plus className="w-3 h-3 mr-0.5 sm:mr-1" />
                              <span className="hidden sm:inline">{t("addRecord") || "Add Record"}</span>
                              <span className="sm:hidden">{t("add") || "Add"}</span>
                            </Button>
                          </div>
                          
                          {equipment.maintenanceHistory.length > 0 ? (
                            <div className="ml-3 sm:ml-6 space-y-2">
                              {equipment.maintenanceHistory.map((record) => (
                                <div key={record.id} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/50 rounded-lg">
                                  <History className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                  <div className="flex-1 space-y-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                                      <div className="min-w-0">
                                        <p className="font-medium text-xs sm:text-sm">{record.type}</p>
                                        <p className="text-xs sm:text-sm">{record.description}</p>
                                      </div>
                                      <span className="text-[10px] sm:text-xs text-muted-foreground flex-shrink-0">
                                        {record.date.toLocaleDateString()}
                                      </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground">
                                      <span>{t("technician") || "Technician"}: {record.technician}</span>
                                      {record.cost && <span>{t("cost") || "Cost"}: R$ {record.cost.toFixed(2)}</span>}
                                    </div>
                                    {record.notes && (
                                      <p className="text-[10px] sm:text-xs text-muted-foreground italic">{record.notes}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs sm:text-sm text-muted-foreground ml-3 sm:ml-6">
                              {t("noMaintenanceRecords") || "No maintenance records yet"}
                            </p>
                          )}
                          
                          <Separator />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Maintenance Record Dialog */}
          <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
            <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg">
                  {t("addMaintenanceRecord") || "Add Maintenance Record"}
                  {selectedEquipment && (
                    <span className="text-xs sm:text-sm font-normal text-muted-foreground ml-2">
                      for {selectedEquipment.name}
                    </span>
                  )}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  {t("recordMaintenanceDetails") || "Record maintenance details for future reference"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="maintenance-date" className="text-xs sm:text-sm">{t("date") || "Date"}</Label>
                    <Input
                      id="maintenance-date"
                      type="date"
                      value={maintenanceForm.date}
                      onChange={(e) => setMaintenanceForm({...maintenanceForm, date: e.target.value})}
                      className="h-8 sm:h-10 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maintenance-type" className="text-xs sm:text-sm">{t("maintenanceType") || "Maintenance Type"}</Label>
                    <Select
                      value={maintenanceForm.type}
                      onValueChange={(value) => setMaintenanceForm({...maintenanceForm, type: value})}
                    >
                      <SelectTrigger className="h-8 sm:h-10 text-sm">
                        <SelectValue placeholder={t("selectType") || "Select type"} />
                      </SelectTrigger>
                      <SelectContent>
                        {maintenanceTypes.map(type => (
                          <SelectItem key={type.value} value={type.label}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="maintenance-description" className="text-xs sm:text-sm">{t("description") || "Description"}</Label>
                  <Textarea
                    id="maintenance-description"
                    value={maintenanceForm.description}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, description: e.target.value})}
                    placeholder={t("describeMaintenancePerformed") || "Describe the maintenance performed..."}
                    rows={3}
                    className="text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="maintenance-technician" className="text-xs sm:text-sm">{t("technician") || "Technician"}</Label>
                    <Input
                      id="maintenance-technician"
                      value={maintenanceForm.technician}
                      onChange={(e) => setMaintenanceForm({...maintenanceForm, technician: e.target.value})}
                      placeholder={t("technicianName") || "Technician name"}
                      className="h-8 sm:h-10 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maintenance-cost" className="text-xs sm:text-sm">{t("cost") || "Cost (R$)"}</Label>
                    <Input
                      id="maintenance-cost"
                      type="number"
                      step="0.01"
                      value={maintenanceForm.cost}
                      onChange={(e) => setMaintenanceForm({...maintenanceForm, cost: e.target.value})}
                      placeholder="0.00"
                      className="h-8 sm:h-10 text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="maintenance-notes" className="text-xs sm:text-sm">{t("additionalNotes") || "Additional Notes"}</Label>
                  <Textarea
                    id="maintenance-notes"
                    value={maintenanceForm.notes}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, notes: e.target.value})}
                    placeholder={t("anyAdditionalNotes") || "Any additional notes or observations..."}
                    rows={2}
                    className="text-sm"
                  />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  type="submit"
                  onClick={handleAddMaintenanceRecord}
                  disabled={!maintenanceForm.type || !maintenanceForm.description || !maintenanceForm.technician}
                  className="w-full sm:w-auto"
                >
                  {t("saveRecord") || "Save Record"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Related Features Card */}
          <Card className="mt-4 sm:mt-6">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">{t("relatedFeatures")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                    <h3 className="font-semibold text-sm sm:text-base">{t("automaticScheduleReminder")}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t("automaticScheduleReminderDesc")}
                  </p>
                </div>
                <div className="p-3 sm:p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <History className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <h3 className="font-semibold text-sm sm:text-base">{t("maintenanceHistoryTracking")}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t("maintenanceHistoryTrackingDesc")}
                  </p>
                </div>
                <div className="p-3 sm:p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                    <h3 className="font-semibold text-sm sm:text-base">{t("detailedReports") || "Detailed Reports"}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t("detailedReportsDesc") || "Generate comprehensive maintenance reports for compliance and analysis"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}