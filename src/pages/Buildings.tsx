import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Plus, Calculator, Home, Users, Trash2, Edit, Search, Eye } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTranslation } from "react-i18next";
import { useState } from "react";

// Mock data for demonstration
const mockUnits = [
  { 
    id: 1, 
    number: "101", 
    blockName: "A", 
    floor: 1, 
    area: 85.5, 
    keyDelivery: "yes", 
    owner: "João Silva", 
    identification: "residential", 
    depositLocation: "Subsolo", 
    parkingSpaces: 1, 
    idealFraction: 8.5, 
    status: "occupied" 
  },
  { 
    id: 2, 
    number: "102", 
    blockName: "A", 
    floor: 1, 
    area: 90.0, 
    keyDelivery: "yes", 
    owner: "Maria Santos", 
    identification: "residential", 
    depositLocation: "Subsolo", 
    parkingSpaces: 1, 
    idealFraction: 9.0, 
    status: "occupied" 
  },
  { 
    id: 3, 
    number: "201", 
    blockName: "A", 
    floor: 2, 
    area: 85.5, 
    keyDelivery: "no", 
    owner: "", 
    identification: "residential", 
    depositLocation: "Subsolo", 
    parkingSpaces: 1, 
    idealFraction: 8.5, 
    status: "vacant" 
  },
  { 
    id: 4, 
    number: "202", 
    blockName: "A", 
    floor: 2, 
    area: 90.0, 
    keyDelivery: "yes", 
    owner: "Carlos Oliveira", 
    identification: "residential", 
    depositLocation: "Subsolo", 
    parkingSpaces: 1, 
    idealFraction: 9.0, 
    status: "occupied" 
  },
  { 
    id: 5, 
    number: "301", 
    blockName: "A", 
    floor: 3, 
    area: 85.5, 
    keyDelivery: "yes", 
    owner: "Ana Costa", 
    identification: "residential", 
    depositLocation: "Subsolo", 
    parkingSpaces: 1, 
    idealFraction: 8.5, 
    status: "occupied" 
  },
];

