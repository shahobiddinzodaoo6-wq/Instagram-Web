import axios from "axios"
export const url = "https://instagram-api.softclub.tj"
export const urlImage = "https://instagram-api.softclub.tj/images"
export function saveToken(token:string)
{
    localStorage.setItem("token",token)
}
export const getToken = () =>
    {
        return localStorage.getItem("token")
    }

export const axiosRequest = axios.create(
    {
        baseURL: process.env.NEXT_PUBLIC_API_URL
    })

axiosRequest.interceptors.request.use(
    (config) =>
        {
            const token = getToken()

            if(token)
                {
                    config.headers["Authorization"] = `Bearer ${token}`
                }
                return config
        },
    (error) => Promise.reject(error)
)