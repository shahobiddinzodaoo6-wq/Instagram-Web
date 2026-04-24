"use client"
import { useRouter } from "next/navigation"
import { axiosRequest, saveToken } from "./token"
import Link from "next/link"
import { useUIStore } from "@/src/shared/model/ui.store"
import { useState } from "react"

const Page = () => {
    const router = useRouter()
    const { showSplash } = useUIStore()
    const [isLoading, setIsLoading] = useState(false)
    
    const handleSubmit = async(event) => {   
        event.preventDefault()
        setIsLoading(true)
        const obj = {
            userName: (event.target["inpName"].value),
            password: (event.target["inpPassword"].value)
        }
        try {
            const {data} = await axiosRequest.post(`/Account/Login`, obj)
            if(data.statusCode == 200) {
                saveToken(data.data)
                showSplash()
                setTimeout(() => {
                    router.push("/")
                }, 500)
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-white flex w-full font-sans text-black overflow-hidden select-none">
            {/* Left Side: Branding and Info */}
            <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-8 bg-[#fafafa] border-r border-[#dbdbdb]">
                <div className="max-w-[450px] text-center flex flex-col items-center">
                    <div className="mb-6 transform scale-90">
                        <svg aria-label="Instagram" color="#262626" fill="#262626" height="60" role="img" viewBox="0 0 24 24" width="60">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                        </svg>
                    </div>

                    <h1 className="text-[26px] font-bold leading-tight mb-4 px-4">
                        Посмотрите, какими моментами из жизни поделились ваши <span className="bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888] bg-clip-text text-transparent">близкие друзья</span>.
                    </h1>

                    <div className="relative mt-4">
                        <img 
                            src="https://static.cdninstagram.com/rsrc.php/yN/r/-erGonz07kB.webp" 
                            alt="Photos" 
                            className="w-[260px] shadow-2xl rounded-xl rotate-[-5deg] relative z-20"
                        />
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-[450px] flex flex-col items-center justify-center p-6 lg:p-10 h-full bg-white relative">
                <div className="w-full max-w-[350px] flex flex-col h-full py-4 justify-center">
                    <div className="flex items-center gap-2 mb-6">
                        <Link href="/" className="hover:opacity-70">
                            <svg aria-label="Назад" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                <path d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z" transform="rotate(-90 12 12)"></path>
                            </svg>
                        </Link>
                        <h2 className="text-xl font-bold">Войти в Instagram</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                        <div className="relative group">
                            <input 
                                type="text" 
                                name="inpName" 
                                className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[8px] px-3 py-3.5 text-sm focus:outline-none focus:border-[#a8a8a8] transition-colors"
                                id="inpName"
                                placeholder="Имя пользователя или эл. адрес"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <input 
                                type="password" 
                                name="inpPassword" 
                                className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[8px] px-3 py-3.5 text-sm focus:outline-none focus:border-[#a8a8a8] transition-colors"
                                id="inpPassword"
                                placeholder="Пароль"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`mt-2 bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold py-2.5 rounded-[12px] text-sm transition-colors ${isLoading ? 'opacity-70' : ''}`}
                        >
                            {isLoading ? 'Вход...' : 'Войти'}
                        </button>

                        <Link href="/accounts/password/reset" className="text-sm text-center font-semibold mt-3 hover:opacity-70">
                            Забыли пароль?
                        </Link>
                    </form>

                    <div className="flex flex-col gap-3 mt-6 w-full">
                        <button type="button" className="flex items-center justify-center gap-2 border border-[#dbdbdb] py-2.5 rounded-[12px] text-sm font-semibold hover:bg-[#fafafa] transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0081fb">
                                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                            </svg>
                            Войти через Facebook
                        </button>

                        <Link href="/accounts/emailsignup" className="flex items-center justify-center border border-[#dbdbdb] py-2.5 rounded-[12px] text-sm font-semibold hover:bg-[#fafafa] transition-colors text-[#0095f6]">
                            Создать новый аккаунт
                        </Link>
                    </div>

                    <div className="mt-8 flex flex-col items-center opacity-70">
                         <svg height="16" viewBox="0 0 134 24" width="70" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50.467 15.688V8.163c0-2.316 1.705-4.148 3.931-4.148 2.226 0 3.931 1.832 3.931 4.148v7.525c0 2.316-1.705 4.148-3.931 4.148-2.226 0-3.931-1.832-3.931-4.148zm5.556 0V8.163c0-1.127-.852-2.024-1.625-2.024s-1.625.897-1.625 2.024v7.525c0 1.127.852 2.024 1.625 2.024s1.625-.897 1.625-2.024zm18.319 4.148c-1.341 0-2.261-.591-2.738-1.57h-.056v1.424h-2.193V4.163h2.249v6.529h.056c.477-.978 1.397-1.57 2.738-1.57 2.193 0 3.91 1.815 3.91 4.148 0 2.332-1.717 4.566-3.966 4.566zm-1.123-2.124c1.079 0 1.838-.934 1.838-2.024 0-1.09-.759-2.024-1.838-2.024-1.079 0-1.838.934-1.838 2.024 0 1.09.759 2.024 1.838 2.024zm15.421 2.124c-2.306 0-4.08-1.815-4.08-4.148 0-2.332 1.774-4.148 4.08-4.148 2.306 0 4.08 1.815 4.08 4.148 0 2.332-1.774 4.148-4.08 4.148zm0-2.124c1.079 0 1.838-.934 1.838-2.024 0-1.09-.759-2.024-1.838-2.024-1.079 0-1.838.934-1.838 2.024 0 1.09.759 2.024 1.838 2.024zm13.158 2.124c-2.306 0-4.08-1.815-4.08-4.148 0-2.332 1.774-4.148 4.08-4.148 2.306 0 4.08 1.815 4.08 4.148 0 2.332-1.774 4.148-4.08 4.148zm0-2.124c1.079 0 1.838-.934 1.838-2.024 0-1.09-.759-2.024-1.838-2.024-1.079 0-1.838.934-1.838 2.024 0 1.09.759 2.024 1.838 2.024zm13.158 2.124c-2.306 0-4.08-1.815-4.08-4.148 0-2.332 1.774-4.148 4.08-4.148 2.306 0 4.08 1.815 4.08 4.148 0 2.332-1.774 4.148-4.08 4.148zm0-2.124c1.079 0 1.838-.934 1.838-2.024 0-1.09-.759-2.024-1.838-2.024-1.079 0-1.838.934-1.838 2.024 0 1.09.759 2.024 1.838 2.024zM15.485 5.626c-2.14 0-3.923 1.134-4.996 2.836-1.073-1.702-2.856-2.836-4.996-2.836C2.463 5.626.033 8.056.033 11.083c0 3.027 2.43 5.457 5.457 5.457 2.14 0 3.923-1.134 4.996-2.836 1.073 1.702 2.856 2.836 4.996 2.836 3.027 0 5.457-2.43 5.457-5.457C20.942 8.056 18.512 5.626 15.485 5.626zm-9.995 8.795c-1.846 0-3.344-1.498-3.344-3.344s1.498-3.344 3.344-3.344c1.479 0 2.738.966 3.167 2.298l-.001.002c.005.015.009.03.013.045.003.009.006.018.008.027.006.024.013.047.018.071.001.007.003.015.004.022.004.02.008.039.011.059.003.016.005.033.007.049.002.013.003.026.004.039.01.079.015.159.015.241 0 .025-.001.05-.002.075-.015.228-.052.449-.109.658-.45 1.636-1.954 2.842-3.344 2.842zm9.995 0c-1.4 0-2.92-1.233-3.355-2.888-.008-.03-.016-.06-.024-.09-.001-.005-.002-.01-.003-.015-.006-.023-.012-.045-.018-.068l-.004-.016c-.005-.021-.01-.041-.016-.061l-.004-.014c-.006-.023-.012-.045-.019-.067l-.003-.012c-.007-.024-.014-.047-.021-.071-.035-.119-.059-.24-.074-.363-.002-.016-.004-.033-.005-.049-.001-.008-.002-.016-.002-.025-.016-.211-.005-.429.032-.64.444-1.314 1.688-2.244 3.149-2.244 1.846 0 3.344 1.498 3.344 3.344s-1.498 3.344-3.344 3.344z" fill="currentColor"/></svg>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    )
}

export default Page