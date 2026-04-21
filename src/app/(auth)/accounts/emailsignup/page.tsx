"use client"
import { axiosRequest } from '../login/token'
import { useRouter } from 'next/navigation'
import { sileo } from 'sileo'

const Page = () => {
    const router = useRouter()
    const handleSubmit = async (event) => {
        event.preventDefault()

        if (event.target["inpPassword"].value != event.target["inpConfirmPassword"].value) {
            sileo.error({ title: "Error ", description: "This password don`t match", position: "top-center" });

        }
        const obj =
        {
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
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name='inpName' placeholder='Name' />
                <input type="text" name='inpFullName' />
                <input type="text" name='inpEmail' />
                <input type="password" name='inpPassword' />
                <input type="password" name='inpConfirmPassword' />
                <button type='submit'>Save</button>
            </form>
        </div>
    )
}

export default Page