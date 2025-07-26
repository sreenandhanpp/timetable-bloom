import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Download,
  Bell,
  AlertCircle
} from 'lucide-react';

export default function StaffDashboard() {
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

  // Sample staff timetable
  const staffTimetable = {
    'Monday': {
      'Period 1': { subject: 'Data Structures', type: 'Lecture', semester: '3', room: 'Room 101', students: 45 },
      'Period 3': { subject: 'Programming Lab', type: 'Lab', semester: '3', room: 'Lab 1', students: 22 },
      'Period 5': { subject: 'Software Engineering', type: 'Lecture', semester: '5', room: 'Room 104', students: 38 },
    },
    'Tuesday': {
      'Period 2': { subject: 'Algorithms', type: 'Lecture', semester: '5', room: 'Room 101', students: 42 },
      'Period 5': { subject: 'Database Lab', type: 'Lab', semester: '3', room: 'Lab 3', students: 20 },
      'Period 6': { subject: 'Data Structures', type: 'Lecture', semester: '3', room: 'Room 102', students: 40 },
    },
    'Wednesday': {
      'Period 1': { subject: 'System Design', type: 'Lecture', semester: '7', room: 'Room 104', students: 35 },
      'Period 3': { subject: 'Programming Lab', type: 'Lab', semester: '3', room: 'Lab 1', students: 24 },
      'Period 5': { subject: 'Advanced Programming', type: 'Lecture', semester: '5', room: 'Room 103', students: 30 },
    },
    'Thursday': {
      'Period 2': { subject: 'Software Engineering', type: 'Lecture', semester: '5', room: 'Room 101', students: 38 },
      'Period 3': { subject: 'Project Lab', type: 'Lab', semester: '7', room: 'Lab 2', students: 18 },
      'Period 6': { subject: 'Data Structures', type: 'Lecture', semester: '3', room: 'Room 105', students: 44 },
    },
    'Friday': {
      'Period 1': { subject: 'Seminar', type: 'Lecture', semester: '7', room: 'Auditorium', students: 60 },
      'Period 3': { subject: 'Office Hours', type: 'Consultation', semester: 'All', room: 'Office 201', students: 0 },
    },
  };

  const getSubjectStyle = (type: string) => {
    switch (type) {
      case 'Lab': return 'course-card-blue';
      case 'Consultation': return 'course-card-green';
      default: return 'course-card-purple';
    }
  };

  const upcomingClasses = [
    { time: '9:05 AM - 10:00 AM', subject: 'Data Structures', room: 'Room 101', type: 'Lecture' },
    { time: '11:10 AM - 12:00 PM', subject: 'Programming Lab', room: 'Lab 1', type: 'Lab' },
    { time: '1:30 PM - 2:20 PM', subject: 'Software Engineering', room: 'Room 104', type: 'Lecture' },
  ];

  const weeklyStats = {
    totalClasses: 15,
    lectureHours: 12,
    labHours: 8,
    totalStudents: 285
  };

  return (
    <Layout userType="staff" userName="Dr. John Smith">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">My Schedule</h1>
          <p className="text-muted-foreground">
            View your weekly teaching schedule and upcoming classes.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">{weeklyStats.totalClasses}</p>
                  <p className="text-xs text-muted-foreground">Total Classes</p>
                </div>
                <div className="course-card-purple p-3 rounded-xl">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Lecture Hours</p>
                  <p className="text-2xl font-bold">{weeklyStats.lectureHours}</p>
                  <p className="text-xs text-muted-foreground">This Week</p>
                </div>
                <div className="course-card-yellow p-3 rounded-xl">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Lab Hours</p>
                  <p className="text-2xl font-bold">{weeklyStats.labHours}</p>
                  <p className="text-xs text-muted-foreground">This Week</p>
                </div>
                <div className="course-card-blue p-3 rounded-xl">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Students</p>
                  <p className="text-2xl font-bold">{weeklyStats.totalStudents}</p>
                  <p className="text-xs text-muted-foreground">Total Enrolled</p>
                </div>
                <div className="course-card-green p-3 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Today's Classes</span>
                </div>
                <Badge variant="secondary">Monday</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingClasses.map((classItem, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg border">
                  <div className={`p-2 rounded-lg ${getSubjectStyle(classItem.type)}`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{classItem.subject}</h4>
                      <span className="text-sm text-muted-foreground">{classItem.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{classItem.room}</span>
                      <Badge variant="outline" className="text-xs">
                        {classItem.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export Schedule
              </Button>
            </CardContent>
          </Card>

          {/* Weekly Timetable */}
          <div className="lg:col-span-2">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Weekly Timetable</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="course-card-purple">Lecture</Badge>
                    <Badge variant="outline" className="course-card-blue">Lab</Badge>
                    <Badge variant="outline" className="course-card-green">Consultation</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="grid gap-2 min-w-[800px]" style={{ gridTemplateColumns: `120px repeat(${timeSlots.length}, 1fr)` }}>
                    {/* Header row */}
                    <div className="font-semibold text-center p-2 bg-muted rounded-lg text-sm">
                      Day / Time
                    </div>
                    {timeSlots.map((slot) => (
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
                        <div className="text-xs font-medium text-center p-2 bg-card border rounded-lg flex items-center justify-center">
                          {day}
                        </div>
                        {timeSlots.map((slot) => {
                          if (slot.type === 'break' || slot.type === 'lunch') {
                            return (
                              <div
                                key={`${day}-${slot.label}`}
                                className="p-2 rounded-lg text-xs bg-orange-50 border border-orange-200 flex items-center justify-center"
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
                                className="p-2 rounded-lg text-xs course-card-green flex items-center justify-center"
                              >
                                <div className="text-center font-medium">
                                  QCPC
                                </div>
                              </div>
                            );
                          }

                          const classData = staffTimetable[day]?.[slot.label];
                          return (
                            <div
                              key={`${day}-${slot.label}`}
                              className={`p-2 rounded-lg text-xs ${
                                classData
                                  ? `${getSubjectStyle(classData.type)} font-medium`
                                  : 'time-slot-empty'
                              }`}
                            >
                              {classData ? (
                                <div className="space-y-1">
                                  <div className="font-semibold">{classData.subject}</div>
                                  <div className="opacity-80">Sem {classData.semester}</div>
                                  <div className="opacity-80">{classData.room}</div>
                                  {classData.students > 0 && (
                                    <div className="opacity-80">{classData.students} students</div>
                                  )}
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
          </div>
        </div>

        {/* Important Notice */}
        <Card className="card-shadow border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-800">Upcoming Schedule Changes</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Please note that the Programming Lab session on Wednesday has been moved to Lab 2 
                  due to maintenance work in Lab 1. Students have been notified via email.
                </p>
                <Button variant="outline" size="sm" className="mt-3 text-yellow-700 border-yellow-300">
                  View All Notifications
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}