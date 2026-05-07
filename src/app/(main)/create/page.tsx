"use client";

import React, { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { ImagePlus, X, ChevronLeft, MapPin, Smile, ChevronDown } from "lucide-react";
import { axiosRequest } from "../../(auth)/accounts/login/token";
import { useRouter } from "next/navigation";
import { message } from "antd";

interface PostFormValues {
  title: string;
  content: string;
  images: FileList | null;
}





const CreatePostPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Select, 2: Finalize
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { register, handleSubmit, watch, reset } = useForm<PostFormValues>({
    defaultValues: {
      title: "",
      content: "",
      images: null,
    },
  });





  const createPost = useMutation({
    mutationKey: ["add-post"],
    mutationFn: async (formData: FormData) => {
      const { data } = await axiosRequest.post("/Post/add-post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: () => {
      message.success("Пост опубликован!");
      router.push("/");
    },
    onError: (error) => {
      console.error(error);
      message.error("Ошибка при создании поста");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(Array.from(files));
    }
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(Array.from(files));
    }
  };

  const processFiles = (files: File[]) => {
    setSelectedFiles(files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
    setStep(2);
  };

  const onSubmit = (data: PostFormValues) => {
    const formData = new FormData();
    formData.append("Title", data.title || "New Post");
    formData.append("Content", data.content);
    
    selectedFiles.forEach((file) => {
      formData.append("Images", file);
    });

    createPost.mutate(formData);
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      setPreviews([]);
      setSelectedFiles([]);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-40px)] items-center justify-center p-4">
      {/* Modal Container */}
      <div className="flex h-full max-h-[800px] min-h-[400px] w-full max-w-[800px] flex-col overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5">
        
        {/* Header */}
        <div className="flex h-11 items-center justify-between border-b border-gray-200 px-4">
          <button onClick={goBack} className="p-1 hover:opacity-50 transition-opacity">
            {step === 1 ? <X size={24} /> : <ChevronLeft size={24} />}
          </button>
          <h1 className="text-base font-semibold text-[#262626]">
            {step === 1 ? "Создание публикации" : "Создать новую публикацию"}
          </h1>
          <div className="w-10 flex justify-end">
            {step === 2 && (
              <button 
                onClick={handleSubmit(onSubmit)}
                disabled={createPost.isPending}
                className="text-sm font-semibold text-[#0095f6] hover:text-[#00376b] disabled:opacity-50 transition-colors"
              >
                {createPost.isPending ? "..." : "Поделиться"}
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {step === 1 ? (
            /* Step 1: Select Files with Drag & Drop */
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-1 flex-col items-center justify-center p-10 text-center transition-colors ${isDragging ? "bg-blue-50/50" : "bg-white"}`}
            >
              <div className={`mb-4 transition-transform duration-300 ${isDragging ? "scale-110 text-[#0095f6]" : "text-[#262626]"}`}>
                <ImagePlus size={96} strokeWidth={1} />
              </div>
              <h2 className="mb-6 text-xl font-light text-[#262626]">Перетащите сюда фото и видео</h2>
              <label className="cursor-pointer rounded-lg bg-[#0095f6] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#1877f2] active:scale-95 transition-all shadow-sm">
                Выбрать на компьютере
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          ) : (
            /* Step 2: Finalize */
            <div className="flex flex-1 flex-col md:flex-row">
              {/* Preview Area */}
              <div className="flex flex-1 items-center justify-center bg-black overflow-hidden relative">
                {previews.length > 0 && (
                  selectedFiles[0]?.type.startsWith("video/") ? (
                    <video
                      src={previews[0]}
                      className="h-full w-full object-contain"
                      autoPlay
                      muted
                      loop
                      controls
                    />
                  ) : (
                    <img
                      src={previews[0]}
                      alt="Preview"
                      className="h-full w-full object-contain"
                    />
                  )
                )}
              </div>

              {/* Sidebar / Info */}
              <div className="flex w-full flex-col border-l border-gray-200 md:w-[340px]">
                {/* User Info */}
                <div className="flex items-center gap-3 p-4">
                  <div className="h-7 w-7 rounded-full bg-gray-200" />
                  <span className="text-sm font-semibold">Ваш профиль</span>
                </div>

                {/* Caption Area */}
                <div className="px-4">
                  <textarea
                    {...register("content")}
                    placeholder="Добавьте подпись..."
                    className="h-40 w-full resize-none text-sm outline-none placeholder:text-gray-400"
                  />
                </div>



                {/* Extra Options */}
                <div className="mt-4 flex flex-col border-t border-gray-100">
                  <div className="flex items-center justify-between p-4 text-gray-400">
                    <Smile size={20} />
                    <span className="text-xs">0/2200</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-t border-gray-100 p-4">
                    <span className="text-sm">Добавить место</span>
                    <MapPin size={20} className="text-gray-600" />
                  </div>

                  <div className="flex items-center justify-between border-b border-gray-100 p-4">
                    <span className="text-sm">Специальные возможности</span>
                    <ChevronDown size={20} className="text-gray-600" />
                  </div>

                  <div className="flex items-center justify-between border-b border-gray-100 p-4">
                    <span className="text-sm">Расширенные настройки</span>
                    <ChevronDown size={20} className="text-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;


