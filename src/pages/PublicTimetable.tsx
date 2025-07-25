import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Filter, Clock } from 'lucide-react';

export default function PublicTimetable() {
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const departments = [
    'Computer Science',
    'Electronics', 
    'Mechanical',
    'Civil',
    'Information Technology'
  ];

  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const timeSlots = [
    { period: 'QCPC', time: '8:50 AM - 9:05 AM' },
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

  // Sample timetable data
  const sampleTimetable = {
    'Monday': {
      '9:00 AM': { subject: 'Data Structures', type: 'Lecture', faculty: 'Dr. Smith' },
      '10:00 AM': { subject: 'Database Management', type: 'Lecture', faculty: 'Prof. Johnson' },
      '11:00 AM': { subject: 'Programming Lab', type: 'Lab', faculty: 'Dr. Brown' },
      '2:00 PM': { subject: 'Computer Networks', type: 'Lecture', faculty: 'Dr. Wilson' },
    },
    'Tuesday': {
      '9:00 AM': { subject: 'Operating Systems', type: 'Lecture', faculty: 'Prof. Davis' },
      '11:00 AM': { subject: 'Web Development', type: 'Lab', faculty: 'Dr. Taylor' },
      '2:00 PM': { subject: 'Software Engineering', type: 'Lecture', faculty: 'Dr. Anderson' },
    },
    // Add more days...
  };

  const getSubjectStyle = (type: string) => {
    if (type === 'Lab') return 'course-card-blue';
    return 'course-card-purple';
  };

  const showTimetable = selectedSemester && selectedDepartment;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Calendar className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Class Timetables</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            View class schedules and timings for all departments and years. 
            Select your year and department to see the current timetable.
          </p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Semester</label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger>
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
                  <SelectTrigger>
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

              <div className="flex items-end">
                <Button 
                  className="w-full"
                  disabled={!selectedSemester || !selectedDepartment}
                >
                  View Timetable
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timetable Display */}
        {showTimetable ? (
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Semester {selectedSemester} - {selectedDepartment}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="course-card-purple">Lecture</Badge>
                  <Badge variant="outline" className="course-card-blue">Lab</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-10 gap-2 min-w-[1200px]">
                  {/* Header row */}
                  <div className="font-semibold text-center p-3 bg-muted rounded-lg">
                    Day
                  </div>
                  {timeSlots.map((slot) => (
                    <div key={slot.period} className="font-semibold text-center p-3 bg-muted rounded-lg text-sm">
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
                      {timeSlots.map((time) => {
                        const classData = sampleTimetable[day]?.[time];
                        return (
                          <div
                            key={`${day}-${time}`}
                            className={`p-3 rounded-lg text-sm ${
                              classData
                                ? `${getSubjectStyle(classData.type)} font-medium`
                                : 'time-slot-empty'
                            }`}
                          >
                            {classData ? (
                              <div className="space-y-1">
                                <div className="font-semibold">{classData.subject}</div>
                                <div className="text-xs opacity-80">{classData.faculty}</div>
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs"
                                >
                                  {classData.type}
                                </Badge>
                              </div>
                            ) : (
                              <div className="text-center text-muted-foreground">
                                Free
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="card-shadow">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-semibold">Select Filters to View Timetable</h3>
                <p className="text-muted-foreground">
                  Choose your academic year and department to display the class schedule.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}