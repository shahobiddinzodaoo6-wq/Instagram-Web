"use client"
import { axiosRequest } from '../login/token'
import { useRouter } from 'next/navigation'
import { sileo } from 'sileo'
import Link from 'next/link'

const Page = () => {
    const router = useRouter()
    const handleSubmit = async (event) => {
        event.preventDefault()

        if (event.target["inpPassword"].value != event.target["inpConfirmPassword"].value) {
            sileo.error({ title: "Error ", description: "This password don`t match", position: "top-center" });
            return;
        }
        const obj = {
            userName: event.target["inpName"].value,
            fullName: event.target["inpFullName"].value,
            email: event.target["inpEmail"].value,
            password: event.target["inpPassword"].value,
            confirmPassword: event.target["inpConfirmPassword"].value,
        }
        try {
            const { data } = await axiosRequest.post(`/Account/register`, obj)
            if (data.statusCode == 200 || data.data) {
                sileo.success({ title: "Account Created!", description: "Welcome to Exclusive. Please log in.", position: "top-center" });
                router.push("/accounts/login")
            }
        } catch (error) {
            console.error(error);
            sileo.error({ title: "Sign Up Failed", description: "This email might already be in use.", position: "top-center" });
        }
    }

    return (
        <div className="flex flex-col gap-3 w-full max-w-[350px] text-black">
            <div className="bg-white border border-[#dbdbdb] px-10 py-10 flex flex-col items-center text-center">
                <div className="mb-4">
                     <h1 className="text-4xl font-bold italic" style={{fontFamily: 'serif'}}>Instagram</h1>
                </div>

                <h2 className="text-[#8e8e8e] font-bold text-lg leading-5 mb-4">
                    Sign up to see photos and videos from your friends.
                </h2>

                <button type="button" className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold py-1.5 rounded-[8px] text-sm flex items-center justify-center gap-2 mb-4 transition-colors">
                    Log in with Facebook
                </button>

                <div className="flex items-center gap-4 w-full mb-4 text-[#8e8e8e] text-xs font-semibold uppercase">
                    <div className="h-[1px] bg-[#dbdbdb] flex-1"></div>
                    <span>or</span>
                    <div className="h-[1px] bg-[#dbdbdb] flex-1"></div>
                </div>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
                    <div className="relative flex flex-col">
                        <input type="text" name="inpEmail" placeholder="Mobile Number or Email" className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 pt-2.5 pb-1.5 text-xs focus:outline-none focus:border-[#a8a8a8] peer placeholder-transparent" id="inpEmail" required />
                        <label htmlFor="inpEmail" className="absolute left-2 top-0.5 text-[#8e8e8e] text-[10px] transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-2.5 peer-focus:top-0.5 peer-focus:text-[10px] pointer-events-none">Mobile Number or Email</label>
                    </div>
                    <div className="relative flex flex-col">
                        <input type="text" name="inpFullName" placeholder="Full Name" className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 pt-2.5 pb-1.5 text-xs focus:outline-none focus:border-[#a8a8a8] peer placeholder-transparent" id="inpFullName" required />
                        <label htmlFor="inpFullName" className="absolute left-2 top-0.5 text-[#8e8e8e] text-[10px] transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-2.5 peer-focus:top-0.5 peer-focus:text-[10px] pointer-events-none">Full Name</label>
                    </div>
                    <div className="relative flex flex-col">
                        <input type="text" name="inpName" placeholder="Username" className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 pt-2.5 pb-1.5 text-xs focus:outline-none focus:border-[#a8a8a8] peer placeholder-transparent" id="inpName" required />
                        <label htmlFor="inpName" className="absolute left-2 top-0.5 text-[#8e8e8e] text-[10px] transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-2.5 peer-focus:top-0.5 peer-focus:text-[10px] pointer-events-none">Username</label>
                    </div>
                    <div className="relative flex flex-col">
                        <input type="password" name="inpPassword" placeholder="Password" className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 pt-2.5 pb-1.5 text-xs focus:outline-none focus:border-[#a8a8a8] peer placeholder-transparent" id="inpPassword" required />
                        <label htmlFor="inpPassword" className="absolute left-2 top-0.5 text-[#8e8e8e] text-[10px] transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-2.5 peer-focus:top-0.5 peer-focus:text-[10px] pointer-events-none">Password</label>
                    </div>
                    <div className="relative flex flex-col">
                        <input type="password" name="inpConfirmPassword" placeholder="Confirm Password" className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 pt-2.5 pb-1.5 text-xs focus:outline-none focus:border-[#a8a8a8] peer placeholder-transparent" id="inpConfirmPassword" required />
                        <label htmlFor="inpConfirmPassword" className="absolute left-2 top-0.5 text-[#8e8e8e] text-[10px] transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-2.5 peer-focus:top-0.5 peer-focus:text-[10px] pointer-events-none">Confirm Password</label>
                    </div>

                    <button type="submit" className="mt-4 bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold py-1.5 rounded-[8px] text-sm transition-colors">Sign up</button>
                </form>
            </div>

            <div className="bg-white border border-[#dbdbdb] p-6 flex items-center justify-center gap-1 text-sm">
                <span className="text-[#262626]">Have an account?</span>
                <Link href="/accounts/login" className="text-[#0095f6] font-semibold">Log in</Link>
            </div>
        </div>
    )
}

export default Page