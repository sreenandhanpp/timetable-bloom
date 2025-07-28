import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Users, Plus, Loader2, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getStaffList, deleteStaff } from "@/api/staff.api";

interface Staff {
  _id: string;
  name: string;
  department: string;
  email: string;
  phone?: string;
  designation: string;
}

export default function StaffList() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch staff list
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await getStaffList();
        setStaff(data);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error fetching staff",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [toast]);

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      try {
        await deleteStaff(id);
        setStaff((prev) => prev.filter((s) => s._id !== id));
        toast({ title: "Staff deleted successfully!" });
      } catch (error) {
        toast({
          title: "Error deleting staff",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Layout userType="admin" userName="Administrator">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold flex items-center space-x-2">
              <Users className="w-7 h-7 text-primary" />
              <span>Staff Members</span>
            </h1>
            <p className="text-muted-foreground">
              View and manage all registered faculty members
            </p>
          </div>
          <Link to="/admin/staff/add">
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Staff</span>
            </Button>
          </Link>
        </div>

        {/* Staff List */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Registered Staff</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : staff.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No staff members found.  
                <Link to="/admin/staff/add" className="underline ml-1">
                  Add one now
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="py-2 px-4">Name</th>
                      <th className="py-2 px-4">Department</th>
                      <th className="py-2 px-4">Designation</th>
                      <th className="py-2 px-4">Email</th>
                      <th className="py-2 px-4">Phone</th>
                      <th className="py-2 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map((member) => (
                      <tr key={member._id} className="border-b">
                        <td className="py-2 px-4">{member.name}</td>
                        <td className="py-2 px-4">{member.department}</td>
                        <td className="py-2 px-4">{member.designation}</td>
                        <td className="py-2 px-4">{member.email}</td>
                        <td className="py-2 px-4">{member.phone || "-"}</td>
                        <td className="py-2 px-4 text-right space-x-2">
                          <Link to={`/admin/staff/edit/${member._id}`}>
                            <Button size="icon" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDelete(member._id)}
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
