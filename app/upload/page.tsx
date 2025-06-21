"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, BookOpen, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function UploadPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    tags: "",
    total_pages: "",
  })
  const [bookFile, setBookFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const handleFileUpload = async (file: File, bucket: string, folder: string) => {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)

    try {
      let file_url = ""
      let cover_url = ""

      // Upload book file
      if (bookFile) {
        file_url = await handleFileUpload(bookFile, "books", "uploads")
      }

      // Upload cover image
      if (coverFile) {
        cover_url = await handleFileUpload(coverFile, "covers", "uploads")
      }

      // Create book record
      const bookData = {
        title: formData.title,
        description: formData.description,
        author_id: user.id,
        file_url,
        cover_url,
        category_id: formData.category_id || null,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        total_pages: Number.parseInt(formData.total_pages) || 0,
        status: "pending", // Will need admin approval
      }

      const { error } = await supabase.from("books").insert([bookData])

      if (error) throw error

      toast({
        title: "Book uploaded successfully!",
        description: "Your book is now pending review by our administrators.",
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        category_id: "",
        tags: "",
        total_pages: "",
      })
      setBookFile(null)
      setCoverFile(null)
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <BookOpen className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <CardTitle>Sign in required</CardTitle>
            <CardDescription>You need to be signed in to upload books</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Header */}
      <motion.header
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 dark:border-slate-700/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Library
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Upload Book</h1>
                <p className="text-slate-600 dark:text-slate-400">Share your work with the WordVale community</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {user.role === "author" ? "Author" : "User"}
            </Badge>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Book Details</span>
              </CardTitle>
              <CardDescription>Fill in the information about your book</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Book Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter your book title"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your book..."
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Total Pages */}
                  <div>
                    <Label htmlFor="pages">Total Pages</Label>
                    <Input
                      id="pages"
                      type="number"
                      value={formData.total_pages}
                      onChange={(e) => setFormData({ ...formData, total_pages: e.target.value })}
                      placeholder="Number of pages"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="technology, fiction, science (comma separated)"
                    />
                  </div>

                  {/* Book File */}
                  <div>
                    <Label htmlFor="book-file">Book File (PDF) *</Label>
                    <div className="mt-2">
                      <Input
                        id="book-file"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setBookFile(e.target.files?.[0] || null)}
                        required
                      />
                      <p className="text-xs text-slate-500 mt-1">Upload your book in PDF format</p>
                    </div>
                  </div>

                  {/* Cover Image */}
                  <div>
                    <Label htmlFor="cover-file">Cover Image</Label>
                    <div className="mt-2">
                      <Input
                        id="cover-file"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                      />
                      <p className="text-xs text-slate-500 mt-1">Upload a cover image (optional)</p>
                    </div>
                  </div>
                </div>

                {/* Upload Guidelines */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Upload Guidelines</h3>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Books must be original content or properly licensed</li>
                    <li>• PDF files should be under 50MB for optimal performance</li>
                    <li>• Cover images help attract readers (recommended: 300x400px)</li>
                    <li>• All uploads are reviewed by our moderation team</li>
                    <li>• You'll be notified once your book is approved</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Link href="/">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                  <Button type="submit" disabled={loading || !bookFile}>
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Book
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
