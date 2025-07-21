// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://your-backend-api.com/api"

// Generic API request function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API Request failed:", error)
    throw error
  }
}

// Save the Date API functions
export interface SaveTheDateData {
  partner1Name?: string
  partner2Name?: string
  weddingDate: string
  createdBy?: string
}

export interface SaveTheDateResponse {
  id: string
  shareableUrl: string
  expiresAt: string
}

export async function createSaveTheDate(data: SaveTheDateData): Promise<SaveTheDateResponse> {
  return apiRequest("/save-the-date", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getSaveTheDate(id: string) {
  return apiRequest(`/save-the-date/${id}`)
}

// User/Auth API functions
export interface UserData {
  email: string
  name: string
  password?: string
}

export interface LoginResponse {
  user: {
    id: string
    email: string
    name: string
    role: "user" | "admin"
  }
  token?: string
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function registerUser(userData: UserData): Promise<LoginResponse> {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

export async function logoutUser(): Promise<void> {
  return apiRequest("/auth/logout", {
    method: "POST",
  })
}

// Project API functions
export interface ProjectData {
  title: string
  type: "invitation" | "save-the-date"
  templateId?: string
  elements: any[]
  userId?: string
}

export async function saveProject(projectData: ProjectData) {
  return apiRequest("/projects", {
    method: "POST",
    body: JSON.stringify(projectData),
  })
}

export async function getProject(id: string) {
  return apiRequest(`/projects/${id}`)
}

export async function getUserProjects(userId: string) {
  return apiRequest(`/users/${userId}/projects`)
}

export async function updateProject(id: string, projectData: Partial<ProjectData>) {
  return apiRequest(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(projectData),
  })
}

export async function deleteProject(id: string) {
  return apiRequest(`/projects/${id}`, {
    method: "DELETE",
  })
}

// Analytics/Logging API functions
export interface AnalyticsEvent {
  event: string
  userId?: string
  data?: any
  timestamp?: string
}

export async function trackEvent(event: AnalyticsEvent) {
  return apiRequest("/analytics/track", {
    method: "POST",
    body: JSON.stringify({
      ...event,
      timestamp: new Date().toISOString(),
    }),
  })
}

// Admin API functions (if user is admin)
export async function getAdminStats() {
  return apiRequest("/admin/stats")
}

export async function getAllUsers() {
  return apiRequest("/admin/users")
}

export async function getAllProjects() {
  return apiRequest("/admin/projects")
}

export async function updateUserRole(userId: string, role: "user" | "admin") {
  return apiRequest(`/admin/users/${userId}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  })
}

export async function updateUserStatus(userId: string, status: "active" | "inactive") {
  return apiRequest(`/admin/users/${userId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  })
}
