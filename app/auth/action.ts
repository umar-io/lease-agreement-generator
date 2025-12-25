'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return redirect('/login?error=' + encodeURIComponent(error.message))
  }

  // If Supabase is set to 'Confirm Email', the user isn't logged in yet.
  // If 'Confirm Email' is OFF, they are logged in and we redirect.
  if (data.user && data.session) {
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  } else {
    // Redirect to a page telling them to check their email
    redirect('/login?message=Check your email to continue')
  }
}

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) redirect('/login?error=Could not authenticate user')

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}