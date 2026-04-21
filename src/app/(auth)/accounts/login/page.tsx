"use client"
import { useRouter } from "next/navigation"
import { axiosRequest, saveToken } from "./token"

const Page = () => {
    const router = useRouter()
    const handleSubmit = async(event) =>
        {   
            event.preventDefault()
            const obj = 
            {
                userName:(event.target["inpName"].value),
                password:(event.target["inpPassword"].value)
            }
            try {
                const {data} = await axiosRequest.post(`/Account/Login`,obj)
                if(data.statusCode == 200)
                    {
                        saveToken(data.data)
                        router.push("/")
                    }
            } catch (error) {
                console.error(error);
                
            }
        }
  return (
    <div>
        <form onSubmit={handleSubmit}>
            <input type="text" name="inpName" placeholder="Name" />
            <input type="text" name="inpPassword" placeholder="Password" />
            <button type="submit">Save</button>
        </form>
    </div>
  )
}

export default Page