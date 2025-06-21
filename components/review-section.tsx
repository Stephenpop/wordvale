"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, ThumbsUp, MessageCircle, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface Review {
  id: string
  user: {
    username: string
    avatar_url?: string
  }
  rating: number
  review: string
  created_at: string
  likes: number
  isLiked: boolean
}

interface ReviewSectionProps {
  bookId: string
}

export function ReviewSection({ bookId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching reviews
    setTimeout(() => {
      setReviews([
        {
          id: "1",
          user: {
            username: "bookworm_sarah",
            avatar_url: "/placeholder.svg?height=40&width=40",
          },
          rating: 5,
          review:
            "Absolutely brilliant! This book opened my eyes to the possibilities of digital transformation. The author does an excellent job of explaining complex concepts in an accessible way.",
          created_at: "2024-01-10",
          likes: 12,
          isLiked: false,
        },
        {
          id: "2",
          user: {
            username: "tech_enthusiast",
            avatar_url: "/placeholder.svg?height=40&width=40",
          },
          rating: 4,
          review:
            "Great insights into the future of technology. Some chapters were a bit dense, but overall a very informative read. Highly recommend for anyone in the tech industry.",
          created_at: "2024-01-08",
          likes: 8,
          isLiked: true,
        },
        {
          id: "3",
          user: {
            username: "digital_nomad",
            avatar_url: "/placeholder.svg?height=40&width=40",
          },
          rating: 5,
          review:
            "This book is a must-read for anyone trying to understand where we're heading as a society. The case studies are particularly compelling.",
          created_at: "2024-01-05",
          likes: 15,
          isLiked: false,
        },
      ])
      setLoading(false)
    }, 1000)
  }, [bookId])

  const handleLikeReview = (reviewId: string) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              isLiked: !review.isLiked,
              likes: review.isLiked ? review.likes - 1 : review.likes + 1,
            }
          : review,
      ),
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Reviews</h3>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 animate-pulse"
          >
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Reviews ({reviews.length})</h3>
        <Button variant="outline" size="sm">
          <MessageCircle className="w-4 h-4 mr-2" />
          Write Review
        </Button>
      </div>

      <div className="space-y-4">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start space-x-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={review.user.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{review.user.username}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "text-yellow-400 fill-current" : "text-slate-300 dark:text-slate-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">{review.review}</p>

                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikeReview(review.id)}
                    className={`text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 ${
                      review.isLiked ? "text-indigo-600 dark:text-indigo-400" : ""
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 mr-1 ${review.isLiked ? "fill-current" : ""}`} />
                    {review.likes}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
