"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, Users, Star, TrendingUp, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookCard } from "@/components/book-card"
import { CategoryFilter } from "@/components/category-filter"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useBooks } from "@/hooks/use-books"

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

export default function HomePage() {
  const { user } = useAuth()
  const { books, loading, fetchPersonalizedBooks, fetchTrendingBooks } = useBooks()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"personalized" | "trending" | "recent">("personalized")

  useEffect(() => {
    if (user && activeTab === "personalized") {
      fetchPersonalizedBooks()
    } else if (activeTab === "trending") {
      fetchTrendingBooks()
    }
  }, [user, activeTab])

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || book.categories.includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Navigation />

      {/* Hero Section */}
      <motion.section className="pt-20 pb-12 px-4" initial="hidden" animate="visible" variants={containerVariants}>
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <motion.h1
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              WordVale
            </motion.h1>
            <motion.p
              className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Your gateway to infinite stories. Discover, read, and share books in the most beautiful digital library.
            </motion.p>

            {/* Search Bar */}
            <motion.div className="relative max-w-2xl mx-auto mb-8" variants={itemVariants}>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search for books, authors, or genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 shadow-lg"
              />
            </motion.div>

            {/* Stats */}
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto" variants={itemVariants}>
              {[
                { icon: BookOpen, label: "Books", value: "10,000+" },
                { icon: Users, label: "Readers", value: "50,000+" },
                { icon: Star, label: "Reviews", value: "100,000+" },
                { icon: TrendingUp, label: "Authors", value: "5,000+" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <stat.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{stat.value}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <motion.section className="px-4 pb-12" variants={containerVariants}>
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <motion.div className="flex flex-wrap gap-2 mb-8 justify-center" variants={itemVariants}>
            {[
              { key: "personalized", label: "For You", icon: Star },
              { key: "trending", label: "Trending", icon: TrendingUp },
              { key: "recent", label: "Recent", icon: BookOpen },
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "outline"}
                onClick={() => setActiveTab(tab.key as any)}
                className="rounded-full px-6 py-3 transition-all duration-300"
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </motion.div>

          {/* Category Filter */}
          <motion.div variants={itemVariants}>
            <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          </motion.div>

          {/* Books Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
            variants={containerVariants}
          >
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg animate-pulse"
                    variants={itemVariants}
                  >
                    <div className="bg-slate-200 dark:bg-slate-700 h-48 rounded-xl mb-4"></div>
                    <div className="bg-slate-200 dark:bg-slate-700 h-4 rounded mb-2"></div>
                    <div className="bg-slate-200 dark:bg-slate-700 h-3 rounded w-2/3"></div>
                  </motion.div>
                ))
              : filteredBooks.map((book) => (
                  <motion.div key={book.id} variants={itemVariants}>
                    <BookCard book={book} />
                  </motion.div>
                ))}
          </motion.div>

          {filteredBooks.length === 0 && !loading && (
            <motion.div className="text-center py-12" variants={itemVariants}>
              <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">No books found</h3>
              <p className="text-slate-500 dark:text-slate-500">Try adjusting your search or category filters</p>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0"
          onClick={() => (window.location.href = "/upload")}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  )
}
