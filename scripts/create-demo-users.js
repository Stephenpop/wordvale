// This script should be run in the browser console or as a Node.js script
// after setting up the Supabase client

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://loepddodudqrglogtabj.supabase.co"
const supabaseServiceKey = "YOUR_SERVICE_ROLE_KEY" // Get this from Supabase dashboard

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createDemoUsers() {
  try {
    // Create Admin User
    const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
      email: "admin@wordvale.com",
      password: "admin123",
      email_confirm: true,
      user_metadata: {
        username: "admin",
      },
    })

    if (adminError) {
      console.error("Error creating admin:", adminError)
    } else {
      console.log("Admin user created:", adminData.user.id)

      // Update admin role
      await supabase.from("users").update({ role: "admin", bio: "WordVale Administrator" }).eq("id", adminData.user.id)
    }

    // Create Regular User
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: "user@wordvale.com",
      password: "user123",
      email_confirm: true,
      user_metadata: {
        username: "bookworm",
      },
    })

    if (userError) {
      console.error("Error creating user:", userError)
    } else {
      console.log("Regular user created:", userData.user.id)

      // Update user profile
      await supabase
        .from("users")
        .update({
          bio: "Avid reader and book enthusiast",
          preferred_categories: ["Fiction", "Mystery", "Romance"],
        })
        .eq("id", userData.user.id)
    }

    // Create Author User
    const { data: authorData, error: authorError } = await supabase.auth.admin.createUser({
      email: "author@wordvale.com",
      password: "author123",
      email_confirm: true,
      user_metadata: {
        username: "author_sarah",
      },
    })

    if (authorError) {
      console.error("Error creating author:", authorError)
    } else {
      console.log("Author user created:", authorData.user.id)

      // Update author role and profile
      await supabase
        .from("users")
        .update({
          role: "author",
          bio: "Published author and writing coach",
          preferred_categories: ["Writing", "Self-Help", "Business"],
        })
        .eq("id", authorData.user.id)
    }

    console.log("All demo users created successfully!")
  } catch (error) {
    console.error("Error creating demo users:", error)
  }
}

// Run the function
createDemoUsers()
