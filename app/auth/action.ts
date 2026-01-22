'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  // Validate passwords match
  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // If Supabase is set to 'Confirm Email', the user isn't logged in yet.
  // If 'Confirm Email' is OFF, they are logged in and we redirect.
  if (data.user && data.session) {
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  } else {
    // Redirect to a page telling them to check their email
    redirect('/auth/check-email')
  }
}

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message || 'Could not authenticate user' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}