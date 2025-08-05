import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Building2, Plus, Calculator, Home, Users, Trash2, Edit, Search, Eye } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { buildingApi, BuildingData, ApiError } from "@/lib/building";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockUnits = [
  { 
    id: 1, 
    number: "101", 
    blockName: "A", 
    floor: 1, 
    area: 85.500, 
    keyDelivery: "yes", 
    owner: "João Silva", 
    identification: "residential", 
    hasDeposit: "yes",
    depositLocation: "Subsolo", 
    parkingSpaces: 1, 
    idealFraction: 8.500000, 
    status: "occupied" 
  },
  { 
    id: 2, 
    number: "102", 
    blockName: "A", 
    floor: 1, 
    area: 90.000, 
    keyDelivery: "yes", 
    owner: "Maria Santos", 
    identification: "residential", 
    hasDeposit: "yes",
    depositLocation: "Subsolo", 
    parkingSpaces: 1, 
    idealFraction: 9.000000, 
    status: "occupied" 
  },
  { 
    id: 3, 
    number: "201", 
    blockName: "A", 
    floor: 2, 
    area: 85.500, 
    keyDelivery: "no", 
    owner: "", 
    identification: "residential", 
    hasDeposit: "no",
    depositLocation: "", 
    parkingSpaces: 1, 
    idealFraction: 8.500000, 
    status: "vacant" 
  },
  { 
    id: 4, 
    number: "202", 
    blockName: "A", 
    floor: 2, 
    area: 90.000, 
    keyDelivery: "yes", 
    owner: "Carlos Oliveira", 
    identification: "residential", 
    hasDeposit: "yes",
    depositLocation: "Subsolo", 
    parkingSpaces: 1, 
    idealFraction: 9.000000, 
    status: "occupied" 
  },
  { 
    id: 5, 
    number: "301", 
    blockName: "A", 
    floor: 3, 
    area: 85.500, 
    keyDelivery: "yes", 
    owner: "Ana Costa", 
    identification: "residential", 
    hasDeposit: "yes",
    depositLocation: "Subsolo", 
    parkingSpaces: 1, 
    idealFraction: 8.500000, 
    status: "occupied" 
  },
];

