import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Filter, Clock } from 'lucide-react';

export default function PublicTimetable() {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Information Technology'
  ];

  const years = ['1', '2', '3', '4'];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
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

  const showTimetable = selectedYear && selectedDepartment;

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
                <label className="text-sm font-medium">Academic Year</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        Year {year}
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
                  disabled={!selectedYear || !selectedDepartment}
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
                  <span>Year {selectedYear} - {selectedDepartment}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="course-card-purple">Lecture</Badge>
                  <Badge variant="outline" className="course-card-blue">Lab</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-6 gap-2 min-w-[800px]">
                  {/* Header row */}
                  <div className="font-semibold text-center p-3 bg-muted rounded-lg">
                    Time
                  </div>
                  {days.map((day) => (
                    <div key={day} className="font-semibold text-center p-3 bg-muted rounded-lg">
                      {day}
                    </div>
                  ))}

                  {/* Time slots */}
                  {timeSlots.map((time) => (
                    <div key={time} className="contents">
                      <div className="text-sm font-medium text-center p-3 bg-card border rounded-lg">
                        {time}
                      </div>
                      {days.map((day) => {
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