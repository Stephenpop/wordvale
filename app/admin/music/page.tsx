"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Play, Pause, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

interface BackgroundMusic {
  id: string
  title: string
  artist: string
  file_url: string
  genre: string
  duration: number
  is_active: boolean
  created_at: string
}

export default function MusicManagement() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [music, setMusic] = useState<BackgroundMusic[]>([])
  const [loading, setLoading] = useState(true)
  const [editingMusic, setEditingMusic] = useState<BackgroundMusic | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    genre: "",
    is_active: true,
  })
  const [audioFile, setAudioFile] = useState<File | null>(null)

  useEffect(() => {
    if (user?.role === "admin") {
      fetchMusic()
    }
  }, [user])

  const fetchMusic = async () => {
    try {
      const { data, error } = await supabase
        .from("background_music")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setMusic(data || [])
    } catch (error) {
      console.error("Error fetching music:", error)
      toast({
        title: "Error",
        description: "Failed to fetch music",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `music/${fileName}`

    const { error: uploadError } = await supabase.storage.from("music").upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from("music").getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let file_url = editingMusic?.file_url || ""

      if (audioFile) {
        file_url = await handleFileUpload(audioFile)
      }

      const musicData = {
        ...formData,
        file_url,
        duration: 0, // You could implement duration detection
      }

      if (editingMusic) {
        const { error } = await supabase.from("background_music").update(musicData).eq("id", editingMusic.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Music updated successfully",
        })
      } else {
        const { error } = await supabase.from("background_music").insert([musicData])

        if (error) throw error

        toast({
          title: "Success",
          description: "Music uploaded successfully",
        })
      }

      setIsDialogOpen(false)
      setEditingMusic(null)
      setAudioFile(null)
      setFormData({
        title: "",
        artist: "",
        genre: "",
        is_active: true,
      })
      fetchMusic()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save music",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (musicItem: BackgroundMusic) => {
    setEditingMusic(musicItem)
    setFormData({
      title: musicItem.title,
      artist: musicItem.artist || "",
      genre: musicItem.genre || "",
      is_active: musicItem.is_active,
    })
    setIsDialogOpen(true)
  }

  const handleToggleActive = async (musicItem: BackgroundMusic) => {
    try {
      const { error } = await supabase
        .from("background_music")
        .update({ is_active: !musicItem.is_active })
        .eq("id", musicItem.id)

      if (error) throw error

      toast({
        title: "Success",
        description: `Music ${!musicItem.is_active ? "activated" : "deactivated"}`,
      })
      fetchMusic()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update music",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (musicItem: BackgroundMusic) => {
    if (!confirm("Are you sure you want to delete this music?")) return

    try {
      const { error } = await supabase.from("background_music").delete().eq("id", musicItem.id)

      if (error) throw error

      // Also delete from storage
      const fileName = musicItem.file_url.split("/").pop()
      if (fileName) {
        await supabase.storage.from("music").remove([`music/${fileName}`])
      }

      toast({
        title: "Success",
        description: "Music deleted successfully",
      })
      fetchMusic()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete music",
        variant: "destructive",
      })
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (user?.role !== "admin") {
    return <div>Access denied</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Background Music Management</h1>
          <p className="text-muted-foreground">Manage background music for reading sessions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingMusic(null)
                setAudioFile(null)
                setFormData({
                  title: "",
                  artist: "",
                  genre: "",
                  is_active: true,
                })
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Music
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingMusic ? "Edit Music" : "Add New Music"}</DialogTitle>
              <DialogDescription>
                {editingMusic ? "Update music details" : "Upload new background music"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="artist">Artist</Label>
                <Input
                  id="artist"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                />
              </div>
              {!editingMusic && (
                <div>
                  <Label htmlFor="audio">Audio File</Label>
                  <Input
                    id="audio"
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                    required
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? "Uploading..." : editingMusic ? "Update" : "Upload"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Background Music Library</CardTitle>
          <CardDescription>Manage background music for reading sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {music.map((musicItem) => (
                <TableRow key={musicItem.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Music className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{musicItem.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{musicItem.artist}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{musicItem.genre}</Badge>
                  </TableCell>
                  <TableCell>{formatDuration(musicItem.duration)}</TableCell>
                  <TableCell>
                    <Badge variant={musicItem.is_active ? "default" : "secondary"}>
                      {musicItem.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (currentlyPlaying === musicItem.id) {
                            setCurrentlyPlaying(null)
                          } else {
                            setCurrentlyPlaying(musicItem.id)
                            // Here you would implement audio playback
                          }
                        }}
                      >
                        {currentlyPlaying === musicItem.id ? (
                          <Pause className="w-3 h-3" />
                        ) : (
                          <Play className="w-3 h-3" />
                        )}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(musicItem)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleToggleActive(musicItem)}>
                        {musicItem.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(musicItem)}
                      >
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
    </div>
  )
}
