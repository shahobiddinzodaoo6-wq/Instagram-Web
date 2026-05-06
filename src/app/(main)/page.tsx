"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { axiosRequest } from "../(auth)/accounts/login/token";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile, ChevronRight, ChevronLeft, X, CheckCircle2, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { message } from "antd";

const api = "https://instagram-api.softclub.tj";
const imageUrl = "https://instagram-api.softclub.tj/images"; 

const getFullImageUrl = (imageName: string | null) => {
  if (!imageName) return null;
  if (imageName.startsWith("http")) return imageName;
  return `${imageUrl}/${imageName}`; 
};

let mockStories = [
  { id: 1, author: 'xollllova', avatar: '', hasStory: false, image: 'https://picsum.photos/400/800?1' },
  { id: 2, author: 'amircargo', avatar: '', hasStory: true, image: 'https://picsum.photos/400/800?2' },
  { id: 3, author: 'softclub.st...', avatar: '', hasStory: true, image: 'https://picsum.photos/400/800?3' },
  { id: 4, author: '_mustafo_4l', avatar: '', hasStory: true, image: 'https://picsum.photos/400/800?4' },
  { id: 5, author: 'fazliddinjo...', avatar: '', hasStory: true, image: 'https://picsum.photos/400/800?5' },
  { id: 6, author: 'najibulloh....', avatar: '', hasStory: true, image: 'https://picsum.photos/400/800?6' },
];

