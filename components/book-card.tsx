"use client"

import { motion } from "framer-motion"
import { Star, BookOpen, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Book } from "@/types/book"

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const handleRead = () => {
    window.location.href = `/book/${book.id}`
  }

  const handleLike = () => {
    // TODO: Implement like functionality
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Check out "${book.title}" by ${book.author} on WordVale`,
        url: `/book/${book.id}`,
      })
    }
  }

  return (
    <motion.div
      className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300"
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Book Cover */}
      <div className="relative overflow-hidden">
        <motion.img
          src={book.cover_url || "/placeholder.svg?height=300&width=200"}
          alt={book.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Overlay Actions */}
        <motion.div
          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={handleRead}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Read
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLike}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleShare}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Reading Progress */}
        {book.reading_progress && book.reading_progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${book.reading_progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-6">
        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-3">
          {book.categories.slice(0, 2).map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {book.title}
        </h3>

        {/* Author */}
        <div className="flex items-center space-x-2 mb-3">
          <Avatar className="w-6 h-6">
            <AvatarImage src={book.author_avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-xs">
              {book.author
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-slate-600 dark:text-slate-400">{book.author}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(book.avg_rating)
                      ? "text-yellow-400 fill-current"
                      : "text-slate-300 dark:text-slate-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400">{book.avg_rating.toFixed(1)}</span>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-500">{book.total_pages} pages</span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 line-clamp-2">{book.description}</p>
      </div>
    </motion.div>
  )
}
