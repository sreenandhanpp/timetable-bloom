import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Settings, Clock, Coffee, ArrowLeft, Save, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConfigPayload, createConfig, getConfigDetails, updateConfig } from '@/api/config.api';

export default function Configuration() {
  const [globalSettings, setGlobalSettings] = useState({
    startOfDay: '8:50',
    qcpcEnabled: true,
    qcpcStart: '8:50',
    qcpcEnd: '9:05',
    classStart: '9:05',
    classEnd: '16:15',
    lunchStart: '12:50',
    lunchEnd: '13:30',
    periodBeforeLunch: 50,   // NEW: Period duration before lunch (minutes)
    periodAfterLunch: 50     // NEW: Period duration after lunch (minutes)
  });

  const [breaks, setBreaks] = useState([
    { id: 1, start: '10:50', end: '11:10', name: 'Morning Break' }
  ]);

  const [selectedSemester, setSelectedSemester] = useState('global');
  const [configId, setConfigId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const { toast } = useToast();

  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  /** Reset to default values */
  const resetDefaults = () => {
    setGlobalSettings({
      startOfDay: '8:50',
      qcpcEnabled: true,
      qcpcStart: '8:50',
      qcpcEnd: '9:05',
      classStart: '9:05',
      classEnd: '16:15',
      lunchStart: '12:50',
      lunchEnd: '13:30',
      periodBeforeLunch: 50,
      periodAfterLunch: 50
    });
    setBreaks([{ id: 1, start: '10:50', end: '11:10', name: 'Morning Break' }]);
  };

  /** Fetch existing config based on semester */
  const fetchConfig = async () => {
    setFetching(true);
    try {
      const semesterKey = selectedSemester === 'global' ? 'global' : selectedSemester;
      const data = await getConfigDetails(semesterKey);
      console.log("Fetched config data:", data);
      if (data) {
        setConfigId(data._id);
        setGlobalSettings({
          startOfDay: data.classStartTime,
          qcpcEnabled: data.qcpcEnabled,
          qcpcStart: data.qcpcTime?.start || '',
          qcpcEnd: data.qcpcTime?.end || '',
          classStart: data.classStartTime,
          classEnd: data.classEndTime,
          lunchStart: data.lunchBreak?.start,
          lunchEnd: data.lunchBreak?.end,
          periodBeforeLunch: data.periodBeforeLunch || 50,
          periodAfterLunch: data.periodAfterLunch || 50
        });
        setBreaks(data.breaks || []);
      } else {
        setConfigId(null);
        resetDefaults();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch configuration.",
        variant: "destructive",
      });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [selectedSemester]);

  /** Save or update configuration */
  const handleSave = async () => {
    setLoading(true);
    try {
      const payload: ConfigPayload = {
        semester: selectedSemester === 'global' ? 'global' : parseInt(selectedSemester),
        startOfDay: globalSettings.startOfDay,
        qcpcEnabled: globalSettings.qcpcEnabled,
        qcpcStart: globalSettings.qcpcEnabled ? globalSettings.qcpcStart : undefined,
        qcpcEnd: globalSettings.qcpcEnabled ? globalSettings.qcpcEnd : undefined,
        classStart: globalSettings.classStart,
        classEnd: globalSettings.classEnd,
        lunchStart: globalSettings.lunchStart,
        lunchEnd: globalSettings.lunchEnd,
        periodBeforeLunch: globalSettings.periodBeforeLunch, // Save new field
        periodAfterLunch: globalSettings.periodAfterLunch,   // Save new field
        breaks
      };

      if (configId) {
        await updateConfig(configId, payload);
        toast({ title: "Updated!", description: "Configuration updated successfully." });
      } else {
        await createConfig(payload);
        toast({ title: "Added!", description: "Configuration added successfully." });
      }

      fetchConfig();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to save configuration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /** Break handlers */
  const addBreak = () => {
    const newBreak = {
      id: Date.now(),
      start: '14:00',
      end: '14:15',
      name: 'Afternoon Break'
    };
    setBreaks([...breaks, newBreak]);
  };

  const removeBreak = (id: number) => {
    setBreaks(breaks.filter(br => br.id !== id));
  };

  const updateBreak = (id: number, field: string, value: string) => {
    setBreaks(breaks.map(br =>
      br.id === id ? { ...br, [field]: value } : br
    ));
  };

  const updateGlobalSetting = (field: string, value: string | number | boolean) => {
    setGlobalSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout userType="admin" userName="Administrator">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Link to="/admin">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Configuration</h1>
            </div>
            <p className="text-muted-foreground">
              Manage timetable settings, time slots, and academic schedules
            </p>
          </div>
          <div className="course-card-green p-3 rounded-xl">
            <Settings className="w-8 h-8" />
          </div>
        </div>

        {/* Semester Selection */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Scope Selection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Label htmlFor="scope">Apply settings to:</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">All Semesters (Global)</SelectItem>
                  {semesters.map((semester) => (
                    <SelectItem key={semester} value={semester}>
                      Semester {semester} Only
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSemester !== 'global' && (
                <Badge variant="outline" className="course-card-blue">
                  Semester-specific settings
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Form Section */}
        {fetching ? (
          <p className="text-center text-gray-500">Loading configuration...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Time Settings */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Basic Time Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="startOfDay">Start of Day</Label>
                    <Input
                      id="startOfDay"
                      type="time"
                      value={globalSettings.startOfDay}
                      onChange={(e) => updateGlobalSetting('startOfDay', e.target.value)}
                      className="h-11"
                    />
                  </div>

                  {/* QCPC */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="qcpcEnabled">QCPC Slot</Label>
                      <Switch
                        id="qcpcEnabled"
                        checked={globalSettings.qcpcEnabled}
                        onCheckedChange={(checked) => updateGlobalSetting('qcpcEnabled', checked)}
                      />
                    </div>
                    
                    {globalSettings.qcpcEnabled && (
                      <div className="grid grid-cols-2 gap-4 pl-6 border-l-2 border-primary/20">
                        <div className="space-y-2">
                          <Label htmlFor="qcpcStart">QCPC Start</Label>
                          <Input
                            id="qcpcStart"
                            type="time"
                            value={globalSettings.qcpcStart}
                            onChange={(e) => updateGlobalSetting('qcpcStart', e.target.value)}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="qcpcEnd">QCPC End</Label>
                          <Input
                            id="qcpcEnd"
                            type="time"
                            value={globalSettings.qcpcEnd}
                            onChange={(e) => updateGlobalSetting('qcpcEnd', e.target.value)}
                            className="h-11"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Class Start & End */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="classStart">Class Start Time</Label>
                      <Input
                        id="classStart"
                        type="time"
                        value={globalSettings.classStart}
                        onChange={(e) => updateGlobalSetting('classStart', e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="classEnd">Class End Time</Label>
                      <Input
                        id="classEnd"
                        type="time"
                        value={globalSettings.classEnd}
                        onChange={(e) => updateGlobalSetting('classEnd', e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>

                  {/* NEW: Period Duration Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="periodBeforeLunch">Period Duration Before Lunch (min)</Label>
                      <Input
                        id="periodBeforeLunch"
                        type="number"
                        value={globalSettings.periodBeforeLunch}
                        onChange={(e) => updateGlobalSetting('periodBeforeLunch', parseInt(e.target.value))}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="periodAfterLunch">Period Duration After Lunch (min)</Label>
                      <Input
                        id="periodAfterLunch"
                        type="number"
                        value={globalSettings.periodAfterLunch}
                        onChange={(e) => updateGlobalSetting('periodAfterLunch', parseInt(e.target.value))}
                        className="h-11"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Break Times */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Coffee className="w-5 h-5" />
                      <span>Break Times</span>
                    </div>
                    <Button onClick={addBreak} size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Break
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Lunch Break</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="lunchStart">Start Time</Label>
                        <Input
                          id="lunchStart"
                          type="time"
                          value={globalSettings.lunchStart}
                          onChange={(e) => updateGlobalSetting('lunchStart', e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lunchEnd">End Time</Label>
                        <Input
                          id="lunchEnd"
                          type="time"
                          value={globalSettings.lunchEnd}
                          onChange={(e) => updateGlobalSetting('lunchEnd', e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Other Breaks</Label>
                    {breaks.map((breakItem) => (
                      <div key={breakItem.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <Input
                            placeholder="Break name"
                            value={breakItem.name}
                            onChange={(e) => updateBreak(breakItem.id, 'name', e.target.value)}
                            className="h-9"
                          />
                          <Button
                            onClick={() => removeBreak(breakItem.id)}
                            size="sm"
                            variant="outline"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Start Time</Label>
                            <Input
                              type="time"
                              value={breakItem.start}
                              onChange={(e) => updateBreak(breakItem.id, 'start', e.target.value)}
                              className="h-9"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Time</Label>
                            <Input
                              type="time"
                              value={breakItem.end}
                              onChange={(e) => updateBreak(breakItem.id, 'end', e.target.value)}
                              className="h-9"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview and Save */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Time Slot Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-6">
                  {globalSettings.qcpcEnabled && (
                    <div className="p-3 rounded-lg course-card-green text-center">
                      <div className="font-semibold text-sm">QCPC</div>
                      <div className="text-xs opacity-80">{globalSettings.qcpcStart} - {globalSettings.qcpcEnd}</div>
                    </div>
                  )}
                  
                  <div className="p-3 rounded-lg course-card-blue text-center">
                    <div className="font-semibold text-sm">Period (Before Lunch)</div>
                    <div className="text-xs opacity-80">{globalSettings.periodBeforeLunch} min</div>
                  </div>

                  <div className="p-3 rounded-lg bg-orange-100 text-orange-800 text-center">
                    <div className="font-semibold text-sm">Lunch</div>
                    <div className="text-xs opacity-80">{globalSettings.lunchStart} - {globalSettings.lunchEnd}</div>
                  </div>

                  <div className="p-3 rounded-lg course-card-blue text-center">
                    <div className="font-semibold text-sm">Period (After Lunch)</div>
                    <div className="text-xs opacity-80">{globalSettings.periodAfterLunch} min</div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{configId ? 'Update Configuration' : 'Add Configuration'}</span>
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" onClick={resetDefaults}>
                    Reset to Defaults
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
