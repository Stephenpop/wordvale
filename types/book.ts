export interface Book {
  id: string
  title: string
  description: string
  author: string
  author_id: string
  author_avatar?: string
  cover_url?: string
  file_url: string
  categories: string[]
  tags: string[]
  avg_rating: number
  total_pages: number
  created_at: string
  reading_progress?: number
}
