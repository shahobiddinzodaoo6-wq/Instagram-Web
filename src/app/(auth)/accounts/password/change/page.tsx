import { useMutation } from "@tanstack/react-query";
import { axiosRequest } from "../../login/token";

export const ForgotPassword = () =>
{
    const {data,isLoading} = useMutation(
        {
        mutationFn:async() =>
                {
                    const {data} = await axiosRequest.put(`/Accounts/ChangePassword`)
                    return data.data
                },
                onSuccess:(data) =>
                    {
                        console.log("Succesful updated");
                        
                    },
                mutationKey:["change-password"],
        }),
        const handleSubmit = (event) =>
            {
                event.preventDefault()
                const oldPassword = event.target["inpOldPassword"].value
                const newPassword = event.target["inpNewPassword"].value
                const confirmPassword = event.target["inpConfirmPassword"].value
                mutate({oldPassword,newPassword,confirmPassword}) 
            }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="inpOldPassword" placeholder="OldPassword" />
                <input type="text" name="inpNewPassword" placeholder="NewPassword" />
                <input type="text" name="inpConfirmPassword" placeholder="ConfirmPassword" />
                <button type="submit">Save</button>
            </form>
        </div>
    )
}

    export default ForgotPassword;