const mockSuggestions = [
  { id: 101, username: '_mbrz__', description: 'Подписаны: texac.2 и...', avatar: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
  { id: 102, username: 'komilzodaa77', description: 'Подписан(-а) l.musoev...', avatar: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
  { id: 103, username: 'Soft Club English...', description: 'Подписан(-а) khairiddi...', avatar: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
  { id: 104, username: 'Hj', description: 'Подписан(-а) ozodmar...', avatar: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
  { id: 105, username: 'HABIB (ANAKONDA)', description: 'Подписан(-а) shuxrat_...', avatar: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
];

const StoryViewer = ({ stories, initialIndex, onClose }: { stories: any[], initialIndex: number, onClose: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const story = stories[currentIndex];

  const DURATION = 3000; // 3 seconds
  const TICK = 50; // ms per tick

  const goNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((c) => c + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };
  const goPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex((c) => c - 1);
      setProgress(0);
    }
  };

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  useEffect(() => {
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (paused) return;
    let tick = 0;
    const totalTicks = DURATION / TICK;
    intervalRef.current = setInterval(() => {
      tick++;
      const pct = (tick / totalTicks) * 100;
      setProgress(Math.min(pct, 100));
      if (tick >= totalTicks) {
        clearInterval(intervalRef.current!);
        const c = currentIndexRef.current;
        if (c < stories.length - 1) {
          setCurrentIndex(c + 1);
        } else {
          onClose();
        }
      }
    }, TICK);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [currentIndex, paused]);

  // DEBUG: log all story fields to see what API returns
  console.log("Story object:", JSON.stringify(story, null, 2));

  const nestedStory = story.stories?.[0];
  console.log("Nested story:", JSON.stringify(nestedStory, null, 2));

  const file = nestedStory?.imageUrl || nestedStory?.image || nestedStory?.file || nestedStory?.mediaPath || nestedStory?.fileName || nestedStory?.storyImage || nestedStory?.url
    || story.image || story.file || story.mediaPath || story.fileName || story.storyImage || story.images?.[0] || story.imageUrl || story.url;
  const mediaUrl = file ? (file.startsWith('http') ? file : getFullImageUrl(file)) : null;
  const isVideo = file?.endsWith(".mp4") || file?.endsWith(".mov") || story.isVideo || nestedStory?.isVideo;

  const uName = story.userName || story.author || "User";
  const avatar = getFullImageUrl(story.userImage || story.avatar) || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";

  return (
    <div className="fixed inset-0 bg-[#1a1a1a] z-[100] flex items-center justify-center h-screen w-screen" onClick={onClose}>
      <button className="absolute top-4 right-4 text-white hover:opacity-70 z-[110] p-2" onClick={onClose}>
        <X className="w-8 h-8" />
      </button>

      {currentIndex > 0 && (
        <button 
          className="absolute left-2 sm:left-[5%] md:left-[10%] lg:left-[25%] top-1/2 -translate-y-1/2 bg-white/20 p-2 sm:p-3 rounded-full text-white hover:bg-white/40 transition z-[110]" 
          onClick={goPrev}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}





      {currentIndex < stories.length - 1 && (
        <button 
          className="absolute right-2 sm:right-[5%] md:right-[10%] lg:right-[25%] top-1/2 -translate-y-1/2 bg-white/20 p-2 sm:p-3 rounded-full text-white hover:bg-white/40 transition z-[110]" 
          onClick={goNext}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      <div 
        className="relative w-full sm:max-w-[400px] h-full sm:h-[90vh] bg-black sm:rounded-xl overflow-hidden flex flex-col items-center justify-center shadow-2xl"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="absolute top-2 w-full px-2 flex gap-1 z-20">
          {stories.map((_: any, i: number) => (
            <div key={i} className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-none"
                style={{
                  width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>

        <div className="absolute top-4 w-full p-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2 text-white">
            <img src={avatar} className="w-8 h-8 rounded-full border border-gray-500 object-cover" alt="avatar" />
            <span className="font-semibold text-sm">{uName}</span>
            <span className="text-white/60 text-xs">1h</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <button><MessageCircle className="w-5 h-5"/></button>
            <button><MoreHorizontal className="w-5 h-5"/></button>
          </div>
        </div>

        {mediaUrl ? (
          isVideo ? (
            <video src={mediaUrl} autoPlay muted loop className="w-full h-full object-cover" />
          ) : (
            <img src={mediaUrl} className="w-full h-full object-cover" alt="story" />
          )
        ) : (
          <div className="text-white">Не удалось загрузить медиа</div>
        )}
      </div>
    </div>
  );
};

const StorySection = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [activeUserStories, setActiveUserStories] = useState<any[]>([]);
  const [loadingStories, setLoadingStories] = useState(false);

  const { data: storiesObj } = useQuery({
    queryKey: ["getStories"],
    queryFn: async () => {
      const { data } = await axiosRequest.get(`${api}/Story/get-stories`);
      return Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    },
  });

  // Also fetch my own stories
  const { data: myStoriesData } = useQuery({
    queryKey: ["getMyStories"],
    queryFn: async () => {
      const { data } = await axiosRequest.get(`${api}/Story/get-my-stories`);
      return Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    },
  });

  const displayStories = storiesObj && storiesObj.length > 0 ? storiesObj : mockStories;

  const addStoryMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("Image", file);
      const { data } = await axiosRequest.post(`${api}/Story/AddStories`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("AddStories response:", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getStories"] });
      queryClient.invalidateQueries({ queryKey: ["getMyStories"] });
    },
    onError: (err: any) => {
      console.error("AddStories error:", err?.response?.data);
    }
  });

  const handleAddStory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) addStoryMutation.mutate(file);
  };

  const openUserStories = async (userId: string) => {
    setLoadingStories(true);
    try {
      const { data: raw } = await axiosRequest.get(`${api}/Story/get-user-stories/${userId}`);
      console.log("get-user-stories RAW:", JSON.stringify(raw, null, 2));
      const stories = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : raw?.data ? [raw.data] : [];
      if (stories.length > 0) {
        setActiveUserStories(stories);
        setActiveUserId(userId);
      } else {
        message.info("У этого пользователя нет активных историй");
      }
    } catch (e) {
      console.error("Failed to fetch user stories", e);
    }
    setLoadingStories(false);
  };

  const openMyStories = async () => {
    setLoadingStories(true);
    try {
      const { data: raw } = await axiosRequest.get(`${api}/Story/get-my-stories`);
      console.log("get-my-stories RAW:", JSON.stringify(raw, null, 2));
      const stories = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : raw?.data ? [raw.data] : [];
      if (stories.length > 0) {
        setActiveUserStories(stories);
        setActiveUserId("me");
      } else {
        message.info("У вас пока нет историй. Нажмите на +, чтобы добавить.");
      }
    } catch (e) {
      console.error("Failed to fetch my stories", e);
    }
    setLoadingStories(false);
  };

  return (
    <>
      <div className="bg-white py-4 flex gap-4 overflow-x-auto relative mb-4 w-full max-w-[470px] mt-8 mx-auto scrollbar-hide">
        {/* My story bubble */}
        <div className="flex flex-col items-center gap-1 min-w-[72px] shrink-0">
          <div className="relative">
            <div
              className={`w-[66px] h-[66px] rounded-full p-[2px] cursor-pointer ${myStoriesData && myStoriesData.length > 0 ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' : 'bg-gray-200'}`}
              onClick={openMyStories}
            >
              <div className="bg-white p-[2px] rounded-full w-full h-full">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" alt="You" className="rounded-full w-full h-full object-cover" />
              </div>
            </div>
            <label className="absolute bottom-1 right-0 bg-[#0095f6] text-white rounded-full border-2 border-white w-[22px] h-[22px] flex items-center justify-center cursor-pointer z-10">
              <input type="file" accept="image/*" className="hidden" onChange={handleAddStory} disabled={addStoryMutation.isPending} />
              {addStoryMutation.isPending
                ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                : <Plus className="w-3 h-3" />
              }
            </label>
          </div>
          <span className="text-xs text-[#8e8e8e] truncate text-center font-normal mt-0.5">Your story</span>
        </div>

        {displayStories.map((story: any, idx: number) => {
          const avatarUrl = getFullImageUrl(story.userImage || story.avatar) || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
          const uName = story.userName || story.author || "User";
          const hasStories = (story.stories && story.stories.length > 0) || story.hasStory === true || story.id;
          return (
            <div 
              key={story.id || story.storyId || idx} 
              onClick={() => story.userId ? openUserStories(story.userId) : null} 
              className="flex flex-col items-center gap-1 cursor-pointer min-w-[72px]"
            >
              <div className={`w-[66px] h-[66px] rounded-full p-[2px] ${hasStories ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' : 'bg-gray-200'}`}>
                <div className="bg-white p-[2px] rounded-full w-full h-full">
                  <img src={avatarUrl} alt={uName} className="rounded-full w-full h-full object-cover" />
                </div>
              </div>
              <span 
                className="text-xs text-black w-16 truncate text-center font-normal hover:underline cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/${uName}`);
                }}
              >
                {uName}
              </span>
            </div>
          );
        })}
        <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-[2px] shadow hover:bg-gray-50 z-10 transition">
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {loadingStories && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {activeUserId !== null && activeUserStories.length > 0 && (
        <StoryViewer
          stories={activeUserStories}
          initialIndex={0}
          onClose={() => { setActiveUserId(null); setActiveUserStories([]); }}
        />
      )}
    </>
  );
};





const RightSidebar = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>({
    username: "User",
    name: "User",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const username = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || payload.name || payload.unique_name || "User";
        setCurrentUser({ username, name: username });
      } catch (e) {
        console.error("Ошибка расшифровки токена", e);
      }
    }
  }, []);

  return (
    <div className="w-[320px] hidden lg:block sticky top-8 text-sm mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push(`/${currentUser.username}`)}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" alt="Profile" className="w-[44px] h-[44px] rounded-full object-cover" />
          <div className="flex flex-col">
            <span className="font-semibold text-black hover:underline transition">{currentUser.username}</span>
            <span className="text-gray-500 text-sm">{currentUser.name}</span>
          </div>
        </div>
        <button className="text-blue-500 text-xs font-semibold hover:text-blue-900 transition">Переключиться</button>
      </div>

      <div className="flex items-center justify-between font-semibold mb-4">
        <span className="text-gray-500 font-semibold text-sm">Рекомендации для вас</span>
        <button className="text-black text-xs hover:text-gray-500 transition">Все</button>
      </div>

      <div className="flex flex-col gap-4">
        {mockSuggestions.map(user => (
          <div key={user.id} className="flex items-center justify-between">
             <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push(`/${user.username}`)}>
               <img src={user.avatar} alt={user.username} className="w-[44px] h-[44px] rounded-full object-cover" />
               <div className="flex flex-col">
                 <span className="font-semibold text-black hover:underline transition text-sm">{user.username}</span>
                 <span className="text-gray-500 text-[12px] truncate max-w-[170px]">{user.description}</span>
               </div>
             </div>
             <button className="text-blue-500 text-xs font-semibold hover:text-blue-900 transition">Подписаться</button>
          </div>
        ))}
      </div>

      <div className="mt-10 text-[12px] text-gray-400 font-normal space-y-4">
        <p className="leading-snug">
          Информация · Помощь · Пресса · API · Вакансии · <br/>
          Конфиденциальность · Условия · Места · Язык · <br/>
          Meta Verified
        </p>
        <p className="uppercase">© 2026 INSTAGRAM FROM META</p>
      </div>
    </div>
  );
};

const PostItem = ({ post }: { post: any }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const likePost = useMutation({
    mutationFn: async (postId: number) => {
      await axiosRequest.post(`${api}/Post/like-post?postId=${postId}`);
    },
    onSuccess: (_, postId) => {
      queryClient.setQueryData(["getPosts"], (oldData: any) => {
        return oldData.map((post: any) => {
          if (post.postId === postId) {
            return {
              ...post,
              postLike: !post.postLike,
              postLikeCount: post.postLike
                ? post.postLikeCount - 1
                : post.postLikeCount + 1,
            };
          }
          return post;
        });
      });
    },
  });

  const toggleFavorite = useMutation({
    mutationFn: async (postId: number) => {
      await axiosRequest.post(`${api}/Post/add-post-favorite`, { postId });
    },
    onSuccess: (_, postId) => {
      queryClient.setQueryData(["getPosts"], (oldData: any) => {
        return oldData.map((post: any) => {
          if (post.postId === postId) {
            return {
              ...post,
              postFavorite: !post.postFavorite,
            };
          }
          return post;
        });
      });
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: number) => {
      await axiosRequest.delete(`${api}/Post/delete-comment?commentId=${commentId}`);
      return commentId;
    },
    onSuccess: (deletedCommentId) => {
      queryClient.setQueryData(["getPosts"], (oldData: any) => {
        return oldData.map((p: any) => {
          if (p.postId === post.postId) {
            return {
              ...p,
              commentCount: Math.max(0, p.commentCount - 1),
              comments: p.comments?.filter((c: any) => (c.postCommentId || c.commentId || c.id) !== deletedCommentId) || [],
            };
          }
          return p;
        });
      });
    },
  });

  const addComment = useMutation({
    mutationFn: async (formData: { comment: string; postId: number }) => {
      await axiosRequest.post(`${api}/Post/add-comment`, formData);
      return formData;
    },
    onSuccess: (newComment) => {
      queryClient.setQueryData(["getPosts"], (oldData: any) => {
        return oldData.map((post: any) => {
          if (post.postId === newComment.postId) {
            return {
              ...post,
              commentCount: post.commentCount + 1,
              comments: [
                {
                  userName: "You",
                  comment: newComment.comment,
                },
                ...(post.comments || []),
              ],
            };
          }
          return post;
        });
      });
    },
  });

  const hasImage = post.images && post.images.length > 0;
  const postImageFullUrl = hasImage ? getFullImageUrl(post.images[0]) : null;
  const userAvatarFullUrl = getFullImageUrl(post.userImage) || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";

  return (
    <div className="bg-white w-full max-w-[470px] mb-3 mx-auto flex flex-col text-sm text-[#262626]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-1 py-3">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push(`/${post.userName}`)}>
          <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-tr from-[#FEDA75] via-[#FA7E1E] via-[#D62976] via-[#962FBF] to-[#4F5BD5] p-[3px]">
            <div className="bg-white p-[2px] rounded-full w-full h-full">
              <img src={userAvatarFullUrl} alt="avatar" className="rounded-full w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[13px] hover:underline transition">{post.userName}</span>
            <span className="text-[#8e8e8e] text-[13px] font-normal">• 1h</span>
          </div>
        </div>
        <MoreHorizontal className="w-6 h-6 cursor-pointer text-[#262626] hover:text-[#8e8e8e] transition" />
      </div>

      {/* ── Media ── */}
      {hasImage && postImageFullUrl ? (
        <div className="w-full border border-[#efefef] rounded-[4px] overflow-hidden bg-black flex items-center justify-center aspect-square">
          {(() => {
            const mediaFile = post.images[0];
            const isVideoFile = typeof mediaFile === 'string' && mediaFile.match(/\.(mp4|mov|avi|webm|mkv)$|video/i);
            return isVideoFile ? (
              <video 
                src={postImageFullUrl} 
                className="w-full h-full object-contain" 
                controls 
                autoPlay 
                muted 
                loop 
              />
            ) : (
              <img src={postImageFullUrl} alt="Post content" className="w-full h-full object-cover" />
            );
          })()}
        </div>
      ) : (
        <div className="bg-[#fafafa] w-full aspect-square flex flex-col items-center justify-center p-6 border border-[#efefef] rounded-[4px] text-center">
          <h2 className="text-lg font-bold text-[#262626] break-words w-full">{post.title}</h2>
          <p className="mt-3 text-[#8e8e8e] break-words w-full text-sm">{post.content}</p>
        </div>
      )}

      {/* ── Action Buttons ── */}
      <div className="flex justify-between items-center pt-3 pb-1 px-1">
        <div className="flex gap-4 items-center">
          <button onClick={() => likePost.mutate(post.postId)} disabled={likePost.isPending} className="hover:opacity-50 transition">
            <Heart className={`w-[24px] h-[24px] transition-colors ${post.postLike ? "fill-[#ed4956] text-[#ed4956]" : "text-[#262626]"}`} />
          </button>
          <button onClick={() => setIsModalOpen(true)} className="hover:opacity-50 transition">
            <MessageCircle className="w-[24px] h-[24px] text-[#262626]" />
          </button>
          <button className="hover:opacity-50 transition">
            <Send className="w-[24px] h-[24px] text-[#262626]" />
          </button>
        </div>
        <button onClick={() => toggleFavorite.mutate(post.postId)} className="hover:opacity-50 transition">
          <Bookmark className={`w-[24px] h-[24px] transition-colors ${post.postFavorite ? "fill-[#262626] text-[#262626]" : "text-[#262626]"}`} />
        </button>
      </div>

      {/* ── Likes ── */}
      <div className="px-1 pt-1 pb-1">
        <span className="font-semibold text-[14px]">{post.postLikeCount || 0} likes</span>
      </div>

      {/* ── Caption ── */}
      <div className="px-1 pb-1">
        <span className="font-semibold text-[14px] mr-1 cursor-pointer hover:underline" onClick={() => router.push(`/${post.userName}`)}>{post.userName}</span>
        <span className="text-[14px]">{post.content}</span>
      </div>

      {/* ── View Comments ── */}
      {post.commentCount > 0 && (
        <div className="px-1 pb-1">
          <button onClick={() => setIsModalOpen(true)} className="text-[#8e8e8e] text-[14px] hover:text-[#8e8e8e]/70 transition">
            View all {post.commentCount} comments
          </button>
        </div>
      )}

      {/* ── Last Comment Preview ── */}
      {post.comments && post.comments.length > 0 && (
        <div className="px-1 pb-1.5">
          <span className="font-semibold text-[14px] mr-1 cursor-pointer hover:underline" onClick={() => router.push(`/${post.comments[0].userName}`)}>{post.comments[0].userName}</span>
          <span className="text-[14px]">{post.comments[0].comment}</span>
        </div>
      )}

      {/* ── Comment Input ── */}
      <div className="flex items-center px-1 py-3 border-b border-[#efefef]">
        <Smile className="w-[24px] h-[24px] text-[#8e8e8e] mr-3 cursor-pointer hover:text-[#262626] transition" />
        <input
          type="text"
          className="flex-1 text-[14px] outline-none bg-transparent placeholder-[#8e8e8e] text-[#262626]"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && commentText.trim()) {
              addComment.mutate({ comment: commentText, postId: post.postId });
              setCommentText("");
            }
          }}
        />
        {commentText.trim() && (
          <button
            className="text-[#0095f6] font-semibold text-[14px] ml-2 hover:text-[#00376b] disabled:opacity-40 transition"
            disabled={addComment.isPending}
            onClick={() => {
              if (commentText.trim()) {
                addComment.mutate({ comment: commentText, postId: post.postId });
                setCommentText("");
              }
            }}
          >
            Post
          </button>
        )}
      </div>

      {/* ── Comments Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/65 z-[100] flex items-center justify-center p-4 sm:p-10 cursor-default" onClick={() => setIsModalOpen(false)}>
          <button className="absolute top-4 right-4 text-white hover:opacity-70 z-[110]" onClick={() => setIsModalOpen(false)}>
            <X className="w-7 h-7" />
          </button>
          
          <div 
            className="bg-white max-w-[1100px] w-full h-full max-h-[90vh] rounded-[4px] flex flex-col md:flex-row overflow-hidden shadow-2xl" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex-1 bg-black flex items-center justify-center max-h-[50vh] md:max-h-full min-h-[30vh] overflow-hidden">
              {hasImage && postImageFullUrl ? (
                (() => {
                  const mediaFile = post.images[0];
                  const isVideoFile = typeof mediaFile === 'string' && mediaFile.match(/\.(mp4|mov|avi|webm|mkv)$|video/i);
                  return isVideoFile ? (
                    <video 
                      src={postImageFullUrl} 
                      className="w-full h-full object-contain" 
                      controls 
                      autoPlay 
                      muted 
                      loop 
                    />
                  ) : (
                    <img src={postImageFullUrl} className="w-full h-full object-contain" alt="Modal Post" />
                  );
                })()
              ) : (
                <div className="bg-[#fafafa] w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#262626]">
                  <h2 className="text-xl font-bold break-words w-full">{post.title}</h2>
                  <p className="mt-4 text-[#8e8e8e] break-words w-full">{post.content}</p>
                </div>
              )}
            </div>

            <div className="w-full md:w-[405px] flex flex-col h-[50vh] md:h-full bg-white shrink-0 border-l border-[#efefef]">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#efefef] shrink-0">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push(`/${post.userName}`)}>
                   <img src={userAvatarFullUrl} className="w-8 h-8 rounded-full object-cover" alt="Avatar" />
                   <span className="font-semibold text-[14px] hover:underline">{post.userName}</span>
                </div>
                <MoreHorizontal className="w-6 h-6 cursor-pointer text-[#262626]" />
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 text-[14px] space-y-4">
                 {post.content && (
                    <div className="flex gap-3">
                       <img 
                          src={userAvatarFullUrl} 
                          className="w-8 h-8 rounded-full shrink-0 object-cover cursor-pointer" 
                          alt="Avatar" 
                          onClick={() => router.push(`/${post.userName}`)}
                        />
                       <div className="flex flex-col">
                          <div>
                            <span className="font-semibold mr-1.5 cursor-pointer hover:underline" onClick={() => router.push(`/${post.userName}`)}>{post.userName}</span>
                            <span>{post.content}</span>
                          </div>
                          <span className="text-[12px] text-[#8e8e8e] mt-2">1h</span>
                       </div>
                    </div>
                 )}

                 {post.comments?.map((comment: any, idx: number) => {
                    const cAvatar = getFullImageUrl(comment.userImage) || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
                    const commentId = comment.postCommentId || comment.commentId || comment.id;
                    return (
                      <div key={commentId || idx} className="flex gap-3 group px-2 py-1 -mx-2 hover:bg-gray-50 rounded transition-colors">
                         <img 
                            src={cAvatar} 
                            className="w-8 h-8 rounded-full shrink-0 object-cover cursor-pointer" 
                            alt="Avatar" 
                            onClick={() => router.push(`/${comment.userName}`)}
                          />
                         <div className="flex flex-col flex-1">
                            <div>
                              <span className="font-semibold mr-1.5 cursor-pointer hover:underline" onClick={() => router.push(`/${comment.userName}`)}>{comment.userName}</span>
                              <span>{comment.comment}</span>
                            </div>
                            <div className="flex gap-3 mt-2 text-[12px] text-[#8e8e8e] items-center">
                               <span>1w</span>
                               <button className="font-semibold">Reply</button>
                               {commentId && (
                                 <button 
                                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 hover:text-[#ed4956] font-semibold flex items-center gap-1"
                                    onClick={() => deleteComment.mutate(commentId)}
                                    disabled={deleteComment.isPending}
                                 >
                                    <Trash2 className="w-3 h-3" />
                                 </button>
                               )}
                            </div>
                         </div>
                         <Heart className="w-3 h-3 mt-2 text-[#8e8e8e] ml-auto cursor-pointer flex-shrink-0 hover:text-[#ed4956]" />
                      </div>
                    );
                 })}
              </div>

              <div className="border-t border-[#efefef] shrink-0">
                 <div className="flex justify-between items-center px-4 pt-3 pb-2">
                    <div className="flex gap-4">
                       <button onClick={() => likePost.mutate(post.postId)} disabled={likePost.isPending}>
                          <Heart className={`w-[24px] h-[24px] transition-colors ${post.postLike ? 'fill-[#ed4956] text-[#ed4956]' : 'text-[#262626] hover:text-[#8e8e8e]'}`} />
                       </button>
                       <button onClick={() => document.getElementById(`modal-comment-input-${post.postId}`)?.focus()}>
                          <MessageCircle className="w-[24px] h-[24px] text-[#262626] hover:text-[#8e8e8e] transition" />
                       </button>
                       <button>
                          <Send className="w-[24px] h-[24px] text-[#262626] hover:text-[#8e8e8e] transition" />
                       </button>
                    </div>
                    <button onClick={() => toggleFavorite.mutate(post.postId)}>
                       <Bookmark className={`w-[24px] h-[24px] transition-colors ${post.postFavorite ? 'fill-[#262626]' : 'text-[#262626] hover:text-[#8e8e8e]'}`} />
                    </button>
                 </div>
                 <div className="px-4 pb-2 font-semibold text-[14px]">
                    {post.postLikeCount || 0} likes
                 </div>
                 
                 <div className="flex items-center px-4 py-2.5 border-t border-[#efefef]">
                    <Smile className="w-[24px] h-[24px] text-[#8e8e8e] mr-3 cursor-pointer" />
                    <input
                       id={`modal-comment-input-${post.postId}`}
                       type="text"
                       className="flex-1 text-[14px] outline-none bg-transparent placeholder-[#8e8e8e] text-[#262626]"
                       placeholder="Add a comment..."
                       value={commentText}
                       onChange={(e) => setCommentText(e.target.value)}
                       onKeyDown={(e) => {
                         if (e.key === "Enter" && commentText.trim()) {
                           addComment.mutate({ comment: commentText, postId: post.postId });
                           setCommentText("");
                         }
                       }}
                    />
                    <button
                       className="text-[#0095f6] font-semibold text-[14px] ml-2 disabled:opacity-30 hover:text-[#00376b] transition"
                       disabled={!commentText.trim() || addComment.isPending}
                       onClick={() => {
                         if (commentText.trim()) {
                           addComment.mutate({ comment: commentText, postId: post.postId });
                           setCommentText("");
                         }
                       }}
                    >
                       Post
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HomePage = () => {
  const { isPending, error, data: posts } = useQuery({
    queryKey: ["getPosts"],
    queryFn: async () => {
      const { data } = await axiosRequest.get(`${api}/Post/get-posts`);
      return Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[850px] mx-auto flex justify-center gap-8 pl-4 pr-12">
        {/* Main Feed Column */}
        <div className="w-full flex flex-col flex-1 max-w-[470px]">
          <StorySection />
          
          <div className="flex flex-col items-center">
            {isPending && <p className="text-center mt-10">Загрузка постов...</p>}
            {error && <p className="text-center text-red-500 mt-10">Ошибка при загрузке постов</p>}

            {posts?.map((post: any) => (
              <PostItem key={post.postId} post={post} />
            ))}
          </div>
        </div>

        <div className="w-[320px] shrink-0 pt-2 border-l border-transparent">
           <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;











