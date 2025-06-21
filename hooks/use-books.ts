"use client"

import { useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { Book } from "@/types/book"

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)

  const fetchPersonalizedBooks = useCallback(async () => {
    setLoading(true)
    try {
      // This would fetch books based on user's followed authors and preferred categories
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          users!books_author_id_fkey (
            username,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false })
        .limit(20)

      if (error) throw error

      const formattedBooks = data.map((book) => ({
        ...book,
        author: book.users.username,
        author_avatar: book.users.avatar_url,
        categories: book.categories || [],
        avg_rating: book.avg_rating || 0,
        total_pages: book.total_pages || 0,
        reading_progress: 0, // This would come from user_books table
      }))

      setBooks(formattedBooks)
    } catch (error) {
      console.error("Error fetching personalized books:", error)
      // Fallback to sample data
      setBooks(getSampleBooks())
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTrendingBooks = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          users!books_author_id_fkey (
            username,
            avatar_url
          )
        `)
        .order("avg_rating", { ascending: false })
        .limit(20)

      if (error) throw error

      const formattedBooks = data.map((book) => ({
        ...book,
        author: book.users.username,
        author_avatar: book.users.avatar_url,
        categories: book.categories || [],
        avg_rating: book.avg_rating || 0,
        total_pages: book.total_pages || 0,
        reading_progress: 0,
      }))

      setBooks(formattedBooks)
    } catch (error) {
      console.error("Error fetching trending books:", error)
      setBooks(getSampleBooks())
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    books,
    loading,
    fetchPersonalizedBooks,
    fetchTrendingBooks,
  }
}

// Sample data for development
function getSampleBooks(): Book[] {
  return [
    {
      id: "1",
      title: "The Digital Renaissance",
      description: "A comprehensive guide to the modern digital transformation and its impact on society.",
      author: "Sarah Chen",
      author_id: "1",
      author_avatar: "/placeholder.svg?height=40&width=40",
      cover_url: "/placeholder.svg?height=300&width=200",
      file_url: "",
      categories: ["Technology", "Business"],
      tags: ["digital", "transformation", "future"],
      avg_rating: 4.5,
      total_pages: 320,
      created_at: "2024-01-15",
      reading_progress: 65,
    },
    {
      id: "2",
      title: "Mysteries of the Quantum Realm",
      description:
        "Explore the fascinating world of quantum physics and its implications for our understanding of reality.",
      author: "Dr. Michael Rodriguez",
      author_id: "2",
      author_avatar: "/placeholder.svg?height=40&width=40",
      cover_url: "/placeholder.svg?height=300&width=200",
      file_url: "",
      categories: ["Science", "Physics"],
      tags: ["quantum", "physics", "science"],
      avg_rating: 4.8,
      total_pages: 280,
      created_at: "2024-01-10",
      reading_progress: 0,
    },
    {
      id: "3",
      title: "The Art of Mindful Living",
      description: "Discover practical techniques for incorporating mindfulness into your daily routine.",
      author: "Emma Thompson",
      author_id: "3",
      author_avatar: "/placeholder.svg?height=40&width=40",
      cover_url: "/placeholder.svg?height=300&width=200",
      file_url: "",
      categories: ["Self-Help", "Health"],
      tags: ["mindfulness", "wellness", "meditation"],
      avg_rating: 4.3,
      total_pages: 240,
      created_at: "2024-01-08",
      reading_progress: 30,
    },
    {
      id: "4",
      title: "Echoes of Tomorrow",
      description: "A thrilling sci-fi adventure set in a world where time travel has become reality.",
      author: "Alex Johnson",
      author_id: "4",
      author_avatar: "/placeholder.svg?height=40&width=40",
      cover_url: "/placeholder.svg?height=300&width=200",
      file_url: "",
      categories: ["Sci-Fi", "Fiction"],
      tags: ["time-travel", "adventure", "future"],
      avg_rating: 4.6,
      total_pages: 380,
      created_at: "2024-01-05",
      reading_progress: 0,
    },
    {
      id: "5",
      title: "Culinary Adventures Around the World",
      description: "A journey through global cuisines with authentic recipes and cultural stories.",
      author: "Chef Maria Gonzalez",
      author_id: "5",
      author_avatar: "/placeholder.svg?height=40&width=40",
      cover_url: "/placeholder.svg?height=300&width=200",
      file_url: "",
      categories: ["Cooking", "Travel"],
      tags: ["recipes", "culture", "food"],
      avg_rating: 4.4,
      total_pages: 450,
      created_at: "2024-01-03",
      reading_progress: 15,
    },
    {
      id: "6",
      title: "The Psychology of Success",
      description: "Understanding the mental patterns and habits that lead to achievement and fulfillment.",
      author: "Dr. James Wilson",
      author_id: "6",
      author_avatar: "/placeholder.svg?height=40&width=40",
      cover_url: "/placeholder.svg?height=300&width=200",
      file_url: "",
      categories: ["Psychology", "Self-Help"],
      tags: ["success", "psychology", "motivation"],
      avg_rating: 4.7,
      total_pages: 300,
      created_at: "2024-01-01",
      reading_progress: 80,
    },
  ]
}
