import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search, Download, Share, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SupplierContact {
  id: string;
  companyName: string;
  contactPerson: string;
  phoneNumbers: string[];
  emailAddress: string;
  serviceCategory: string;
  notes: string;
  condominium: string;
}

interface PhoneDirectoryProps {
  supplierContacts: SupplierContact[];
  setSupplierContacts: React.Dispatch<React.SetStateAction<SupplierContact[]>>;
}

export const PhoneDirectory = ({ supplierContacts, setSupplierContacts }: PhoneDirectoryProps) => {
  const { t } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondominium, setSelectedCondominium] = useState("all");
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  
  // Form state for creating new contacts
  const [newContactForm, setNewContactForm] = useState({
    companyName: '',
    contactPerson: '',
    phoneNumbers: '',
    emailAddress: '',
    serviceCategory: '',
    notes: '',
    condominium: ''
  });

  const serviceCategories = [
    { value: "elevatorMaintenance", label: t("elevatorMaintenance") },
    { value: "securityServices", label: t("securityServices") },
    { value: "cleaningServices", label: t("cleaningServices") },
    { value: "constructionServices", label: t("constructionServices") },
    { value: "plumbingServices", label: t("plumbingServices") },
    { value: "electricalServices", label: t("electricalServices") },
    { value: "landscapingServices", label: t("landscapingServices") }
  ];

  const filteredContacts = supplierContacts.filter(contact => {
    const matchesSearch = contact.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || contact.serviceCategory === selectedCategory;
    const matchesCondominium = selectedCondominium === "all" || contact.condominium === selectedCondominium;
    
    return matchesSearch && matchesCategory && matchesCondominium;
  });

  const handleCallContact = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`);
  };

  const handleEmailContact = (email: string) => {
    window.open(`mailto:${email}`);
  };

  const handleCreateContact = () => {
    if (!newContactForm.companyName || !newContactForm.contactPerson || !newContactForm.phoneNumbers) {
      return;
    }

    const newContact: SupplierContact = {
      id: Date.now().toString(),
      companyName: newContactForm.companyName,
      contactPerson: newContactForm.contactPerson,
      phoneNumbers: newContactForm.phoneNumbers.split(',').map(p => p.trim()),
      emailAddress: newContactForm.emailAddress,
      serviceCategory: newContactForm.serviceCategory,
      notes: newContactForm.notes,
      condominium: newContactForm.condominium || "Edifício Central"
    };

    setSupplierContacts(prev => [...prev, newContact]);
    setNewContactForm({
      companyName: '',
      contactPerson: '',
      phoneNumbers: '',
      emailAddress: '',
      serviceCategory: '',
      notes: '',
      condominium: ''
    });
    setIsAddContactDialogOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t("filterByServiceType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                {serviceCategories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCondominium} onValueChange={setSelectedCondominium}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t("filterByCondominium")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                <SelectItem value="Edifício Central">Edifício Central</SelectItem>
                <SelectItem value="Residencial Park">Residencial Park</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t("exportContacts")}</span>
            <span className="sm:hidden">{t("export")}</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Share className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t("shareContacts")}</span>
            <span className="sm:hidden">{t("share")}</span>
          </Button>
          
          <Dialog open={isAddContactDialogOpen} onOpenChange={setIsAddContactDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 sm:flex-none">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t("addSupplierContact")}</span>
                <span className="sm:hidden">{t("add")}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg">{t("addSupplierContact")}</DialogTitle>
                <DialogDescription className="text-sm">
                  {t("addNew")} {t("supplierContacts").toLowerCase()}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="companyName" className="text-sm">{t("companyProviderName")}</Label>
                  <Input 
                    id="companyName" 
                    placeholder={t("companyProviderName")}
                    value={newContactForm.companyName}
                    onChange={(e) => setNewContactForm(prev => ({...prev, companyName: e.target.value}))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contactPerson" className="text-sm">{t("contactPerson")}</Label>
                  <Input 
                    id="contactPerson" 
                    placeholder={t("contactPerson")}
                    value={newContactForm.contactPerson}
                    onChange={(e) => setNewContactForm(prev => ({...prev, contactPerson: e.target.value}))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-sm">{t("phoneNumbers")}</Label>
                  <Input 
                    id="phone" 
                    placeholder="(11) 1234-5678, (11) 9999-8888"
                    value={newContactForm.phoneNumbers}
                    onChange={(e) => setNewContactForm(prev => ({...prev, phoneNumbers: e.target.value}))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm">{t("emailAddress")}</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="contato@empresa.com"
                    value={newContactForm.emailAddress}
                    onChange={(e) => setNewContactForm(prev => ({...prev, emailAddress: e.target.value}))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category" className="text-sm">{t("serviceCategory")}</Label>
                  <Select onValueChange={(value) => setNewContactForm(prev => ({...prev, serviceCategory: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("serviceCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="condominium" className="text-sm">{t("linkedCondominium")}</Label>
                  <Select onValueChange={(value) => setNewContactForm(prev => ({...prev, condominium: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("linkedCondominium")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Edifício Central">Edifício Central</SelectItem>
                      <SelectItem value="Residencial Park">Residencial Park</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes" className="text-sm">{t("notes")}</Label>
                  <Textarea 
                    id="notes" 
                    placeholder={t("notes")}
                    value={newContactForm.notes}
                    onChange={(e) => setNewContactForm(prev => ({...prev, notes: e.target.value}))}
                    className="min-h-[60px]"
                  />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsAddContactDialogOpen(false)} className="flex-1 sm:flex-none">
                  {t("cancel")}
                </Button>
                <Button onClick={handleCreateContact} className="flex-1 sm:flex-none">
                  {t("save")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg leading-tight">{contact.companyName}</CardTitle>
              <CardDescription>
                <Badge variant="secondary" className="text-xs">
                  {serviceCategories.find(cat => cat.value === contact.serviceCategory)?.label}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium text-sm sm:text-base">{contact.contactPerson}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{contact.condominium}</p>
              </div>
              
              <div className="space-y-2">
                {contact.phoneNumbers.map((phone, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs sm:text-sm"
                    onClick={() => handleCallContact(phone)}
                  >
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{phone}</span>
                  </Button>
                ))}
                
                {contact.emailAddress && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs sm:text-sm"
                    onClick={() => handleEmailContact(contact.emailAddress)}
                  >
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{contact.emailAddress}</span>
                  </Button>
                )}
              </div>

              {contact.notes && (
                <div className="pt-2 border-t">
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{contact.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};