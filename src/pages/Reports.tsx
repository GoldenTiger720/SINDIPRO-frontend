import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { FileText, Download, Settings, Mail, FileSpreadsheet, History, Building2, Edit, Eye, Printer } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useBuildings } from "@/hooks/useBuildings";
import "@/styles/reportLayout.css";

export default function Reports() {
  const { t } = useTranslation();
  const { data: buildings = [], isLoading, error } = useBuildings();
  
  // State for building selection
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("");
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
  
  // State for report preview and editing
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [isEditingReport, setIsEditingReport] = useState(false);
  
  // State for financial information
  const [apartmentSaleValue, setApartmentSaleValue] = useState("");
  const [apartmentRentalValue, setApartmentRentalValue] = useState("");
  
  // State for operational activities
  const [scheduledMeetings, setScheduledMeetings] = useState("");
  const [workActivities, setWorkActivities] = useState("");
  
  // State for report sections
  const [includeSections, setIncludeSections] = useState({
    management: true,
    equipment: true,
    finances: true,
    consumption: true,
    activity: true,
    meetings: true,
    marketValues: true
  });
  
  // Effect to set first building as default
  useEffect(() => {
    if (buildings.length > 0 && !selectedBuildingId) {
      setSelectedBuildingId(buildings[0].id.toString());
      setSelectedBuilding(buildings[0]);
    }
  }, [buildings, selectedBuildingId]);
  
  // Handle building selection
  const handleBuildingChange = (buildingId: string) => {
    setSelectedBuildingId(buildingId);
    const building = buildings.find(b => b.id.toString() === buildingId);
    setSelectedBuilding(building);
  };
  
  // Generate report content
  const generateReportContent = () => {
    if (!selectedBuilding) return "";
    
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
    
    let content = `<div class="report-content">`;
    
    // Header
    content += `<div class="report-header">`;
    content += `<h1>${t("reportTitle")}</h1>`;
    content += `<h2>${selectedBuilding.building_name}</h2>`;
    content += `<p class="report-date">${formattedDate}</p>`;
    content += `</div>`;
    
    // Building Information Section
    content += `<section class="report-section">`;
    content += `<h2>${t("buildingInformation")}</h2>`;
    content += `<div class="report-info-block">`;
    content += `<p><strong>${t("buildingName")}:</strong> ${selectedBuilding.building_name}</p>`;
    content += `<p><strong>${t("cnpj")}:</strong> ${selectedBuilding.cnpj}</p>`;
    content += `<p><strong>${t("manager")}:</strong> ${selectedBuilding.manager_name}</p>`;
    content += `<p><strong>${t("address")}:</strong> ${selectedBuilding.address.street}, ${selectedBuilding.address.number} - ${selectedBuilding.address.neighborhood}</p>`;
    content += `<p><strong>${t("city")}:</strong> ${selectedBuilding.address.city} - ${selectedBuilding.address.state}</p>`;
    content += `<p><strong>${t("totalUnits")}:</strong> ${selectedBuilding.residential_units || 0} unidades</p>`;
    content += `</div>`;
    content += `</section>`;
    
    // Financial Information
    if (includeSections.marketValues && (apartmentSaleValue || apartmentRentalValue)) {
      content += `<section class="report-section">`;
      content += `<h2>${t("marketValues")}</h2>`;
      content += `<div class="report-info-block">`;
      if (apartmentSaleValue) {
        content += `<p><strong>${t("averageSaleValue")}:</strong> <span class="financial-value">${apartmentSaleValue}</span></p>`;
      }
      if (apartmentRentalValue) {
        content += `<p><strong>${t("averageRentalValue")}:</strong> <span class="financial-value">${apartmentRentalValue}</span></p>`;
      }
      content += `<p class="info-note"><em>${t("saleValueHint")}</em></p>`;
      content += `</div>`;
      content += `</section>`;
    }
    
    // Operational Activities
    if (includeSections.meetings && scheduledMeetings) {
      content += `<section class="report-section">`;
      content += `<h2>${t("scheduledMeetings")}</h2>`;
      const meetings = scheduledMeetings.split('\\n').filter(m => m.trim());
      meetings.forEach(meeting => {
        content += `<div class="meeting-item">${meeting}</div>`;
      });
      content += `</section>`;
    }
    
    if (includeSections.activity && workActivities) {
      content += `<section class="report-section">`;
      content += `<h2>${t("operationalActivities")}</h2>`;
      const activities = workActivities.split('\\n').filter(a => a.trim());
      activities.forEach(activity => {
        content += `<div class="activity-item">${activity}</div>`;
      });
      content += `</section>`;
    }
    
    // Signature Area
    content += `<div class="signature-area">`;
    content += `<div class="signature-line">`;
    content += `<p>${selectedBuilding.manager_name}</p>`;
    content += `<p>${t("manager")}</p>`;
    content += `</div>`;
    content += `<div class="signature-line">`;
    content += `<p>_______________________________</p>`;
    content += `<p>${t("signature")}</p>`;
    content += `</div>`;
    content += `</div>`;
    
    content += `</div>`;
    
    return content;
  };
  
  // Handle report preview
  const handleGeneratePreview = () => {
    const content = generateReportContent();
    setReportContent(content);
    setShowReportPreview(true);
  };
  
  // Handle print
  const handlePrint = () => {
    window.print();
  };
  
  // Handle PDF generation
  const handleGeneratePDF = () => {
    // This would integrate with a PDF generation library
    console.log("Generating PDF with content:", reportContent);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={t("adminSindipro")} />
      <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-500" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{t("reportGenerationAndExport")}</h1>
          </div>
        </div>

        {/* Building Selection Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {t("selectBuilding")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="building-select">{t("building")}</Label>
                {isLoading ? (
                  <div className="flex items-center justify-center h-10 border rounded">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  </div>
                ) : error ? (
                  <div className="text-sm text-destructive p-2">{t("errorLoadingBuildings")}</div>
                ) : buildings.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-2">{t("noBuildingsAvailable")}</div>
                ) : (
                  <Select value={selectedBuildingId} onValueChange={handleBuildingChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectBuildingPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {buildings.map((building) => (
                        <SelectItem key={building.id} value={building.id.toString()}>
                          {building.building_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              {selectedBuilding && (
                <div className="flex items-end">
                  <div className="text-sm text-muted-foreground">
                    <p>{selectedBuilding.address.street}, {selectedBuilding.address.number}</p>
                    <p>{selectedBuilding.address.city} - {selectedBuilding.address.state}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
{t("automaticPDFGeneration")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="report-type">{t("reportType")}</Label>
                <select className="w-full p-2 border rounded">
                  <option value="complete">{t("completeReport")}</option>
                  <option value="financial">{t("financialOnly")}</option>
                  <option value="maintenance">{t("maintenanceOnly")}</option>
                  <option value="consumption">{t("consumptionOnly")}</option>
                  <option value="custom">{t("customReport")}</option>
                </select>
              </div>
              <div>
                <Label htmlFor="report-period">{t("period")}</Label>
                <div className="flex gap-2">
                  <Input id="start-date" type="date" />
                  <Input id="end-date" type="date" />
                </div>
              </div>
              <div>
                <Label>{t("reportSections")}</Label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={includeSections.management}
                      onChange={(e) => setIncludeSections({...includeSections, management: e.target.checked})}
                    />
                    <span className="text-sm">{t("managementStatus")}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={includeSections.equipment}
                      onChange={(e) => setIncludeSections({...includeSections, equipment: e.target.checked})}
                    />
                    <span className="text-sm">{t("equipmentInfo")}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={includeSections.finances}
                      onChange={(e) => setIncludeSections({...includeSections, finances: e.target.checked})}
                    />
                    <span className="text-sm">{t("finances")}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={includeSections.consumption}
                      onChange={(e) => setIncludeSections({...includeSections, consumption: e.target.checked})}
                    />
                    <span className="text-sm">{t("consumption")}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={includeSections.activity}
                      onChange={(e) => setIncludeSections({...includeSections, activity: e.target.checked})}
                    />
                    <span className="text-sm">{t("activityLog")}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={includeSections.meetings}
                      onChange={(e) => setIncludeSections({...includeSections, meetings: e.target.checked})}
                    />
                    <span className="text-sm">{t("scheduledMeetings")}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={includeSections.marketValues}
                      onChange={(e) => setIncludeSections({...includeSections, marketValues: e.target.checked})}
                    />
                    <span className="text-sm">{t("marketValues")}</span>
                  </label>
                </div>
              </div>
              <Button 
                className="w-full gap-2"
                onClick={handleGeneratePreview}
                disabled={!selectedBuildingId}
              >
                <Eye className="w-4 h-4" />
                {t("previewReport")}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
{t("exportExcel")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="excel-data">{t("dataToExport")}</Label>
                <select className="w-full p-2 border rounded">
                  <option value="financial">{t("financialData")}</option>
                  <option value="consumption">{t("consumptionData")}</option>
                  <option value="equipment">{t("equipmentData")}</option>
                  <option value="requests">{t("requestsData")}</option>
                  <option value="all">{t("allData")}</option>
                </select>
              </div>
              <div>
                <Label htmlFor="excel-format">{t("format")}</Label>
                <select className="w-full p-2 border rounded">
                  <option value="xlsx">Excel (.xlsx)</option>
                  <option value="csv">CSV (.csv)</option>
                  <option value="ods">OpenDocument (.ods)</option>
                </select>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 {t("excelIncludesCharts")}
                </p>
              </div>
              <Button className="w-full gap-2" variant="outline">
                <FileSpreadsheet className="w-4 h-4" />
{t("exportExcel")}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Financial and Operational Information Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t("additionalInformation")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">{t("financialInformation")}</h3>
                <div>
                  <Label htmlFor="sale-value">{t("averageSaleValue")}</Label>
                  <Input 
                    id="sale-value"
                    placeholder={t("saleValuePlaceholder")}
                    value={apartmentSaleValue}
                    onChange={(e) => setApartmentSaleValue(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{t("saleValueHint")}</p>
                </div>
                <div>
                  <Label htmlFor="rental-value">{t("averageRentalValue")}</Label>
                  <Input 
                    id="rental-value"
                    placeholder={t("rentalValuePlaceholder")}
                    value={apartmentRentalValue}
                    onChange={(e) => setApartmentRentalValue(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{t("rentalValueHint")}</p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">{t("operationalInformation")}</h3>
                <div>
                  <Label htmlFor="meetings">{t("scheduledMeetings")}</Label>
                  <Textarea 
                    id="meetings"
                    placeholder={t("meetingsPlaceholder")}
                    rows={3}
                    value={scheduledMeetings}
                    onChange={(e) => setScheduledMeetings(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="activities">{t("workActivities")}</Label>
                  <Textarea 
                    id="activities"
                    placeholder={t("activitiesPlaceholder")}
                    rows={3}
                    value={workActivities}
                    onChange={(e) => setWorkActivities(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
{t("customizableTemplates")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t("executiveTemplate")}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("executiveSummaryReport")}
                </p>
                <Button variant="outline" size="sm">{t("customize")}</Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t("technicalTemplate")}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("detailedTechnicalReport")}
                </p>
                <Button variant="outline" size="sm">{t("customize")}</Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t("financialTemplate")}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("focusFinancialAnalysis")}
                </p>
                <Button variant="outline" size="sm">{t("customize")}</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
{t("reportHistory")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{t("monthlyReport")} - Março 2024</h3>
                  <p className="text-sm text-muted-foreground">{t("generatedOn")} 15/03/2024 {t("at")} 14:30</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-3 h-3" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="w-3 h-3" />
{t("send")}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{t("financialReport")} - Q1 2024</h3>
                  <p className="text-sm text-muted-foreground">{t("generatedOn")} 01/04/2024 {t("at")} 09:15</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-3 h-3" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="w-3 h-3" />
{t("send")}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
{t("emailAttachments")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipient-emails">{t("recipients")}</Label>
                <textarea 
                  className="w-full p-2 border rounded resize-none" 
                  rows={3}
                  placeholder="sindico@condominio.com&#10;administracao@empresa.com&#10;contabilidade@empresa.com"
                ></textarea>
              </div>
              <div>
                <Label htmlFor="email-subject">{t("emailSubject")}</Label>
                <Input id="email-subject" placeholder={t("monthlyReportPlaceholder")} />
                <Label htmlFor="email-message" className="mt-2 block">{t("message")}</Label>
                <textarea 
                  className="w-full p-2 border rounded resize-none" 
                  rows={2}
                  placeholder={t("attachmentMessage")}
                ></textarea>
              </div>
            </div>
            <Button className="mt-4 gap-2">
              <Mail className="w-4 h-4" />
{t("sendReportByEmail")}
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t("relatedFeatures")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t("customizableTemplates")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("customizableTemplatesDesc")}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t("automaticSaveAndTracking")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("automaticSaveAndTrackingDesc")}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t("emailAttachmentSending")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("emailAttachmentSendingDesc")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
      
      {/* Report Preview Dialog */}
      <Dialog open={showReportPreview} onOpenChange={setShowReportPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{t("reportPreview")}</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingReport(!isEditingReport)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  {isEditingReport ? t("doneEditing") : t("editReport")}
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription>
              {t("reviewAndEditReport")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            {isEditingReport ? (
              <Textarea
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
            ) : (
              <div className="report-preview">
                <div dangerouslySetInnerHTML={{ __html: reportContent }} />
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowReportPreview(false)}>
              {t("cancel")}
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1" />
              {t("print")}
            </Button>
            <Button onClick={handleGeneratePDF}>
              <Download className="w-4 h-4 mr-1" />
              {t("generatePDF")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}