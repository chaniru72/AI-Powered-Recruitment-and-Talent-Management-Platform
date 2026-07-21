import httpClient from "./httpClient";

export type UserRole =
  | "Candidate"
  | "Recruiter"
  | "HiringManager"
  | "Administrator";

export type JobStatus =
  | "Draft"
  | "Open"
  | "Closed"
  | "Archived";

export type AdminUser = {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
};

export type AdminDashboard = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalCandidates: number;
  totalRecruiters: number;
  totalHiringManagers: number;
  totalAdministrators: number;
  totalOrganizations: number;
  totalJobs: number;
  activeJobs: number;
  closedJobs: number;
  totalApplications: number;
  totalInterviews: number;
  totalEvaluations: number;
};

export type AdminSystemStatus = {
  apiStatus: string;
  databaseStatus: string;
  serverTime: string;
  environment: string;
  version: string;
};

export type AdminAuditLog = {
  id: number;
  action: string;
  entityName: string;
  entityId: number | null;
  adminUserId: number | null;
  adminEmail: string | null;
  details: string;
  createdAt: string;
};

export type AdminOrganization = {
  id: number;
  recruiterUserId: number;
  recruiterName: string;
  recruiterEmail: string;
  name: string;
  industry: string;
  description: string;
  location: string;
  websiteUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminDepartment = {
  id: number;
  name: string;
  description: string | null;
  organizationId: number;
  organizationName: string | null;
  isActive: boolean;
  createdAt: string;
};

export type AdminJob = {
  id: number;
  organizationId: number;
  organizationName: string;
  recruiterUserId: number;
  recruiterName: string;
  title: string;
  description: string;
  requiredSkills: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  salaryRange: string;
  status: JobStatus;
  applicationDeadline: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GetAdminUsersParams = {
  searchTerm?: string;
  role?: UserRole | "";
  isActive?: boolean | "";
};

export type GetAdminJobsParams = {
  status?: JobStatus | "";
};

export type CreateDepartmentRequest = {
  name: string;
  description?: string;
};

export type UpdateDepartmentRequest = {
  name: string;
  description?: string;
  isActive: boolean;
};

const adminService = {
  async getDashboard() {
    const response = await httpClient.get<AdminDashboard>(
      "/api/Admin/dashboard",
    );

    return response.data;
  },

  async getUsers(params?: GetAdminUsersParams) {
    const response = await httpClient.get<AdminUser[]>(
      "/api/Admin/users",
      {
        params: {
          searchTerm: params?.searchTerm || undefined,
          role: params?.role || undefined,
          isActive:
            params?.isActive === ""
              ? undefined
              : params?.isActive,
        },
      },
    );

    return response.data;
  },

  async getUserById(userId: number) {
    const response = await httpClient.get<AdminUser>(
      `/api/Admin/users/${userId}`,
    );

    return response.data;
  },

  async updateUserStatus(userId: number, isActive: boolean) {
    const response = await httpClient.put<AdminUser>(
      `/api/Admin/users/${userId}/status`,
      {
        isActive,
      },
    );

    return response.data;
  },

  async updateUserRole(userId: number, role: UserRole) {
    const response = await httpClient.put<AdminUser>(
      `/api/Admin/users/${userId}/role`,
      {
        role,
      },
    );

    return response.data;
  },

  async getOrganizations() {
    const response = await httpClient.get<AdminOrganization[]>(
      "/api/Admin/organizations",
    );

    return response.data;
  },

  async getDepartmentsByOrganizationId(organizationId: number) {
    const response = await httpClient.get<AdminDepartment[]>(
      `/api/Admin/organizations/${organizationId}/departments`,
    );

    return response.data;
  },

  async createDepartment(
    organizationId: number,
    request: CreateDepartmentRequest,
  ) {
    const response = await httpClient.post<AdminDepartment>(
      `/api/Admin/organizations/${organizationId}/departments`,
      request,
    );

    return response.data;
  },

  async updateDepartment(
    departmentId: number,
    request: UpdateDepartmentRequest,
  ) {
    const response = await httpClient.put<AdminDepartment>(
      `/api/Admin/departments/${departmentId}`,
      request,
    );

    return response.data;
  },

  async deleteDepartment(departmentId: number) {
    await httpClient.delete(
      `/api/Admin/departments/${departmentId}`,
    );
  },

  async getJobs(params?: GetAdminJobsParams) {
    const response = await httpClient.get<AdminJob[]>(
      "/api/Admin/jobs",
      {
        params: {
          status: params?.status || undefined,
        },
      },
    );

    return response.data;
  },

  async updateJobStatus(jobId: number, status: JobStatus) {
    const response = await httpClient.put<AdminJob>(
      `/api/Admin/jobs/${jobId}/status`,
      null,
      {
        params: {
          status,
        },
      },
    );

    return response.data;
  },

  async getSystemStatus() {
    const response = await httpClient.get<AdminSystemStatus>(
      "/api/Admin/system/status",
    );

    return response.data;
  },

  async getAuditLogs() {
    const response = await httpClient.get<AdminAuditLog[]>(
      "/api/Admin/audit-logs",
    );

    return response.data;
  },
};

export default adminService;