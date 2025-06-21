"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Edit, Camera, Save, BookOpen, Star, Calendar, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    bio: "",
    preferred_categories: [] as string[],
  })
  const [stats, setStats] = useState({
    totalBooks: 0,
    booksRead: 0,
    readingStreak: 0,
    totalReadingTime: 0,
    averageRating: 0,
  })

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        full_name: user.full_name || "",
        bio: user.bio || "",
        preferred_categories: user.preferred_categories || [],
      })
      fetchUserStats()
    }
  }, [user])

  const fetchUserStats = async () => {
    if (!user) return

    try {
      // Fetch user books and stats
      const { data: userBooks } = await supabase.from("user_books").select("*").eq("user_id", user.id)

      const { data: ratings } = await supabase.from("ratings").select("rating").eq("user_id", user.id)

      const totalBooks = userBooks?.length || 0
      const booksRead = userBooks?.filter((book) => book.finished_reading_at).length || 0
      const averageRating = ratings?.length ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length : 0

      setStats({
        totalBooks,
        booksRead,
        readingStreak: user.reading_streak || 0,
        totalReadingTime: user.total_reading_time || 0,
        averageRating,
      })
    } catch (error) {
      console.error("Error fetching user stats:", error)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setUploading(true)

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar_url: data.publicUrl })
        .eq("id", user.id)

      if (updateError) throw updateError

      toast({
        title: "Avatar updated!",
        description: "Your profile picture has been updated successfully.",
      })

      // Refresh the page to show new avatar
      window.location.reload()
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload avatar.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("users")
        .update({
          username: formData.username,
          full_name: formData.full_name,
          bio: formData.bio,
          preferred_categories: formData.preferred_categories,
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully.",
      })

      setIsEditing(false)
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Sign in to view profile</h1>
          <Link href="/auth/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Navigation />

      <div className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200/50 dark:border-slate-700/50 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-24 h-24 md:w-32 md:h-32">
                  <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.username} />
                  <AvatarFallback className="text-2xl">{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 cursor-pointer transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                      {user.full_name || user.username}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-2">@{user.username}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      <Badge
                        variant={
                          user.role === "admin" ? "destructive" : user.role === "author" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                      {user.is_verified && (
                        <Badge variant="outline" className="border-green-500 text-green-600">
                          <Award className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Badge variant="outline">
                        <Calendar className="w-3 h-3 mr-1" />
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => {
                      if (isEditing) {
                        handleSaveProfile()
                      } else {
                        setIsEditing(true)
                      }
                    }}
                    className="mt-4 md:mt-0"
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-600 dark:text-slate-400">{user.bio || "No bio available"}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {[
              { icon: BookOpen, label: "Books in Library", value: stats.totalBooks, color: "blue" },
              { icon: Star, label: "Books Completed", value: stats.booksRead, color: "green" },
              { icon: Award, label: "Reading Streak", value: `${stats.readingStreak} days`, color: "yellow" },
              {
                icon: User,
                label: "Reading Time",
                value: `${Math.floor(stats.totalReadingTime / 60)}h`,
                color: "purple",
              },
              { icon: Star, label: "Avg Rating Given", value: stats.averageRating.toFixed(1), color: "pink" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50 text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <stat.icon
                  className={`w-6 h-6 mx-auto mb-2 ${
                    stat.color === "blue"
                      ? "text-blue-600"
                      : stat.color === "green"
                        ? "text-green-600"
                        : stat.color === "yellow"
                          ? "text-yellow-600"
                          : stat.color === "purple"
                            ? "text-purple-600"
                            : "text-pink-600"
                  }`}
                />
                <div className="text-lg font-bold text-slate-800 dark:text-slate-200">{stat.value}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Profile Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs defaultValue="activity" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-1">
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="activity">
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                  <CardHeader>
                    <CardTitle>Recent Reading Activity</CardTitle>
                    <CardDescription>Your latest reading sessions and progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400">No recent activity to show</p>
                      <p className="text-sm text-slate-500 dark:text-slate-500">
                        Start reading to see your activity here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences">
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                  <CardHeader>
                    <CardTitle>Reading Preferences</CardTitle>
                    <CardDescription>Customize your reading experience</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Preferred Categories</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {user.preferred_categories?.map((category) => (
                            <Badge key={category} variant="outline">
                              {category}
                            </Badge>
                          ))}
                          {(!user.preferred_categories || user.preferred_categories.length === 0) && (
                            <p className="text-sm text-slate-500">No preferences set</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements">
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                  <CardHeader>
                    <CardTitle>Achievements & Badges</CardTitle>
                    <CardDescription>Your reading milestones and accomplishments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Award className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400">No achievements yet</p>
                      <p className="text-sm text-slate-500 dark:text-slate-500">Keep reading to unlock achievements</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
