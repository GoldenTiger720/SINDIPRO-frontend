import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, Settings, Mail, FileSpreadsheet, History } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTranslation } from "react-i18next";

export default function Reports() {
  const { t } = useTranslation();

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
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">{t("managementStatus")}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">{t("equipmentInfo")}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">{t("finances")}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">{t("consumption")}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">{t("activityLog")}</span>
                  </label>
                </div>
              </div>
              <Button className="w-full gap-2">
                <Download className="w-4 h-4" />
{t("generatePDF")}
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
    </div>
  );
}