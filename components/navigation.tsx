"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { getCurrentUser, logout } from "@/services/api"
import { User, LogOut } from "lucide-react"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/prediction", label: "Prediction" },
]

const authItems = [
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Sign Up" },
]

export function Navigation() {
  const pathname = usePathname()
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    setCurrentUser(getCurrentUser())
  }, [])

  const handleLogout = () => {
    logout()
    setCurrentUser(null)
    window.location.href = "/"
  }

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-lg">₿</span>
            </div>
            <span className="font-bold text-xl text-foreground">CryptoPulse</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-accent",
                  pathname === item.href ? "text-accent" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-accent" />
                  <span className="font-medium text-foreground">{currentUser.username}</span>
                </div>
                <Button onClick={handleLogout} variant="ghost" size="sm" className="flex items-center space-x-1">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <>
                {authItems.map((item) => (
                  <Button key={item.href} asChild variant={item.label === "Sign Up" ? "default" : "ghost"} size="sm">
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
