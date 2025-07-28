import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Plus, Loader2, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getSubjectList, deleteSubject } from "@/api/subject.api";
import { useToast } from "@/hooks/use-toast";

export default function SubjectList() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const data = await getSubjectList();
      setSubjects(data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load subjects.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await deleteSubject(id);
      toast({ title: "Subject deleted successfully!" });
      fetchSubjects();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete subject.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <Layout userType="admin" userName="Administrator">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold flex items-center space-x-2">
              <BookOpen className="w-7 h-7 text-primary" />
              <span>Subjects</span>
            </h1>
            <p className="text-muted-foreground">
              View and manage all registered subjects and labs
            </p>
          </div>
          <Link to="/admin/subjects/add">
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Subject</span>
            </Button>
          </Link>
        </div>

        {/* Subject List */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Registered Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : subjects.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No subjects found.
                <Link to="/admin/subjects/add" className="underline ml-1">
                  Add one now
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="py-2 px-4">Subject Code</th>
                      <th className="py-2 px-4">Name</th>
                      <th className="py-2 px-4">Type</th>
                      <th className="py-2 px-4">Faculty</th>
                      <th className="py-2 px-4">Semester</th>
                      <th className="py-2 px-4">Department</th>
                      <th className="py-2 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject) => (
                      <tr key={subject._id} className="border-b">
                        <td className="py-2 px-4">{subject.subjectCode}</td>
                        <td className="py-2 px-4">{subject.subjectName}</td>
                        <td className="py-2 px-4">{subject.subjectType}</td>
                        <td className="py-2 px-4">
                          {subject.faculty?.name || "-"}
                        </td>
                        <td className="py-2 px-4">{subject.semester}</td>
                        <td className="py-2 px-4">{subject.department}</td>
                        <td className="py-2 px-4 text-right space-x-2">
                          <Link to={`/admin/subjects/edit/${subject._id}`}>
                            <Button size="icon" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDelete(subject._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
