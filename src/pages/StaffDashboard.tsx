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
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Sample staff timetable
  const staffTimetable = {
    'Monday': {
      '9:00 AM': { subject: 'Data Structures', type: 'Lecture', year: '2', room: 'Room 101', students: 45 },
      '11:00 AM': { subject: 'Programming Lab', type: 'Lab', year: '2', room: 'Lab 1', students: 22 },
      '2:00 PM': { subject: 'Software Engineering', type: 'Lecture', year: '3', room: 'Room 104', students: 38 },
    },
    'Tuesday': {
      '10:00 AM': { subject: 'Algorithms', type: 'Lecture', year: '3', room: 'Room 101', students: 42 },
      '2:00 PM': { subject: 'Database Lab', type: 'Lab', year: '2', room: 'Lab 3', students: 20 },
      '3:00 PM': { subject: 'Data Structures', type: 'Lecture', year: '2', room: 'Room 102', students: 40 },
    },
    'Wednesday': {
      '9:00 AM': { subject: 'System Design', type: 'Lecture', year: '4', room: 'Room 104', students: 35 },
      '11:00 AM': { subject: 'Programming Lab', type: 'Lab', year: '2', room: 'Lab 1', students: 24 },
      '2:00 PM': { subject: 'Advanced Programming', type: 'Lecture', year: '3', room: 'Room 103', students: 30 },
    },
    'Thursday': {
      '10:00 AM': { subject: 'Software Engineering', type: 'Lecture', year: '3', room: 'Room 101', students: 38 },
      '11:00 AM': { subject: 'Project Lab', type: 'Lab', year: '4', room: 'Lab 2', students: 18 },
      '3:00 PM': { subject: 'Data Structures', type: 'Lecture', year: '2', room: 'Room 105', students: 44 },
    },
    'Friday': {
      '9:00 AM': { subject: 'Seminar', type: 'Lecture', year: '4', room: 'Auditorium', students: 60 },
      '11:00 AM': { subject: 'Office Hours', type: 'Consultation', year: 'All', room: 'Office 201', students: 0 },
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
    { time: '9:00 AM', subject: 'Data Structures', room: 'Room 101', type: 'Lecture' },
    { time: '11:00 AM', subject: 'Programming Lab', room: 'Lab 1', type: 'Lab' },
    { time: '2:00 PM', subject: 'Software Engineering', room: 'Room 104', type: 'Lecture' },
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
                  <div className="grid grid-cols-10 gap-2 min-w-[1000px]">
                    {/* Header row */}
                    <div className="font-semibold text-center p-2 bg-muted rounded-lg text-sm">
                      Day
                    </div>
                    {timeSlots.map((time) => (
                      <div key={time} className="font-semibold text-center p-2 bg-muted rounded-lg text-sm">
                        {time}
                      </div>
                    ))}

                    {/* Days */}
                    {days.map((day) => (
                      <div key={day} className="contents">
                        <div className="text-xs font-medium text-center p-2 bg-card border rounded-lg">
                          {day}
                        </div>
                        {timeSlots.map((time) => {
                          const classData = staffTimetable[day]?.[time];
                          return (
                            <div
                              key={`${day}-${time}`}
                              className={`p-2 rounded-lg text-xs ${
                                classData
                                  ? `${getSubjectStyle(classData.type)} font-medium`
                                  : 'time-slot-empty'
                              }`}
                            >
                              {classData ? (
                                <div className="space-y-1">
                                  <div className="font-semibold">{classData.subject}</div>
                                  <div className="opacity-80">Year {classData.year}</div>
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