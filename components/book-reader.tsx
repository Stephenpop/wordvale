"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  Bookmark,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Moon,
  Type,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import type { Book } from "@/types/book"

interface BookReaderProps {
  book: Book
  onClose: () => void
}

export function BookReader({ book, onClose }: BookReaderProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [showSettings, setShowSettings] = useState(false)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          handlePrevPage()
          break
        case "ArrowRight":
          handleNextPage()
          break
        case "Escape":
          onClose()
          break
        case "f":
        case "F":
          toggleFullscreen()
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentPage])

  const handleNextPage = () => {
    if (currentPage < book.total_pages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const progress = (currentPage / book.total_pages) * 100

  return (
    <motion.div
      className={`fixed inset-0 z-50 ${isDarkMode ? "bg-slate-900" : "bg-white"} transition-colors duration-300`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <motion.header
        className={`sticky top-0 z-10 ${isDarkMode ? "bg-slate-800/90" : "bg-white/90"} backdrop-blur-md border-b ${
          isDarkMode ? "border-slate-700" : "border-slate-200"
        } transition-colors duration-300`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className={isDarkMode ? "text-slate-300 hover:text-white" : ""}
            >
              <X className="w-5 h-5" />
            </Button>
            <div>
              <h1 className={`font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{book.title}</h1>
              <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>by {book.author}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBookmarks(!showBookmarks)}
              className={isDarkMode ? "text-slate-300 hover:text-white" : ""}
            >
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className={isDarkMode ? "text-slate-300 hover:text-white" : ""}>
              <Search className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className={isDarkMode ? "text-slate-300 hover:text-white" : ""}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`h-1 ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.header>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="absolute top-16 right-4 z-20 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Reading Settings</h3>

            <div className="space-y-6">
              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <span className="text-sm">Dark Mode</span>
                </div>
                <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
              </div>

              {/* Font Size */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Type className="w-4 h-4" />
                    <span className="text-sm">Font Size</span>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{fontSize}px</span>
                </div>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  min={12}
                  max={24}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Zoom */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Zoom</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{zoom}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                    <ZoomOut className="w-3 h-3" />
                  </Button>
                  <Slider
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                    min={50}
                    max={200}
                    step={10}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(200, zoom + 10))}>
                    <ZoomIn className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Reset */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setZoom(100)
                  setFontSize(16)
                }}
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Default
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Book Content */}
        <div className="flex-1 flex flex-col">
          <div
            className="flex-1 p-8 overflow-auto"
            style={{
              fontSize: `${fontSize}px`,
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top left",
            }}
          >
            <div className={`max-w-4xl mx-auto ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
              {/* Simulated book content */}
              <div className="prose prose-lg max-w-none">
                <h1>Chapter {Math.ceil(currentPage / 20)}: The Digital Revolution</h1>
                <p>
                  In the rapidly evolving landscape of the 21st century, we find ourselves at the epicenter of a digital
                  renaissance that is fundamentally reshaping how we live, work, and interact with the world around us.
                  This transformation extends far beyond mere technological advancement; it represents a paradigm shift
                  that touches every aspect of human experience.
                </p>
                <p>
                  The convergence of artificial intelligence, machine learning, blockchain technology, and the Internet
                  of Things has created an interconnected ecosystem where data flows seamlessly between devices,
                  systems, and platforms. This interconnectedness has given rise to new possibilities that were once
                  confined to the realm of science fiction.
                </p>
                <p>
                  As we navigate this digital frontier, it becomes increasingly important to understand not just the
                  technical aspects of these innovations, but also their broader implications for society, economy, and
                  human culture. The decisions we make today about how we implement and regulate these technologies will
                  shape the world our children inherit.
                </p>
                <p>
                  This chapter explores the foundational concepts that underpin our digital age, examining both the
                  tremendous opportunities and the significant challenges that lie ahead. We will delve into case
                  studies from various industries, analyze emerging trends, and consider the ethical implications of our
                  increasingly connected world.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className={`border-t ${isDarkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"} p-4`}>
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <Button
                variant="ghost"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={isDarkMode ? "text-slate-300 hover:text-white disabled:text-slate-600" : ""}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center space-x-4">
                <span className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Page {currentPage} of {book.total_pages}
                </span>
                <div className="w-32">
                  <Slider
                    value={[currentPage]}
                    onValueChange={(value) => setCurrentPage(value[0])}
                    min={1}
                    max={book.total_pages}
                    step={1}
                  />
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={handleNextPage}
                disabled={currentPage === book.total_pages}
                className={isDarkMode ? "text-slate-300 hover:text-white disabled:text-slate-600" : ""}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
