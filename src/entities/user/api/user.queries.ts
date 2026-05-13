import { useQuery } from "@tanstack/react-query";
import { userService } from "./user.service";

export const useSearchUsers = (userName: string) => {
  return useQuery({
    queryKey: ["users", "search", userName],
    queryFn: () => userService.getUsers({ UserName: userName, PageNumber: 1, PageSize: 50 }),
    enabled: userName.length > 0,
  });
};

export const useRecommendedUsers = () => {
  return useQuery({
    queryKey: ["users", "recommended"],
    queryFn: () => userService.getUsers({ PageNumber: 1, PageSize: 20 }),
  });
};



export const useSearchHistories = () => {
  return useQuery({
    queryKey: ["users", "histories"],
    queryFn: () => userService.getSearchHistories(),
  });
};




export const useMyProfile = () => {
  return useQuery({
    queryKey: ["users", "profile", "me"],
    queryFn: () => userService.getMyProfile(),
  });
};

