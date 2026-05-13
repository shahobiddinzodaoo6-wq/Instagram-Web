import { axiosRequest } from "@/src/app/(auth)/accounts/login/token";
import { ChatResponse } from "../../chat/model/types";

export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  image: string;
  fullName: string;
}



export interface UserSearchResponse {
  data: UserProfile[];
  totalCount: number;
  statusCode: number;
}



export const userService = {
  getUsers: async (params: { UserName?: string; Email?: string; PageNumber?: number; PageSize?: number }): Promise<UserSearchResponse> => {
    const { data } = await axiosRequest.get("/User/get-users", { params });
    return data;
  },


  
  getSearchHistories: async (): Promise<UserSearchResponse> => {
    const { data } = await axiosRequest.get("/User/get-search-histories");
    return data;
  },



  getMyProfile: async (): Promise<ChatResponse<UserProfile>> => {
    const { data } = await axiosRequest.get("/UserProfile/get-my-profile");
    return data;
  }
};



