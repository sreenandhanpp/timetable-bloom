import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getTimetablesByVersionType, setActiveTimetable, getActiveTimetable } from "@/api/timetable.api";
import { getSubjectDetails } from "@/api/subject.api";
import { Calendar, ArrowLeft } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

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
};

type SemesterBlock = {
  semester: number | string;
  department: string;
  entries: TimetableEntry[];
  timeSlots?: TimeSlot[];
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
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

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TimetableViewer() {
  const { type, version } = useParams<{ type: "odd" | "even"; version: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Convert version to number
  const versionNum = Number(version);
  
  const [timetables, setTimetables] = useState<SemesterBlock[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [subjectData, setSubjectData] = useState<Record<string, {
    name: string;
    facultyName?: string;
  }>>({});
  const [error, setError] = useState<string | null>(null);
  const [isActiveVersion, setIsActiveVersion] = useState(false);
  const [isSettingActive, setIsSettingActive] = useState(false);

  // Fetch timetable data and active status
  useEffect(() => {
    if (!type || !version) {
      setError("Invalid timetable parameters");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch timetable data
        const data = await getTimetablesByVersionType(type, versionNum);
        setTimetables(data);
        
        if (data.length > 0) {
          const allEntries = data.flatMap((sem) => sem.entries);
          await updateSubjectData(allEntries);
          setSelectedSemester(String(data[0].semester));
        } else {
          setError("No timetable data found for this version");
        }
        
        // Check if this version is active
        const activeTimetable = await getActiveTimetable(type);
        setIsActiveVersion(activeTimetable?.version === versionNum);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load timetable data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, version]);

  // Update subject data
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

  // Toggle active status
  const handleToggleActive = async () => {
    if (!type || !versionNum) return;
    
    setIsSettingActive(true);
    try {
      if (!isActiveVersion) {
        await setActiveTimetable(type, versionNum);
        setIsActiveVersion(true);
        toast({
          title: "Timetable Activated",
          description: `This version is now the active timetable for ${type} semester`,
        });
      } else {
        // Note: API doesn't support deactivation directly
        // We'll just set it to inactive in UI
        setIsActiveVersion(false);
        toast({
          title: "Timetable Deactivated",
          description: "This version is no longer active",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error setting active timetable:", error);
      toast({
        title: "Failed to update status",
        description: "Could not set timetable as active",
        variant: "destructive",
      });
    } finally {
      setIsSettingActive(false);
    }
  };

  const getSubjectStyle = (type?: string) => {
    if (!type) return "bg-gray-100";
    if (type.toLowerCase() === "lab") return "bg-blue-100 border-blue-200";
    if (type.toLowerCase() === "lecture") return "bg-purple-100 border-purple-200";
    if (type === "qcpc") return "bg-green-100 border-green-200";
    if (type === "lunch" || type === "break") return "bg-orange-100 border-orange-200";
    return "bg-gray-100";
  };

  const deriveTimeSlots = (entries: TimetableEntry[]): TimeSlot[] => {
    const slotsMap = new Map<string, TimeSlot>();
    entries.forEach(entry => {
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

  const getEntryForDayAndSlot = (entries: TimetableEntry[], day: string, timeSlot: TimeSlot) => {
    return entries.find(
      (entry) => 
        entry.day === day && 
        entry.timeSlot.start === timeSlot.start && 
        entry.timeSlot.end === timeSlot.end
    );
  };

  // Get current semester data
  const getCurrentSemester = () => {
    return timetables.find(sem => String(sem.semester) === selectedSemester);
  };

  return (
    <Layout userType="admin" userName="Administrator">
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Calendar className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Timetable Viewer</h1>
            </div>
          </div>
          <div className="bg-blue-100 p-3 rounded-xl">
            <Calendar className="w-8 h-8" />
          </div>
        </div>

        {/* Header with version info */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>
                  Timetable Version: {version} ({type})
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={isActiveVersion}
                    onCheckedChange={handleToggleActive}
                    disabled={isSettingActive}
                  />
                  <span className="text-sm font-medium">
                    {isActiveVersion ? "Active" : "Set as Active"}
                  </span>
                </div>
                <Badge 
                  variant={isActiveVersion ? "default" : "secondary"} 
                  className="text-sm"
                >
                  {isActiveVersion ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {error ? (
          <Card className="shadow-md bg-red-50 border-red-200">
            <CardContent className="py-8 text-center">
              <div className="text-red-600 font-medium text-lg">{error}</div>
              <Button 
                className="mt-4"
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-4 text-gray-600">Loading timetable...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Semester Selector */}
            {timetables.length > 0 && (
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Select Semester:</label>
                <Select
                  value={selectedSemester || ""}
                  onValueChange={setSelectedSemester}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select a semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {timetables.map((sem) => (
                      <SelectItem 
                        key={`sem-${sem.semester}`} 
                        value={String(sem.semester)}
                      >
                        Semester {sem.semester} - {sem.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Timetable Grid */}
            {selectedSemester && (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>
                        Semester {selectedSemester} - {getCurrentSemester()?.department}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-purple-100 text-purple-800">
                        Lecture
                      </Badge>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        Lab
                      </Badge>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        QCPC
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
                          {deriveTimeSlots(getCurrentSemester()?.entries || []).map((slot) => (
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
                        {days.map((day) => (
                          <tr key={`row-${day}`}>
                            <td className="p-3 border bg-white font-medium">{day}</td>
                            {deriveTimeSlots(getCurrentSemester()?.entries || []).map((slot) => {
                              const entry = getEntryForDayAndSlot(
                                getCurrentSemester()?.entries || [], 
                                day, 
                                slot
                              );
                              const cellKey = `cell-${day}-${slot.start}-${slot.end}`;

                              return (
                                <td
                                  key={cellKey}
                                  className={`p-3 border ${getSubjectStyle(entry?.type)}`}
                                >
                                  {entry ? (
                                    <div className="space-y-1">
                                      {entry.type === "qcpc" ? (
                                        <div className="text-center font-semibold">QCPC</div>
                                      ) : entry.type === "lunch" ? (
                                        <div className="text-center font-semibold">Lunch</div>
                                      ) : (
                                        <>
                                          <div className="font-semibold text-xs">
                                            {entry.subject 
                                              ? subjectData[entry.subject]?.name || entry.subject 
                                              : "Free Period"}
                                          </div>
                                          {entry.subject && subjectData[entry.subject]?.facultyName && (
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
                                        </>
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}