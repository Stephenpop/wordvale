"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Download, Trash2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    readingReminders: true,
    newBookAlerts: true,
  })
  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
    readingActivityVisible: true,
    showReadingProgress: true,
  })

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      })

      if (error) throw error

      toast({
        title: "Password updated!",
        description: "Your password has been successfully updated.",
      })

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.")

    if (!confirmed) return

    try {
      // In a real app, you'd call a server function to handle account deletion
      toast({
        title: "Account deletion requested",
        description: "Your account deletion request has been submitted. You'll receive an email confirmation.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Settings className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Sign in to access settings</h1>
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
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Settings
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Manage your account preferences and privacy settings
            </p>
          </motion.div>

          {/* Settings Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Tabs defaultValue="account" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-1">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
              </TabsList>

              {/* Account Settings */}
              <TabsContent value="account">
                <div className="space-y-6">
                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>Update your account password</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="current-password">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="current-password"
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                          <Input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        />
                      </div>
                      <Button onClick={handlePasswordChange} disabled={loading}>
                        {loading ? "Updating..." : "Update Password"}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>Your basic account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Email</Label>
                          <Input value={user.email} disabled />
                        </div>
                        <div>
                          <Label>Username</Label>
                          <Input value={user.username} disabled />
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        To change your email or username, please contact support.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications">
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose what notifications you want to receive</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Receive updates via email</p>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, emailNotifications: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Receive push notifications in browser
                        </p>
                      </div>
                      <Switch
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, pushNotifications: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Reading Reminders</Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Get reminded to continue reading</p>
                      </div>
                      <Switch
                        checked={notifications.readingReminders}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, readingReminders: checked })}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>New Book Alerts</Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Get notified about new books in your favorite categories
                        </p>
                      </div>
                      <Switch
                        checked={notifications.newBookAlerts}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, newBookAlerts: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Privacy Settings */}
              <TabsContent value="privacy">
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>Control who can see your information and activity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Profile Visibility</Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Make your profile visible to other users
                        </p>
                      </div>
                      <Switch
                        checked={privacy.profileVisibility}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, profileVisibility: checked })}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Reading Activity</Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Show your reading activity to others
                        </p>
                      </div>
                      <Switch
                        checked={privacy.readingActivityVisible}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, readingActivityVisible: checked })}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Reading Progress</Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Display your reading progress on books
                        </p>
                      </div>
                      <Switch
                        checked={privacy.showReadingProgress}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, showReadingProgress: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Data Management */}
              <TabsContent value="data">
                <div className="space-y-6">
                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                    <CardHeader>
                      <CardTitle>Data Export</CardTitle>
                      <CardDescription>Download your data and reading history</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          You can request a copy of all your data including reading history, bookmarks, and preferences.
                        </p>
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Request Data Export
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <CardHeader>
                      <CardTitle className="text-red-800 dark:text-red-200">Danger Zone</CardTitle>
                      <CardDescription className="text-red-600 dark:text-red-400">
                        Irreversible and destructive actions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Delete Account</h4>
                          <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <Button variant="destructive" onClick={handleDeleteAccount}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
