// Mock database for projects
interface MockProject {
  id: string
  title: string
  type: "invitation" | "save-the-date"
  templateId: string
  elements: any[] // Simplified for mock
  userId: string
  createdAt: string
  lastModified: string
  // Specific fields for save-the-date
  wedding_date?: string
  partner1_name?: string
  partner2_name?: string
  expires_at?: string
  view_count?: number
}

const MOCK_PROJECTS: MockProject[] = [
  {
    id: "proj_mock_1",
    title: "Sarah & Michael Düğün Davetiyesi",
    type: "invitation",
    templateId: "classic-elegant",
    elements: [],
    userId: "user1",
    createdAt: "2023-01-01T10:00:00Z",
    lastModified: "2023-01-01T10:00:00Z",
  },
  {
    id: "proj_mock_2",
    title: "Emma & James Save the Date",
    type: "save-the-date",
    templateId: "modern-minimal",
    elements: [],
    userId: "user1",
    wedding_date: "2025-12-25",
    partner1_name: "Emma",
    partner2_name: "James",
    expires_at: "2026-12-25T00:00:00Z",
    view_count: 150,
    createdAt: "2024-01-01T10:00:00Z",
    lastModified: "2024-01-01T10:00:00Z",
  },
  {
    id: "proj_mock_3",
    title: "Admin Test Davetiyesi",
    type: "invitation",
    templateId: "floral-romance",
    elements: [],
    userId: "admin1",
    createdAt: "2023-03-15T10:00:00Z",
    lastModified: "2023-03-15T10:00:00Z",
  },
]

// Mock database for analytics events
interface MockEvent {
  id: string
  event: string
  userId?: string
  timestamp: string
  data: any
}

const MOCK_EVENTS: MockEvent[] = []

// Simulate API request delay
const simulateDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

// Simulate API failure for testing purposes
const SIMULATE_API_FAILURE = false // Set to true to test error handling

async function apiRequest<T>(
  path: string,
  method = "GET",
  body?: any,
): Promise<{ success: boolean; data?: T; error?: string }> {
  await simulateDelay()

  if (SIMULATE_API_FAILURE) {
    console.error(`Simulating API failure for ${method} ${path}`)
    return { success: false, error: "Simulated network error" }
  }

  try {
    // Mock Project API
    if (path.startsWith("/api/projects")) {
      if (method === "POST") {
        const newProject: MockProject = {
          id: `proj_mock_${MOCK_PROJECTS.length + 1}`,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          ...body,
        }
        MOCK_PROJECTS.push(newProject)
        return { success: true, data: newProject as T }
      } else if (method === "PUT") {
        const index = MOCK_PROJECTS.findIndex((p) => p.id === body.id)
        if (index !== -1) {
          MOCK_PROJECTS[index] = { ...MOCK_PROJECTS[index], ...body, lastModified: new Date().toISOString() }
          return { success: true, data: MOCK_PROJECTS[index] as T }
        }
        return { success: false, error: "Project not found" }
      } else if (method === "GET") {
        const projectId = path.split("/").pop()
        if (projectId && projectId !== "projects") {
          const project = MOCK_PROJECTS.find((p) => p.id === projectId)
          if (project) {
            return { success: true, data: project as T }
          }
          return { success: false, error: "Project not found" }
        }
        return { success: true, data: MOCK_PROJECTS as T }
      }
    }

    // Mock Save-the-Date API (uses projects endpoint for data)
    if (path.startsWith("/api/save-the-date")) {
      if (method === "GET") {
        const projectId = path.split("/").pop()
        if (projectId && projectId !== "save-the-date") {
          const project = MOCK_PROJECTS.find((p) => p.id === projectId && p.type === "save-the-date")
          if (project) {
            // Simulate view count increment
            project.view_count = (project.view_count || 0) + 1
            return { success: true, data: project as T }
          }
          return { success: false, error: "Save-the-date link not found" }
        }
      }
    }

    // Mock Analytics API
    if (path === "/api/track-event") {
      if (method === "POST") {
        const newEvent: MockEvent = {
          id: `event_${MOCK_EVENTS.length + 1}`,
          timestamp: new Date().toISOString(),
          ...body,
        }
        MOCK_EVENTS.push(newEvent)
        console.log("Tracked event:", newEvent) // Log tracked events
        return { success: true, data: newEvent as T }
      }
    }

    return { success: false, error: "Not Found" }
  } catch (e: any) {
    console.error("Mock API error:", e)
    return { success: false, error: e.message || "An unexpected error occurred" }
  }
}

export const saveProject = async (projectData: Omit<MockProject, "id" | "createdAt" | "lastModified">) => {
  const response = await apiRequest<MockProject>("/api/projects", "POST", projectData)
  if (!response.success) {
    throw new Error(response.error || "Failed to save project")
  }
  return response.data!
}

export const updateProject = async (
  id: string,
  projectData: Partial<Omit<MockProject, "id" | "createdAt" | "lastModified">>,
) => {
  const response = await apiRequest<MockProject>("/api/projects", "PUT", { id, ...projectData })
  if (!response.success) {
    throw new Error(response.error || "Failed to update project")
  }
  return response.data!
}

export async function getProjectById(id: string) {
  const response = await apiRequest<MockProject>(`/api/projects/${id}`, "GET")
  return response
}

export const trackEvent = async (eventData: Omit<MockEvent, "id" | "timestamp">) => {
  const response = await apiRequest<MockEvent>("/api/track-event", "POST", eventData)
  if (!response.success) {
    console.error("Failed to track event:", response.error)
    // Do not throw error to avoid breaking UI for analytics failures
  }
  return response.success
}
