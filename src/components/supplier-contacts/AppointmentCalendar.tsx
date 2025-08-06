import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Calendar, Clock, Users, MapPin, Grid3x3, List, ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface AppointmentEvent {
  id: string;
  title: string;
  eventType: string;
  dateTime: Date;
  condominium: string;
  peopleInvolved: string[];
  comments: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface AppointmentCalendarProps {
  appointmentEvents: AppointmentEvent[];
  setAppointmentEvents: React.Dispatch<React.SetStateAction<AppointmentEvent[]>>;
}

export const AppointmentCalendar = ({ appointmentEvents, setAppointmentEvents }: AppointmentCalendarProps) => {
  const { t } = useTranslation();
  
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<'monthly' | 'daily' | 'list'>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    reminderTime: '24', // hours before event
    autoReminders: true
  });
  
  // Form state for creating new events
  const [newEventForm, setNewEventForm] = useState({
    title: '',
    eventType: '',
    dateTime: '',
    condominium: '',
    peopleInvolved: '',
    comments: ''
  });

  const eventTypes = [
    { value: "meetingEvent", label: t("meetingEvent") },
    { value: "inspectionEvent", label: t("inspectionEvent") },
    { value: "generalAssemblyEvent", label: t("generalAssemblyEvent") },
    { value: "technicalVisitEvent", label: t("technicalVisitEvent") },
    { value: "maintenanceEvent", label: t("maintenanceEvent") },
    { value: "repairEvent", label: t("repairEvent") }
  ];

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    return appointmentEvents.filter(event => {
      const eventDate = new Date(event.dateTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleCreateEvent = () => {
    if (!newEventForm.title || !newEventForm.eventType || !newEventForm.dateTime) {
      return;
    }

    const newEvent: AppointmentEvent = {
      id: Date.now().toString(),
      title: newEventForm.title,
      eventType: newEventForm.eventType,
      dateTime: new Date(newEventForm.dateTime),
      condominium: newEventForm.condominium || "Edifício Central",
      peopleInvolved: newEventForm.peopleInvolved.split(',').map(p => p.trim()).filter(p => p),
      comments: newEventForm.comments,
      status: 'pending'
    };

    setAppointmentEvents(prev => [...prev, newEvent]);
    setNewEventForm({
      title: '',
      eventType: '',
      dateTime: '',
      condominium: '',
      peopleInvolved: '',
      comments: ''
    });
    setIsAddEventDialogOpen(false);
  };

  const renderMonthlyCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-1 sm:p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const events = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={day}
          className={`p-1 sm:p-2 border border-border min-h-[60px] sm:min-h-[100px] ${
            isToday ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
          }`}
        >
          <div className={`font-semibold text-xs sm:text-sm mb-1 ${isToday ? 'text-primary' : ''}`}>
            {day}
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            {events.slice(0, calendarView === 'monthly' ? (window.innerWidth < 640 ? 1 : 2) : 2).map((event) => (
              <div
                key={event.id}
                className={`text-[10px] sm:text-xs p-0.5 sm:p-1 rounded text-white truncate ${
                  event.status === 'confirmed' ? 'bg-green-500' :
                  event.status === 'pending' ? 'bg-yellow-500' :
                  event.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'
                }`}
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {events.length > (window.innerWidth < 640 ? 1 : 2) && (
              <div className="text-[10px] sm:text-xs text-muted-foreground">
                +{events.length - (window.innerWidth < 640 ? 1 : 2)} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex gap-1 sm:gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')} className="px-2 sm:px-3">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())} className="px-2 sm:px-3 text-xs sm:text-sm">
              {t("today")}
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')} className="px-2 sm:px-3">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0 border border-border rounded-md overflow-hidden">
          {dayNames.map(day => (
            <div key={day} className="p-1 sm:p-2 bg-muted font-semibold text-center border-r border-border text-xs sm:text-sm">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.slice(0, 1)}</span>
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  const renderDailyCalendar = () => {
    const events = getEventsForDate(currentDate).sort((a, b) => 
      a.dateTime.getTime() - b.dateTime.getTime()
    );

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-lg font-semibold leading-tight">
            <span className="hidden sm:inline">
              {currentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <span className="sm:hidden">
              {currentDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </h3>
          <div className="flex gap-1 sm:gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateDay('prev')} className="px-2 sm:px-3">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())} className="px-2 sm:px-3 text-xs sm:text-sm">
              {t("today")}
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateDay('next')} className="px-2 sm:px-3">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
              No events scheduled for this day
            </div>
          ) : (
            events.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm sm:text-base truncate">{event.title}</h4>
                        <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                          {event.status}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                          {event.dateTime.toLocaleTimeString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="truncate">{event.condominium}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="truncate">{event.peopleInvolved.join(", ")}</span>
                        </div>
                      </div>
                      
                      {event.comments && (
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2">{event.comments}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm">{t("editEvent")}</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Calendar Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
            <Select>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t("filterByEventType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                {eventTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
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

          {/* Calendar View Toggle */}
          <div className="flex items-center border border-border rounded-md">
            <Button
              variant={calendarView === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCalendarView('monthly')}
              className="rounded-r-none border-r px-2 sm:px-3"
            >
              <Grid3x3 className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">{t("monthlyView")}</span>
            </Button>
            <Button
              variant={calendarView === 'daily' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCalendarView('daily')}
              className="rounded-none border-r px-2 sm:px-3"
            >
              <Calendar className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">{t("dailyView")}</span>
            </Button>
            <Button
              variant={calendarView === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCalendarView('list')}
              className="rounded-l-none px-2 sm:px-3"
            >
              <List className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">{t("listView")}</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          {/* Notification Settings */}
          <Dialog open={isNotificationSettingsOpen} onOpenChange={setIsNotificationSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t("notificationSettings")}</span>
                <span className="sm:hidden">{t("notifications")}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg">{t("automaticNotifications")}</DialogTitle>
                <DialogDescription className="text-sm">
                  {t("configureEventReminders")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <Label className="text-sm">{t("emailNotifications")}</Label>
                    <p className="text-xs text-muted-foreground">
                      {t("receiveNotificationsViaEmail")}
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings(prev => ({
                        ...prev,
                        emailNotifications: checked
                      }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <Label className="text-sm">{t("pushNotifications")}</Label>
                    <p className="text-xs text-muted-foreground">
                      {t("receivePushNotifications")}
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings(prev => ({
                        ...prev,
                        pushNotifications: checked
                      }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <Label className="text-sm">{t("autoReminders")}</Label>
                    <p className="text-xs text-muted-foreground">
                      {t("automaticReminderEnabled")}
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.autoReminders}
                    onCheckedChange={(checked) =>
                      setNotificationSettings(prev => ({
                        ...prev,
                        autoReminders: checked
                      }))
                    }
                  />
                </div>

                {notificationSettings.autoReminders && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="reminderTime" className="text-sm">{t("reminderTime")}</Label>
                      <Select
                        value={notificationSettings.reminderTime}
                        onValueChange={(value) =>
                          setNotificationSettings(prev => ({
                            ...prev,
                            reminderTime: value
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">{t("1HourBefore")}</SelectItem>
                          <SelectItem value="2">{t("2HoursBefore")}</SelectItem>
                          <SelectItem value="24">{t("1DayBefore")}</SelectItem>
                          <SelectItem value="48">{t("2DaysBefore")}</SelectItem>
                          <SelectItem value="168">{t("1WeekBefore")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button onClick={() => setIsNotificationSettingsOpen(false)} className="w-full sm:w-auto">
                  {t("save")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Create Event Dialog */}
          <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 sm:flex-none">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t("createEvent")}</span>
                <span className="sm:hidden">{t("create")}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg">{t("createEvent")}</DialogTitle>
                <DialogDescription className="text-sm">
                  {t("eventScheduling")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="eventTitle" className="text-sm">{t("requestTitle")}</Label>
                  <Input 
                    id="eventTitle" 
                    placeholder={t("requestTitle")}
                    value={newEventForm.title}
                    onChange={(e) => setNewEventForm(prev => ({...prev, title: e.target.value}))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="eventType" className="text-sm">{t("eventType")}</Label>
                  <Select onValueChange={(value) => setNewEventForm(prev => ({...prev, eventType: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("eventType")} />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dateTime" className="text-sm">{t("dateTime")}</Label>
                  <Input 
                    id="dateTime" 
                    type="datetime-local"
                    value={newEventForm.dateTime}
                    onChange={(e) => setNewEventForm(prev => ({...prev, dateTime: e.target.value}))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="condominium" className="text-sm">{t("linkedCondominium")}</Label>
                  <Select onValueChange={(value) => setNewEventForm(prev => ({...prev, condominium: value}))}>
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
                  <Label htmlFor="people" className="text-sm">{t("peopleInvolved")}</Label>
                  <Input 
                    id="people" 
                    placeholder={t("peopleInvolved")}
                    value={newEventForm.peopleInvolved}
                    onChange={(e) => setNewEventForm(prev => ({...prev, peopleInvolved: e.target.value}))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="eventComments" className="text-sm">{t("comments")}</Label>
                  <Textarea 
                    id="eventComments" 
                    placeholder={t("comments")}
                    value={newEventForm.comments}
                    onChange={(e) => setNewEventForm(prev => ({...prev, comments: e.target.value}))}
                    className="min-h-[60px]"
                  />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsAddEventDialogOpen(false)} className="flex-1 sm:flex-none">
                  {t("cancel")}
                </Button>
                <Button onClick={handleCreateEvent} className="flex-1 sm:flex-none">
                  {t("createEvent")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar Views */}
      <div className="space-y-6">
        {calendarView === 'monthly' && renderMonthlyCalendar()}
        {calendarView === 'daily' && renderDailyCalendar()}
        {calendarView === 'list' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">{t("upcomingEvents")}</h3>
              <div className="space-y-4">
                {appointmentEvents
                  .filter(event => event.dateTime > new Date())
                  .map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{event.title}</h4>
                            <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'}>
                              {event.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {event.dateTime.toLocaleDateString()} - {event.dateTime.toLocaleTimeString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.condominium}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {event.peopleInvolved.join(", ")}
                            </div>
                          </div>
                          
                          {event.comments && (
                            <p className="text-sm text-muted-foreground mt-2">{event.comments}</p>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">{t("editEvent")}</Button>
                          <Button variant="destructive" size="sm">{t("deleteEvent")}</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t("pastEvents")}</h3>
              <div className="space-y-4">
                {appointmentEvents
                  .filter(event => event.dateTime <= new Date())
                  .map((event) => (
                  <Card key={event.id} className="opacity-75">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{event.title}</h4>
                            <Badge variant="outline">{t("completed")}</Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {event.dateTime.toLocaleDateString()} - {event.dateTime.toLocaleTimeString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.condominium}
                            </div>
                          </div>
                          
                          {event.comments && (
                            <p className="text-sm text-muted-foreground mt-2">{event.comments}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};