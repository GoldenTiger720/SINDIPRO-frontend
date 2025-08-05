import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { buildingApi, BuildingData, ApiError } from "@/lib/building";
import { useToast } from "@/hooks/use-toast";

interface BuildingInformationProps {
  // Building basic info
  buildingName: string;
  setBuildingName: (value: string) => void;
  cnpj: string;
  setCnpj: (value: string) => void;
  buildingType: string;
  setBuildingType: (value: string) => void;
  totalUnits: string;
  setTotalUnits: (value: string) => void;
  
  // Building composition
  numberOfTowers: string;
  setNumberOfTowers: (value: string) => void;
  apartmentsPerTower: string;
  setApartmentsPerTower: (value: string) => void;
  unitsPerTower: string;
  setUnitsPerTower: (value: string) => void;
  residentialUnits: string;
  setResidentialUnits: (value: string) => void;
  commercialUnits: string;
  setCommercialUnits: (value: string) => void;
  studioUnits: string;
  setStudioUnits: (value: string) => void;
  nonResidentialUnits: string;
  setNonResidentialUnits: (value: string) => void;
  waveUnits: string;
  setWaveUnits: (value: string) => void;
  towerNames: string[];
  setTowerNames: (value: string[]) => void;
  unitsPerTowerArray: string[];
  setUnitsPerTowerArray: (value: string[]) => void;
  
  // Per-tower unit distribution
  towerUnitDistribution: Array<{
    residential: string;
    commercial: string;
    studio: string;
    nonResidential: string;
    wave: string;
  }>;
  setTowerUnitDistribution: (value: Array<{
    residential: string;
    commercial: string;
    studio: string;
    nonResidential: string;
    wave: string;
  }>) => void;
  
  // Manager info
  managerName: string;
  setManagerName: (value: string) => void;
  managerPhone: string;
  setManagerPhone: (value: string) => void;
  managerPhoneType: string;
  setManagerPhoneType: (value: string) => void;
  
  // Address info
  cep: string;
  setCep: (value: string) => void;
  street: string;
  setStreet: (value: string) => void;
  addressNumber: string;
  setAddressNumber: (value: string) => void;
  neighborhood: string;
  setNeighborhood: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  
  // Alternative address
  useSeparateAddress: boolean;
  setUseSeparateAddress: (value: boolean) => void;
  altStreet: string;
  setAltStreet: (value: string) => void;
  altAddressNumber: string;
  setAltAddressNumber: (value: string) => void;
  altCep: string;
  setAltCep: (value: string) => void;
  altNeighborhood: string;
  setAltNeighborhood: (value: string) => void;
  altCity: string;
  setAltCity: (value: string) => void;
  altState: string;
  setAltState: (value: string) => void;
  
  // Helper functions
  handleCNPJChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCEPChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleManagerPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatCEP: (value: string) => string;
}

