import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, User, Calendar, Users, BookOpen, BarChart3, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface LayoutProps {
  children: ReactNode;
  userType?: 'admin' | 'staff' | 'public';
  userName?: string;
}

export function Layout({ children, userType = 'public', userName }: LayoutProps) {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const getNavItems = () => {
    if (userType === 'admin') {
      return [
        { path: '/admin', label: 'Dashboard', icon: BarChart3 },
        { path: '/admin/staff', label: 'Staff', icon: Users },
        { path: '/admin/subjects', label: 'Subjects', icon: BookOpen },
        { path: '/admin/timetable', label: 'Timetable', icon: Calendar },
      ];
    } else if (userType === 'staff') {
      return [
        { path: '/staff', label: 'My Schedule', icon: Calendar },
      ];
    } else {
      return [
        { path: '/', label: 'View Timetable', icon: Calendar },
      ];
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border card-shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">EduTime</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {getNavItems().map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>

            {/* User section */}
            <div className="flex items-center space-x-4">
              {userType !== 'public' && (
                <>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></div>
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {userName ? userName.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground hidden sm:block">
                      {userName || 'User'}
                    </span>
                  </div>

                  <Button variant="ghost" size="icon">
                    <LogOut className="w-5 h-5" />
                  </Button>
                </>
              )}

              {userType === 'public' && (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" asChild>
                    <Link to="/staff/login">Staff Login</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/admin/login">Admin Login</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}