import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllTimetables } from "@/api/timetable.api";

interface Timetable {
  _id: string;
  department: string;
  type: "even" | "odd";
  version: number;
  createdAt: string; // already formatted in backend
}

export default function TimetableList() {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const data = await getAllTimetables();
        setTimetables(data);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error fetching timetables",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTimetables();
  }, [toast]);

  return (
    <Layout userType="admin" userName="Administrator">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold flex items-center space-x-2">
              <Calendar className="w-7 h-7 text-primary" />
              <span>Timetables</span>
            </h1>
            <p className="text-muted-foreground">
              View and manage all timetable versions
            </p>
          </div>
          <Link to="/admin/timetable/generate">
            <Button className="flex items-center space-x-2">
              <span>Generate</span>
            </Button>
          </Link>
        </div>

        {/* Timetable List */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Available Timetables</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : timetables.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No timetables found.  
                <Link to="/admin/timetable/add" className="underline ml-1">
                  Add one now
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="py-2 px-4">Department</th>
                      <th className="py-2 px-4">Type</th>
                      <th className="py-2 px-4">Version</th>
                      <th className="py-2 px-4">Created On</th>
                      <th className="py-2 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetables.map((tt) => (
                      <tr key={tt._id} className="border-b">
                        <td className="py-2 px-4">{tt.department}</td>
                        <td className="py-2 px-4 capitalize">{tt.type}</td>
                        <td className="py-2 px-4">{tt.version}</td>
                        <td className="py-2 px-4">{tt.createdAt}</td>
                        <td className="py-2 px-4 text-right">
                          <Link to={`/admin/timetable/view/${tt.type}/${tt.version}`}>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </Link>
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
