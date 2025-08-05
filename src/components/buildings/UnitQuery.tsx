import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Home, Edit } from "lucide-react";
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

interface UnitQueryProps {
  units: Unit[];
  queryUnitNumber: string;
  setQueryUnitNumber: (value: string) => void;
  queryBlockName: string;
  setQueryBlockName: (value: string) => void;
  queryResult: Unit | null;
  setQueryResult: (unit: Unit | null) => void;
  isQueryEditingOwner: boolean;
  setIsQueryEditingOwner: (editing: boolean) => void;
  queryEditOwnerName: string;
  setQueryEditOwnerName: (name: string) => void;
  handleSearchUnit: () => void;
  handleClearQuery: () => void;
  handleQuerySaveOwnerName: () => void;
  handleQueryCancelEdit: () => void;
}

export default function UnitQuery(props: UnitQueryProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
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
                  value={props.queryUnitNumber}
                  onChange={(e) => props.setQueryUnitNumber(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="query-block-name">{t("blockName")} *</Label>
                <Input 
                  id="query-block-name" 
                  placeholder={t("enterBlockNumber")} 
                  value={props.queryBlockName}
                  onChange={(e) => props.setQueryBlockName(e.target.value)}
                />
              </div>
              <div className="flex items-end gap-2">
                <Button 
                  onClick={props.handleSearchUnit}
                  className="gap-2"
                  disabled={!props.queryUnitNumber || !props.queryBlockName}
                >
                  <Search className="w-4 h-4" />
                  {t("searchButton")}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={props.handleClearQuery}
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
      {props.queryResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              {t("unitFound")} - {t("unit")} {props.queryResult.number}
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
                    <p className="text-sm font-medium">{props.queryResult.number}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">{t("blockName")}</Label>
                    <p className="text-sm font-medium">{props.queryResult.blockName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">{t("floorNumber")}</Label>
                    <p className="text-sm font-medium">{props.queryResult.floor}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">{t("area")} (m²)</Label>
                    <p className="text-sm font-medium">{props.queryResult.area}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">{t("keyDelivery")}</Label>
                    <Badge variant={props.queryResult.keyDelivery === 'yes' ? 'default' : 'secondary'} className="w-fit">
                      {props.queryResult.keyDelivery === 'yes' ? t("keyDelivered") : t("keyNotDelivered")}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">{t("identification")}</Label>
                    <p className="text-sm font-medium">{t(props.queryResult.identification)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">{t("hasDeposit")}</Label>
                    <Badge variant={props.queryResult.hasDeposit === 'yes' ? 'default' : 'secondary'} className="w-fit">
                      {props.queryResult.hasDeposit === 'yes' ? t("yes") : t("no")}
                    </Badge>
                  </div>
                  {props.queryResult.hasDeposit === "yes" && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">{t("depositLocation")}</Label>
                      <p className="text-sm font-medium">{props.queryResult.depositLocation}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">{t("parkingSpacesByApartment")}</Label>
                    <p className="text-sm font-medium">{props.queryResult.parkingSpaces}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">{t("idealFraction")}</Label>
                    <p className="text-sm font-medium">{props.queryResult.idealFraction}%</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">{t("status")}</Label>
                    <Badge variant={props.queryResult.status === 'occupied' ? 'default' : props.queryResult.status === 'vacant' ? 'secondary' : 'destructive'}>
                      {t(props.queryResult.status)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Owner Information - Editable */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">{t("ownerName")}</h3>
                
                <div className="p-4 border rounded-lg">
                  {props.isQueryEditingOwner ? (
                    <div className="space-y-3">
                      <Label htmlFor="query-owner-name">{t("ownerName")}</Label>
                      <Input
                        id="query-owner-name"
                        value={props.queryEditOwnerName}
                        onChange={(e) => props.setQueryEditOwnerName(e.target.value)}
                        placeholder={t("ownerNameOptional")}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={props.handleQuerySaveOwnerName}>
                          {t("save")}
                        </Button>
                        <Button size="sm" variant="outline" onClick={props.handleQueryCancelEdit}>
                          {t("cancel")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-muted-foreground">{t("ownerName")}</Label>
                      <p className="text-sm font-medium">{props.queryResult.owner || t("noOwnerSet")}</p>
                      <Button size="sm" variant="outline" onClick={() => props.setIsQueryEditingOwner(true)} className="gap-2">
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
      {props.queryUnitNumber && props.queryBlockName && props.queryResult === null && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">{t("unitNotFound")}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {t("unit")}: {props.queryUnitNumber} | {t("block")}: {props.queryBlockName}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}