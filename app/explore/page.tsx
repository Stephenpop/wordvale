"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, TrendingUp, Star, BookOpen, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookCard } from "@/components/book-card"
import { CategoryFilter } from "@/components/category-filter"
import { Navigation } from "@/components/navigation"
import { useBooks } from "@/hooks/use-books"
import type { Book } from "@/types/book"

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

export default function ExplorePage() {
  const { books, loading, fetchTrendingBooks } = useBooks()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"trending" | "recent" | "popular" | "featured">("trending")
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])

  useEffect(() => {
    fetchTrendingBooks()
  }, [])

  useEffect(() => {
    const filtered = books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || book.categories.includes(selectedCategory)
      return matchesSearch && matchesCategory
    })
    setFilteredBooks(filtered)
  }, [books, searchQuery, selectedCategory])

  const featuredBooks = books.filter((book) => book.avg_rating >= 4.5).slice(0, 6)
  const recentBooks = [...books]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 12)
  const popularBooks = [...books].sort((a, b) => b.avg_rating - a.avg_rating).slice(0, 12)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Navigation />

      {/* Hero Section */}
      <motion.section className="pt-20 pb-8 px-4" initial="hidden" animate="visible" variants={containerVariants}>
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Explore Books
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
              Discover your next favorite read from our curated collection
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search books, authors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
              />
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" variants={itemVariants}>
            {[
              { icon: BookOpen, label: "Total Books", value: "10,000+", color: "blue" },
              { icon: Users, label: "Authors", value: "5,000+", color: "green" },
              { icon: Star, label: "Avg Rating", value: "4.2", color: "yellow" },
              { icon: TrendingUp, label: "New This Week", value: "50+", color: "purple" },
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
          {/* Category Filter */}
          <motion.div className="mb-8" variants={itemVariants}>
            <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          </motion.div>

          {/* Content Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-1">
                <TabsTrigger value="trending" className="rounded-lg">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Trending</span>
                </TabsTrigger>
                <TabsTrigger value="featured" className="rounded-lg">
                  <Star className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Featured</span>
                </TabsTrigger>
                <TabsTrigger value="recent" className="rounded-lg">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Recent</span>
                </TabsTrigger>
                <TabsTrigger value="popular" className="rounded-lg">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Popular</span>
                </TabsTrigger>
              </TabsList>

              {/* Trending Books */}
              <TabsContent value="trending">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">Trending Now</h2>
                    <Badge
                      variant="secondary"
                      className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                    >
                      {filteredBooks.length} books
                    </Badge>
                  </div>

                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                    variants={containerVariants}
                  >
                    {loading
                      ? Array.from({ length: 8 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg animate-pulse"
                            variants={itemVariants}
                          >
                            <div className="bg-slate-200 dark:bg-slate-700 h-48 md:h-64 rounded-xl mb-4"></div>
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
                </div>
              </TabsContent>

              {/* Featured Books */}
              <TabsContent value="featured">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">
                      Editor's Choice
                    </h2>
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                    >
                      Highly Rated
                    </Badge>
                  </div>

                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                    variants={containerVariants}
                  >
                    {featuredBooks.map((book) => (
                      <motion.div key={book.id} variants={itemVariants}>
                        <BookCard book={book} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </TabsContent>

              {/* Recent Books */}
              <TabsContent value="recent">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">
                      Recently Added
                    </h2>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                    >
                      Fresh Content
                    </Badge>
                  </div>

                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                    variants={containerVariants}
                  >
                    {recentBooks.map((book) => (
                      <motion.div key={book.id} variants={itemVariants}>
                        <BookCard book={book} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </TabsContent>

              {/* Popular Books */}
              <TabsContent value="popular">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">Most Popular</h2>
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                    >
                      Reader Favorites
                    </Badge>
                  </div>

                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                    variants={containerVariants}
                  >
                    {popularBooks.map((book) => (
                      <motion.div key={book.id} variants={itemVariants}>
                        <BookCard book={book} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* No Results */}
          {filteredBooks.length === 0 && !loading && (
            <motion.div className="text-center py-12" variants={itemVariants}>
              <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">No books found</h3>
              <p className="text-slate-500 dark:text-slate-500 mb-4">Try adjusting your search or category filters</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("")
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  )
}
