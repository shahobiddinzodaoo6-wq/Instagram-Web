"use client"
import { useRouter } from "next/navigation"
import { axiosRequest, saveToken } from "./token"
import Link from "next/link"

const Page = () => {
    const router = useRouter()
    
    const handleSubmit = async(event) => {   
        event.preventDefault()
        const obj = {
            userName: (event.target["inpName"].value),
            password: (event.target["inpPassword"].value)
        }
        try {
            const {data} = await axiosRequest.post(`/Account/Login`, obj)
            if(data.statusCode == 200) {
                saveToken(data.data)
                router.push("/")
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex items-center justify-center gap-8 max-w-[935px] w-full px-4 text-black">
            {/* Phone Mockup (Desktop only) */}
            <div className="hidden md:block relative w-[380px] h-[581px] bg-[url('https://static.cdninstagram.com/images/instagram/xig/homepage/phones/home-phones.png?__make_all_orientations=1')] bg-no-repeat bg-contain">
                <div className="absolute top-[26px] right-[18px] w-[250px] h-[538px] overflow-hidden">
                   <img 
                    src="https://www.instagram.com/static/images/homepage/screenshots/screenshot1.png/fdfe23e49635.png" 
                    alt="Instagram Screenshot" 
                    className="w-full h-full object-cover rounded-[30px]"
                   />
                </div>
            </div>

            {/* Login Form Container */}
            <div className="flex flex-col gap-3 w-full max-w-[350px]">
                <div className="bg-white border border-[#dbdbdb] px-10 py-10 flex flex-col items-center">
                    <div className="mb-8">
                         <h1 className="text-4xl font-bold italic" style={{fontFamily: 'serif'}}>Instagram</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
                        <div className="relative flex flex-col">
                            <input 
                                type="text" 
                                name="inpName" 
                                placeholder="Phone number, username, or email" 
                                className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 pt-2.5 pb-1.5 text-xs focus:outline-none focus:border-[#a8a8a8] peer placeholder-transparent"
                                id="inpName"
                                required
                            />
                            <label htmlFor="inpName" className="absolute left-2 top-0.5 text-[#8e8e8e] text-[10px] transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-2.5 peer-focus:top-0.5 peer-focus:text-[10px] pointer-events-none">
                                Phone number, username, or email
                            </label>
                        </div>

                        <div className="relative flex flex-col">
                            <input 
                                type="password" 
                                name="inpPassword" 
                                placeholder="Password" 
                                className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 pt-2.5 pb-1.5 text-xs focus:outline-none focus:border-[#a8a8a8] peer placeholder-transparent"
                                id="inpPassword"
                                required
                            />
                            <label htmlFor="inpPassword" className="absolute left-2 top-0.5 text-[#8e8e8e] text-[10px] transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-2.5 peer-focus:top-0.5 peer-focus:text-[10px] pointer-events-none">
                                Password
                            </label>
                        </div>

                        <button type="submit" className="mt-2 bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold py-1.5 rounded-[8px] text-sm transition-colors">
                            Log in
                        </button>

                        <div className="flex items-center gap-4 my-4 text-[#8e8e8e] text-xs font-semibold uppercase">
                            <div className="h-[1px] bg-[#dbdbdb] flex-1"></div>
                            <span>or</span>
                            <div className="h-[1px] bg-[#dbdbdb] flex-1"></div>
                        </div>

                        <button type="button" className="flex items-center justify-center gap-2 text-[#385185] font-semibold text-sm mb-3">
                            Log in with Facebook
                        </button>

                        <Link href="/accounts/password/reset" className="text-[#00376b] text-xs text-center">
                            Forgot password?
                        </Link>
                    </form>
                </div>

                <div className="bg-white border border-[#dbdbdb] p-6 flex items-center justify-center gap-1 text-sm">
                    <span className="text-[#262626]">Don't have an account?</span>
                    <Link href="/accounts/emailsignup" className="text-[#0095f6] font-semibold">
                        Sign up
                    </Link>
                </div>

                <div className="flex flex-col items-center gap-4 mt-2">
                    <span className="text-sm text-[#262626]">Get the app.</span>
                    <div className="flex gap-2">
                        <img src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7YmS_tI.png" alt="Google Play" className="h-10 cursor-pointer" />
                        <img src="https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png" alt="Microsoft" className="h-10 cursor-pointer" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page