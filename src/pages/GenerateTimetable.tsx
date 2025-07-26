import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Settings, Download, ArrowLeft, Zap, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GenerateTimetable() {
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [includeQCPC, setIncludeQCPC] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [timetableGenerated, setTimetableGenerated] = useState(false);
  const { toast } = useToast();

  const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Information Technology'
  ];

  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const timeSlots = [
    { label: 'QCPC', time: '8:50 AM - 9:05 AM', type: 'qcpc' },
    { label: 'Period 1', time: '9:05 AM - 10:00 AM', type: 'class' },
    { label: 'Period 2', time: '10:00 AM - 10:50 AM', type: 'class' },
    { label: 'Break', time: '10:50 AM - 11:10 AM', type: 'break' },
    { label: 'Period 3', time: '11:10 AM - 12:00 PM', type: 'class' },
    { label: 'Period 4', time: '12:00 PM - 12:50 PM', type: 'class' },
    { label: 'Lunch', time: '12:50 PM - 1:30 PM', type: 'lunch' },
    { label: 'Period 5', time: '1:30 PM - 2:20 PM', type: 'class' },
    { label: 'Period 6', time: '2:20 PM - 3:10 PM', type: 'class' },
    { label: 'Period 7', time: '3:10 PM - 4:00 PM', type: 'class' },
    { label: 'Period 8', time: '4:00 PM - 4:15 PM', type: 'class' }
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Sample generated timetable data
  const generatedTimetable = {
    'Monday': {
      'Period 1': { subject: 'Data Structures', type: 'Lecture', faculty: 'Dr. Smith', room: 'Room 101' },
      'Period 2': { subject: 'Database Management', type: 'Lecture', faculty: 'Prof. Johnson', room: 'Room 102' },
      'Period 3': { subject: 'Programming Lab', type: 'Lab', faculty: 'Dr. Brown', room: 'Lab 1' },
      'Period 5': { subject: 'Computer Networks', type: 'Lecture', faculty: 'Dr. Wilson', room: 'Room 103' },
      'Period 6': { subject: 'Software Engineering', type: 'Lecture', faculty: 'Dr. Anderson', room: 'Room 104' },
    },
    'Tuesday': {
      'Period 1': { subject: 'Operating Systems', type: 'Lecture', faculty: 'Prof. Davis', room: 'Room 105' },
      'Period 2': { subject: 'Algorithms', type: 'Lecture', faculty: 'Dr. Taylor', room: 'Room 101' },
      'Period 3': { subject: 'Web Development', type: 'Lab', faculty: 'Dr. Brown', room: 'Lab 2' },
      'Period 5': { subject: 'Machine Learning', type: 'Lecture', faculty: 'Prof. White', room: 'Room 102' },
    },
    'Wednesday': {
      'Period 1': { subject: 'Computer Graphics', type: 'Lecture', faculty: 'Dr. Green', room: 'Room 103' },
      'Period 2': { subject: 'Database Lab', type: 'Lab', faculty: 'Prof. Johnson', room: 'Lab 3' },
      'Period 3': { subject: 'System Design', type: 'Lecture', faculty: 'Dr. Smith', room: 'Room 104' },
      'Period 5': { subject: 'Mobile Development', type: 'Lab', faculty: 'Dr. Wilson', room: 'Lab 1' },
    },
    'Thursday': {
      'Period 1': { subject: 'Artificial Intelligence', type: 'Lecture', faculty: 'Prof. Black', room: 'Room 105' },
      'Period 2': { subject: 'Cybersecurity', type: 'Lecture', faculty: 'Dr. Anderson', room: 'Room 101' },
      'Period 3': { subject: 'Network Lab', type: 'Lab', faculty: 'Dr. Wilson', room: 'Lab 4' },
      'Period 5': { subject: 'Data Mining', type: 'Lecture', faculty: 'Prof. Davis', room: 'Room 102' },
    },
    'Friday': {
      'Period 1': { subject: 'Project Work', type: 'Lab', faculty: 'Multiple Faculty', room: 'Lab 1-3' },
      'Period 2': { subject: 'Seminar', type: 'Lecture', faculty: 'Guest Speaker', room: 'Auditorium' },
      'Period 3': { subject: 'Industry Training', type: 'Lab', faculty: 'Industry Expert', room: 'Lab 2' },
    },
  };

  const handleGenerate = async () => {
    setGenerating(true);
    
    // Simulate timetable generation process
    setTimeout(() => {
      setTimetableGenerated(true);
      setGenerating(false);
      toast({
        title: "Timetable Generated Successfully!",
        description: `Generated optimized schedule for Semester ${selectedSemester} ${selectedDepartment}`,
      });
    }, 3000);
  };

  const getSubjectStyle = (type: string) => {
    if (type === 'Lab') return 'course-card-blue';
    return 'course-card-purple';
  };

  const canGenerate = selectedSemester && selectedDepartment;

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
              <h1 className="text-3xl font-bold">Generate Timetable</h1>
            </div>
            <p className="text-muted-foreground">
              Create optimized class schedules with intelligent automation
            </p>
          </div>
          <div className="course-card-blue p-3 rounded-xl">
            <Calendar className="w-8 h-8" />
          </div>
        </div>

        {/* Generation Form */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Timetable Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium">Semester</label>
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center space-x-2">
                  <span>Include QCPC in Timetable</span>
                </label>
                <div className="flex items-center space-x-2 h-11">
                  <Switch
                    checked={includeQCPC}
                    onCheckedChange={setIncludeQCPC}
                  />
                  <span className="text-sm text-muted-foreground">
                    {includeQCPC ? 'QCPC slot will be included' : 'QCPC slot excluded'}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={handleGenerate}
                  disabled={!canGenerate || generating}
                  className="flex items-center space-x-2 h-11"
                >
                  {generating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Generate My Timetable</span>
                    </>
                  )}
                </Button>
              </div>

              {timetableGenerated && (
                <div className="flex space-x-2">
                  <Button variant="outline" className="h-11">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button variant="outline" className="h-11">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              )}
            </div>

            {generating && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <div className="space-y-1">
                    <p className="font-medium">Generating optimized timetable...</p>
                    <p className="text-sm text-muted-foreground">
                      Analyzing constraints, allocating resources, and optimizing schedules
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generated Timetable Display */}
        {timetableGenerated && (
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Generated Timetable - Semester {selectedSemester} {selectedDepartment}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="course-card-purple">Lecture</Badge>
                  <Badge variant="outline" className="course-card-blue">Lab</Badge>
                  <Badge variant="secondary">Optimized</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="grid gap-2 min-w-[800px]" style={{ gridTemplateColumns: `120px repeat(${timeSlots.filter(slot => includeQCPC || slot.type !== 'qcpc').length}, 1fr)` }}>
                  {/* Header row */}
                  <div className="font-semibold text-center p-3 bg-muted rounded-lg">
                    Day / Time
                  </div>
                  {timeSlots.filter(slot => includeQCPC || slot.type !== 'qcpc').map((slot) => (
                    <div key={slot.label} className={`font-semibold text-center p-2 rounded-lg text-xs ${
                      slot.type === 'qcpc' ? 'course-card-green' :
                      slot.type === 'break' || slot.type === 'lunch' ? 'bg-orange-100 text-orange-800' :
                      'bg-muted'
                    }`}>
                      <div>{slot.label}</div>
                      <div className="text-xs opacity-80">{slot.time}</div>
                    </div>
                  ))}

                  {/* Days */}
                  {days.map((day) => (
                    <div key={day} className="contents">
                      <div className="text-sm font-medium text-center p-3 bg-card border rounded-lg flex items-center justify-center">
                        {day}
                      </div>
                      {timeSlots.filter(slot => includeQCPC || slot.type !== 'qcpc').map((slot) => {
                        if (slot.type === 'break' || slot.type === 'lunch') {
                          return (
                            <div
                              key={`${day}-${slot.label}`}
                              className="p-3 rounded-lg text-sm bg-orange-50 border border-orange-200 flex items-center justify-center"
                            >
                              <div className="text-center text-orange-700 font-medium">
                                {slot.type === 'break' ? 'Break' : 'Lunch'}
                              </div>
                            </div>
                          );
                        }

                        if (slot.type === 'qcpc') {
                          return (
                            <div
                              key={`${day}-${slot.label}`}
                              className="p-3 rounded-lg text-sm course-card-green flex items-center justify-center"
                            >
                              <div className="text-center font-medium">
                                QCPC
                              </div>
                            </div>
                          );
                        }

                        const classData = generatedTimetable[day]?.[slot.label];
                        return (
                          <div
                            key={`${day}-${slot.label}`}
                            className={`p-3 rounded-lg text-sm transition-all hover:scale-105 cursor-pointer ${
                              classData
                                ? `${getSubjectStyle(classData.type)} font-medium elevated-shadow`
                                : 'time-slot-empty'
                            }`}
                          >
                            {classData ? (
                              <div className="space-y-1">
                                <div className="font-semibold text-xs">{classData.subject}</div>
                                <div className="text-xs opacity-80">{classData.faculty}</div>
                                <div className="text-xs opacity-80">{classData.room}</div>
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs"
                                >
                                  {classData.type}
                                </Badge>
                              </div>
                            ) : (
                              <div className="text-center text-muted-foreground text-xs">
                                Free Period
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Optimization Stats</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• 95% room utilization</li>
                    <li>• Zero faculty conflicts</li>
                    <li>• Balanced workload distribution</li>
                  </ul>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Schedule Summary</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• 24 total class periods</li>
                    <li>• 15 lectures, 9 labs</li>
                    <li>• 8 different faculty assigned</li>
                  </ul>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Next Steps</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Review and approve schedule</li>
                    <li>• Notify faculty of assignments</li>
                    <li>• Publish to students</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions Card */}
        {!timetableGenerated && (
          <Card className="card-shadow">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-semibold">Ready to Generate Timetable</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Select the semester and department to generate an optimized class schedule. 
                  Our intelligent algorithm will create conflict-free timetables automatically.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mt-6">
                  <div className="text-left">
                    <h4 className="font-semibold text-sm">Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                      <li>• Automatic conflict resolution</li>
                      <li>• Resource optimization</li>
                      <li>• Faculty workload balancing</li>
                    </ul>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-sm">Constraints:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                      <li>• Room availability</li>
                      <li>• Faculty schedules</li>
                      <li>• Lab requirements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}