import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Filter, Clock, ArrowLeft, Download } from 'lucide-react';
import { getPublicTimetableBySemester } from '@/api/timetable.api';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

type TimeSlot = {
  start: string;
  end: string;
};

type TimetableEntry = {
  day: string;
  timeSlot: TimeSlot;
  subject: {
    _id: string;
    subjectCode: string;
    subjectName: string;
    subjectType: string;
    faculty?: {
      name: string;
    };
  } | null;
  type: string;
  room: string | null;
  faculty?: string;
};

type TimetableData = {
  department: string;
  semester: number;
  entries: TimetableEntry[];
};

export default function PublicTimetable() {
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [timetableData, setTimetableData] = useState<TimetableData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Information Technology'
  ];

  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const data = await getPublicTimetableBySemester(
        Number(selectedSemester),
        selectedDepartment
      );
      console.log(data)
      setTimetableData(data.timetable);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch timetable data',
        variant: 'destructive'
      });
      setTimetableData(null);
    } finally {
      setLoading(false);
    }
  };

  // Derive time slots from timetable data
  const deriveTimeSlots = (): TimeSlot[] => {
    if (!timetableData?.entries) return [];
    
    const slotsMap = new Map<string, TimeSlot>();
    
    timetableData.entries.forEach(entry => {
      const key = `${entry.timeSlot.start}-${entry.timeSlot.end}`;
      if (!slotsMap.has(key)) {
        slotsMap.set(key, {
          start: entry.timeSlot.start,
          end: entry.timeSlot.end
        });
      }
    });

    // Sort time slots chronologically
    return Array.from(slotsMap.values()).sort((a, b) => 
      a.start.localeCompare(b.start)
    );
  };

  const getEntriesForDay = (day: string) => {
    return timetableData?.entries.filter(entry => entry.day === day) || [];
  };

  const getEntryForDayAndSlot = (day: string, slot: TimeSlot) => {
    return timetableData?.entries.find(
      entry => 
        entry.day === day && 
        entry.timeSlot.start === slot.start && 
        entry.timeSlot.end === slot.end
    );
  };

  const getSubjectStyle = (type?: string) => {
  if (!type) return 'time-slot-empty';
  if (type.toLowerCase() === 'lab') return 'course-card-blue';
  if (type.toLowerCase() === 'lecture') return 'course-card-purple';
  if (type === 'qcpc') return 'bg-gradient-to-br from-green-100 to-green-300 text-green-800';
  if (type === 'break') return 'bg-gradient-to-br from-yellow-100 to-yellow-300 text-yellow-800';
  return 'time-slot-empty';
};

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const showTimetable = selectedSemester && selectedDepartment && timetableData;
  const timeSlots = deriveTimeSlots();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Public Timetable</h1>
            </div>
            <p className="text-muted-foreground">
              View class schedules and timings for all departments and semesters
            </p>
          </div>
          <div className="course-card-blue p-3 rounded-xl">
            <Calendar className="w-8 h-8" />
          </div>
        </div>

        {/* Filters */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filter Timetable</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium">Semester</label>
                <Select 
                  value={selectedSemester} 
                  onValueChange={setSelectedSemester}
                  disabled={loading}
                >
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
                <Select 
                  value={selectedDepartment} 
                  onValueChange={setSelectedDepartment}
                  disabled={loading}
                >
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

              <div className="flex space-x-2">
                <Button 
                  onClick={fetchTimetable}
                  disabled={!selectedSemester || !selectedDepartment || loading}
                  className="flex items-center space-x-2 h-11"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>View Timetable</span>
                    </>
                  )}
                </Button>
              </div>

              {showTimetable && (
                <div className="flex space-x-2">
                  <Button variant="outline" className="h-11">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="card-shadow">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground">
                  Loading timetable data...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timetable Display */}
        {showTimetable ? (
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Semester {timetableData.semester} - {timetableData.department}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="course-card-purple">Lecture</Badge>
                  <Badge variant="outline" className="course-card-blue">Lab</Badge>
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
                    <div key={`${slot.start}-${slot.end}`} className="font-semibold text-center p-3 bg-muted rounded-lg text-sm">
                      <div>{slot.start} - {slot.end}</div>
                    </div>
                  ))}

                  {/* Days */}
                  {days.map((day) => {
                    const dayEntries = getEntriesForDay(day);
                    if (dayEntries.length === 0) return null;
                    
                    return (
                      <div key={day} className="contents">
                        <div className="font-semibold text-center p-3 bg-muted rounded-lg flex items-center justify-center">
                          {day}
                        </div>
                        {timeSlots.map((slot) => {
                          const entry = getEntryForDayAndSlot(day, slot);
                          const cellKey = `cell-${day}-${slot.start}-${slot.end}`;

                          if (!entry) {
                            return (
                              <div
                                key={cellKey}
                                className="p-3 rounded-lg text-sm text-center text-muted-foreground time-slot-empty"
                              >
                                Free Period
                              </div>
                            );
                          }

                          // Handle special slots
                          if (entry.type === 'qcpc') {
                            return (
                              <div
                                key={cellKey}
                                className="p-3 rounded-lg text-sm text-center font-medium bg-gradient-to-br from-green-100 to-green-300 text-green-800 flex flex-col items-center justify-center"
>
                                QCPC
                              </div>
                            );
                          }

                          if (entry.type === 'break') {
                            return (
                              <div
                                key={cellKey}
                               className="p-3 rounded-lg text-sm text-center font-medium bg-gradient-to-br from-yellow-100 to-yellow-300 text-yellow-800 flex flex-col items-center justify-center"
>
                                Break
                              </div>
                            );
                          }

                          // Regular class entry
                          return (
                            <div
                              key={cellKey}
                              className={`p-3 rounded-lg text-sm transition-all hover:scale-105 cursor-pointer ${getSubjectStyle(entry.type)} elevated-shadow`}
                            >
                              {entry.subject ? (
                                <div className="space-y-1">
                                  <div className="font-semibold">
                                    {entry.subject.subjectName || entry.subject.subjectCode}
                                  </div>
                                  {entry.subject.faculty?.name && (
                                    <div className="text-xs opacity-80">
                                      {entry.subject.faculty.name}
                                    </div>
                                  )}
                                  {entry.room && (
                                    <div className="text-xs opacity-80">{entry.room}</div>
                                  )}
                                  <Badge variant="secondary" className="text-xs">
                                    {entry.type}
                                  </Badge>
                                </div>
                              ) : (
                                <div className="text-center text-muted-foreground">
                                  Free Period
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : !loading && (
          <Card className="card-shadow">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-semibold">Select Filters to View Timetable</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Choose your semester and department to display the class schedule.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}