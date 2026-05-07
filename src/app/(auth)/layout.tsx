"use client"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <main className="flex-1 flex items-center justify-center py-8">
        {children}
      </main>
    </div>
  )
}




