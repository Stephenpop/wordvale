"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, Heart, Share2, Star, Download, Bookmark, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { BookReader } from "@/components/book-reader"
import { RatingStars } from "@/components/rating-stars"
import { ReviewSection } from "@/components/review-section"
import type { Book } from "@/types/book"
import { useAuth } from "@/hooks/use-auth"

interface BookPageProps {
  params: { id: string }
}

export default function BookPage({ params }: BookPageProps) {
  const { user } = useAuth()
  const [book, setBook] = useState<Book | null>(null)
  const [isReading, setIsReading] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching book data
    setTimeout(() => {
      setBook({
        id: params.id,
        title: "The Digital Renaissance",
        description:
          "A comprehensive guide to the modern digital transformation and its impact on society. This book explores how technology is reshaping our world, from artificial intelligence and machine learning to blockchain and the Internet of Things. Through detailed analysis and real-world examples, readers will gain insights into the opportunities and challenges of our digital age.",
        author: "Sarah Chen",
        author_id: "1",
        author_avatar: "/placeholder.svg?height=40&width=40",
        cover_url: "/placeholder.svg?height=400&width=300",
        file_url: "/books/digital-renaissance.pdf",
        categories: ["Technology", "Business", "Future"],
        tags: ["digital", "transformation", "AI", "blockchain", "IoT"],
        avg_rating: 4.5,
        total_pages: 320,
        created_at: "2024-01-15",
        reading_progress: 35,
      })
      setReadingProgress(35)
      setLoading(false)
    }, 1000)
  }, [params.id])

  const handleStartReading = () => {
    setIsReading(true)
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const handleShare = async () => {
    if (navigator.share && book) {
      try {
        await navigator.share({
          title: book.title,
          text: `Check out "${book.title}" by ${book.author} on WordVale`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading book...</p>
        </motion.div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Book not found</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">The book you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  if (isReading) {
    return <BookReader book={book} onClose={() => setIsReading(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleToggleFavorite}>
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover and Actions */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="sticky top-24">
              {/* Book Cover */}
              <motion.div className="relative group mb-6" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <img
                  src={book.cover_url || "/placeholder.svg"}
                  alt={book.title}
                  className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>

              {/* Reading Progress */}
              {readingProgress > 0 && (
                <motion.div
                  className="mb-6 p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Reading Progress</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">{readingProgress}%</span>
                  </div>
                  <Progress value={readingProgress} className="h-2" />
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={handleStartReading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  {readingProgress > 0 ? "Continue Reading" : "Start Reading"}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="py-3">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" className="py-3">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Book Details */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Title and Author */}
            <div>
              <motion.h1
                className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-200 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {book.title}
              </motion.h1>

              <motion.div
                className="flex items-center space-x-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={book.author_avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {book.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">{book.author}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Published on {new Date(book.created_at).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>

              {/* Categories */}
              <motion.div
                className="flex flex-wrap gap-2 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {book.categories.map((category) => (
                  <Badge
                    key={category}
                    className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1"
                  >
                    {category}
                  </Badge>
                ))}
              </motion.div>

              {/* Rating */}
              <motion.div
                className="flex items-center space-x-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(book.avg_rating)
                            ? "text-yellow-400 fill-current"
                            : "text-slate-300 dark:text-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                    {book.avg_rating.toFixed(1)}
                  </span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <span className="text-slate-600 dark:text-slate-400">{book.total_pages} pages</span>
              </motion.div>
            </div>

            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">About this book</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{book.description}</p>
            </motion.div>

            {/* Tags */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {/* Rating Section */}
            {user && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                <RatingStars bookId={book.id} />
              </motion.div>
            )}

            {/* Reviews */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
              <ReviewSection bookId={book.id} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
