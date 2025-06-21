"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  BookmarkIcon,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Moon,
  Type,
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Highlighter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import type { Book } from "@/types/book"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"

interface BookReaderProps {
  book: Book
  onClose: () => void
}

interface BackgroundMusic {
  id: string
  title: string
  artist: string
  file_url: string
  genre: string
}

interface Bookmark {
  id: string
  page_number: number
  note: string
  highlight_text?: string
  highlight_color?: string
}

export function EnhancedBookReader({ book, onClose }: BookReaderProps) {
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [showSettings, setShowSettings] = useState(false)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [showMusicPanel, setShowMusicPanel] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Music state
  const [backgroundMusic, setBackgroundMusic] = useState<BackgroundMusic[]>([])
  const [currentMusic, setCurrentMusic] = useState<BackgroundMusic | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Reading state
  const [readingTime, setReadingTime] = useState(0)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [selectedText, setSelectedText] = useState("")
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [noteText, setNoteText] = useState("")
  const [highlightColor, setHighlightColor] = useState("#fbbf24")

  const highlightColors = [
    { name: "Yellow", value: "#fbbf24" },
    { name: "Green", value: "#10b981" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Pink", value: "#ec4899" },
    { name: "Purple", value: "#8b5cf6" },
  ]

  useEffect(() => {
    fetchBackgroundMusic()
    fetchBookmarks()

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
        case "m":
        case "M":
          setShowMusicPanel(!showMusicPanel)
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentPage, showMusicPanel])

  // Reading time tracker
  useEffect(() => {
    const interval = setInterval(() => {
      setReadingTime((prev) => prev + 1)
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Update reading progress in database
  useEffect(() => {
    const updateProgress = async () => {
      if (!user) return

      const progress = Math.round((currentPage / book.total_pages) * 100)

      await supabase.from("user_books").upsert({
        user_id: user.id,
        book_id: book.id,
        reading_progress: progress,
        current_page: currentPage,
        reading_time: readingTime,
        last_read_at: new Date().toISOString(),
      })
    }

    const debounce = setTimeout(updateProgress, 2000)
    return () => clearTimeout(debounce)
  }, [currentPage, readingTime, user, book.id, book.total_pages])

  const fetchBackgroundMusic = async () => {
    try {
      const { data, error } = await supabase.from("background_music").select("*").eq("is_active", true).order("title")

      if (error) throw error
      setBackgroundMusic(data || [])
    } catch (error) {
      console.error("Error fetching music:", error)
    }
  }

  const fetchBookmarks = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .eq("book_id", book.id)
        .order("page_number")

      if (error) throw error
      setBookmarks(data || [])
    } catch (error) {
      console.error("Error fetching bookmarks:", error)
    }
  }

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

  const playMusic = (music: BackgroundMusic) => {
    if (audioRef.current) {
      audioRef.current.src = music.file_url
      audioRef.current.volume = volume / 100
      audioRef.current.play()
      setCurrentMusic(music)
      setIsPlaying(true)
    }
  }

  const pauseMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0]
    setVolume(vol)
    if (audioRef.current) {
      audioRef.current.volume = vol / 100
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString())
      setShowNoteDialog(true)
    }
  }

  const saveBookmark = async () => {
    if (!user || !selectedText) return

    try {
      const { error } = await supabase.from("bookmarks").insert({
        user_id: user.id,
        book_id: book.id,
        page_number: currentPage,
        note: noteText,
        highlight_text: selectedText,
        highlight_color: highlightColor,
      })

      if (error) throw error

      setShowNoteDialog(false)
      setNoteText("")
      setSelectedText("")
      fetchBookmarks()
    } catch (error) {
      console.error("Error saving bookmark:", error)
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
      {/* Audio element for background music */}
      <audio ref={audioRef} loop />

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
              onClick={() => setShowMusicPanel(!showMusicPanel)}
              className={isDarkMode ? "text-slate-300 hover:text-white" : ""}
            >
              <Music className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBookmarks(!showBookmarks)}
              className={isDarkMode ? "text-slate-300 hover:text-white" : ""}
            >
              <BookmarkIcon className="w-4 h-4" />
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

      {/* Music Panel */}
      <AnimatePresence>
        {showMusicPanel && (
          <motion.div
            className="absolute top-16 right-4 z-20 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Background Music</h3>

            {currentMusic && (
              <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">{currentMusic.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{currentMusic.artist}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={isPlaying ? pauseMusic : () => playMusic(currentMusic)}>
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  </Button>
                  <Slider value={[volume]} onValueChange={handleVolumeChange} max={100} step={1} className="flex-1" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">{volume}%</span>
                </div>
              </div>
            )}

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {backgroundMusic.map((music) => (
                <div
                  key={music.id}
                  className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded cursor-pointer"
                  onClick={() => playMusic(music)}
                >
                  <div>
                    <p className="text-sm font-medium">{music.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{music.artist}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {music.genre}
                  </Badge>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

              {/* Highlight Color */}
              <div>
                <span className="text-sm mb-2 block">Highlight Color</span>
                <div className="flex space-x-2">
                  {highlightColors.map((color) => (
                    <button
                      key={color.value}
                      className={`w-6 h-6 rounded-full border-2 ${
                        highlightColor === color.value ? "border-gray-800 dark:border-white" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setHighlightColor(color.value)}
                    />
                  ))}
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

      {/* Bookmarks Panel */}
      <AnimatePresence>
        {showBookmarks && (
          <motion.div
            className="absolute top-16 left-4 z-20 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Bookmarks & Notes</h3>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600"
                  onClick={() => setCurrentPage(bookmark.page_number)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Page {bookmark.page_number}</span>
                    {bookmark.highlight_color && (
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: bookmark.highlight_color }} />
                    )}
                  </div>
                  {bookmark.highlight_text && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1 italic">
                      "{bookmark.highlight_text}"
                    </p>
                  )}
                  {bookmark.note && <p className="text-xs text-slate-700 dark:text-slate-300">{bookmark.note}</p>}
                </div>
              ))}

              {bookmarks.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No bookmarks yet. Select text to create one!</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note Dialog */}
      <AnimatePresence>
        {showNoteDialog && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-xl p-6 w-96 max-w-[90vw]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="font-semibold mb-4">Add Note & Highlight</h3>

              <div className="mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Selected text:</p>
                <p className="text-sm italic bg-slate-50 dark:bg-slate-700 p-2 rounded">"{selectedText}"</p>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Highlight Color:</label>
                <div className="flex space-x-2">
                  {highlightColors.map((color) => (
                    <button
                      key={color.value}
                      className={`w-6 h-6 rounded-full border-2 ${
                        highlightColor === color.value ? "border-gray-800 dark:border-white" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setHighlightColor(color.value)}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Note (optional):</label>
                <Textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add your thoughts about this passage..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNoteDialog(false)
                    setSelectedText("")
                    setNoteText("")
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={saveBookmark}>
                  <Highlighter className="w-4 h-4 mr-2" />
                  Save Highlight
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <div
            className="flex-1 p-8 overflow-auto"
            style={{
              fontSize: `${fontSize}px`,
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top left",
            }}
            onMouseUp={handleTextSelection}
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

                {/* Reading stats */}
                <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <h3 className="font-semibold mb-2">Reading Session</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Time reading:</span>
                      <span className="ml-2 font-medium">{readingTime} min</span>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Progress:</span>
                      <span className="ml-2 font-medium">{progress.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
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
