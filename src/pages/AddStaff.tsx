import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AddStaff() {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    email: '',
    phone: '',
    designation: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Information Technology',
    'Mathematics',
    'Physics',
    'Chemistry'
  ];

  const designations = [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Lecturer',
    'Lab Assistant',
    'Visiting Faculty'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Staff Member Added Successfully!",
        description: `${formData.name} has been added to the ${formData.department} department.`,
      });
      
      // Reset form
      setFormData({
        name: '',
        department: '',
        email: '',
        phone: '',
        designation: ''
      });
      setLoading(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
              <h1 className="text-3xl font-bold">Add Staff Member</h1>
            </div>
            <p className="text-muted-foreground">
              Register new faculty and teaching staff to the system
            </p>
          </div>
          <div className="course-card-purple p-3 rounded-xl">
            <Users className="w-8 h-8" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Staff Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Dr. John Smith"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.smith@institution.edu"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation *</Label>
                      <Select 
                        value={formData.designation} 
                        onValueChange={(value) => handleInputChange('designation', value)}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                        <SelectContent>
                          {designations.map((designation) => (
                            <SelectItem key={designation} value={designation}>
                              {designation}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select 
                        value={formData.department} 
                        onValueChange={(value) => handleInputChange('department', value)}
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
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button 
                      type="submit" 
                      className="flex items-center space-x-2"
                      disabled={loading || !formData.name || !formData.email || !formData.department || !formData.designation}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>Adding Staff...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Add Staff Member</span>
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setFormData({
                        name: '',
                        department: '',
                        email: '',
                        phone: '',
                        designation: ''
                      })}
                    >
                      Clear Form
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold">Required Information</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Full name of the faculty member</li>
                    <li>• Valid institutional email address</li>
                    <li>• Department assignment</li>
                    <li>• Professional designation</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Best Practices</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Use official titles (Dr., Prof.)</li>
                    <li>• Ensure email is accessible</li>
                    <li>• Verify department spelling</li>
                    <li>• Include contact information</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow course-card-purple">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Staff Management</h3>
                <p className="text-sm opacity-90">
                  Efficiently manage your institution's teaching staff and faculty members.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}