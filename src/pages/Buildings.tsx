import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Home, Search } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Import the new components
import BuildingInformation from "@/components/buildings/BuildingInformation";
import UnitManagement from "@/components/buildings/UnitManagement";
import UnitQuery from "@/components/buildings/UnitQuery";

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
  
  // Units state
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
  const [towerUnitDistribution, setTowerUnitDistribution] = useState<Array<{
    residential: string;
    commercial: string;
    studio: string;
    nonResidential: string;
    wave: string;
  }>>([]);
  
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
            <BuildingInformation
              // Building basic info
              buildingName={buildingName}
              setBuildingName={setBuildingName}
              cnpj={cnpj}
              setCnpj={setCnpj}
              buildingType={buildingType}
              setBuildingType={setBuildingType}
              totalUnits={totalUnits}
              setTotalUnits={setTotalUnits}
              
              // Building composition
              numberOfTowers={numberOfTowers}
              setNumberOfTowers={setNumberOfTowers}
              apartmentsPerTower={apartmentsPerTower}
              setApartmentsPerTower={setApartmentsPerTower}
              unitsPerTower={unitsPerTower}
              setUnitsPerTower={setUnitsPerTower}
              residentialUnits={residentialUnits}
              setResidentialUnits={setResidentialUnits}
              commercialUnits={commercialUnits}
              setCommercialUnits={setCommercialUnits}
              studioUnits={studioUnits}
              setStudioUnits={setStudioUnits}
              nonResidentialUnits={nonResidentialUnits}
              setNonResidentialUnits={setNonResidentialUnits}
              waveUnits={waveUnits}
              setWaveUnits={setWaveUnits}
              towerNames={towerNames}
              setTowerNames={setTowerNames}
              unitsPerTowerArray={unitsPerTowerArray}
              setUnitsPerTowerArray={setUnitsPerTowerArray}
              towerUnitDistribution={towerUnitDistribution}
              setTowerUnitDistribution={setTowerUnitDistribution}
              
              // Manager info
              managerName={managerName}
              setManagerName={setManagerName}
              managerPhone={managerPhone}
              setManagerPhone={setManagerPhone}
              managerPhoneType={managerPhoneType}
              setManagerPhoneType={setManagerPhoneType}
              
              // Address info
              cep={cep}
              setCep={setCep}
              street={street}
              setStreet={setStreet}
              addressNumber={addressNumber}
              setAddressNumber={setAddressNumber}
              neighborhood={neighborhood}
              setNeighborhood={setNeighborhood}
              city={city}
              setCity={setCity}
              state={state}
              setState={setState}
              
              // Alternative address
              useSeparateAddress={useSeparateAddress}
              setUseSeparateAddress={setUseSeparateAddress}
              altStreet={altStreet}
              setAltStreet={setAltStreet}
              altAddressNumber={altAddressNumber}
              setAltAddressNumber={setAltAddressNumber}
              altCep={altCep}
              setAltCep={setAltCep}
              altNeighborhood={altNeighborhood}
              setAltNeighborhood={setAltNeighborhood}
              altCity={altCity}
              setAltCity={setAltCity}
              altState={altState}
              setAltState={setAltState}
              
              // Helper functions
              handleCNPJChange={handleCNPJChange}
              handleCEPChange={handleCEPChange}
              handleManagerPhoneChange={handleManagerPhoneChange}
              formatCEP={formatCEP}
            />
          </TabsContent>

          <TabsContent value="unit-management" className="space-y-6">
            <UnitManagement
              buildingType={buildingType}
              numberOfTowers={numberOfTowers}
              apartmentsPerTower={apartmentsPerTower}
              unitsPerTower={unitsPerTower}
              residentialUnits={residentialUnits}
              commercialUnits={commercialUnits}
              studioUnits={studioUnits}
              towerNames={towerNames}
              units={units}
              setUnits={setUnits}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedUnit={selectedUnit}
              setSelectedUnit={setSelectedUnit}
              isEditingOwner={isEditingOwner}
              setIsEditingOwner={setIsEditingOwner}
              editOwnerName={editOwnerName}
              setEditOwnerName={setEditOwnerName}
              newUnit={newUnit}
              setNewUnit={setNewUnit}
              handleAddUnit={handleAddUnit}
              handleDeleteUnit={handleDeleteUnit}
              handleSelectUnit={handleSelectUnit}
              handleSaveOwnerName={handleSaveOwnerName}
              handleCancelEdit={handleCancelEdit}
              formatArea={formatArea}
              formatIdealFraction={formatIdealFraction}
            />
          </TabsContent>

          <TabsContent value="unit-query" className="space-y-6">
            <UnitQuery
              units={units}
              queryUnitNumber={queryUnitNumber}
              setQueryUnitNumber={setQueryUnitNumber}
              queryBlockName={queryBlockName}
              setQueryBlockName={setQueryBlockName}
              queryResult={queryResult}
              setQueryResult={setQueryResult}
              isQueryEditingOwner={isQueryEditingOwner}
              setIsQueryEditingOwner={setIsQueryEditingOwner}
              queryEditOwnerName={queryEditOwnerName}
              setQueryEditOwnerName={setQueryEditOwnerName}
              handleSearchUnit={handleSearchUnit}
              handleClearQuery={handleClearQuery}
              handleQuerySaveOwnerName={handleQuerySaveOwnerName}
              handleQueryCancelEdit={handleQueryCancelEdit}
            />
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