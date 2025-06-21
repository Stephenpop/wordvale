"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface RatingStarsProps {
  bookId: string
  initialRating?: number
  initialReview?: string
}

export function RatingStars({ bookId, initialRating = 0, initialReview = "" }: RatingStarsProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)
  const [review, setReview] = useState(initialReview)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmitRating = async () => {
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "You need to select at least one star to submit a rating.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Submit rating to Supabase
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      toast({
        title: "Rating submitted!",
        description: "Thank you for your feedback.",
      })
    } catch (error) {
      toast({
        title: "Error submitting rating",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Rate this book</h3>

      {/* Star Rating */}
      <div className="flex items-center space-x-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.button
            key={i}
            className="focus:outline-none"
            onMouseEnter={() => setHoverRating(i + 1)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(i + 1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Star
              className={`w-8 h-8 transition-colors duration-200 ${
                i < (hoverRating || rating) ? "text-yellow-400 fill-current" : "text-slate-300 dark:text-slate-600"
              }`}
            />
          </motion.button>
        ))}
        {rating > 0 && (
          <motion.span
            className="ml-2 text-sm text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {rating} star{rating !== 1 ? "s" : ""}
          </motion.span>
        )}
      </div>

      {/* Review Text */}
      <div className="mb-4">
        <Textarea
          placeholder="Write a review (optional)..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="min-h-[100px] resize-none"
        />
      </div>

      {/* Submit Button */}
      <Button onClick={handleSubmitRating} disabled={isSubmitting || rating === 0} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Rating"}
      </Button>
    </motion.div>
  )
}
