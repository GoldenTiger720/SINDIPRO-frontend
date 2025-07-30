import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Plus, Calculator, Home, Users, Trash2, Edit, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTranslation } from "react-i18next";
import { useState } from "react";

// Mock data for demonstration
const mockUnits = [
  { id: 1, number: "101", floor: 1, area: 85.5, type: "residential", owner: "João Silva", status: "occupied" },
  { id: 2, number: "102", floor: 1, area: 90.0, type: "residential", owner: "Maria Santos", status: "occupied" },
  { id: 3, number: "201", floor: 2, area: 85.5, type: "residential", owner: "", status: "vacant" },
  { id: 4, number: "202", floor: 2, area: 90.0, type: "residential", owner: "Carlos Oliveira", status: "occupied" },
  { id: 5, number: "301", floor: 3, area: 85.5, type: "residential", owner: "Ana Costa", status: "occupied" },
];

export default function Buildings() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [units, setUnits] = useState(mockUnits);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUnit, setNewUnit] = useState({
    number: "",
    floor: "",
    area: "",
    type: "residential",
    owner: "",
    status: "vacant"
  });

  const filteredUnits = units.filter(unit => 
    unit.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUnit = () => {
    if (newUnit.number && newUnit.floor && newUnit.area) {
      const unit = {
        id: Date.now(),
        number: newUnit.number,
        floor: parseInt(newUnit.floor),
        area: parseFloat(newUnit.area),
        type: newUnit.type,
        owner: newUnit.owner,
        status: newUnit.status
      };
      setUnits([...units, unit]);
      setNewUnit({
        number: "",
        floor: "",
        area: "",
        type: "residential",
        owner: "",
        status: "vacant"
      });
    }
  };

  const handleDeleteUnit = (id: number) => {
    setUnits(units.filter(unit => unit.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={t("adminSindipro")} />
      <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t("backToDashboard")}
          </Button>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">{t("basicCondominiumRegistry")}</h1>
          </div>
        </div>

        <Tabs defaultValue="building-info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="building-info" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Building Information
            </TabsTrigger>
            <TabsTrigger value="unit-management" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Unit Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="building-info" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    {t("basicBuildingInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="building-name">{t("buildingName")}</Label>
                    <Input id="building-name" placeholder={t("enterBuildingName")} />
                  </div>
                  <div>
                    <Label htmlFor="building-type">{t("buildingType")}</Label>
                    <Select>
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
                    <Label htmlFor="total-area">{t("totalArea")}</Label>
                    <Input id="total-area" type="number" placeholder="0.00" />
                  </div>
                  <div>
                    <Label htmlFor="total-units">{t("numberOfUnits")}</Label>
                    <Input id="total-units" type="number" placeholder="0" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    {t("advancedSettings")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="area-unit">{t("areaPerUnit")}</Label>
                    <Input id="area-unit" type="number" placeholder="0.00" />
                  </div>
                  <div>
                    <Label htmlFor="allocation-ratio">{t("allocationRatio")}</Label>
                    <Input id="allocation-ratio" type="number" placeholder="0.00" />
                  </div>
                  <div>
                    <Label htmlFor="parking">{t("parkingSpaces")}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t("availability")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">{t("available")}</SelectItem>
                        <SelectItem value="not-available">{t("notAvailable")}</SelectItem>
                        <SelectItem value="limited">{t("limited")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    {t("saveSettings")}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="unit-management" className="space-y-6">
            {/* Unit Registration Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Register New Unit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="unit-number">Unit Number</Label>
                    <Input 
                      id="unit-number" 
                      placeholder="e.g., 101, 102..." 
                      value={newUnit.number}
                      onChange={(e) => setNewUnit({...newUnit, number: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit-floor">Floor</Label>
                    <Input 
                      id="unit-floor" 
                      type="number" 
                      placeholder="1, 2, 3..." 
                      value={newUnit.floor}
                      onChange={(e) => setNewUnit({...newUnit, floor: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit-area">Area (m²)</Label>
                    <Input 
                      id="unit-area" 
                      type="number" 
                      step="0.1" 
                      placeholder="85.5" 
                      value={newUnit.area}
                      onChange={(e) => setNewUnit({...newUnit, area: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit-type">Type</Label>
                    <Select value={newUnit.type} onValueChange={(value) => setNewUnit({...newUnit, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="parking">Parking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="unit-owner">Owner/Tenant</Label>
                    <Input 
                      id="unit-owner" 
                      placeholder="Owner name (optional)" 
                      value={newUnit.owner}
                      onChange={(e) => setNewUnit({...newUnit, owner: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit-status">Status</Label>
                    <Select value={newUnit.status} onValueChange={(value) => setNewUnit({...newUnit, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="vacant">Vacant</SelectItem>
                        <SelectItem value="maintenance">Under Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAddUnit} className="mt-4 gap-2">
                  <Plus className="w-4 h-4" />
                  Add Unit
                </Button>
              </CardContent>
            </Card>

            {/* Units List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Registered Units ({units.length})
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search units or owners..."
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
                    <div key={unit.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold">Unit {unit.number}</span>
                        </div>
                        <Badge variant={unit.status === 'occupied' ? 'default' : unit.status === 'vacant' ? 'secondary' : 'destructive'}>
                          {unit.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          Floor {unit.floor} • {unit.area}m² • {unit.type}
                        </div>
                        {unit.owner && (
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="w-3 h-3" />
                            {unit.owner}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteUnit(unit.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {filteredUnits.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No units found matching your search." : "No units registered yet."}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t("relatedFeatures")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Unit Registration System
                </h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive unit management with registration, tracking, and owner/tenant information.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t("automaticFeeDistribution")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("automaticFeeDistributionDesc")}
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