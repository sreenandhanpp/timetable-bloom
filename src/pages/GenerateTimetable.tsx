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
import { generateTimetable as generateTimetableAPI } from "@/api/timetable.api"; // <-- import API

function formatTimetableData(rawData) {
  const timetable = {};

  rawData.forEach((entry) => {
    const { day, timeSlot, subject, type, room, faculty } = entry;

    if (!timetable[day]) timetable[day] = {};

    const slotLabel = `${timeSlot.start} - ${timeSlot.end}`;
    timetable[day][slotLabel] = {
      subject: subject || null,
      type: type || null,
      room: room || null,
      faculty: faculty || null,
    };
  });

  return timetable;
}

export default function GenerateTimetable() {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [includeQCPC, setIncludeQCPC] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [timetableGenerated, setTimetableGenerated] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [timetableData, setTimetableData] = useState({});
  const [semesterType, setSemesterType] = useState<"odd" | "even" | "">("");
  const { toast } = useToast();

  const departments = [
    "Computer Science",
    "Electronics",
    "Mechanical",
    "Civil",
    "Information Technology",
  ];

  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

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

      // Convert backend format → frontend grid format
      const formattedData = formatTimetableData(data.timetableEntries);
      setTimetableData(formattedData);

      // Optional: also set timeSlots from API if returned
      setTimeSlots(data.timeSlots || []);

      setTimetableGenerated(true);

      toast({
        title: "Timetable Generated Successfully!",
        description: `Generated optimized schedule for ${semesterType} semester - ${selectedDepartment}`,
      });
    } catch (error) {
      toast({
        title: "Failed to generate timetable",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const getSubjectStyle = (type: string) => {
    if (type?.toLowerCase() === "lab") return "course-card-blue";
    return "course-card-purple";
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
          <div className="course-card-blue p-3 rounded-xl">
            <Calendar className="w-8 h-8" />
          </div>
        </div>

        {/* Form */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Timetable Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* Semester */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Semester Type</label>
                <Select
                  value={semesterType}
                  onValueChange={(value) =>
                    setSemesterType(value as "odd" | "even")
                  }
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
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
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

              {/* QCPC Toggle */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center space-x-2">
                  <span>Include QCPC in Timetable</span>
                </label>
                <div className="flex items-center space-x-2 h-11">
                  <Switch
                    checked={includeQCPC}
                    onCheckedChange={setIncludeQCPC}
                  />
                  <span className="text-sm text-muted-foreground">
                    {includeQCPC
                      ? "QCPC slot will be included"
                      : "QCPC slot excluded"}
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
                  <Button
                    variant="outline"
                    className="h-11"
                    onClick={handleGenerate}
                  >
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

        {/* Timetable */}
        {timetableGenerated && (
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>
                    Generated Timetable - Semester {selectedSemester}{" "}
                    {selectedDepartment}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="course-card-purple">
                    Lecture
                  </Badge>
                  <Badge variant="outline" className="course-card-blue">
                    Lab
                  </Badge>
                  <Badge variant="secondary">Optimized</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div
                  className="grid gap-2 min-w-[800px]"
                  style={{
                    gridTemplateColumns: `120px repeat(${
                      timeSlots.filter(
                        (slot) => includeQCPC || slot.type !== "qcpc"
                      ).length
                    }, 1fr)`,
                  }}
                >
                  {/* Header row */}
                  <div className="font-semibold text-center p-3 bg-muted rounded-lg">
                    Day / Time
                  </div>
                  {timeSlots
                    .filter((slot) => includeQCPC || slot.type !== "qcpc")
                    .map((slot) => (
                      <div
                        key={slot.label}
                        className={`font-semibold text-center p-2 rounded-lg text-xs ${
                          slot.type === "qcpc"
                            ? "course-card-green"
                            : slot.type === "break" || slot.type === "lunch"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-muted"
                        }`}
                      >
                        <div>{slot.label}</div>
                        <div className="text-xs opacity-80">
                          {slot.start} - {slot.end}
                        </div>
                      </div>
                    ))}

                  {/* Day rows */}
                  {days.map((day) => (
                    <div key={day} className="contents">
                      <div className="text-sm font-medium text-center p-3 bg-card border rounded-lg flex items-center justify-center">
                        {day}
                      </div>
                      {timeSlots
                        .filter((slot) => includeQCPC || slot.type !== "qcpc")
                        .map((slot) => {
                          if (slot.type === "break" || slot.type === "lunch") {
                            return (
                              <div
                                key={`${day}-${slot.label}`}
                                className="p-3 rounded-lg text-sm bg-orange-50 border border-orange-200 flex items-center justify-center"
                              >
                                <div className="text-center text-orange-700 font-medium">
                                  {slot.type === "break" ? "Break" : "Lunch"}
                                </div>
                              </div>
                            );
                          }

                          if (slot.type === "qcpc") {
                            return (
                              <div
                                key={`${day}-${slot.label}`}
                                className="p-3 rounded-lg text-sm course-card-green flex items-center justify-center"
                              >
                                <div className="text-center font-medium">
                                  QCPC
                                </div>
                              </div>
                            );
                          }

                          const classData = timetableData[day]?.[slot.label];
                          return (
                            <div
                              key={`${day}-${slot.label}`}
                              className={`p-3 rounded-lg text-sm transition-all hover:scale-105 cursor-pointer ${
                                classData
                                  ? `${getSubjectStyle(
                                      classData.type
                                    )} font-medium elevated-shadow`
                                  : "time-slot-empty"
                              }`}
                            >
                              {classData ? (
                                <div className="space-y-1">
                                  <div className="font-semibold text-xs">
                                    {classData.subject}
                                  </div>
                                  <div className="text-xs opacity-80">
                                    {classData.faculty}
                                  </div>
                                  <div className="text-xs opacity-80">
                                    {classData.room}
                                  </div>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {classData.type}
                                  </Badge>
                                </div>
                              ) : (
                                <div className="text-center text-muted-foreground text-xs">
                                  Free Period
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
        )}
      </div>
    </Layout>
  );
}
