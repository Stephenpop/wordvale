export interface User {
  id: string
  email: string
  username: string
  bio?: string
  avatar_url?: string
  role: "user" | "author" | "admin"
  preferred_categories: string[]
  created_at: string
  updated_at?: string
}
