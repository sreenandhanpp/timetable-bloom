import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  Plus,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const stats = [
    { 
      label: 'Total Staff', 
      value: '45', 
      icon: Users, 
      color: 'course-card-purple',
      change: '+5 this month'
    },
    { 
      label: 'Active Subjects', 
      value: '128', 
      icon: BookOpen, 
      color: 'course-card-yellow',
      change: '+12 this semester'
    },
    { 
      label: 'Classes Scheduled', 
      value: '340', 
      icon: Calendar, 
      color: 'course-card-blue',
      change: '95% utilization'
    },
    { 
      label: 'Departments', 
      value: '5', 
      icon: BarChart3, 
      color: 'course-card-green',
      change: 'All active'
    },
  ];

  const quickActions = [
    { 
      title: 'Add Staff Member', 
      description: 'Register new faculty and teaching staff',
      icon: Users,
      path: '/admin/staff',
      color: 'course-card-purple'
    },
    { 
      title: 'Add Subjects', 
      description: 'Create new courses and lab sessions',
      icon: BookOpen,
      path: '/admin/subjects',
      color: 'course-card-yellow'
    },
    { 
      title: 'Generate Timetable', 
      description: 'Create optimized class schedules',
      icon: Calendar,
      path: '/admin/timetable',
      color: 'course-card-blue'
    },
  ];

  const recentActivity = [
    { action: 'New staff member added', details: 'Dr. Sarah Johnson - Computer Science', time: '2 hours ago' },
    { action: 'Timetable generated', details: 'Year 3 - Electronics Department', time: '4 hours ago' },
    { action: 'Subject updated', details: 'Machine Learning Lab - Schedule changed', time: '1 day ago' },
    { action: 'Staff profile updated', details: 'Prof. Michael Brown - Contact info', time: '2 days ago' },
  ];

  return (
    <Layout userType="admin" userName="Administrator">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome back, Administrator</h1>
          <p className="text-muted-foreground">
            Manage your institution's timetables, staff, and academic schedules from your dashboard.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.path}>
                  <div className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{action.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-primary mt-3 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.details}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>System Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Database Usage</span>
                  <span className="text-sm text-muted-foreground">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Timetable Completion</span>
                  <span className="text-sm text-muted-foreground">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Staff Allocation</span>
                  <span className="text-sm text-muted-foreground">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">System Notice</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Semester change is scheduled for next week. Please ensure all timetables are finalized.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}