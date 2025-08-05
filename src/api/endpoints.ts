export const ENDPOINTS = {
  // ... existing endpoints
  auth: {
    adminLogin: "/auth/admin/login",
    staffLogin: "/auth/staff/login",
    adminProfile: "/auth/admin/profile",
    staffProfile: "/auth/staff/profile",
  },
  staff: {
    create: "/staff", // POST: Add new staff
    list: "/staff", // GET: Fetch all staff
    details: (id: string) => `/staff/${id}`, // GET one staff
    update: (id: string) => `/staff/${id}`, // PUT/PATCH update staff
    delete: (id: string) => `/staff/${id}`, // DELETE staff
  },
  subject: {
    create: "/subjects", // POST: Add a new subject
    list: "/subjects", // GET: Fetch all subjects
    details: (id: string) => `/subjects/${id}`, // GET: Get one subject
    update: (id: string) => `/subjects/${id}`, // PUT/PATCH: Update subject
    delete: (id: string) => `/subjects/${id}`, // DELETE: Remove subject
  },
   configuration: {
    create: "/config", // POST: Add new configuration
    list: "/config", // GET: Fetch all configurations
    details: (id: string) => `/config/${id}`, // GET: Get one configuration
    update: (id: string) => `/config/${id}`, // PUT/PATCH: Update configuration
    delete: (id: string) => `/config/${id}`, // DELETE: Remove configuration
  },
  timetable: {
  generate: "/timetable/generate",             // POST: Generate a timetable
  list: "/timetable",                          // GET: List all timetables
  bySemester: (semester: number, dept: string) => `/timetable/${semester}/${dept}`, // GET: Get one timetable
  delete: (semester: number, dept: string) => `/timetable/${semester}/${dept}`,     // DELETE: Remove timetable
}

};
