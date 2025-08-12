import type { AuthUser } from "@/contexts/auth-context"

export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  createdAt: string
  lastLogin?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Admin emails - in a real app, this would be in a database
const ADMIN_EMAILS = ["admin@bellacolor.com", "admin@example.com", "test@admin.com"]

// Mock user data
const MOCK_USERS = [
  { id: "user1", email: "user@bellacolor.com", name: "Demo User", role: "user", password: "test123" },
  { id: "admin1", email: "admin@bellacolor.com", name: "Admin User", role: "admin", password: "test123" },
  { id: "admin2", email: "test@admin.com", name: "Test Admin", role: "admin", password: "test123" },
]

// Generate a simple user ID
function generateUserId(): string {
  return "user_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}

// Get current user from localStorage
export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  const userJson = localStorage.getItem("currentUser")
  return userJson ? JSON.parse(userJson) : null
}

// Save user to localStorage
export function saveUser(user: AuthUser): void {
  if (typeof window === "undefined") return
  localStorage.setItem("currentUser", JSON.stringify(user))
}

// Remove user from localStorage
export function removeUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("currentUser")
}

// Check if email is admin
export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

// Simulate API call for login
export async function apiLogin(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const foundUser = MOCK_USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase()
  );
  if (!foundUser) return { success: false, error: "Invalid credentials" };

  // Check per-user password
  if (password !== foundUser.password) {
    return { success: false, error: "Invalid credentials" };
  }

  // Remove password before returning user object
  const { password: _, ...userWithoutPassword } = foundUser;

  return { success: true, user: { ...userWithoutPassword, createdAt: new Date().toISOString() } };  
}

// Simulate API call for registration
export async function apiRegister(
  email: string,
  password: string,
  name: string,
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  })
  if (!response.ok) return null
  return await response.json()
}

// Simulate API call for logout
export async function apiLogout(): Promise<{ success: boolean }> {
  const response = await fetch("/api/logout", {
    method: "POST",
  })
  return response.ok
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

// Check if current user is admin
export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.role === "admin"
}

export interface AdminStats {
  totalUsers: number
  totalProjects: number
  totalSaveTheDates: number
  activeUsers: number
  recentSignups: number
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  createdAt: string
  lastLogin?: string
  projectCount: number
  status: "active" | "inactive"
}

export interface AdminProject {
  id: string
  userId: string
  userName: string
  title: string
  type: "invitation" | "save-the-date"
  createdAt: string
  lastModified: string
  status: "draft" | "completed"
}

// Mock admin data functions
export function getAdminStats(): AdminStats {
  return {
    totalUsers: 1247,
    totalProjects: 3891,
    totalSaveTheDates: 892,
    activeUsers: 156,
    recentSignups: 23,
  }
}

export function getAllUsers(): AdminUser[] {
  return [
    {
      id: "1",
      name: "Ayşe Yılmaz",
      email: "ayse@example.com",
      role: "user",
      createdAt: "2024-01-15T10:30:00Z",
      lastLogin: "2024-01-18T14:22:00Z",
      projectCount: 3,
      status: "active",
    },
    {
      id: "2",
      name: "Mehmet Kaya",
      email: "mehmet@example.com",
      role: "user",
      createdAt: "2024-01-10T09:15:00Z",
      lastLogin: "2024-01-17T16:45:00Z",
      projectCount: 1,
      status: "active",
    },
    {
      id: "3",
      name: "Admin User",
      email: "admin@bellacolor.com",
      role: "admin",
      createdAt: "2023-12-01T08:00:00Z",
      lastLogin: "2024-01-18T09:00:00Z",
      projectCount: 0,
      status: "active",
    },
    {
      id: "4",
      name: "Test Admin",
      email: "test@admin.com",
      role: "admin",
      createdAt: "2023-12-01T08:00:00Z",
      lastLogin: "2024-01-18T09:00:00Z",
      projectCount: 0,
      status: "active",
    },
  ]
}

export function getAllProjects(): AdminProject[] {
  return [
    {
      id: "1",
      userId: "1",
      userName: "Ayşe Yılmaz",
      title: "Klasik Zarafet Davetiyesi",
      type: "invitation",
      createdAt: "2024-01-16T10:30:00Z",
      lastModified: "2024-01-17T15:22:00Z",
      status: "completed",
    },
    {
      id: "2",
      userId: "2",
      userName: "Mehmet Kaya",
      title: "Save the Date - Haziran 2024",
      type: "save-the-date",
      createdAt: "2024-01-15T14:20:00Z",
      lastModified: "2024-01-15T14:20:00Z",
      status: "draft",
    },
  ]
}
