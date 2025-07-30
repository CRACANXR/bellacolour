// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://your-backend-api.com/api"

// Mock data for development/demo purposes
const MOCK_DATA = {
  users: [
    { id: "1", email: "admin@bellacolor.com", name: "Admin User", role: "admin" as const },
    { id: "2", email: "test@admin.com", name: "Test Admin", role: "admin" as const },
    { id: "3", email: "user@example.com", name: "Demo User", role: "user" as const },
  ],
  projects: [],
  saveTheDates: [],
}

// Check if we're in development or if API is not available
const isDevelopment = process.env.NODE_ENV === "development" || !process.env.NEXT_PUBLIC_API_URL

// Generic API request function with fallback
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  // If in development or no API URL, use mock data
  if (isDevelopment) {
    return handleMockRequest(endpoint, options)
  }

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
    console.warn("API Request failed, falling back to mock data:", error)
    // Fallback to mock data if API fails
    return handleMockRequest(endpoint, options)
  }
}

// Mock request handler
async function handleMockRequest(endpoint: string, options: RequestInit = {}) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const method = options.method || "GET"
  const body = options.body ? JSON.parse(options.body as string) : null

  console.log(`Mock API: ${method} ${endpoint}`, body)

  // Handle different endpoints
  if (endpoint === "/auth/login") {
    const { email, password } = body
    const user = MOCK_DATA.users.find((u) => u.email === email)

    if (user) {
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token: `mock-token-${user.id}`,
      }
    } else {
      throw new Error("Invalid credentials")
    }
  }

  if (endpoint === "/auth/register") {
    const { email, password, name } = body
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: "user" as const,
    }
    MOCK_DATA.users.push(newUser)

    return {
      user: newUser,
      token: `mock-token-${newUser.id}`,
    }
  }

  if (endpoint === "/auth/logout") {
    return { success: true }
  }

  if (endpoint === "/projects" && method === "POST") {
    const project = {
      id: `project-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    }
    MOCK_DATA.projects.push(project)
    return project
  }

  if (endpoint.startsWith("/projects/") && method === "PUT") {
    const projectId = endpoint.split("/")[2]
    const projectIndex = MOCK_DATA.projects.findIndex((p) => p.id === projectId)
    if (projectIndex >= 0) {
      MOCK_DATA.projects[projectIndex] = { ...MOCK_DATA.projects[projectIndex], ...body }
      return MOCK_DATA.projects[projectIndex]
    }
    return { id: projectId, ...body }
  }

  if (endpoint.startsWith("/projects/") && method === "GET") {
    const projectId = endpoint.split("/")[2]
    const project = MOCK_DATA.projects.find((p) => p.id === projectId)
    return project || { id: projectId, title: "Mock Project", elements: [] }
  }

  if (endpoint === "/save-the-date" && method === "POST") {
    const saveTheDate = {
      id: `std-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      shareableUrl: `${window.location.origin}/save-the-date/${Date.now()}`,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    }
    MOCK_DATA.saveTheDates.push(saveTheDate)
    return saveTheDate
  }

  if (endpoint.startsWith("/save-the-date/") && method === "GET") {
    const id = endpoint.split("/")[2]
    const saveTheDate = MOCK_DATA.saveTheDates.find((std) => std.id === id)
    return (
      saveTheDate || {
        id,
        partner1Name: "Demo Partner 1",
        partner2Name: "Demo Partner 2",
        weddingDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      }
    )
  }

  if (endpoint === "/analytics/track" && method === "POST") {
    console.log("Analytics event tracked:", body)
    return { success: true }
  }

  if (endpoint === "/admin/stats") {
    return {
      totalUsers: MOCK_DATA.users.length,
      totalProjects: MOCK_DATA.projects.length,
      totalOrders: 0,
      revenue: 0,
    }
  }

  if (endpoint === "/admin/users") {
    return MOCK_DATA.users
  }

  if (endpoint === "/admin/projects") {
    return MOCK_DATA.projects
  }

  // Default response
  return { success: true, message: "Mock response" }
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
