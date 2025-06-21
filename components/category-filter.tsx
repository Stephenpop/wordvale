"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const categories = [
  "All",
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Fantasy",
  "Biography",
  "History",
  "Self-Help",
  "Technology",
  "Business",
  "Health",
  "Travel",
  "Cooking",
  "Art",
  "Poetry",
  "Drama",
]

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 p-1">
          {categories.map((category) => (
            <motion.div key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={selectedCategory === (category === "All" ? "" : category) ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(category === "All" ? "" : category)}
                className="rounded-full px-4 py-2 whitespace-nowrap transition-all duration-300"
              >
                {category}
              </Button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  )
}
