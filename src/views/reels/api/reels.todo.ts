import { useQuery } from "@tanstack/react-query";
import { axiosRequest } from "@/src/app/(auth)/accounts/login/token";


export interface ReelComment {
    postCommentId: number;
    userId: string;
    userName: string;
    userImage: string;
    dateCommented: string;
    comment: string;
}


export interface ReelData {
    userName: string;
    isSubscriber: boolean;
    userImage: string;
    images: string;
    postId: number;
    userId: string;
    datePublished: string;
    postLike: boolean;
    postLikeCount: number;
    userLikes: unknown[];
    commentCount: number;
    comments: ReelComment[];
}



export interface ReelsResponse {
    pageNumber: number;
    pageSize: number;
    totalPage: number;
    totalRecord: number;
    data: ReelData[];
}



export const fetchReelsApi = async (
    pageNumber: number = 1,
    pageSize: number = 10
): Promise<ReelsResponse> => {
    const response = await axiosRequest.get("https://instagram-api.softclub.tj/Post/get-reels", {
        params: {
            PageNumber: pageNumber,
            PageSize: pageSize,
        },
    });

    return response.data;
};



export const useReelsQuery = (pageNumber = 1, pageSize = 10) => {
    return useQuery({
        queryKey: ["reels", pageNumber, pageSize],
        queryFn: () => fetchReelsApi(pageNumber, pageSize),
    });
};






