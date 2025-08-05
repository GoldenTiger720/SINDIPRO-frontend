import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Building2, Plus, Calculator, Home, Users, Trash2, Edit, Search, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Unit {
  id: number;
  number: string;
  blockName: string;
  floor: number;
  area: number;
  keyDelivery: string;
  owner: string;
  identification: string;
  hasDeposit: string;
  depositLocation: string;
  parkingSpaces: number;
  idealFraction: number;
  status: string;
}

interface NewUnit {
  number: string;
  blockName: string;
  floor: string;
  area: string;
  keyDelivery: string;
  owner: string;
  ownerPhone: string;
  identification: string;
  hasDeposit: string;
  depositLocation: string;
  parkingSpaces: string;
  idealFraction: string;
  status: string;
}

interface Tower {
  name: string;
  units: number;
  buildingName: string;
  buildingId: number;
}

interface UnitManagementProps {
  buildingType: string;
  numberOfTowers: string;
  apartmentsPerTower: string;
  unitsPerTower: string;
  residentialUnits: string;
  commercialUnits: string;
  studioUnits: string;
  towerNames: string[];
  availableTowers: Tower[];
  units: Unit[];
  setUnits: (units: Unit[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedUnit: Unit | null;
  setSelectedUnit: (unit: Unit | null) => void;
  isEditingOwner: boolean;
  setIsEditingOwner: (editing: boolean) => void;
  editOwnerName: string;
  setEditOwnerName: (name: string) => void;
  newUnit: NewUnit;
  setNewUnit: (unit: NewUnit) => void;
  handleAddUnit: () => void;
  handleDeleteUnit: (id: number) => void;
  handleSelectUnit: (unit: Unit) => void;
  handleSaveOwnerName: () => void;
  handleCancelEdit: () => void;
  formatArea: (value: string) => string;
  formatIdealFraction: (value: string) => string;
}

export default function UnitManagement(props: UnitManagementProps) {
  const { t } = useTranslation();
  
  const filteredUnits = props.units.filter(unit => 
    unit.number.toLowerCase().includes(props.searchTerm.toLowerCase()) ||
    unit.blockName.toLowerCase().includes(props.searchTerm.toLowerCase()) ||
    unit.owner.toLowerCase().includes(props.searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Tower Information */}
      {props.availableTowers && props.availableTowers.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span>
                {t("availableTowers")}: <strong>{props.availableTowers.map(tower => tower.name).join(", ")}</strong>
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
                  value={props.newUnit.number}
                  onChange={(e) => props.setNewUnit({...props.newUnit, number: e.target.value})}
                />
              </div>
              {props.availableTowers && props.availableTowers.length > 0 && (
                <div>
                  <Label htmlFor="block-name">{t("blockName")} *</Label>
                  <Select value={props.newUnit.blockName} onValueChange={(value) => props.setNewUnit({...props.newUnit, blockName: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectTower")} />
                    </SelectTrigger>
                    <SelectContent>
                      {props.availableTowers.map((tower, index) => (
                        <SelectItem key={index} value={tower.name}>
                          {tower.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label htmlFor="unit-floor">{t("floorNumber")} *</Label>
                <Input 
                  id="unit-floor" 
                  type="number" 
                  placeholder={t("enterFloorNumber")} 
                  value={props.newUnit.floor}
                  onChange={(e) => props.setNewUnit({...props.newUnit, floor: e.target.value})}
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
                  value={props.newUnit.area}
                  onChange={(e) => props.setNewUnit({...props.newUnit, area: e.target.value})}
                  onBlur={(e) => {
                    if (e.target.value) {
                      props.setNewUnit({...props.newUnit, area: props.formatArea(e.target.value)});
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="key-delivery">{t("keyDelivery")} *</Label>
                <Select value={props.newUnit.keyDelivery} onValueChange={(value) => props.setNewUnit({...props.newUnit, keyDelivery: value})}>
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
                  value={props.newUnit.owner}
                  onChange={(e) => props.setNewUnit({...props.newUnit, owner: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="owner-phone">{t("ownerPhone")} *</Label>
                <Input 
                  id="owner-phone" 
                  placeholder={t("enterOwnerPhone")} 
                  value={props.newUnit.ownerPhone}
                  onChange={(e) => props.setNewUnit({...props.newUnit, ownerPhone: e.target.value})}
                />
              </div>
            </div>

            {/* Fourth row - Identification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="identification">{t("identification")} *</Label>
                <Select value={props.newUnit.identification} onValueChange={(value) => props.setNewUnit({...props.newUnit, identification: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectIdentification")} />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Show all options for mixed building type */}
                    {props.buildingType === "mixed" && (
                      <>
                        <SelectItem value="residential">{t("residential")}</SelectItem>
                        <SelectItem value="commercial">{t("commercial")}</SelectItem>
                        <SelectItem value="studio">{t("studio")}</SelectItem>
                        <SelectItem value="non-residential">{t("nonResidential")}</SelectItem>
                        <SelectItem value="wave">{t("wave")}</SelectItem>
                      </>
                    )}
                    {/* Show residential options for residential building type */}
                    {props.buildingType === "residential" && (
                      <>
                        <SelectItem value="residential">{t("residential")}</SelectItem>
                        <SelectItem value="studio">{t("studio")}</SelectItem>
                        <SelectItem value="wave">{t("wave")}</SelectItem>
                      </>
                    )}
                    {/* Show commercial options for commercial building type */}
                    {props.buildingType === "commercial" && (
                      <>
                        <SelectItem value="commercial">{t("commercial")}</SelectItem>
                        <SelectItem value="non-residential">{t("nonResidential")}</SelectItem>
                      </>
                    )}
                    {/* Show all options when no building type is selected */}
                    {!props.buildingType && (
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
                    checked={props.newUnit.hasDeposit === "yes"}
                    onCheckedChange={(checked) => props.setNewUnit({...props.newUnit, hasDeposit: checked ? "yes" : "no", depositLocation: checked ? props.newUnit.depositLocation : ""})}
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
                  value={props.newUnit.parkingSpaces}
                  onChange={(e) => props.setNewUnit({...props.newUnit, parkingSpaces: e.target.value})}
                />
              </div>
            </div>
            
            {/* Conditional deposit location field */}
            {props.newUnit.hasDeposit === "yes" && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="deposit-location">{t("depositLocation")} *</Label>
                  <Input 
                    id="deposit-location" 
                    placeholder={t("enterDepositLocation")} 
                    value={props.newUnit.depositLocation}
                    onChange={(e) => props.setNewUnit({...props.newUnit, depositLocation: e.target.value})}
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
                  value={props.newUnit.idealFraction}
                  onChange={(e) => props.setNewUnit({...props.newUnit, idealFraction: e.target.value})}
                  onBlur={(e) => {
                    if (e.target.value) {
                      props.setNewUnit({...props.newUnit, idealFraction: props.formatIdealFraction(e.target.value)});
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="unit-status">{t("status")}</Label>
                <Select value={props.newUnit.status} onValueChange={(value) => props.setNewUnit({...props.newUnit, status: value})}>
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
          <Button onClick={props.handleAddUnit} className="mt-4 gap-2">
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
            {t("registeredUnits")} ({props.units.length})
          </CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <div className="relative flex-1 max-w-full sm:max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchByUnitOrBlock")}
                value={props.searchTerm}
                onChange={(e) => props.setSearchTerm(e.target.value)}
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
                      <Button variant="outline" size="sm" onClick={() => props.handleSelectUnit(unit)} className="h-8 w-8 sm:h-9 sm:w-9 p-0">
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
                          {props.isEditingOwner ? (
                            <div className="flex gap-2 mt-1">
                              <Input
                                value={props.editOwnerName}
                                onChange={(e) => props.setEditOwnerName(e.target.value)}
                                placeholder={t("ownerNameOptional")}
                              />
                              <Button size="sm" onClick={props.handleSaveOwnerName}>
                                {t("save")}
                              </Button>
                              <Button size="sm" variant="outline" onClick={props.handleCancelEdit}>
                                {t("cancel")}
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm">{unit.owner || t("noOwnerSet")}</p>
                              <Button size="sm" variant="outline" onClick={() => props.setIsEditingOwner(true)}>
                                <Edit className="w-3 h-3" />
                                {t("editOwnerName")}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" onClick={() => props.handleDeleteUnit(unit.id)} className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                    <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredUnits.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {props.searchTerm ? t("noUnitsFoundSearch") : t("noUnitsRegisteredYet")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}