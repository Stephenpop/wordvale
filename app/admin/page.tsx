"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  BookOpen,
  Star,
  TrendingUp,
  Shield,
  Settings,
  BarChart3,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export default function AdminDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [stats, setStats] = useState({
    totalUsers: 50234,
    totalBooks: 12456,
    totalReviews: 98765,
    activeUsers: 8432,
  })

  const [recentBooks, setRecentBooks] = useState([
    {
      id: "1",
      title: "The Future of AI",
      author: "Dr. Sarah Chen",
      status: "pending",
      uploadedAt: "2024-01-20",
      category: "Technology",
    },
    {
      id: "2",
      title: "Quantum Computing Basics",
      author: "Prof. Michael Rodriguez",
      status: "approved",
      uploadedAt: "2024-01-19",
      category: "Science",
    },
    {
      id: "3",
      title: "Mindful Leadership",
      author: "Emma Thompson",
      status: "rejected",
      uploadedAt: "2024-01-18",
      category: "Business",
    },
  ])

  const [recentUsers, setRecentUsers] = useState([
    {
      id: "1",
      username: "bookworm_sarah",
      email: "sarah@example.com",
      role: "user",
      joinedAt: "2024-01-20",
      status: "active",
    },
    {
      id: "2",
      username: "author_mike",
      email: "mike@example.com",
      role: "author",
      joinedAt: "2024-01-19",
      status: "active",
    },
    {
      id: "3",
      username: "reader_emma",
      email: "emma@example.com",
      role: "user",
      joinedAt: "2024-01-18",
      status: "suspended",
    },
  ])

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== "admin") {
      window.location.href = "/"
      return
    }
  }, [user])

  const handleBookAction = (bookId: string, action: "approve" | "reject") => {
    setRecentBooks(
      recentBooks.map((book) =>
        book.id === bookId ? { ...book, status: action === "approve" ? "approved" : "rejected" } : book,
      ),
    )
    toast({
      title: `Book ${action}d`,
      description: `The book has been ${action}d successfully.`,
    })
  }

  const handleUserAction = (userId: string, action: "suspend" | "activate") => {
    setRecentUsers(
      recentUsers.map((user) =>
        user.id === userId ? { ...user, status: action === "suspend" ? "suspended" : "active" } : user,
      ),
    )
    toast({
      title: `User ${action}d`,
      description: `The user has been ${action}d successfully.`,
    })
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Access Denied</h1>
          <p className="text-slate-600 dark:text-slate-400">You don't have permission to access this page.</p>
        </div>
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
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Admin Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-400">Manage WordVale platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
              <Avatar>
                <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {[
            { icon: Users, label: "Total Users", value: stats.totalUsers.toLocaleString(), color: "blue" },
            { icon: BookOpen, label: "Total Books", value: stats.totalBooks.toLocaleString(), color: "green" },
            { icon: Star, label: "Total Reviews", value: stats.totalReviews.toLocaleString(), color: "yellow" },
            { icon: TrendingUp, label: "Active Users", value: stats.activeUsers.toLocaleString(), color: "purple" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{stat.value}</p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        stat.color === "blue"
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : stat.color === "green"
                            ? "bg-green-100 dark:bg-green-900/30"
                            : stat.color === "yellow"
                              ? "bg-yellow-100 dark:bg-yellow-900/30"
                              : "bg-purple-100 dark:bg-purple-900/30"
                      }`}
                    >
                      <stat.icon
                        className={`w-6 h-6 ${
                          stat.color === "blue"
                            ? "text-blue-600 dark:text-blue-400"
                            : stat.color === "green"
                              ? "text-green-600 dark:text-green-400"
                              : stat.color === "yellow"
                                ? "text-yellow-600 dark:text-yellow-400"
                                : "text-purple-600 dark:text-purple-400"
                        }`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Tabs defaultValue="books" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="books">Book Management</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Book Management */}
            <TabsContent value="books">
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle>Recent Book Submissions</CardTitle>
                  <CardDescription>Review and manage book uploads</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Uploaded</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentBooks.map((book) => (
                        <TableRow key={book.id}>
                          <TableCell className="font-medium">{book.title}</TableCell>
                          <TableCell>{book.author}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{book.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                book.status === "approved"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : book.status === "rejected"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              }
                            >
                              {book.status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                              {book.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
                              {book.status === "pending" && <AlertTriangle className="w-3 h-3 mr-1" />}
                              {book.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{book.uploadedAt}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3" />
                              </Button>
                              {book.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() => handleBookAction(book.id, "approve")}
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleBookAction(book.id, "reject")}
                                  >
                                    <XCircle className="w-3 h-3" />
                                  </Button>
                                </>
                              )}
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* User Management */}
            <TabsContent value="users">
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{user.username}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                user.role === "admin"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                  : user.role === "author"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                user.status === "active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.joinedAt}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className={
                                  user.status === "active"
                                    ? "text-red-600 hover:text-red-700"
                                    : "text-green-600 hover:text-green-700"
                                }
                                onClick={() =>
                                  handleUserAction(user.id, user.status === "active" ? "suspend" : "activate")
                                }
                              >
                                {user.status === "active" ? "Suspend" : "Activate"}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                  <CardHeader>
                    <CardTitle>Platform Analytics</CardTitle>
                    <CardDescription>Key metrics and insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Daily Active Users</span>
                        <span className="text-2xl font-bold text-green-600">+12.5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Book Uploads</span>
                        <span className="text-2xl font-bold text-blue-600">+8.3%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">User Engagement</span>
                        <span className="text-2xl font-bold text-purple-600">+15.7%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                  <CardHeader>
                    <CardTitle>Popular Categories</CardTitle>
                    <CardDescription>Most read book categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { category: "Fiction", percentage: 35 },
                        { category: "Technology", percentage: 28 },
                        { category: "Self-Help", percentage: 22 },
                        { category: "Science", percentage: 15 },
                      ].map((item) => (
                        <div key={item.category} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{item.category}</span>
                            <span>{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings">
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>Configure platform-wide settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Content Moderation</h3>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <Settings className="w-4 h-4 mr-2" />
                            Auto-approval Settings
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <FileText className="w-4 h-4 mr-2" />
                            Content Guidelines
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Flagged Content
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">System Configuration</h3>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Analytics Settings
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Users className="w-4 h-4 mr-2" />
                            User Permissions
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Shield className="w-4 h-4 mr-2" />
                            Security Settings
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
