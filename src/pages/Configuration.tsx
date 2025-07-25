import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Settings, Clock, Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Configuration() {
  const [selectedSemester, setSelectedSemester] = useState('');
  const [applyGlobally, setApplyGlobally] = useState(true);
  const [startOfDay, setStartOfDay] = useState('08:50');
  const [qcpcEnabled, setQcpcEnabled] = useState(true);
  const [qcpcStartTime, setQcpcStartTime] = useState('08:50');
  const [qcpcEndTime, setQcpcEndTime] = useState('09:05');
  const [classStartTime, setClassStartTime] = useState('09:05');
  const [classEndTime, setClassEndTime] = useState('16:15');
  const [breakTimes, setBreakTimes] = useState([
    { name: 'Morning Break', start: '10:50', end: '11:10' }
  ]);
  const [lunchStart, setLunchStart] = useState('12:50');
  const [lunchEnd, setLunchEnd] = useState('13:30');
  
  const { toast } = useToast();

  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const addBreakTime = () => {
    setBreakTimes([...breakTimes, { name: '', start: '', end: '' }]);
  };

  const removeBreakTime = (index: number) => {
    setBreakTimes(breakTimes.filter((_, i) => i !== index));
  };

  const updateBreakTime = (index: number, field: string, value: string) => {
    const updated = [...breakTimes];
    updated[index] = { ...updated[index], [field]: value };
    setBreakTimes(updated);
  };

  const handleSave = () => {
    toast({
      title: "Configuration Saved Successfully!",
      description: applyGlobally ? "Settings applied globally to all semesters" : `Settings applied to Semester ${selectedSemester}`,
    });
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
              Configure time slots, breaks, and QCPC settings for timetable generation
            </p>
          </div>
          <div className="course-card-blue p-3 rounded-xl">
            <Settings className="w-8 h-8" />
          </div>
        </div>

        {/* Scope Selection */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Configuration Scope</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="applyGlobally"
                    checked={applyGlobally}
                    onCheckedChange={setApplyGlobally}
                  />
                  <label htmlFor="applyGlobally" className="text-sm font-medium">
                    Apply settings globally to all semesters
                  </label>
                </div>
                
                {!applyGlobally && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Specific Semester</label>
                    <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((semester) => (
                          <SelectItem key={semester} value={semester}>
                            Semester {semester}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Configuration */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Daily Time Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start of Day</label>
                <Input
                  type="time"
                  value={startOfDay}
                  onChange={(e) => setStartOfDay(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Class Start Time</label>
                <Input
                  type="time"
                  value={classStartTime}
                  onChange={(e) => setClassStartTime(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Class End Time</label>
                <Input
                  type="time"
                  value={classEndTime}
                  onChange={(e) => setClassEndTime(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QCPC Configuration */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>QCPC Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="qcpcEnabled"
                  checked={qcpcEnabled}
                  onCheckedChange={setQcpcEnabled}
                />
                <label htmlFor="qcpcEnabled" className="text-sm font-medium">
                  Enable QCPC Slot
                </label>
              </div>

              {qcpcEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">QCPC Start Time</label>
                    <Input
                      type="time"
                      value={qcpcStartTime}
                      onChange={(e) => setQcpcStartTime(e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">QCPC End Time</label>
                    <Input
                      type="time"
                      value={qcpcEndTime}
                      onChange={(e) => setQcpcEndTime(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Break Times Configuration */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Break Times</span>
              <Button 
                onClick={addBreakTime}
                size="sm"
                className="flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Break</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {breakTimes.map((breakTime, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Break Name</label>
                    <Input
                      placeholder="e.g., Morning Break"
                      value={breakTime.name}
                      onChange={(e) => updateBreakTime(index, 'name', e.target.value)}
                      className="h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Time</label>
                    <Input
                      type="time"
                      value={breakTime.start}
                      onChange={(e) => updateBreakTime(index, 'start', e.target.value)}
                      className="h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Time</label>
                    <Input
                      type="time"
                      value={breakTime.end}
                      onChange={(e) => updateBreakTime(index, 'end', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium opacity-0">Actions</label>
                    <Button
                      onClick={() => removeBreakTime(index)}
                      variant="outline"
                      size="sm"
                      className="h-10 w-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lunch Break Configuration */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Lunch Break</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Lunch Start Time</label>
                <Input
                  type="time"
                  value={lunchStart}
                  onChange={(e) => setLunchStart(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Lunch End Time</label>
                <Input
                  type="time"
                  value={lunchEnd}
                  onChange={(e) => setLunchEnd(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </Button>
        </div>
      </div>
    </Layout>
  );
}