export default function Buildings() {
  const { t } = useTranslation();
  const [units, setUnits] = useState(mockUnits);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [isEditingOwner, setIsEditingOwner] = useState(false);
  const [editOwnerName, setEditOwnerName] = useState("");
  
  // Query tab state
  const [queryUnitNumber, setQueryUnitNumber] = useState("");
  const [queryBlockName, setQueryBlockName] = useState("");
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isQueryEditingOwner, setIsQueryEditingOwner] = useState(false);
  const [queryEditOwnerName, setQueryEditOwnerName] = useState("");
  
  // Building address state
  const [cep, setCep] = useState("");
  
  // Building type and composition state
  const [buildingType, setBuildingType] = useState("");
  const [numberOfTowers, setNumberOfTowers] = useState("");
  const [apartmentsPerTower, setApartmentsPerTower] = useState("");
  const [unitsPerTower, setUnitsPerTower] = useState("");
  const [residentialUnits, setResidentialUnits] = useState("");
  const [commercialUnits, setCommercialUnits] = useState("");
  const [studioUnits, setStudioUnits] = useState("");

  // CEP formatting function
  const formatCEP = (value: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // Apply the CEP format: XXXXX-XXX
    if (numericValue.length <= 5) {
      return numericValue;
    } else {
      return `${numericValue.slice(0, 5)}-${numericValue.slice(5, 8)}`;
    }
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCEP = formatCEP(e.target.value);
    setCep(formattedCEP);
  };
  const [newUnit, setNewUnit] = useState({
    number: "",
    blockName: "",
    floor: "",
    area: "",
    keyDelivery: "no",
    owner: "",
    identification: "residential",
    depositLocation: "",
    parkingSpaces: "",
    idealFraction: "",
    status: "vacant"
  });

  const filteredUnits = units.filter(unit => 
    unit.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.blockName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUnit = () => {
    if (newUnit.number && newUnit.blockName && newUnit.floor && newUnit.area && newUnit.depositLocation && newUnit.parkingSpaces && newUnit.idealFraction) {
      const unit = {
        id: Date.now(),
        number: newUnit.number,
        blockName: newUnit.blockName,
        floor: parseInt(newUnit.floor),
        area: parseFloat(newUnit.area),
        keyDelivery: newUnit.keyDelivery,
        owner: newUnit.owner,
        identification: newUnit.identification,
        depositLocation: newUnit.depositLocation,
        parkingSpaces: parseInt(newUnit.parkingSpaces),
        idealFraction: parseFloat(newUnit.idealFraction),
        status: newUnit.status
      };
      setUnits([...units, unit]);
      setNewUnit({
        number: "",
        blockName: "",
        floor: "",
        area: "",
        keyDelivery: "no",
        owner: "",
        identification: "residential",
        depositLocation: "",
        parkingSpaces: "",
        idealFraction: "",
        status: "vacant"
      });
    }
  };

  const handleDeleteUnit = (id: number) => {
    setUnits(units.filter(unit => unit.id !== id));
  };

  const handleSelectUnit = (unit: any) => {
    setSelectedUnit(unit);
    setEditOwnerName(unit.owner);
  };

  const handleSaveOwnerName = () => {
    if (selectedUnit) {
      setUnits(units.map(unit => 
        unit.id === selectedUnit.id 
          ? { ...unit, owner: editOwnerName }
          : unit
      ));
      setSelectedUnit({ ...selectedUnit, owner: editOwnerName });
      setIsEditingOwner(false);
    }
  };

  const handleCancelEdit = () => {
    setEditOwnerName(selectedUnit?.owner || "");
    setIsEditingOwner(false);
  };

  // Query tab functions
  const handleSearchUnit = () => {
    const foundUnit = units.find(unit => 
      unit.number === queryUnitNumber && 
      unit.blockName.toLowerCase() === queryBlockName.toLowerCase()
    );
    setQueryResult(foundUnit || null);
    if (foundUnit) {
      setQueryEditOwnerName(foundUnit.owner);
    }
  };

  const handleClearQuery = () => {
    setQueryUnitNumber("");
    setQueryBlockName("");
    setQueryResult(null);
    setIsQueryEditingOwner(false);
    setQueryEditOwnerName("");
  };

  const handleQuerySaveOwnerName = () => {
    if (queryResult) {
      setUnits(units.map(unit => 
        unit.id === queryResult.id 
          ? { ...unit, owner: queryEditOwnerName }
          : unit
      ));
      setQueryResult({ ...queryResult, owner: queryEditOwnerName });
      setIsQueryEditingOwner(false);
    }
  };

  const handleQueryCancelEdit = () => {
    setQueryEditOwnerName(queryResult?.owner || "");
    setIsQueryEditingOwner(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={t("adminSindipro")} />
      <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{t("basicCondominiumRegistry")}</h1>
          </div>
        </div>

        <Tabs defaultValue="building-info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="building-info" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3">
              <Building2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate">{t("buildingInformation")}</span>
            </TabsTrigger>
            <TabsTrigger value="unit-management" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3">
              <Home className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate">{t("unitManagement")}</span>
            </TabsTrigger>
            <TabsTrigger value="unit-query" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3">
              <Search className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate">{t("query")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="building-info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {t("basicBuildingInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Building Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="building-name">{t("buildingName")}</Label>
                    <Input id="building-name" placeholder={t("enterBuildingName")} />
                  </div>
                  <div>
                    <Label htmlFor="cnpj">{t("cnpj")} *</Label>
                    <Input id="cnpj" placeholder={t("enterCNPJ")} />
                  </div>
                  <div>
                    <Label htmlFor="building-type">{t("buildingType")}</Label>
                    <Select value={buildingType} onValueChange={setBuildingType}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectType")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">{t("residential")}</SelectItem>
                        <SelectItem value="commercial">{t("commercial")}</SelectItem>
                        <SelectItem value="mixed">{t("mixed")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="total-units">{t("numberOfUnits")}</Label>
                    <Input id="total-units" type="number" placeholder="0" />
                  </div>
                </div>

                {/* Dynamic Building Composition Fields */}
                {buildingType && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{t("buildingComposition")}</h3>
                    
                    {buildingType === "residential" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="number-of-towers">{t("numberOfTowers")}</Label>
                          <Input 
                            id="number-of-towers" 
                            type="number" 
                            placeholder={t("enterNumberOfTowers")}
                            value={numberOfTowers}
                            onChange={(e) => setNumberOfTowers(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="apartments-per-tower">{t("apartmentsPerTower")}</Label>
                          <Input 
                            id="apartments-per-tower" 
                            type="number" 
                            placeholder={t("enterApartmentsPerTower")}
                            value={apartmentsPerTower}
                            onChange={(e) => setApartmentsPerTower(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                    
                    {buildingType === "commercial" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="number-of-towers-commercial">{t("numberOfTowers")}</Label>
                          <Input 
                            id="number-of-towers-commercial" 
                            type="number" 
                            placeholder={t("enterNumberOfTowers")}
                            value={numberOfTowers}
                            onChange={(e) => setNumberOfTowers(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="units-per-tower">{t("unitsPerTower")}</Label>
                          <Input 
                            id="units-per-tower" 
                            type="number" 
                            placeholder={t("enterUnitsPerTower")}
                            value={unitsPerTower}
                            onChange={(e) => setUnitsPerTower(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                    
                    {buildingType === "mixed" && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="residential-units">{t("residentialUnits")}</Label>
                          <Input 
                            id="residential-units" 
                            type="number" 
                            placeholder={t("enterResidentialUnits")}
                            value={residentialUnits}
                            onChange={(e) => setResidentialUnits(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="commercial-units">{t("commercialUnits")}</Label>
                          <Input 
                            id="commercial-units" 
                            type="number" 
                            placeholder={t("enterCommercialUnits")}
                            value={commercialUnits}
                            onChange={(e) => setCommercialUnits(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="studio-units">{t("studioUnits")}</Label>
                          <Input 
                            id="studio-units" 
                            type="number" 
                            placeholder={t("enterStudioUnits")}
                            value={studioUnits}
                            onChange={(e) => setStudioUnits(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Full Address Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t("fullAddress")} *</h3>
                  
                  {/* First row - Street and Number */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="street">{t("street")} *</Label>
                      <Input id="street" placeholder={t("enterStreet")} />
                    </div>
                    <div>
                      <Label htmlFor="address-number">{t("addressNumber")} *</Label>
                      <Input id="address-number" placeholder={t("enterAddressNumber")} />
                    </div>
                  </div>
                  
                  {/* Second row - CEP and Neighborhood */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cep">{t("cep")} *</Label>
                      <Input 
                        id="cep" 
                        placeholder={t("enterCEP")} 
                        value={cep}
                        onChange={handleCEPChange}
                        maxLength={9}
                      />
                    </div>
                    <div>
                      <Label htmlFor="neighborhood">{t("neighborhood")} *</Label>
                      <Input id="neighborhood" placeholder={t("enterNeighborhood")} />
                    </div>
                  </div>
                  
                  {/* Third row - City and State */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">{t("city")} *</Label>
                      <Input id="city" placeholder={t("enterCity")} />
                    </div>
                    <div>
                      <Label htmlFor="state">{t("state")} *</Label>
                      <Input id="state" placeholder={t("enterState")} />
                    </div>
                  </div>
                </div>

                <Button className="w-full gap-2">
                  <Plus className="w-4 h-4" />
                  {t("saveSettings")}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unit-management" className="space-y-6">
            {/* Building Type Information */}
            {buildingType && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span>
                      {t("buildingType")}: <strong>{t(buildingType)}</strong>
                      {buildingType === "mixed" && (
                        <span className="ml-2">
                          - {t("residentialUnits")}: {residentialUnits || "0"}, 
                          {t("commercialUnits")}: {commercialUnits || "0"}, 
                          {t("studioUnits")}: {studioUnits || "0"}
                        </span>
                      )}
                      {buildingType === "residential" && numberOfTowers && apartmentsPerTower && (
                        <span className="ml-2">
                          - {numberOfTowers} {t("numberOfTowers")}, {apartmentsPerTower} {t("apartmentsPerTower")}
                        </span>
                      )}
                      {buildingType === "commercial" && numberOfTowers && unitsPerTower && (
                        <span className="ml-2">
                          - {numberOfTowers} {t("numberOfTowers")}, {unitsPerTower} {t("unitsPerTower")}
                        </span>
                      )}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Unit Registration Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  {t("registerNewUnit")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">{t("requiredFields")} *</p>
                  
                  {/* First row - Basic unit info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="unit-number">{t("unitNumber")} *</Label>
                      <Input 
                        id="unit-number" 
                        placeholder={t("unitNumberPlaceholder")} 
                        value={newUnit.number}
                        onChange={(e) => setNewUnit({...newUnit, number: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="block-name">{t("blockName")} *</Label>
                      <Input 
                        id="block-name" 
                        placeholder={t("enterBlockName")} 
                        value={newUnit.blockName}
                        onChange={(e) => setNewUnit({...newUnit, blockName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit-floor">{t("floorNumber")} *</Label>
                      <Input 
                        id="unit-floor" 
                        type="number" 
                        placeholder={t("enterFloorNumber")} 
                        value={newUnit.floor}
                        onChange={(e) => setNewUnit({...newUnit, floor: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Second row - Area and key delivery */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="unit-area">{t("area")} (m²) *</Label>
                      <Input 
                        id="unit-area" 
                        type="number" 
                        step="0.1" 
                        placeholder={t("areaPlaceholder")} 
                        value={newUnit.area}
                        onChange={(e) => setNewUnit({...newUnit, area: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="key-delivery">{t("keyDelivery")} *</Label>
                      <Select value={newUnit.keyDelivery} onValueChange={(value) => setNewUnit({...newUnit, keyDelivery: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectKeyDelivery")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">{t("keyDelivered")}</SelectItem>
                          <SelectItem value="no">{t("keyNotDelivered")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Third row - Owner and identification */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="unit-owner">{t("ownerName")}</Label>
                      <Input 
                        id="unit-owner" 
                        placeholder={t("ownerNameOptional")} 
                        value={newUnit.owner}
                        onChange={(e) => setNewUnit({...newUnit, owner: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="identification">{t("identification")} *</Label>
                      <Select value={newUnit.identification} onValueChange={(value) => setNewUnit({...newUnit, identification: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectIdentification")} />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Show all options for mixed building type */}
                          {buildingType === "mixed" && (
                            <>
                              <SelectItem value="residential">{t("residential")}</SelectItem>
                              <SelectItem value="commercial">{t("commercial")}</SelectItem>
                              <SelectItem value="studio">{t("studio")}</SelectItem>
                              <SelectItem value="non-residential">{t("nonResidential")}</SelectItem>
                              <SelectItem value="wave">{t("wave")}</SelectItem>
                            </>
                          )}
                          {/* Show residential options for residential building type */}
                          {buildingType === "residential" && (
                            <>
                              <SelectItem value="residential">{t("residential")}</SelectItem>
                              <SelectItem value="studio">{t("studio")}</SelectItem>
                              <SelectItem value="wave">{t("wave")}</SelectItem>
                            </>
                          )}
                          {/* Show commercial options for commercial building type */}
                          {buildingType === "commercial" && (
                            <>
                              <SelectItem value="commercial">{t("commercial")}</SelectItem>
                              <SelectItem value="non-residential">{t("nonResidential")}</SelectItem>
                            </>
                          )}
                          {/* Show all options when no building type is selected */}
                          {!buildingType && (
                            <>
                              <SelectItem value="residential">{t("residential")}</SelectItem>
                              <SelectItem value="non-residential">{t("nonResidential")}</SelectItem>
                              <SelectItem value="commercial">{t("commercial")}</SelectItem>
                              <SelectItem value="studio">{t("studio")}</SelectItem>
                              <SelectItem value="wave">{t("wave")}</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Fourth row - Deposit and parking */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deposit-location">{t("depositLocation")} *</Label>
                      <Input 
                        id="deposit-location" 
                        placeholder={t("enterDepositLocation")} 
                        value={newUnit.depositLocation}
                        onChange={(e) => setNewUnit({...newUnit, depositLocation: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="parking-spaces">{t("parkingSpacesByApartment")} *</Label>
                      <Input 
                        id="parking-spaces" 
                        type="number" 
                        placeholder={t("enterParkingSpaces")} 
                        value={newUnit.parkingSpaces}
                        onChange={(e) => setNewUnit({...newUnit, parkingSpaces: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Fifth row - Ideal fraction and status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ideal-fraction">{t("idealFraction")} *</Label>
                      <Input 
                        id="ideal-fraction" 
                        type="number" 
                        step="0.01" 
                        placeholder={t("enterIdealFraction")} 
                        value={newUnit.idealFraction}
                        onChange={(e) => setNewUnit({...newUnit, idealFraction: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit-status">{t("status")}</Label>
                      <Select value={newUnit.status} onValueChange={(value) => setNewUnit({...newUnit, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="occupied">{t("occupied")}</SelectItem>
                          <SelectItem value="vacant">{t("vacant")}</SelectItem>
                          <SelectItem value="maintenance">{t("underMaintenance")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <Button onClick={handleAddUnit} className="mt-4 gap-2">
                  <Plus className="w-4 h-4" />
                  {t("addUnit")}
                </Button>
              </CardContent>
            </Card>

            {/* Excel Import Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  {t("importUnits")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t("importFromExcel")} - {t("requiredFields")}: {t("unitNumber")}, {t("blockName")}, {t("floorNumber")}, {t("area")}, {t("keyDelivery")}, {t("ownerName")}, {t("identification")}, {t("depositLocation")}, {t("parkingSpacesByApartment")}, {t("idealFraction")}
                  </p>
                  <div className="flex gap-4">
                    <Button variant="outline" className="gap-2">
                      <Calculator className="w-4 h-4" />
                      {t("downloadTemplate")}
                    </Button>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      {t("uploadExcelFile")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Units List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  {t("registeredUnits")} ({units.length})
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("searchByUnitOrBlock")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredUnits.map((unit) => (
                    <div key={unit.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Home className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                          <span className="text-sm sm:text-base font-semibold">{t("unit")} {unit.number} - {t("block")} {unit.blockName}</span>
                          <Badge variant={unit.status === 'occupied' ? 'default' : unit.status === 'vacant' ? 'secondary' : 'destructive'} className="text-xs">
                            {unit.status}
                          </Badge>
                          <Badge variant={unit.keyDelivery === 'yes' ? 'default' : 'secondary'} className="text-xs">
                            {unit.keyDelivery === 'yes' ? t("keyDelivered") : t("keyNotDelivered")}
                          </Badge>
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          {t("floorNumber")} {unit.floor} • {unit.area}m² • {t(unit.identification)} • {unit.idealFraction}% • {unit.parkingSpaces} {t("parkingSpaces")}
                        </div>
                        {unit.owner && (
                          <div className="flex items-center gap-1 text-xs sm:text-sm">
                            <Users className="w-2 h-2 sm:w-3 sm:h-3" />
                            {unit.owner}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 self-end sm:self-auto">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleSelectUnit(unit)} className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                              <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{t("unitDetails")} - {t("unit")} {unit.number}</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4">
                              <div>
                                <Label className="text-sm font-medium">{t("unitNumber")}</Label>
                                <p className="text-sm">{unit.number}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">{t("blockName")}</Label>
                                <p className="text-sm">{unit.blockName}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">{t("floorNumber")}</Label>
                                <p className="text-sm">{unit.floor}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">{t("area")} (m²)</Label>
                                <p className="text-sm">{unit.area}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">{t("keyDelivery")}</Label>
                                <p className="text-sm">{unit.keyDelivery === 'yes' ? t("keyDelivered") : t("keyNotDelivered")}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">{t("identification")}</Label>
                                <p className="text-sm">{t(unit.identification)}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">{t("depositLocation")}</Label>
                                <p className="text-sm">{unit.depositLocation}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">{t("parkingSpacesByApartment")}</Label>
                                <p className="text-sm">{unit.parkingSpaces}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">{t("idealFraction")}</Label>
                                <p className="text-sm">{unit.idealFraction}%</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">{t("status")}</Label>
                                <p className="text-sm">{t(unit.status)}</p>
                              </div>
                              <div className="col-span-2">
                                <Label className="text-sm font-medium">{t("ownerName")}</Label>
                                {isEditingOwner ? (
                                  <div className="flex gap-2 mt-1">
                                    <Input
                                      value={editOwnerName}
                                      onChange={(e) => setEditOwnerName(e.target.value)}
                                      placeholder={t("ownerNameOptional")}
                                    />
                                    <Button size="sm" onClick={handleSaveOwnerName}>
                                      {t("save")}
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                      {t("cancel")}
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 mt-1">
                                    <p className="text-sm">{unit.owner || t("noOwnerSet")}</p>
                                    <Button size="sm" variant="outline" onClick={() => setIsEditingOwner(true)}>
                                      <Edit className="w-3 h-3" />
                                      {t("editOwnerName")}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteUnit(unit.id)} className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                          <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {filteredUnits.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchTerm ? t("noUnitsFoundSearch") : t("noUnitsRegisteredYet")}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unit-query" className="space-y-6">
            {/* Unit Search Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  {t("unitQuery")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t("searchByUnitOrBlock")}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="query-unit-number">{t("unitNumber")} *</Label>
                      <Input 
                        id="query-unit-number" 
                        placeholder={t("enterUnitNumber")} 
                        value={queryUnitNumber}
                        onChange={(e) => setQueryUnitNumber(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="query-block-name">{t("blockName")} *</Label>
                      <Input 
                        id="query-block-name" 
                        placeholder={t("enterBlockNumber")} 
                        value={queryBlockName}
                        onChange={(e) => setQueryBlockName(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button 
                        onClick={handleSearchUnit}
                        className="gap-2"
                        disabled={!queryUnitNumber || !queryBlockName}
                      >
                        <Search className="w-4 h-4" />
                        {t("searchButton")}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleClearQuery}
                        className="gap-2"
                      >
                        {t("clearSearch")}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Query Results */}
            {queryResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    {t("unitFound")} - {t("unit")} {queryResult.number}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Unit Information - Read Only */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">{t("unitDetails")}</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">{t("unitNumber")}</Label>
                          <p className="text-sm font-medium">{queryResult.number}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">{t("blockName")}</Label>
                          <p className="text-sm font-medium">{queryResult.blockName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">{t("floorNumber")}</Label>
                          <p className="text-sm font-medium">{queryResult.floor}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">{t("area")} (m²)</Label>
                          <p className="text-sm font-medium">{queryResult.area}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">{t("keyDelivery")}</Label>
                          <Badge variant={queryResult.keyDelivery === 'yes' ? 'default' : 'secondary'} className="w-fit">
                            {queryResult.keyDelivery === 'yes' ? t("keyDelivered") : t("keyNotDelivered")}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">{t("identification")}</Label>
                          <p className="text-sm font-medium">{t(queryResult.identification)}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">{t("depositLocation")}</Label>
                          <p className="text-sm font-medium">{queryResult.depositLocation}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">{t("parkingSpacesByApartment")}</Label>
                          <p className="text-sm font-medium">{queryResult.parkingSpaces}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">{t("idealFraction")}</Label>
                          <p className="text-sm font-medium">{queryResult.idealFraction}%</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">{t("status")}</Label>
                          <Badge variant={queryResult.status === 'occupied' ? 'default' : queryResult.status === 'vacant' ? 'secondary' : 'destructive'}>
                            {t(queryResult.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Owner Information - Editable */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">{t("ownerName")}</h3>
                      
                      <div className="p-4 border rounded-lg">
                        {isQueryEditingOwner ? (
                          <div className="space-y-3">
                            <Label htmlFor="query-owner-name">{t("ownerName")}</Label>
                            <Input
                              id="query-owner-name"
                              value={queryEditOwnerName}
                              onChange={(e) => setQueryEditOwnerName(e.target.value)}
                              placeholder={t("ownerNameOptional")}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleQuerySaveOwnerName}>
                                {t("save")}
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleQueryCancelEdit}>
                                {t("cancel")}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-muted-foreground">{t("ownerName")}</Label>
                            <p className="text-sm font-medium">{queryResult.owner || t("noOwnerSet")}</p>
                            <Button size="sm" variant="outline" onClick={() => setIsQueryEditingOwner(true)} className="gap-2">
                              <Edit className="w-3 h-3" />
                              {t("editOwnerName")}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No Results Message */}
            {queryUnitNumber && queryBlockName && queryResult === null && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">{t("unitNotFound")}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t("unit")}: {queryUnitNumber} | {t("block")}: {queryBlockName}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t("relatedFeatures")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  {t("unitRegistrationSystem")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("comprehensiveUnitManagement")}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t("initialConfigSelection")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("initialConfigSelectionDesc")}
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