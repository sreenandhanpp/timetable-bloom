import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Save, ArrowLeft, Beaker } from "lucide-react";
import { getStaffList } from "@/api/staff.api";
import { getSubjectById, updateSubject } from "@/api/subject.api";

export default function EditSubject() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    subjectName: "",
    subjectType: "",
    faculty: "",
    periodsPerWeek: "",
    labName: "",
    semester: "",
    department: "",
    subjectCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [initialLoading, setInitialLoading] = useState(true);

  const departments = [
    "Computer Science",
    "Electronics",
    "Mechanical",
    "Civil",
    "Information Technology",
  ];

  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const subjectTypes = ["Lecture", "Lab"];
  const labNames = [
    "Computer Lab 1",
    "Computer Lab 2",
    "Electronics Lab",
    "Physics Lab",
    "Chemistry Lab",
    "Digital Systems Lab",
    "Network Lab",
    "Programming Lab",
  ];

  // Fetch subject and staff list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffData, subjectData] = await Promise.all([
          getStaffList(),
          getSubjectById(id as string),
        ]);

        setStaffList(staffData);
        setFormData({
          subjectName: subjectData.subjectName,
          subjectType: subjectData.subjectType,
          faculty: subjectData.faculty?._id || "",
          periodsPerWeek: String(subjectData.periodsPerWeek),
          labName: subjectData.labName || "",
          semester: String(subjectData.semester),
          department: subjectData.department,
          subjectCode: subjectData.subjectCode,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load subject details",
          variant: "destructive",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isLabType = formData.subjectType === "Lab";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateSubject(id as string, {
        subjectName: formData.subjectName,
        subjectCode: formData.subjectCode,
        subjectType: formData.subjectType,
        faculty: formData.faculty,
        periodsPerWeek: Number(formData.periodsPerWeek),
        labName: isLabType ? formData.labName : undefined,
        semester: String(formData.semester),
        department: formData.department,
      });

      toast({
        title: "Subject Updated Successfully!",
        description: `${formData.subjectName} has been updated.`,
      });

      navigate("/admin/subjects");
    } catch (error: any) {
      toast({
        title: "Error Updating Subject",
        description: error?.response?.data?.message || "Something went wrong!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Layout userType="admin" userName="Administrator">
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout userType="admin" userName="Administrator">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Link to="/admin/subjects">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Edit Subject</h1>
            </div>
            <p className="text-muted-foreground">
              Update subject or lab details
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
                  <BookOpen className="w-5 h-5" />
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
                        placeholder="e.g., Data Structures"
                        value={formData.subjectName}
                        onChange={(e) =>
                          handleInputChange("subjectName", e.target.value)
                        }
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subjectCode">Subject Code *</Label>
                      <Input
                        id="subjectCode"
                        placeholder="e.g., CS301"
                        value={formData.subjectCode}
                        onChange={(e) =>
                          handleInputChange("subjectCode", e.target.value)
                        }
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subjectType">Subject Type *</Label>
                      <Select
                        value={formData.subjectType}
                        onValueChange={(value) =>
                          handleInputChange("subjectType", value)
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjectTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center space-x-2">
                                {type === "Lab" ? (
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
                        onChange={(e) =>
                          handleInputChange("periodsPerWeek", e.target.value)
                        }
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="faculty">Faculty *</Label>
                      <Select
                        value={formData.faculty}
                        onValueChange={(value) =>
                          handleInputChange("faculty", value)
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select faculty" />
                        </SelectTrigger>
                        <SelectContent>
                          {staffList.map((staff) => (
                            <SelectItem key={staff._id} value={staff._id}>
                              {staff.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester *</Label>
                      <Select
                        value={formData.semester}
                        onValueChange={(value) =>
                          handleInputChange("semester", value)
                        }
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

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) =>
                          handleInputChange("department", value)
                        }
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
                          onValueChange={(value) =>
                            handleInputChange("labName", value)
                          }
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
                      disabled={
                        loading ||
                        !formData.subjectName ||
                        !formData.subjectType ||
                        !formData.faculty ||
                        !formData.semester ||
                        !formData.department ||
                        (isLabType && !formData.labName)
                      }
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>Updating Subject...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Update Subject</span>
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/admin/subjects")}
                    >
                      Cancel
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
                  Keep your curriculum updated and accurate with the latest
                  subject details.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
