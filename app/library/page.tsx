"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BookOpen, Heart, Download, Clock, Star, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BookCard } from "@/components/book-card"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import type { Book } from "@/types/book"
import Link from "next/link"

interface UserBook extends Book {
  reading_progress: number
  is_favorite: boolean
  is_downloaded: boolean
  started_reading_at: string
  finished_reading_at?: string
  last_read_at: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

export default function LibraryPage() {
  const { user } = useAuth()
  const [userBooks, setUserBooks] = useState<UserBook[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"reading" | "favorites" | "finished" | "downloaded">("reading")

  useEffect(() => {
    if (user) {
      fetchUserBooks()
    }
  }, [user])

  const fetchUserBooks = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("user_books")
        .select(`
          *,
          books (
            *,
            users!books_author_id_fkey (
              username,
              avatar_url,
              is_verified
            )
          )
        `)
        .eq("user_id", user.id)
        .order("last_read_at", { ascending: false })

      if (error) throw error

      const formattedBooks = data.map((userBook) => ({
        ...userBook.books,
        author: userBook.books.users.username,
        author_avatar: userBook.books.users.avatar_url,
        is_verified: userBook.books.users.is_verified,
        categories: userBook.books.categories || [],
        reading_progress: userBook.reading_progress,
        is_favorite: userBook.is_favorite,
        is_downloaded: userBook.is_downloaded,
        started_reading_at: userBook.started_reading_at,
        finished_reading_at: userBook.finished_reading_at,
        last_read_at: userBook.last_read_at,
      }))

      setUserBooks(formattedBooks)
    } catch (error) {
      console.error("Error fetching user books:", error)
    } finally {
      setLoading(false)
    }
  }

  const readingBooks = userBooks.filter((book) => book.reading_progress > 0 && book.reading_progress < 100)
  const favoriteBooks = userBooks.filter((book) => book.is_favorite)
  const finishedBooks = userBooks.filter((book) => book.finished_reading_at)
  const downloadedBooks = userBooks.filter((book) => book.is_downloaded)

  const getReadingStats = () => {
    const totalBooks = userBooks.length
    const completedBooks = finishedBooks.length
    const averageProgress = userBooks.reduce((acc, book) => acc + book.reading_progress, 0) / totalBooks || 0
    const totalReadingTime = user?.total_reading_time || 0

    return {
      totalBooks,
      completedBooks,
      averageProgress,
      totalReadingTime,
    }
  }

  const stats = getReadingStats()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Sign in to view your library</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">Keep track of your reading progress and favorites</p>
          <Link href="/auth/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Navigation />

      {/* Hero Section */}
      <motion.section className="pt-20 pb-8 px-4" initial="hidden" animate="visible" variants={containerVariants}>
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              My Library
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
              Your personal reading collection and progress
            </p>
          </motion.div>

          {/* Reading Stats */}
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" variants={itemVariants}>
            {[
              { icon: BookOpen, label: "Books in Library", value: stats.totalBooks, color: "blue" },
              { icon: Star, label: "Completed", value: stats.completedBooks, color: "green" },
              {
                icon: TrendingUp,
                label: "Avg Progress",
                value: `${stats.averageProgress.toFixed(0)}%`,
                color: "yellow",
              },
              {
                icon: Clock,
                label: "Reading Time",
                value: `${Math.floor(stats.totalReadingTime / 60)}h`,
                color: "purple",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <stat.icon
                  className={`w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 ${
                    stat.color === "blue"
                      ? "text-blue-600"
                      : stat.color === "green"
                        ? "text-green-600"
                        : stat.color === "yellow"
                          ? "text-yellow-600"
                          : "text-purple-600"
                  }`}
                />
                <div className="text-lg md:text-2xl font-bold text-slate-800 dark:text-slate-200">{stat.value}</div>
                <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <motion.section className="px-4 pb-12" variants={containerVariants}>
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants}>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-1">
                <TabsTrigger value="reading" className="rounded-lg">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Reading</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {readingBooks.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="favorites" className="rounded-lg">
                  <Heart className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Favorites</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {favoriteBooks.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="finished" className="rounded-lg">
                  <Star className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Finished</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {finishedBooks.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="downloaded" className="rounded-lg">
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Downloaded</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {downloadedBooks.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              {/* Currently Reading */}
              <TabsContent value="reading">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">
                      Continue Reading
                    </h2>
                  </div>

                  {readingBooks.length > 0 ? (
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                      variants={containerVariants}
                    >
                      {readingBooks.map((book) => (
                        <motion.div key={book.id} variants={itemVariants} className="relative">
                          <BookCard book={book} />
                          <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-slate-600 dark:text-slate-400">Progress</span>
                              <span className="font-medium">{book.reading_progress}%</span>
                            </div>
                            <Progress value={book.reading_progress} className="h-1" />
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                        No books in progress
                      </h3>
                      <p className="text-slate-500 dark:text-slate-500 mb-4">Start reading a book to see it here</p>
                      <Link href="/explore">
                        <Button>Explore Books</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Favorites */}
              <TabsContent value="favorites">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">
                      Favorite Books
                    </h2>
                  </div>

                  {favoriteBooks.length > 0 ? (
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                      variants={containerVariants}
                    >
                      {favoriteBooks.map((book) => (
                        <motion.div key={book.id} variants={itemVariants}>
                          <BookCard book={book} />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                        No favorite books yet
                      </h3>
                      <p className="text-slate-500 dark:text-slate-500 mb-4">
                        Mark books as favorites to see them here
                      </p>
                      <Link href="/explore">
                        <Button>Discover Books</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Finished */}
              <TabsContent value="finished">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">
                      Completed Books
                    </h2>
                  </div>

                  {finishedBooks.length > 0 ? (
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                      variants={containerVariants}
                    >
                      {finishedBooks.map((book) => (
                        <motion.div key={book.id} variants={itemVariants}>
                          <BookCard book={book} />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-12">
                      <Star className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                        No completed books yet
                      </h3>
                      <p className="text-slate-500 dark:text-slate-500 mb-4">Finish reading a book to see it here</p>
                      <Link href="/explore">
                        <Button>Start Reading</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Downloaded */}
              <TabsContent value="downloaded">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">
                      Downloaded Books
                    </h2>
                  </div>

                  {downloadedBooks.length > 0 ? (
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                      variants={containerVariants}
                    >
                      {downloadedBooks.map((book) => (
                        <motion.div key={book.id} variants={itemVariants}>
                          <BookCard book={book} />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-12">
                      <Download className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                        No downloaded books
                      </h3>
                      <p className="text-slate-500 dark:text-slate-500 mb-4">Download books for offline reading</p>
                      <Link href="/explore">
                        <Button>Browse Books</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
