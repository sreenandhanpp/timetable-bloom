import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Settings, Download, ArrowLeft, Zap, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GenerateTimetable() {
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [generating, setGenerating] = useState(false);
  const [timetableGenerated, setTimetableGenerated] = useState(false);
  const [includeQCPC, setIncludeQCPC] = useState(true);
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
    ...(includeQCPC ? [{ period: 'QCPC', time: '8:50 AM - 9:05 AM' }] : []),
    { period: 'Period 1', time: '9:05 AM - 10:00 AM' },
    { period: 'Period 2', time: '10:00 AM - 10:50 AM' },
    { period: 'Break', time: '10:50 AM - 11:10 AM' },
    { period: 'Period 3', time: '11:10 AM - 12:00 PM' },
    { period: 'Period 4', time: '12:00 PM - 12:50 PM' },
    { period: 'Lunch', time: '12:50 PM - 1:30 PM' },
    { period: 'Period 5', time: '1:30 PM - 2:20 PM' },
    { period: 'Period 6', time: '2:20 PM - 3:10 PM' },
    { period: 'Period 7', time: '3:10 PM - 4:00 PM' },
    { period: 'Period 8', time: '4:00 PM - 4:15 PM' }
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
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
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeQCPC"
                    checked={includeQCPC}
                    onChange={(e) => setIncludeQCPC(e.target.checked)}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor="includeQCPC" className="text-sm font-medium">
                    Include QCPC in Timetable
                  </label>
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
                <div className="grid gap-2 min-w-[1400px]" style={{ gridTemplateColumns: `200px repeat(${timeSlots.length}, 1fr)` }}>
                  {/* Header row */}
                  <div className="font-semibold text-center p-3 bg-muted rounded-lg">
                    Day
                  </div>
                  {timeSlots.map((slot) => (
                    <div key={slot.period} className={`font-semibold text-center p-3 rounded-lg text-sm ${
                      slot.period === 'QCPC' ? 'course-card-purple' : 
                      slot.period === 'Break' || slot.period === 'Lunch' ? 'bg-muted/50' : 
                      'bg-muted'
                    }`}>
                      <div>{slot.period}</div>
                      <div className="text-xs opacity-80">{slot.time}</div>
                    </div>
                  ))}

                  {/* Days */}
                  {days.map((day) => (
                    <div key={day} className="contents">
                      <div className="text-sm font-medium text-center p-3 bg-card border rounded-lg">
                        {day}
                      </div>
                      {timeSlots.map((slot) => {
                        if (slot.period === 'Break' || slot.period === 'Lunch') {
                          return (
                            <div key={`${day}-${slot.period}`} className="p-3 rounded-lg text-sm bg-muted/30 text-center text-muted-foreground">
                              {slot.period}
                            </div>
                          );
                        }
                        
                        const classData = generatedTimetable[day]?.[slot.period];
                        return (
                          <div
                            key={`${day}-${slot.period}`}
                            className={`p-3 rounded-lg text-sm transition-all hover:scale-105 cursor-pointer ${
                              classData
                                ? `${getSubjectStyle(classData.type)} font-medium elevated-shadow`
                                : slot.period === 'QCPC' 
                                  ? 'course-card-purple/20 text-center text-muted-foreground'
                                  : 'time-slot-empty'
                            }`}
                          >
                            {classData ? (
                              <div className="space-y-1">
                                <div className="font-semibold">{classData.subject}</div>
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
                              <div className="text-center text-muted-foreground">
                                {slot.period === 'QCPC' ? 'QCPC' : 'Free Period'}
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
                  Select the academic year and department to generate an optimized class schedule. 
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