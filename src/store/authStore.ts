/**
 * Auth Store - Firebase Authentication State Management
 * Uses Zustand with persistence + Firebase Auth
 * Falls back to mock auth when Firebase is not configured
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase'

interface AuthUser {
  name: string
  email: string
  photoURL?: string
  uid?: string
}

interface AuthStore {
  isAuthenticated: boolean
  user: AuthUser | null
  loading: boolean
  error: string | null

  // Actions
  login: (name: string, email: string) => void
  loginWithEmail: (email: string, password: string) => Promise<void>
  signupWithEmail: (name: string, email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  setFromFirebaseUser: (user: FirebaseUser | null) => void
}

const mapFirebaseUser = (user: FirebaseUser): AuthUser => ({
  name: user.displayName || user.email?.split('@')[0] || 'User',
  email: user.email || '',
  photoURL: user.photoURL || undefined,
  uid: user.uid,
})

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,

      // Simple login (mock — for when Firebase is not configured)
      login: (name: string, email: string) => {
        set({ isAuthenticated: true, user: { name, email }, error: null })
      },

      // Firebase: Email/Password Sign In
      loginWithEmail: async (email: string, password: string) => {
        if (!isFirebaseConfigured) {
          // Fallback to mock auth
          set({
            isAuthenticated: true,
            user: { name: email.split('@')[0], email },
            loading: false,
            error: null,
          })
          return
        }

        set({ loading: true, error: null })
        try {
          const credential = await signInWithEmailAndPassword(auth, email, password)
          set({
            isAuthenticated: true,
            user: mapFirebaseUser(credential.user),
            loading: false,
          })
        } catch (err: any) {
          const message = getFirebaseErrorMessage(err.code)
          set({ loading: false, error: message })
          throw new Error(message)
        }
      },

      // Firebase: Email/Password Sign Up
      signupWithEmail: async (name: string, email: string, password: string) => {
        if (!isFirebaseConfigured) {
          set({
            isAuthenticated: true,
            user: { name, email },
            loading: false,
            error: null,
          })
          return
        }

        set({ loading: true, error: null })
        try {
          const credential = await createUserWithEmailAndPassword(auth, email, password)
          // Update the display name
          await updateProfile(credential.user, { displayName: name })
          set({
            isAuthenticated: true,
            user: mapFirebaseUser({ ...credential.user, displayName: name } as FirebaseUser),
            loading: false,
          })
        } catch (err: any) {
          const message = getFirebaseErrorMessage(err.code)
          set({ loading: false, error: message })
          throw new Error(message)
        }
      },

      // Firebase: Google Sign In
      loginWithGoogle: async () => {
        if (!isFirebaseConfigured) {
          set({
            isAuthenticated: true,
            user: { name: 'Google User', email: 'user@gmail.com' },
            loading: false,
            error: null,
          })
          return
        }

        set({ loading: true, error: null })
        try {
          const result = await signInWithPopup(auth, googleProvider)
          set({
            isAuthenticated: true,
            user: mapFirebaseUser(result.user),
            loading: false,
          })
        } catch (err: any) {
          // Don't show error if user canceled the popup
          if (err.code === 'auth/popup-closed-by-user') {
            set({ loading: false })
            return
          }
          const message = getFirebaseErrorMessage(err.code)
          set({ loading: false, error: message })
          throw new Error(message)
        }
      },

      // Firebase: Sign Out
      logout: async () => {
        if (isFirebaseConfigured) {
          try {
            await signOut(auth)
          } catch {
            // Ignore sign out errors
          }
        }
        set({ isAuthenticated: false, user: null, error: null })
      },

      clearError: () => set({ error: null }),

      setFromFirebaseUser: (user: FirebaseUser | null) => {
        if (user) {
          set({
            isAuthenticated: true,
            user: mapFirebaseUser(user),
            loading: false,
          })
        } else {
          set({ isAuthenticated: false, user: null, loading: false })
        }
      },
    }),
    {
      name: 'dammylive-auth',
      version: 2,
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
)

// ── Firebase Auth State Listener ──
// Subscribe to auth changes when Firebase is configured
if (isFirebaseConfigured) {
  onAuthStateChanged(auth, (user) => {
    useAuthStore.getState().setFromFirebaseUser(user)
  })
}

// ── Human-readable Firebase error messages ──
function getFirebaseErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered. Please sign in.',
    'auth/invalid-email': 'Invalid email address format.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/popup-blocked': 'Sign-in popup was blocked. Please allow popups.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/requires-recent-login': 'Please sign in again to perform this action.',
  }
  return messages[code] || 'Authentication failed. Please try again.'
}
