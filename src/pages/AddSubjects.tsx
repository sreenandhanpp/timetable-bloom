import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Plus, Save, ArrowLeft, Beaker } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AddSubjects() {
  const [formData, setFormData] = useState({
    subjectName: '',
    subjectType: '',
    faculty: '',
    periodsPerWeek: '',
    labName: '',
    year: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Information Technology'
  ];

  const years = ['1', '2', '3', '4'];
  
  const subjectTypes = ['Lecture', 'Lab'];
  
  const facultyMembers = [
    'Dr. Sarah Johnson',
    'Prof. Michael Brown',
    'Dr. Emily Davis',
    'Prof. Robert Wilson',
    'Dr. Lisa Anderson',
    'Prof. David Taylor'
  ];

  const labNames = [
    'Computer Lab 1',
    'Computer Lab 2',
    'Electronics Lab',
    'Physics Lab',
    'Chemistry Lab',
    'Digital Systems Lab',
    'Network Lab',
    'Programming Lab'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Subject Added Successfully!",
        description: `${formData.subjectName} has been added to Year ${formData.year} ${formData.department}.`,
      });
      
      // Reset form
      setFormData({
        subjectName: '',
        subjectType: '',
        faculty: '',
        periodsPerWeek: '',
        labName: '',
        year: '',
        department: ''
      });
      setLoading(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isLabType = formData.subjectType === 'Lab';

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
              <h1 className="text-3xl font-bold">Add Subject</h1>
            </div>
            <p className="text-muted-foreground">
              Create new courses and lab sessions for your curriculum
            </p>
          </div>
          <div className="course-card-yellow p-3 rounded-xl">
            <BookOpen className="w-8 h-8" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Subject Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="subjectName">Subject Name *</Label>
                      <Input
                        id="subjectName"
                        placeholder="e.g., Data Structures and Algorithms"
                        value={formData.subjectName}
                        onChange={(e) => handleInputChange('subjectName', e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subjectType">Subject Type *</Label>
                      <Select 
                        value={formData.subjectType} 
                        onValueChange={(value) => handleInputChange('subjectType', value)}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjectTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center space-x-2">
                                {type === 'Lab' ? (
                                  <Beaker className="w-4 h-4" />
                                ) : (
                                  <BookOpen className="w-4 h-4" />
                                )}
                                <span>{type}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="periodsPerWeek">Periods Per Week *</Label>
                      <Input
                        id="periodsPerWeek"
                        type="number"
                        min="1"
                        max="10"
                        placeholder="e.g., 4"
                        value={formData.periodsPerWeek}
                        onChange={(e) => handleInputChange('periodsPerWeek', e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="faculty">Faculty *</Label>
                      <Select 
                        value={formData.faculty} 
                        onValueChange={(value) => handleInputChange('faculty', value)}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select faculty" />
                        </SelectTrigger>
                        <SelectContent>
                          {facultyMembers.map((faculty) => (
                            <SelectItem key={faculty} value={faculty}>
                              {faculty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Academic Year *</Label>
                      <Select 
                        value={formData.year} 
                        onValueChange={(value) => handleInputChange('year', value)}
                      >
                        <SelectTrigger className="h-11">
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

                    {/* Conditional Lab Name Field */}
                    {isLabType && (
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="labName">Lab Name *</Label>
                        <Select 
                          value={formData.labName} 
                          onValueChange={(value) => handleInputChange('labName', value)}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select lab" />
                          </SelectTrigger>
                          <SelectContent>
                            {labNames.map((lab) => (
                              <SelectItem key={lab} value={lab}>
                                {lab}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button 
                      type="submit" 
                      className="flex items-center space-x-2"
                      disabled={loading || !formData.subjectName || !formData.subjectType || !formData.faculty || !formData.year || !formData.department || (isLabType && !formData.labName)}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>Adding Subject...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Subject</span>
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setFormData({
                        subjectName: '',
                        subjectType: '',
                        faculty: '',
                        periodsPerWeek: '',
                        labName: '',
                        year: '',
                        department: ''
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
                <CardTitle className="text-lg">Subject Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold">Lecture Subjects</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Theoretical courses</li>
                    <li>• Classroom-based teaching</li>
                    <li>• No lab assignment needed</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Lab Subjects</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Practical sessions</li>
                    <li>• Requires lab allocation</li>
                    <li>• Hands-on learning</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Periods Per Week</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Lectures: 3-4 periods typical</li>
                    <li>• Labs: 2-3 periods typical</li>
                    <li>• Consider curriculum requirements</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow course-card-yellow">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Curriculum Management</h3>
                <p className="text-sm opacity-90">
                  Build comprehensive academic programs with proper subject allocation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}