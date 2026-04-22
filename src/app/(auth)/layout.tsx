"use client"

import { useState, useEffect } from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-20 h-20">
             <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <radialGradient id="rg" r="150%" cx="30%" cy="107%">
                    <stop stopColor="#fdf497" offset="0" />
                    <stop stopColor="#fdf497" offset="0.05" />
                    <stop stopColor="#fd5949" offset="0.45" />
                    <stop stopColor="#d6249f" offset="0.6" />
                    <stop stopColor="#285AEB" offset="0.9" />
                </radialGradient>
                <rect width="512" height="512" rx="15%" fill="url(#rg)" />
                <path d="M256 113.5c46.3 0 51.8.2 70.1 1 16.9.8 26.1 3.6 32.2 6 8.1 3.1 13.9 6.9 20 12.9 6 6 9.8 11.9 12.9 20 2.4 6.1 5.2 15.3 6 32.2.8 18.3 1 23.8 1 70.1s-.2 51.8-1 70.1c-.8 16.9-3.6 26.1-6 32.2-3.1 8.1-6.9 13.9-12.9 20-6 6-11.9 9.8-20 12.9-6.1 2.4-15.3 5.2-32.2 6-18.3.8-23.8 1-70.1 1s-51.8-.2-70.1-1c-16.9-.8-26.1-3.6-32.2-6-8.1-3.1-13.9-6.9-20-12.9-6-6-9.8-11.9-12.9-20-2.4-6.1-5.2-15.3-6-32.2-.8-18.3-1-23.8-1-70.1s.2-51.8 1-70.1c.8-16.9 3.6-26.1 6-32.2 3.1-8.1 6.9-13.9 12.9-20 6-6 11.9-9.8 20-12.9 6.1-2.4 15.3-5.2 32.2-6 18.3-.8 23.8-1 70.1-1m0-45.3c-47.1 0-53 .2-71.5 1-18.5.8-31.1 3.8-42.1 8.1-11.4 4.4-21 10.4-30.7 20-9.6 9.6-15.6 19.3-20 30.7-4.3 11-7.3 23.6-8.1 42.1-.8 18.5-1 24.4-1 71.5s.2 53 1 71.5c.8 18.5 3.8 31.1 8.1 42.1 4.4 11.4 10.4 21 20 30.7 9.6 9.6 19.3 15.6 30.7 20 11 4.3 23.6 7.3 42.1 8.1 18.5.8 24.4 1 71.5 1s53-.2 71.5-1c18.5-.8 31.1-3.8 42.1-8.1 11.4-4.4 21-10.4 30.7-20 9.6-9.6 15.6-19.3 20-30.7 4.3-11 7.3-23.6 8.1-42.1.8-18.5 1-24.4 1-71.5s-.2-53-1-71.5c-.8-18.5-3.8-31.1-8.1-42.1-4.4-11.4-10.4-21-20-30.7-9.6-9.6-19.3-15.6-30.7-20-11-4.3-23.6-7.3-42.1-8.1-18.5-.8-24.4-1-71.5-1z" fill="white" />
                <path d="M256 160c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96zm0 146.7c-28 0-50.7-22.7-50.7-50.7s22.7-50.7 50.7-50.7 50.7 22.7 50.7 50.7-22.7 50.7-50.7 50.7z" fill="white" />
                <circle cx="373" cy="139" r="22.7" fill="white" />
            </svg>
          </div>
        </div>
        <div className="pb-12 flex flex-col items-center">
          <p className="text-[#8e8e8e] text-sm mb-2">from</p>
          <div className="flex items-center gap-1">
            <span className="text-[#F34F5E] font-bold text-lg tracking-wider">Meta</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <main className="flex-1 flex items-center justify-center py-8">
        {children}
      </main>
      <footer className="py-6 flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[#8e8e8e] text-xs mb-4">
          <a href="#">Meta</a>
          <a href="#">About</a>
          <a href="#">Blog</a>
          <a href="#">Jobs</a>
          <a href="#">Help</a>
          <a href="#">API</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Locations</a>
        </div>
        <div className="flex items-center gap-4 text-[#8e8e8e] text-xs">
          <span>English</span>
          <span>© 2024 Instagram from Meta</span>
        </div>
      </footer>
    </div>
  )
}
