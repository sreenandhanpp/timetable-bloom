import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicTimetable from "./pages/PublicTimetable";
import AdminLogin from "./pages/AdminLogin";
import StaffLogin from "./pages/StaffLogin";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AddStaff from "./pages/AddStaff";
import AddSubjects from "./pages/AddSubjects";
import GenerateTimetable from "./pages/GenerateTimetable";
import Configuration from "./pages/Configuration";
import NotFound from "./pages/NotFound";
import StaffList from "./pages/StaffList";
import EditStaff from "./pages/EditStaff";
import SubjectList from "./pages/SubjectList";
import EditSubject from "./pages/EditSubject";
import TimetableList from "./pages/TImetableList";
import TimetableViewer from "./pages/TimetableViewer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicTimetable />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/staff" element={<StaffList />} />
          <Route path="/admin/staff/add" element={<AddStaff />} />
          <Route path="/admin/staff/edit/:id" element={<EditStaff />} />
          <Route path="/admin/subjects" element={<SubjectList />} />
          <Route path="/admin/subjects/add" element={<AddSubjects />} />
          <Route path="/admin/subjects/edit/:id" element={<EditSubject />} />
          <Route path="/admin/timetable" element={<TimetableList />} />
          <Route path="/admin/timetable/generate" element={<GenerateTimetable />} />
          <Route path="/admin/timetable/view/:type/:version" element={<TimetableViewer />} />
          <Route path="/admin/configuration" element={<Configuration />} />
          <Route path="/staff" element={<StaffDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
