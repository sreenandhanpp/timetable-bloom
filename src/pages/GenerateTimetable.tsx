  import { useEffect, useState } from "react";
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
  import { getSubjectDetails } from "@/api/subject.api";
  import { usePDF } from 'react-to-pdf';



  type TimeSlot = {
    label: string;
    start: string;
    end: string;
    type?: string;
    _id?: string;
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

  type SubjectDetailsWithFaculty = {
    subjectName: string;
    facultyName?: string;
  };

  const subjectCache = new Map<string, SubjectDetailsWithFaculty>();

  async function getSubjectDetailsWithFaculty(id: string): Promise<SubjectDetailsWithFaculty> {
    const cached = subjectCache.get(id);
    if (cached) {
      return cached;
    }

    try {
      const subjectDetails = await getSubjectDetails(id);
      const result: SubjectDetailsWithFaculty = {
        subjectName: subjectDetails.subjectCode || subjectDetails.code || "Unknown Subject",
        facultyName: subjectDetails.faculty?.name
      };
      subjectCache.set(id, result);
      return result;
    } catch (error) {
      console.error(`Failed to fetch subject details for ID: ${id}`, error);
      return {
        subjectName: "Unknown Subject",
        facultyName: undefined
      };
    }
  }




  export default function GenerateTimetable() {
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [includeQCPC, setIncludeQCPC] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [timetableGenerated, setTimetableGenerated] = useState(false);
    const [semesterType, setSemesterType] = useState<"odd" | "even" | "">("");
    const [semesterData, setSemesterData] = useState<SemesterBlock[]>([]);
    const [selectedSemester, setSelectedSemester] = useState("");
        const [subjectData, setSubjectData] = useState<Record<string, {
    name: string;
    facultyName?: string;
  }>>({});
  const [isExporting, setIsExporting] = useState(false);


  // Update the name fetching function
  const updateSubjectData = async (entries: TimetableEntry[]) => {
    const subjectIds = Array.from(
      new Set(
        entries
          .filter((entry) => entry.subject)
          .map((entry) => entry.subject as string)
      )
    );

    const newData: Record<string, { name: string; facultyName?: string }> = {};
    await Promise.all(
      subjectIds.map(async (id) => {
        const details = await getSubjectDetailsWithFaculty(id);
        newData[id] = {
          name: details.subjectName,
          facultyName: details.facultyName
        };
      })
    );

    setSubjectData((prev) => ({ ...prev, ...newData }));
  };

  // Inside your component, add this hook before the return statement
const { toPDF, targetRef } = usePDF({
  filename: `timetable-semester-${selectedSemester}.pdf`,
  page: {
    margin: 20,
    format: 'A3',
    orientation: 'landscape'
  }
});

  // Update the useEffect
  useEffect(() => {
    if (semesterData.length > 0) {
      const allEntries = semesterData.flatMap((sem) => sem.entries);
      updateSubjectData(allEntries);
    }
  }, [semesterData]);

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
      if (!currentSemester?.entries) return [];
      
      // Extract unique time slots from entries
      const slotsMap = new Map<string, TimeSlot>();
      currentSemester.entries.forEach(entry => {
        const key = `${entry.timeSlot.start}-${entry.timeSlot.end}`;
        if (!slotsMap.has(key)) {
          slotsMap.set(key, {
            start: entry.timeSlot.start,
            end: entry.timeSlot.end,
            label: `${entry.timeSlot.start}-${entry.timeSlot.end}`,
            type: entry.type === 'qcpc' || entry.type === 'lunch' ? entry.type : undefined
          });
        }
      });
      
      return Array.from(slotsMap.values()).sort((a, b) => 
        a.start.localeCompare(b.start)
      );
    };

    const getEntriesForDayAndSlot = (day: string, timeSlot: TimeSlot) => {
      const currentSemester = getCurrentSemesterData();
      if (!currentSemester?.entries) return null;
      
      return currentSemester.entries.find(
        (entry) => 
          entry.day === day && 
          entry.timeSlot.start === timeSlot.start && 
          entry.timeSlot.end === timeSlot.end &&
          entry.type !== 'qcpc' && 
          entry.type !== 'lunch'
      );
    };

    const getSpecialEntryForDayAndSlot = (day: string, timeSlot: TimeSlot) => {
      const currentSemester = getCurrentSemesterData();
      if (!currentSemester?.entries) return null;
      
      return currentSemester.entries.find(
        (entry) => 
          entry.day === day && 
          entry.timeSlot.start === timeSlot.start && 
          entry.timeSlot.end === timeSlot.end &&
          (entry.type === 'qcpc' || entry.type === 'lunch')
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

const handleExport = async () => {
  setIsExporting(true);
  try {
    await toPDF();
  } catch (error) {
    toast({
      title: "Export failed",
      description: "Could not generate PDF",
      variant: "destructive",
    });
  } finally {
    setIsExporting(false);
  }
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
                        <SelectItem key={`dept-${dept}`} value={dept}>
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

<Button 
  variant="outline" 
  className="h-11" 
  onClick={handleExport}
  disabled={isExporting}
>
  {isExporting ? (
    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
  ) : (
    <Download className="w-4 h-4 mr-2" />
  )}
  {isExporting ? "Exporting..." : "Export PDF"}
</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Semester Selector */}
          {timetableGenerated && semesterData.length > 0 && (
            <div  className="flex items-center gap-4">
              <label className="text-sm font-medium">View Semester</label>
              <Select 
                value={selectedSemester} 
                onValueChange={setSelectedSemester}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesterData.map((sem) => (
                    <SelectItem 
                      key={`sem-${sem._id}`} 
                      value={String(sem.semester)}
                    >
                      Semester {sem.semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Timetable Grid */}
          {timetableGenerated && selectedSemester && (
            <div ref={targetRef}>

            <Card  className="shadow-md">
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
                              key={`header-${slot.start}-${slot.end}`}
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
                          <tr key={`row-${day}`}>
                            <td className="p-3 border bg-white font-medium">{day}</td>
                            {filteredSlots.map((slot) => {
                              const specialEntry = getSpecialEntryForDayAndSlot(day, slot);
                              const entry = getEntriesForDayAndSlot(day, slot);
                              const cellKey = `cell-${day}-${slot.start}-${slot.end}`;

                              // Handle special slots first
                              if (specialEntry) {
                                return (
                                  <td
                                    key={cellKey}
                                    className={`p-3 border ${getSubjectStyle(specialEntry.type)} text-center`}
                                  >
                                    {specialEntry.type === "qcpc" ? "QCPC" : 
                                    specialEntry.type === "lunch" ? "Lunch" : "Break"}
                                  </td>
                                );
                              }

                              // Regular class entry
                              return (
                                <td
                                  key={cellKey}
                                  className={`p-3 border ${getSubjectStyle(entry?.type)}`}
                                >
                                  {entry ? (
                                    <div className="space-y-1">
      <div className="font-semibold text-xs">
        {subjectData[entry.subject]?.name || entry.subject || "Class"}
      </div>
      {subjectData[entry.subject]?.facultyName && (
        <div className="text-xs opacity-80">
          {subjectData[entry.subject]?.facultyName}
        </div>
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
            </div>
          )}
        </div>
      </Layout>
    );
  }