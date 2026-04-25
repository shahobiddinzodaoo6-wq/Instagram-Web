"use client"
import React, { useEffect } from "react"
import { useUIStore } from "@/src/shared/model/ui.store"

export const SplashScreen = () => {
    const { isSplashVisible, showSplash, hideSplash } = useUIStore()

    useEffect(() => {
        // Show on initial mount
        showSplash()
    }, [showSplash])

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (isSplashVisible) {
            timer = setTimeout(() => {
                hideSplash()
            }, 2500)
        }
        return () => clearTimeout(timer)
    }, [isSplashVisible, hideSplash])

    if (!isSplashVisible) return null

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
            <div className="flex flex-1 items-center justify-center">
                {/* Instagram Glyph SVG */}
                <div className="animate-pulse-slow">
                    <svg
                        width="80"
                        height="80"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                            fill="url(#paint0_linear)"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear"
                                x1="3.218"
                                y1="3.218"
                                x2="21.135"
                                y2="21.135"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#405DE6" />
                                <stop offset="0.1" stopColor="#5851DB" />
                                <stop offset="0.2" stopColor="#833AB4" />
                                <stop offset="0.3" stopColor="#C13584" />
                                <stop offset="0.4" stopColor="#E1306C" />
                                <stop offset="0.5" stopColor="#FD1D1D" />
                                <stop offset="0.6" stopColor="#F56040" />
                                <stop offset="0.7" stopColor="#F77737" />
                                <stop offset="0.8" stopColor="#FCAF45" />
                                <stop offset="0.9" stopColor="#FFDC80" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            {/* Bottom Meta Section */}
            <div className="pb-12 flex flex-col items-center gap-2">
                <span className="text-[#8e8e8e] text-sm font-medium">from</span>
                <div className="flex items-center gap-1.5 opacity-80">
                   <svg width="60" height="12" viewBox="0 0 440 84" fill="#0081fb" xmlns="http://www.w3.org/2000/svg">
                        <path d="M118.5 83.5V0.5H153.5V83.5H118.5ZM0.5 83.5V0.5H67.5V11.5H11.5V36.5H62.5V47.5H11.5V72.5H67.5V83.5H0.5ZM203.5 83.5V0.5H238.5V83.5H203.5ZM283.5 83.5V0.5H350.5V11.5H294.5V36.5H345.5V47.5H294.5V72.5H350.5V83.5H283.5ZM371.5 83.5V0.5H438.5V11.5H382.5V36.5H433.5V47.5H382.5V72.5H438.5V83.5H371.5Z" />
                   </svg>
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.1); opacity: 1; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}
