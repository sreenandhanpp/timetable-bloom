import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Settings,
  Download,
  ArrowLeft,
  Zap,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { generateTimetable as generateTimetableAPI } from "@/api/timetable.api";

type TimeSlot = {
  label: string;
  start: string;
  end: string;
  type?: string;
};

type TimetableEntry = {
  day: string;
  timeSlot: { start: string; end: string };
  subject?: string;
  type?: string;
  room?: string;
  faculty?: string;
  _id?: string;
};

type SemesterBlock = {
  semester: number | string;
  department: string;
  entries: TimetableEntry[];
  timeSlots?: TimeSlot[];
  isActive?: boolean;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

export default function GenerateTimetable() {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [includeQCPC, setIncludeQCPC] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [timetableGenerated, setTimetableGenerated] = useState(false);
  const [semesterType, setSemesterType] = useState<"odd" | "even" | "">("");
  const [semesterData, setSemesterData] = useState<SemesterBlock[]>([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const { toast } = useToast();

  const departments = [
    "Computer Science",
    "Electronics",
    "Mechanical",
    "Civil",
    "Information Technology",
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const handleGenerate = async () => {
    if (!semesterType || !selectedDepartment) return;
    setGenerating(true);

    try {
      const payload = {
        type: semesterType,
        department: selectedDepartment,
      };

      const data = await generateTimetableAPI(payload);
      console.log("Generated Timetable Data:", data);
      setSemesterData(data);

      if (data.length > 0) {
        setSelectedSemester(String(data[0].semester));
        setTimetableGenerated(true);
        toast({
          title: "Timetable Generated Successfully!",
          description: `Generated schedules for ${data.length} semesters`,
        });
      } else {
        toast({
          title: "No timetable data found",
          description: "Please try different parameters",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to generate timetable",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const getCurrentSemesterData = () => {
    return semesterData.find((sem) => String(sem.semester) === selectedSemester);
  };

  const getTimeSlots = () => {
    const currentSemester = getCurrentSemesterData();
    return currentSemester?.timeSlots || [];
  };

  const getEntriesForDayAndSlot = (day: string, timeSlot: TimeSlot) => {
    const currentSemester = getCurrentSemesterData();
    if (!currentSemester?.entries) return null;
    
    return currentSemester.entries.find(
      (entry) => 
        entry.day === day && 
        entry.timeSlot.start === timeSlot.start && 
        entry.timeSlot.end === timeSlot.end
    );
  };

  const getSubjectStyle = (type?: string) => {
    if (!type) return "bg-gray-100";
    if (type.toLowerCase() === "lab") return "bg-blue-100 border-blue-200";
    if (type.toLowerCase() === "lecture") return "bg-purple-100 border-purple-200";
    if (type === "qcpc") return "bg-green-100 border-green-200";
    if (type === "lunch" || type === "break") return "bg-orange-100 border-orange-200";
    return "bg-gray-100";
  };

  const canGenerate = semesterType && selectedDepartment;

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
              <h1 className="text-3xl font-bold">Generate Timetable</h1>
            </div>
            <p className="text-muted-foreground">
              Create optimized class schedules with intelligent automation
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-xl">
            <Calendar className="w-8 h-8" />
          </div>
        </div>

        {/* Config Form */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Timetable Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* Semester Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Semester Type</label>
                <Select
                  value={semesterType}
                  onValueChange={(value) => setSemesterType(value as "odd" | "even")}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select semester type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="odd">Odd Semester</SelectItem>
                    <SelectItem value="even">Even Semester</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
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

              {/* QCPC Toggle */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Include QCPC in Timetable</label>
                <div className="flex items-center space-x-2 h-11">
                  <Switch checked={includeQCPC} onCheckedChange={setIncludeQCPC} />
                  <span className="text-sm text-muted-foreground">
                    {includeQCPC ? "QCPC slot will be included" : "QCPC slot excluded"}
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between mt-6">
              <Button
                onClick={handleGenerate}
                disabled={!canGenerate || generating}
                className="flex items-center space-x-2 h-11"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Generate My Timetable</span>
                  </>
                )}
              </Button>

              {timetableGenerated && (
                <div className="flex space-x-2">
                  <Button variant="outline" className="h-11" onClick={handleGenerate}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button variant="outline" className="h-11">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Semester Selector */}
        {timetableGenerated && semesterData.length > 0 && (
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">View Semester</label>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                {semesterData.map((sem) => (
                  <SelectItem key={sem._id} value={String(sem.semester)}>
                    Semester {sem.semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Debug Data - Remove in production */}
        {timetableGenerated && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Debug Data (Current Semester):</h3>
            <pre className="text-xs overflow-auto max-h-60">
              {JSON.stringify(getCurrentSemesterData(), null, 2)}
            </pre>
          </div>
        )}

        {/* Timetable Grid */}
        {timetableGenerated && selectedSemester && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>
                    Generated Timetable - Semester {selectedSemester} {selectedDepartment}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-purple-100 text-purple-800">
                    Lecture
                  </Badge>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    Lab
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-3 border bg-gray-100 font-semibold">Day/Time</th>
                      {getTimeSlots()
                        .filter((slot) => includeQCPC || slot.type !== "qcpc")
                        .map((slot) => (
                          <th 
                            key={`${slot.start}-${slot.end}`}
                            className={`p-2 border text-xs ${
                              slot.type === "qcpc"
                                ? "bg-green-100"
                                : slot.type === "break" || slot.type === "lunch"
                                ? "bg-orange-100"
                                : "bg-gray-100"
                            }`}
                          >
                            <div>{slot.label}</div>
                            <div className="text-xs opacity-80">
                              {slot.start} - {slot.end}
                            </div>
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((day) => {
                      const filteredSlots = getTimeSlots().filter((slot) => 
                        includeQCPC || slot.type !== "qcpc"
                      );

                      return (
                        <tr key={day}>
                          <td className="p-3 border bg-white font-medium">{day}</td>
                          {filteredSlots.map((slot) => {
                            const entry = getEntriesForDayAndSlot(day, slot);

                            // Handle special slots first
                            if (slot.type === "break" || slot.type === "lunch") {
                              return (
                                <td
                                  key={`${day}-${slot.start}-${slot.end}`}
                                  className="p-3 border bg-orange-50 text-center"
                                >
                                  {slot.type === "break" ? "Break" : "Lunch"}
                                </td>
                              );
                            }

                            if (slot.type === "qcpc") {
                              return (
                                <td
                                  key={`${day}-${slot.start}-${slot.end}`}
                                  className="p-3 border bg-green-100 text-center"
                                >
                                  QCPC
                                </td>
                              );
                            }

                            // Regular class entry
                            return (
                              <td
                                key={`${day}-${slot.start}-${slot.end}`}
                                className={`p-3 border ${getSubjectStyle(entry?.type)}`}
                              >
                                {entry ? (
                                  <div className="space-y-1">
                                    <div className="font-semibold text-xs">
                                      {entry.subject || "Class"}
                                    </div>
                                    {entry.faculty && (
                                      <div className="text-xs opacity-80">{entry.faculty}</div>
                                    )}
                                    {entry.room && (
                                      <div className="text-xs opacity-80">{entry.room}</div>
                                    )}
                                    {entry.type && (
                                      <Badge variant="secondary" className="text-xs">
                                        {entry.type}
                                      </Badge>
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-center text-gray-500 text-xs">
                                    Free Period
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}