export default function Buildings() {
  const { t } = useTranslation();
  const { toast } = useToast();
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
  const [cnpj, setCnpj] = useState("");
  
  // Building type and composition state
  const [buildingType, setBuildingType] = useState("");
  const [numberOfTowers, setNumberOfTowers] = useState("");
  const [apartmentsPerTower, setApartmentsPerTower] = useState("");
  const [unitsPerTower, setUnitsPerTower] = useState("");
  const [residentialUnits, setResidentialUnits] = useState("");
  const [commercialUnits, setCommercialUnits] = useState("");
  const [studioUnits, setStudioUnits] = useState("");
  const [nonResidentialUnits, setNonResidentialUnits] = useState("");
  const [waveUnits, setWaveUnits] = useState("");
  const [towerNames, setTowerNames] = useState<string[]>([]);
  const [unitsPerTowerArray, setUnitsPerTowerArray] = useState<string[]>([]);
  
  // Manager information state
  const [managerName, setManagerName] = useState("");
  const [managerPhone, setManagerPhone] = useState("");
  const [managerPhoneType, setManagerPhoneType] = useState("mobile");
  
  // Mixed building address state
  const [useSeparateAddress, setUseSeparateAddress] = useState(false);
  
  // Additional form states for Building Information
  const [buildingName, setBuildingName] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const [street, setStreet] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  
  // Alternative address states for mixed buildings
  const [altStreet, setAltStreet] = useState("");
  const [altAddressNumber, setAltAddressNumber] = useState("");
  const [altCep, setAltCep] = useState("");
  const [altNeighborhood, setAltNeighborhood] = useState("");
  const [altCity, setAltCity] = useState("");
  const [altState, setAltState] = useState("");
  
  // Loading state for API call
  const [isSaving, setIsSaving] = useState(false);

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

  // CNPJ formatting function
  const formatCNPJ = (value: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // Apply the CNPJ format: XX.XXX.XXX/XXXX-XX
    if (numericValue.length <= 2) {
      return numericValue;
    } else if (numericValue.length <= 5) {
      return `${numericValue.slice(0, 2)}.${numericValue.slice(2)}`;
    } else if (numericValue.length <= 8) {
      return `${numericValue.slice(0, 2)}.${numericValue.slice(2, 5)}.${numericValue.slice(5)}`;
    } else if (numericValue.length <= 12) {
      return `${numericValue.slice(0, 2)}.${numericValue.slice(2, 5)}.${numericValue.slice(5, 8)}/${numericValue.slice(8)}`;
    } else {
      return `${numericValue.slice(0, 2)}.${numericValue.slice(2, 5)}.${numericValue.slice(5, 8)}/${numericValue.slice(8, 12)}-${numericValue.slice(12, 14)}`;
    }
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCNPJ = formatCNPJ(e.target.value);
    setCnpj(formattedCNPJ);
  };

  // Phone formatting function for Brazilian phones
  const formatBrazilianPhone = (value: string, type: string) => {
    const numericValue = value.replace(/\D/g, '');
    
    if (type === 'mobile') {
      // Mobile: 55 (11) 98910-0000
      if (numericValue.length <= 2) {
        return numericValue;
      } else if (numericValue.length <= 4) {
        return `${numericValue.slice(0, 2)} (${numericValue.slice(2)}`;
      } else if (numericValue.length <= 9) {
        return `${numericValue.slice(0, 2)} (${numericValue.slice(2, 4)}) ${numericValue.slice(4)}`;
      } else if (numericValue.length <= 13) {
        return `${numericValue.slice(0, 2)} (${numericValue.slice(2, 4)}) ${numericValue.slice(4, 9)}-${numericValue.slice(9)}`;
      } else {
        return `${numericValue.slice(0, 2)} (${numericValue.slice(2, 4)}) ${numericValue.slice(4, 9)}-${numericValue.slice(9, 13)}`;
      }
    } else {
      // Landline: 3083-6749
      if (numericValue.length <= 4) {
        return numericValue;
      } else {
        return `${numericValue.slice(0, 4)}-${numericValue.slice(4, 8)}`;
      }
    }
  };

  const handleManagerPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatBrazilianPhone(e.target.value, managerPhoneType);
    setManagerPhone(formattedPhone);
  };

  // Area formatting with 3 decimal places
  const formatArea = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num) ? value : num.toFixed(3);
  };

  // Ideal fraction formatting with 6 decimal places
  const formatIdealFraction = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num) ? value : num.toFixed(6);
  };
  const [newUnit, setNewUnit] = useState({
    number: "",
    blockName: "",
    floor: "",
    area: "",
    keyDelivery: "no",
    owner: "",
    ownerPhone: "",
    identification: "residential",
    hasDeposit: "no",
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
    const depositRequired = newUnit.hasDeposit === "yes" ? newUnit.depositLocation : true;
    if (newUnit.number && newUnit.owner && newUnit.ownerPhone && (parseInt(numberOfTowers) > 1 ? newUnit.blockName : true) && newUnit.floor && newUnit.area && depositRequired && newUnit.parkingSpaces && newUnit.idealFraction) {
      const unit = {
        id: Date.now(),
        number: newUnit.number,
        blockName: newUnit.blockName,
        floor: parseInt(newUnit.floor),
        area: parseFloat(newUnit.area),
        keyDelivery: newUnit.keyDelivery,
        owner: newUnit.owner,
        ownerPhone: newUnit.ownerPhone,
        identification: newUnit.identification,
        hasDeposit: newUnit.hasDeposit,
        depositLocation: newUnit.hasDeposit === "yes" ? newUnit.depositLocation : "",
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
        ownerPhone: "",
        identification: "residential",
        hasDeposit: "no",
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
  
  // Handle Save Settings API call using professional API service
  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Collect all form data using the BuildingData interface
      const buildingData: BuildingData = {
        buildingName,
        cnpj,
        buildingType: buildingType as 'residential' | 'commercial' | 'mixed',
        totalUnits: totalUnits ? parseInt(totalUnits) : undefined,
        numberOfTowers: numberOfTowers ? parseInt(numberOfTowers) : undefined,
        apartmentsPerTower: apartmentsPerTower ? parseInt(apartmentsPerTower) : undefined,
        unitsPerTower: unitsPerTower ? parseInt(unitsPerTower) : undefined,
        residentialUnits: residentialUnits ? parseInt(residentialUnits) : undefined,
        commercialUnits: commercialUnits ? parseInt(commercialUnits) : undefined,
        studioUnits: studioUnits ? parseInt(studioUnits) : undefined,
        nonResidentialUnits: nonResidentialUnits ? parseInt(nonResidentialUnits) : undefined,
        waveUnits: waveUnits ? parseInt(waveUnits) : undefined,
        towerNames: towerNames.filter(name => name.trim() !== ""),
        unitsPerTowerArray: unitsPerTowerArray.map(units => units ? parseInt(units) : 0),
        managerName,
        managerPhone,
        managerPhoneType: managerPhoneType as 'mobile' | 'landline',
        address: {
          street,
          number: addressNumber,
          cep,
          neighborhood,
          city,
          state
        },
        // Include alternative address if mixed building and separate address is used
        ...(buildingType === "mixed" && useSeparateAddress && {
          alternativeAddress: {
            street: altStreet,
            number: altAddressNumber,
            cep: altCep,
            neighborhood: altNeighborhood,
            city: altCity,
            state: altState
          }
        }),
        useSeparateAddress: buildingType === "mixed" ? useSeparateAddress : false
      };
      
      // Use the professional API service
      const result = await buildingApi.createBuilding(buildingData);
      
      console.log('Building data saved successfully:', result);
      
      // Show success toast notification
      toast({
        title: "Success!",
        description: `Building information saved successfully! Building ID: ${result.id}`,
        variant: "default",
      });
      
      // Optionally reset form or redirect
      // resetForm();
      
    } catch (error) {
      console.error('Error saving building data:', error);
      
      if (error instanceof ApiError) {
        // Handle specific API errors with toast notifications
        switch (error.code) {
          case 'VALIDATION_ERROR':
            console.log('Validation error details:', error.details);
            toast({
              title: "Validation Error",
              description: error.message,
              variant: "destructive",
            });
            break;
          case 'NETWORK_ERROR':
            toast({
              title: "Network Error",
              description: "Please check your connection and try again.",
              variant: "destructive",
            });
            break;
          default:
            toast({
              title: "Error",
              description: error.message || "An error occurred while saving. Please try again.",
              variant: "destructive",
            });
        }
      } else {
        // Handle unexpected errors
        toast({
          title: "Unexpected Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSaving(false);
    }
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
                    <Input 
                      id="building-name" 
                      placeholder={t("enterBuildingName")} 
                      value={buildingName}
                      onChange={(e) => setBuildingName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cnpj">{t("cnpj")} *</Label>
                    <Input 
                      id="cnpj" 
                      placeholder="00.000.000/0000-00" 
                      value={cnpj}
                      onChange={handleCNPJChange}
                      maxLength={18}
                    />
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
                    <Input 
                      id="total-units" 
                      type="number" 
                      placeholder="0" 
                      value={totalUnits}
                      onChange={(e) => setTotalUnits(e.target.value)}
                    />
                  </div>
                </div>

                {/* Dynamic Building Composition Fields */}
                {buildingType && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{t("buildingComposition")}</h3>
                    
                    {buildingType === "residential" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="number-of-towers">{t("numberOfTowers")}</Label>
                            <Input 
                              id="number-of-towers" 
                              type="number" 
                              placeholder={t("enterNumberOfTowers")}
                              value={numberOfTowers}
                              onChange={(e) => {
                                const value = e.target.value;
                                setNumberOfTowers(value);
                                const num = parseInt(value) || 0;
                                if (num > 1) {
                                  setTowerNames(Array(num).fill("").map((_, i) => towerNames[i] || ""));
                                  setUnitsPerTowerArray(Array(num).fill("").map((_, i) => unitsPerTowerArray[i] || ""));
                                } else {
                                  setTowerNames([]);
                                  setUnitsPerTowerArray([]);
                                }
                              }}
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
                        
                        {/* Tower naming section - only show when more than 1 tower */}
                        {parseInt(numberOfTowers) > 1 && (
                          <div className="space-y-3">
                            <Label className="text-sm font-semibold">{t("towerDetails")}</Label>
                            <div className="grid grid-cols-1 gap-4">
                              {towerNames.map((name, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded-lg">
                                  <div>
                                    <Label htmlFor={`tower-name-${index}`} className="text-xs text-muted-foreground">
                                      {t("tower")} {index + 1} - {t("name")}
                                    </Label>
                                    <Input
                                      id={`tower-name-${index}`}
                                      placeholder={`${t("tower")} ${String.fromCharCode(65 + index)}`}
                                      value={name}
                                      onChange={(e) => {
                                        const newNames = [...towerNames];
                                        newNames[index] = e.target.value;
                                        setTowerNames(newNames);
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`tower-units-${index}`} className="text-xs text-muted-foreground">
                                      {t("numberOfUnits")}
                                    </Label>
                                    <Input
                                      id={`tower-units-${index}`}
                                      type="number"
                                      placeholder={t("enterNumberOfUnits")}
                                      value={unitsPerTowerArray[index] || ""}
                                      onChange={(e) => {
                                        const newUnits = [...unitsPerTowerArray];
                                        newUnits[index] = e.target.value;
                                        setUnitsPerTowerArray(newUnits);
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {buildingType === "commercial" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="number-of-towers-commercial">{t("numberOfTowers")}</Label>
                            <Input 
                              id="number-of-towers-commercial" 
                              type="number" 
                              placeholder={t("enterNumberOfTowers")}
                              value={numberOfTowers}
                              onChange={(e) => {
                                const value = e.target.value;
                                setNumberOfTowers(value);
                                const num = parseInt(value) || 0;
                                if (num > 1) {
                                  setTowerNames(Array(num).fill("").map((_, i) => towerNames[i] || ""));
                                  setUnitsPerTowerArray(Array(num).fill("").map((_, i) => unitsPerTowerArray[i] || ""));
                                } else {
                                  setTowerNames([]);
                                  setUnitsPerTowerArray([]);
                                }
                              }}
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
                        
                        {/* Tower naming section - only show when more than 1 tower */}
                        {parseInt(numberOfTowers) > 1 && (
                          <div className="space-y-3">
                            <Label className="text-sm font-semibold">{t("towerDetails")}</Label>
                            <div className="grid grid-cols-1 gap-4">
                              {towerNames.map((name, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded-lg">
                                  <div>
                                    <Label htmlFor={`tower-name-commercial-${index}`} className="text-xs text-muted-foreground">
                                      {t("tower")} {index + 1} - {t("name")}
                                    </Label>
                                    <Input
                                      id={`tower-name-commercial-${index}`}
                                      placeholder={`${t("tower")} ${String.fromCharCode(65 + index)}`}
                                      value={name}
                                      onChange={(e) => {
                                        const newNames = [...towerNames];
                                        newNames[index] = e.target.value;
                                        setTowerNames(newNames);
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`tower-units-commercial-${index}`} className="text-xs text-muted-foreground">
                                      {t("numberOfUnits")}
                                    </Label>
                                    <Input
                                      id={`tower-units-commercial-${index}`}
                                      type="number"
                                      placeholder={t("enterNumberOfUnits")}
                                      value={unitsPerTowerArray[index] || ""}
                                      onChange={(e) => {
                                        const newUnits = [...unitsPerTowerArray];
                                        newUnits[index] = e.target.value;
                                        setUnitsPerTowerArray(newUnits);
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {buildingType === "mixed" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="number-of-towers-mixed">{t("numberOfTowers")}</Label>
                            <Input 
                              id="number-of-towers-mixed" 
                              type="number" 
                              placeholder={t("enterNumberOfTowers")}
                              value={numberOfTowers}
                              onChange={(e) => {
                                const value = e.target.value;
                                setNumberOfTowers(value);
                                const num = parseInt(value) || 0;
                                if (num > 1) {
                                  setTowerNames(Array(num).fill("").map((_, i) => towerNames[i] || ""));
                                  setUnitsPerTowerArray(Array(num).fill("").map((_, i) => unitsPerTowerArray[i] || ""));
                                } else {
                                  setTowerNames([]);
                                  setUnitsPerTowerArray([]);
                                }
                              }}
                            />
                          </div>
                        </div>
                        
                        {/* Tower naming section - only show when more than 1 tower */}
                        {parseInt(numberOfTowers) > 1 && (
                          <div className="space-y-3">
                            <Label className="text-sm font-semibold">{t("towerDetails")}</Label>
                            <div className="grid grid-cols-1 gap-4">
                              {towerNames.map((name, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded-lg">
                                  <div>
                                    <Label htmlFor={`tower-name-mixed-${index}`} className="text-xs text-muted-foreground">
                                      {t("tower")} {index + 1} - {t("name")}
                                    </Label>
                                    <Input
                                      id={`tower-name-mixed-${index}`}
                                      placeholder={`${t("tower")} ${String.fromCharCode(65 + index)}`}
                                      value={name}
                                      onChange={(e) => {
                                        const newNames = [...towerNames];
                                        newNames[index] = e.target.value;
                                        setTowerNames(newNames);
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`tower-units-mixed-${index}`} className="text-xs text-muted-foreground">
                                      {t("numberOfUnits")}
                                    </Label>
                                    <Input
                                      id={`tower-units-mixed-${index}`}
                                      type="number"
                                      placeholder={t("enterNumberOfUnits")}
                                      value={unitsPerTowerArray[index] || ""}
                                      onChange={(e) => {
                                        const newUnits = [...unitsPerTowerArray];
                                        newUnits[index] = e.target.value;
                                        setUnitsPerTowerArray(newUnits);
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-6">
                          {/* Unit type distribution per tower */}
                          {towerNames.length > 0 && (
                            <div className="space-y-4">
                              <Label className="text-sm font-semibold">{t("unitDistributionPerTower")}</Label>
                              {towerNames.map((towerName, towerIndex) => (
                                <div key={towerIndex} className="p-4 border rounded-lg bg-muted/10">
                                  <h4 className="font-medium mb-3">
                                    {towerName || `${t("tower")} ${String.fromCharCode(65 + towerIndex)}`}
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                                    <div>
                                      <Label htmlFor={`residential-units-${towerIndex}`} className="text-xs">{t("residentialUnits")}</Label>
                                      <Input 
                                        id={`residential-units-${towerIndex}`}
                                        type="number" 
                                        placeholder="0"
                                        className="h-8 text-sm"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`commercial-units-${towerIndex}`} className="text-xs">{t("commercialUnits")}</Label>
                                      <Input 
                                        id={`commercial-units-${towerIndex}`}
                                        type="number" 
                                        placeholder="0"
                                        className="h-8 text-sm"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`studio-units-${towerIndex}`} className="text-xs">{t("studioUnits")}</Label>
                                      <Input 
                                        id={`studio-units-${towerIndex}`}
                                        type="number" 
                                        placeholder="0"
                                        className="h-8 text-sm"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`non-residential-units-${towerIndex}`} className="text-xs">{t("nonResidentialUnits")}</Label>
                                      <Input 
                                        id={`non-residential-units-${towerIndex}`}
                                        type="number" 
                                        placeholder="0"
                                        className="h-8 text-sm"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`wave-units-${towerIndex}`} className="text-xs">{t("waveUnits")}</Label>
                                      <Input 
                                        id={`wave-units-${towerIndex}`}
                                        type="number" 
                                        placeholder="0"
                                        className="h-8 text-sm"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Overall totals */}
                          <div className="space-y-3">
                            <Label className="text-sm font-semibold">{t("overallTotals")}</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                              <div>
                                <Label htmlFor="non-residential-units">{t("nonResidentialUnits")}</Label>
                                <Input 
                                  id="non-residential-units" 
                                  type="number" 
                                  placeholder={t("enterNonResidentialUnits")}
                                  value={nonResidentialUnits}
                                  onChange={(e) => setNonResidentialUnits(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="wave-units">{t("waveUnits")}</Label>
                                <Input 
                                  id="wave-units" 
                                  type="number" 
                                  placeholder={t("enterWaveUnits")}
                                  value={waveUnits}
                                  onChange={(e) => setWaveUnits(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Manager Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t("managerInformation")} *</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="manager-name">{t("managerName")} *</Label>
                      <Input 
                        id="manager-name" 
                        placeholder={t("enterManagerName")} 
                        value={managerName}
                        onChange={(e) => setManagerName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone-type">{t("phoneType")} *</Label>
                      <Select value={managerPhoneType} onValueChange={setManagerPhoneType}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectPhoneType")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mobile">{t("mobile")}</SelectItem>
                          <SelectItem value="landline">{t("landline")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="manager-phone">{t("managerPhone")} *</Label>
                      <Input 
                        id="manager-phone" 
                        placeholder={managerPhoneType === 'mobile' ? '55 (11) 98910-0000' : '3083-6749'} 
                        value={managerPhone}
                        onChange={handleManagerPhoneChange}
                        maxLength={managerPhoneType === 'mobile' ? 18 : 9}
                      />
                    </div>
                  </div>
                </div>

                {/* Full Address Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t("fullAddress")} *</h3>
                  
                  {/* Mixed building separate address option */}
                  {buildingType === "mixed" && (
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="separate-address" 
                        checked={useSeparateAddress}
                        onChange={(e) => setUseSeparateAddress(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="separate-address" className="text-sm">
                        {t("useSeparateAddressForMixed")}
                      </Label>
                    </div>
                  )}
                  
                  {/* First row - Street and Number */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="street">{t("street")} *</Label>
                      <Input 
                        id="street" 
                        placeholder={t("enterStreet")} 
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address-number">{t("addressNumber")} *</Label>
                      <Input 
                        id="address-number" 
                        placeholder={t("enterAddressNumber")} 
                        value={addressNumber}
                        onChange={(e) => setAddressNumber(e.target.value)}
                      />
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
                      <Input 
                        id="neighborhood" 
                        placeholder={t("enterNeighborhood")} 
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* Third row - City and State */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">{t("city")} *</Label>
                      <Input 
                        id="city" 
                        placeholder={t("enterCity")} 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">{t("state")} *</Label>
                      <Input 
                        id="state" 
                        placeholder={t("enterState")} 
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* Separate address for mixed buildings */}
                  {buildingType === "mixed" && useSeparateAddress && (
                    <div className="space-y-4 mt-6 p-4 border rounded-lg bg-muted/20">
                      <h4 className="text-md font-semibold">{t("alternativeAddress")}</h4>
                      
                      {/* Alternative Street and Number */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="alt-street">{t("street")}</Label>
                          <Input 
                            id="alt-street" 
                            placeholder={t("enterStreet")} 
                            value={altStreet}
                            onChange={(e) => setAltStreet(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="alt-address-number">{t("addressNumber")}</Label>
                          <Input 
                            id="alt-address-number" 
                            placeholder={t("enterAddressNumber")} 
                            value={altAddressNumber}
                            onChange={(e) => setAltAddressNumber(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      {/* Alternative CEP and Neighborhood */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="alt-cep">{t("cep")}</Label>
                          <Input 
                            id="alt-cep" 
                            placeholder={t("enterCEP")} 
                            maxLength={9} 
                            value={altCep}
                            onChange={(e) => setAltCep(formatCEP(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="alt-neighborhood">{t("neighborhood")}</Label>
                          <Input 
                            id="alt-neighborhood" 
                            placeholder={t("enterNeighborhood")} 
                            value={altNeighborhood}
                            onChange={(e) => setAltNeighborhood(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      {/* Alternative City and State */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="alt-city">{t("city")}</Label>
                          <Input 
                            id="alt-city" 
                            placeholder={t("enterCity")} 
                            value={altCity}
                            onChange={(e) => setAltCity(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="alt-state">{t("state")}</Label>
                          <Input 
                            id="alt-state" 
                            placeholder={t("enterState")} 
                            value={altState}
                            onChange={(e) => setAltState(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full gap-2" 
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                >
                  <Plus className="w-4 h-4" />
                  {isSaving ? "Saving..." : t("saveSettings")}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="unit-number">{t("unitNumber")} *</Label>
                      <Input 
                        id="unit-number" 
                        placeholder={t("unitNumberPlaceholder")} 
                        value={newUnit.number}
                        onChange={(e) => setNewUnit({...newUnit, number: e.target.value})}
                      />
                    </div>
                    {parseInt(numberOfTowers) > 1 && (
                      <div>
                        <Label htmlFor="block-name">{t("blockName")} *</Label>
                        <Select value={newUnit.blockName} onValueChange={(value) => setNewUnit({...newUnit, blockName: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder={t("selectTower")} />
                          </SelectTrigger>
                          <SelectContent>
                            {towerNames.map((name, index) => (
                              <SelectItem key={index} value={name || `${t("tower")} ${String.fromCharCode(65 + index)}`}>
                                {name || `${t("tower")} ${String.fromCharCode(65 + index)}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {parseInt(numberOfTowers) <= 1 && (
                      <div>
                        <Label htmlFor="building-name-single">{t("buildingName")}</Label>
                        <Input 
                          id="building-name-single" 
                          placeholder={t("enterBuildingName")} 
                          value={newUnit.blockName}
                          onChange={(e) => setNewUnit({...newUnit, blockName: e.target.value})}
                          disabled
                        />
                      </div>
                    )}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="unit-area">{t("area")} (m²) *</Label>
                      <Input 
                        id="unit-area" 
                        type="number" 
                        step="0.001" 
                        placeholder={t("areaPlaceholder")} 
                        value={newUnit.area}
                        onChange={(e) => setNewUnit({...newUnit, area: e.target.value})}
                        onBlur={(e) => {
                          if (e.target.value) {
                            setNewUnit({...newUnit, area: formatArea(e.target.value)});
                          }
                        }}
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

                  {/* Third row - Owner name and phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="unit-owner">{t("ownerName")} *</Label>
                      <Input 
                        id="unit-owner" 
                        placeholder={t("enterOwnerName")} 
                        value={newUnit.owner}
                        onChange={(e) => setNewUnit({...newUnit, owner: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="owner-phone">{t("ownerPhone")} *</Label>
                      <Input 
                        id="owner-phone" 
                        placeholder={t("enterOwnerPhone")} 
                        value={newUnit.ownerPhone}
                        onChange={(e) => setNewUnit({...newUnit, ownerPhone: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Fourth row - Identification */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  {/* Fifth row - Deposit and parking */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="has-deposit"
                          checked={newUnit.hasDeposit === "yes"}
                          onCheckedChange={(checked) => setNewUnit({...newUnit, hasDeposit: checked ? "yes" : "no", depositLocation: checked ? newUnit.depositLocation : ""})}
                        />
                        <Label htmlFor="has-deposit" className="cursor-pointer">
                          {t("hasDeposit")} *
                        </Label>
                      </div>
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
                  
                  {/* Conditional deposit location field */}
                  {newUnit.hasDeposit === "yes" && (
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="deposit-location">{t("depositLocation")} *</Label>
                        <Input 
                          id="deposit-location" 
                          placeholder={t("enterDepositLocation")} 
                          value={newUnit.depositLocation}
                          onChange={(e) => setNewUnit({...newUnit, depositLocation: e.target.value})}
                        />
                      </div>
                    </div>
                  )}

                  {/* Sixth row - Ideal fraction and status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ideal-fraction">{t("idealFraction")} (%) *</Label>
                      <Input 
                        id="ideal-fraction" 
                        type="number" 
                        step="0.000001" 
                        placeholder={t("enterIdealFraction")} 
                        value={newUnit.idealFraction}
                        onChange={(e) => setNewUnit({...newUnit, idealFraction: e.target.value})}
                        onBlur={(e) => {
                          if (e.target.value) {
                            setNewUnit({...newUnit, idealFraction: formatIdealFraction(e.target.value)});
                          }
                        }}
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
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">{t("importFromExcel")}</p>
                    <div className="text-xs">
                      <strong>{t("requiredFields")}:</strong>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <span className="inline-block bg-muted px-2 py-1 rounded text-xs">{t("unitNumber")}</span>
                        <span className="inline-block bg-muted px-2 py-1 rounded text-xs">{t("blockName")}</span>
                        <span className="inline-block bg-muted px-2 py-1 rounded text-xs">{t("floorNumber")}</span>
                        <span className="inline-block bg-muted px-2 py-1 rounded text-xs">{t("area")}</span>
                        <span className="inline-block bg-muted px-2 py-1 rounded text-xs">{t("keyDelivery")}</span>
                        <span className="inline-block bg-muted px-2 py-1 rounded text-xs">{t("ownerName")}</span>
                        <span className="inline-block bg-muted px-2 py-1 rounded text-xs">{t("identification")}</span>
                        <span className="inline-block bg-muted px-2 py-1 rounded text-xs">{t("depositLocation")}</span>
                        <span className="inline-block bg-muted px-2 py-1 rounded text-xs">{t("parkingSpacesByApartment")}</span>
                        <span className="inline-block bg-muted px-2 py-1 rounded text-xs">{t("idealFraction")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button variant="outline" className="flex-1 sm:flex-none gap-2 text-xs sm:text-sm">
                      <Calculator className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{t("downloadTemplate")}</span>
                    </Button>
                    <Button className="flex-1 sm:flex-none gap-2 text-xs sm:text-sm">
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{t("uploadExcelFile")}</span>
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
                  <div className="relative flex-1 max-w-full sm:max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("searchByUnitOrBlock")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 text-sm"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredUnits.map((unit) => (
                    <div key={unit.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Home className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                            <span className="text-sm sm:text-base font-semibold">{t("unit")} {unit.number} - {t("block")} {unit.blockName}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant={unit.status === 'occupied' ? 'default' : unit.status === 'vacant' ? 'secondary' : 'destructive'} className="text-xs whitespace-nowrap">
                              {t(unit.status)}
                            </Badge>
                            <Badge variant={unit.keyDelivery === 'yes' ? 'default' : 'secondary'} className="text-xs whitespace-nowrap">
                              {unit.keyDelivery === 'yes' ? t("keyDelivered") : t("keyNotDelivered")}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          {t("floorNumber")} {unit.floor} • {unit.area}m² • {t(unit.identification)} • {unit.idealFraction}% • {unit.parkingSpaces} {t("parkingSpaces")} • {unit.hasDeposit === "yes" ? t("hasDeposit") : t("noDeposit")}
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
                                <Label className="text-sm font-medium">{t("hasDeposit")}</Label>
                                <p className="text-sm">{unit.hasDeposit === "yes" ? t("yes") : t("no")}</p>
                              </div>
                              {unit.hasDeposit === "yes" && (
                                <div>
                                  <Label className="text-sm font-medium">{t("depositLocation")}</Label>
                                  <p className="text-sm">{unit.depositLocation}</p>
                                </div>
                              )}
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
                          <Label className="text-sm font-medium text-muted-foreground">{t("hasDeposit")}</Label>
                          <Badge variant={queryResult.hasDeposit === 'yes' ? 'default' : 'secondary'} className="w-fit">
                            {queryResult.hasDeposit === 'yes' ? t("yes") : t("no")}
                          </Badge>
                        </div>
                        {queryResult.hasDeposit === "yes" && (
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">{t("depositLocation")}</Label>
                            <p className="text-sm font-medium">{queryResult.depositLocation}</p>
                          </div>
                        )}
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
                  {t("unitManagement")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("unitManagementDescription")}
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