export default function BuildingInformation(props: BuildingInformationProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Function to calculate overall totals from per-tower data
  const calculateOverallTotals = () => {
    const totals = {
      residential: 0,
      commercial: 0,
      studio: 0,
      nonResidential: 0,
      wave: 0
    };

    props.towerUnitDistribution.forEach(tower => {
      totals.residential += parseInt(tower.residential) || 0;
      totals.commercial += parseInt(tower.commercial) || 0;
      totals.studio += parseInt(tower.studio) || 0;
      totals.nonResidential += parseInt(tower.nonResidential) || 0;
      totals.wave += parseInt(tower.wave) || 0;
    });

    // Update the overall totals
    props.setResidentialUnits(totals.residential.toString());
    props.setCommercialUnits(totals.commercial.toString());
    props.setStudioUnits(totals.studio.toString());
    props.setNonResidentialUnits(totals.nonResidential.toString());
    props.setWaveUnits(totals.wave.toString());
  };

  // Function to update per-tower unit distribution
  const updateTowerUnitDistribution = (towerIndex: number, unitType: string, value: string) => {
    const newDistribution = [...props.towerUnitDistribution];
    if (!newDistribution[towerIndex]) {
      newDistribution[towerIndex] = {
        residential: "",
        commercial: "",
        studio: "",
        nonResidential: "",
        wave: ""
      };
    }
    newDistribution[towerIndex][unitType as keyof typeof newDistribution[0]] = value;
    props.setTowerUnitDistribution(newDistribution);
    
    // Auto-calculate overall totals
    setTimeout(() => calculateOverallTotals(), 0);
  };

  // Handle Save Settings API call using professional API service
  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Collect all form data using the BuildingData interface
      const buildingData: BuildingData = {
        buildingName: props.buildingName,
        cnpj: props.cnpj,
        buildingType: props.buildingType as 'residential' | 'commercial' | 'mixed',
        totalUnits: props.totalUnits ? parseInt(props.totalUnits) : undefined,
        numberOfTowers: props.numberOfTowers ? parseInt(props.numberOfTowers) : undefined,
        apartmentsPerTower: props.apartmentsPerTower ? parseInt(props.apartmentsPerTower) : undefined,
        unitsPerTower: props.unitsPerTower ? parseInt(props.unitsPerTower) : undefined,
        residentialUnits: props.residentialUnits ? parseInt(props.residentialUnits) : undefined,
        commercialUnits: props.commercialUnits ? parseInt(props.commercialUnits) : undefined,
        studioUnits: props.studioUnits ? parseInt(props.studioUnits) : undefined,
        nonResidentialUnits: props.nonResidentialUnits ? parseInt(props.nonResidentialUnits) : undefined,
        waveUnits: props.waveUnits ? parseInt(props.waveUnits) : undefined,
        towerNames: props.towerNames.filter(name => name.trim() !== ""),
        unitsPerTowerArray: props.unitsPerTowerArray.map(units => units ? parseInt(units) : 0),
        towerUnitDistribution: props.towerUnitDistribution.map(tower => ({
          residential: parseInt(tower.residential) || 0,
          commercial: parseInt(tower.commercial) || 0,
          studio: parseInt(tower.studio) || 0,
          nonResidential: parseInt(tower.nonResidential) || 0,
          wave: parseInt(tower.wave) || 0
        })),
        managerName: props.managerName,
        managerPhone: props.managerPhone,
        managerPhoneType: props.managerPhoneType as 'mobile' | 'landline',
        address: {
          street: props.street,
          number: props.addressNumber,
          cep: props.cep,
          neighborhood: props.neighborhood,
          city: props.city,
          state: props.state
        },
        // Include alternative address if mixed building and separate address is used
        ...(props.buildingType === "mixed" && props.useSeparateAddress && {
          alternativeAddress: {
            street: props.altStreet,
            number: props.altAddressNumber,
            cep: props.altCep,
            neighborhood: props.altNeighborhood,
            city: props.altCity,
            state: props.altState
          }
        }),
        useSeparateAddress: props.buildingType === "mixed" ? props.useSeparateAddress : false
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
              value={props.buildingName}
              onChange={(e) => props.setBuildingName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cnpj">{t("cnpj")} *</Label>
            <Input 
              id="cnpj" 
              placeholder="00.000.000/0000-00" 
              value={props.cnpj}
              onChange={props.handleCNPJChange}
              maxLength={18}
            />
          </div>
          <div>
            <Label htmlFor="building-type">{t("buildingType")}</Label>
            <Select value={props.buildingType} onValueChange={props.setBuildingType}>
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
              value={props.totalUnits}
              onChange={(e) => props.setTotalUnits(e.target.value)}
            />
          </div>
        </div>

        {/* Dynamic Building Composition Fields */}
        {props.buildingType && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("buildingComposition")}</h3>
            
            {props.buildingType === "residential" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="number-of-towers">{t("numberOfTowers")}</Label>
                    <Input 
                      id="number-of-towers" 
                      type="number" 
                      placeholder={t("enterNumberOfTowers")}
                      value={props.numberOfTowers}
                      onChange={(e) => {
                        const value = e.target.value;
                        props.setNumberOfTowers(value);
                        const num = parseInt(value) || 0;
                        if (num > 1) {
                          props.setTowerNames(Array(num).fill("").map((_, i) => props.towerNames[i] || ""));
                          props.setUnitsPerTowerArray(Array(num).fill("").map((_, i) => props.unitsPerTowerArray[i] || ""));
                          // Initialize tower unit distribution
                          const newDistribution = Array(num).fill("").map((_, i) => 
                            props.towerUnitDistribution[i] || {
                              residential: "",
                              commercial: "",
                              studio: "",
                              nonResidential: "",
                              wave: ""
                            }
                          );
                          props.setTowerUnitDistribution(newDistribution);
                        } else {
                          props.setTowerNames([]);
                          props.setUnitsPerTowerArray([]);
                          props.setTowerUnitDistribution([]);
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
                      value={props.apartmentsPerTower}
                      onChange={(e) => props.setApartmentsPerTower(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Tower naming section - only show when more than 1 tower */}
                {parseInt(props.numberOfTowers) > 1 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">{t("towerDetails")}</Label>
                    <div className="grid grid-cols-1 gap-4">
                      {props.towerNames.map((name, index) => (
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
                                const newNames = [...props.towerNames];
                                newNames[index] = e.target.value;
                                props.setTowerNames(newNames);
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
                              value={props.unitsPerTowerArray[index] || ""}
                              onChange={(e) => {
                                const newUnits = [...props.unitsPerTowerArray];
                                newUnits[index] = e.target.value;
                                props.setUnitsPerTowerArray(newUnits);
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
            
            {props.buildingType === "commercial" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="number-of-towers-commercial">{t("numberOfTowers")}</Label>
                    <Input 
                      id="number-of-towers-commercial" 
                      type="number" 
                      placeholder={t("enterNumberOfTowers")}
                      value={props.numberOfTowers}
                      onChange={(e) => {
                        const value = e.target.value;
                        props.setNumberOfTowers(value);
                        const num = parseInt(value) || 0;
                        if (num > 1) {
                          props.setTowerNames(Array(num).fill("").map((_, i) => props.towerNames[i] || ""));
                          props.setUnitsPerTowerArray(Array(num).fill("").map((_, i) => props.unitsPerTowerArray[i] || ""));
                          // Initialize tower unit distribution
                          const newDistribution = Array(num).fill("").map((_, i) => 
                            props.towerUnitDistribution[i] || {
                              residential: "",
                              commercial: "",
                              studio: "",
                              nonResidential: "",
                              wave: ""
                            }
                          );
                          props.setTowerUnitDistribution(newDistribution);
                        } else {
                          props.setTowerNames([]);
                          props.setUnitsPerTowerArray([]);
                          props.setTowerUnitDistribution([]);
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
                      value={props.unitsPerTower}
                      onChange={(e) => props.setUnitsPerTower(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Tower naming section - only show when more than 1 tower */}
                {parseInt(props.numberOfTowers) > 1 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">{t("towerDetails")}</Label>
                    <div className="grid grid-cols-1 gap-4">
                      {props.towerNames.map((name, index) => (
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
                                const newNames = [...props.towerNames];
                                newNames[index] = e.target.value;
                                props.setTowerNames(newNames);
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
                              value={props.unitsPerTowerArray[index] || ""}
                              onChange={(e) => {
                                const newUnits = [...props.unitsPerTowerArray];
                                newUnits[index] = e.target.value;
                                props.setUnitsPerTowerArray(newUnits);
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
            
            {props.buildingType === "mixed" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="number-of-towers-mixed">{t("numberOfTowers")}</Label>
                    <Input 
                      id="number-of-towers-mixed" 
                      type="number" 
                      placeholder={t("enterNumberOfTowers")}
                      value={props.numberOfTowers}
                      onChange={(e) => {
                        const value = e.target.value;
                        props.setNumberOfTowers(value);
                        const num = parseInt(value) || 0;
                        if (num > 1) {
                          props.setTowerNames(Array(num).fill("").map((_, i) => props.towerNames[i] || ""));
                          props.setUnitsPerTowerArray(Array(num).fill("").map((_, i) => props.unitsPerTowerArray[i] || ""));
                          // Initialize tower unit distribution
                          const newDistribution = Array(num).fill("").map((_, i) => 
                            props.towerUnitDistribution[i] || {
                              residential: "",
                              commercial: "",
                              studio: "",
                              nonResidential: "",
                              wave: ""
                            }
                          );
                          props.setTowerUnitDistribution(newDistribution);
                        } else {
                          props.setTowerNames([]);
                          props.setUnitsPerTowerArray([]);
                          props.setTowerUnitDistribution([]);
                        }
                      }}
                    />
                  </div>
                </div>
                
                {/* Tower naming section - only show when more than 1 tower */}
                {parseInt(props.numberOfTowers) > 1 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">{t("towerDetails")}</Label>
                    <div className="grid grid-cols-1 gap-4">
                      {props.towerNames.map((name, index) => (
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
                                const newNames = [...props.towerNames];
                                newNames[index] = e.target.value;
                                props.setTowerNames(newNames);
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
                              value={props.unitsPerTowerArray[index] || ""}
                              onChange={(e) => {
                                const newUnits = [...props.unitsPerTowerArray];
                                newUnits[index] = e.target.value;
                                props.setUnitsPerTowerArray(newUnits);
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
                  {props.towerNames.length > 0 && (
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold">{t("unitDistributionPerTower")}</Label>
                      {props.towerNames.map((towerName, towerIndex) => (
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
                                value={props.towerUnitDistribution[towerIndex]?.residential || ""}
                                onChange={(e) => updateTowerUnitDistribution(towerIndex, "residential", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`commercial-units-${towerIndex}`} className="text-xs">{t("commercialUnits")}</Label>
                              <Input 
                                id={`commercial-units-${towerIndex}`}
                                type="number" 
                                placeholder="0"
                                className="h-8 text-sm"
                                value={props.towerUnitDistribution[towerIndex]?.commercial || ""}
                                onChange={(e) => updateTowerUnitDistribution(towerIndex, "commercial", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`studio-units-${towerIndex}`} className="text-xs">{t("studioUnits")}</Label>
                              <Input 
                                id={`studio-units-${towerIndex}`}
                                type="number" 
                                placeholder="0"
                                className="h-8 text-sm"
                                value={props.towerUnitDistribution[towerIndex]?.studio || ""}
                                onChange={(e) => updateTowerUnitDistribution(towerIndex, "studio", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`non-residential-units-${towerIndex}`} className="text-xs">{t("nonResidentialUnits")}</Label>
                              <Input 
                                id={`non-residential-units-${towerIndex}`}
                                type="number" 
                                placeholder="0"
                                className="h-8 text-sm"
                                value={props.towerUnitDistribution[towerIndex]?.nonResidential || ""}
                                onChange={(e) => updateTowerUnitDistribution(towerIndex, "nonResidential", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`wave-units-${towerIndex}`} className="text-xs">{t("waveUnits")}</Label>
                              <Input 
                                id={`wave-units-${towerIndex}`}
                                type="number" 
                                placeholder="0"
                                className="h-8 text-sm"
                                value={props.towerUnitDistribution[towerIndex]?.wave || ""}
                                onChange={(e) => updateTowerUnitDistribution(towerIndex, "wave", e.target.value)}
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
                        <Label htmlFor="residential-units">{t("residentialUnits")} <span className="text-xs text-muted-foreground">(Auto-calculated)</span></Label>
                        <Input 
                          id="residential-units" 
                          type="number" 
                          placeholder="0"
                          value={props.residentialUnits}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <div>
                        <Label htmlFor="commercial-units">{t("commercialUnits")} <span className="text-xs text-muted-foreground">(Auto-calculated)</span></Label>
                        <Input 
                          id="commercial-units" 
                          type="number" 
                          placeholder="0"
                          value={props.commercialUnits}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <div>
                        <Label htmlFor="studio-units">{t("studioUnits")} <span className="text-xs text-muted-foreground">(Auto-calculated)</span></Label>
                        <Input 
                          id="studio-units" 
                          type="number" 
                          placeholder="0"
                          value={props.studioUnits}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <div>
                        <Label htmlFor="non-residential-units">{t("nonResidentialUnits")} <span className="text-xs text-muted-foreground">(Auto-calculated)</span></Label>
                        <Input 
                          id="non-residential-units" 
                          type="number" 
                          placeholder="0"
                          value={props.nonResidentialUnits}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <div>
                        <Label htmlFor="wave-units">{t("waveUnits")} <span className="text-xs text-muted-foreground">(Auto-calculated)</span></Label>
                        <Input 
                          id="wave-units" 
                          type="number" 
                          placeholder="0"
                          value={props.waveUnits}
                          readOnly
                          className="bg-muted"
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
                value={props.managerName}
                onChange={(e) => props.setManagerName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone-type">{t("phoneType")} *</Label>
              <Select value={props.managerPhoneType} onValueChange={props.setManagerPhoneType}>
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
                placeholder={props.managerPhoneType === 'mobile' ? '55 (11) 98910-0000' : '3083-6749'} 
                value={props.managerPhone}
                onChange={props.handleManagerPhoneChange}
                maxLength={props.managerPhoneType === 'mobile' ? 18 : 9}
              />
            </div>
          </div>
        </div>

        {/* Full Address Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t("fullAddress")} *</h3>
          
          {/* Mixed building separate address option */}
          {props.buildingType === "mixed" && (
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="separate-address" 
                checked={props.useSeparateAddress}
                onChange={(e) => props.setUseSeparateAddress(e.target.checked)}
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
                value={props.street}
                onChange={(e) => props.setStreet(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="address-number">{t("addressNumber")} *</Label>
              <Input 
                id="address-number" 
                placeholder={t("enterAddressNumber")} 
                value={props.addressNumber}
                onChange={(e) => props.setAddressNumber(e.target.value)}
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
                value={props.cep}
                onChange={props.handleCEPChange}
                maxLength={9}
              />
            </div>
            <div>
              <Label htmlFor="neighborhood">{t("neighborhood")} *</Label>
              <Input 
                id="neighborhood" 
                placeholder={t("enterNeighborhood")} 
                value={props.neighborhood}
                onChange={(e) => props.setNeighborhood(e.target.value)}
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
                value={props.city}
                onChange={(e) => props.setCity(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="state">{t("state")} *</Label>
              <Input 
                id="state" 
                placeholder={t("enterState")} 
                value={props.state}
                onChange={(e) => props.setState(e.target.value)}
              />
            </div>
          </div>
          
          {/* Separate address for mixed buildings */}
          {props.buildingType === "mixed" && props.useSeparateAddress && (
            <div className="space-y-4 mt-6 p-4 border rounded-lg bg-muted/20">
              <h4 className="text-md font-semibold">{t("alternativeAddress")}</h4>
              
              {/* Alternative Street and Number */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="alt-street">{t("street")}</Label>
                  <Input 
                    id="alt-street" 
                    placeholder={t("enterStreet")} 
                    value={props.altStreet}
                    onChange={(e) => props.setAltStreet(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="alt-address-number">{t("addressNumber")}</Label>
                  <Input 
                    id="alt-address-number" 
                    placeholder={t("enterAddressNumber")} 
                    value={props.altAddressNumber}
                    onChange={(e) => props.setAltAddressNumber(e.target.value)}
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
                    value={props.altCep}
                    onChange={(e) => props.setAltCep(props.formatCEP(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="alt-neighborhood">{t("neighborhood")}</Label>
                  <Input 
                    id="alt-neighborhood" 
                    placeholder={t("enterNeighborhood")} 
                    value={props.altNeighborhood}
                    onChange={(e) => props.setAltNeighborhood(e.target.value)}
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
                    value={props.altCity}
                    onChange={(e) => props.setAltCity(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="alt-state">{t("state")}</Label>
                  <Input 
                    id="alt-state" 
                    placeholder={t("enterState")} 
                    value={props.altState}
                    onChange={(e) => props.setAltState(e.target.value)}
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
  );
}