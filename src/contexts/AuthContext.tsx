import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react' // Correction TS1484

interface AuthContextType {
  isAuthenticated: boolean
  login: () => void
  register: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login = () => setIsAuthenticated(true)
  const register = () => setIsAuthenticated(true)

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}