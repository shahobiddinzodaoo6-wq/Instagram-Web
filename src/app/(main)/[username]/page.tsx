"use client";
import React from "react";
import Profile from "@/src/views/profile/ui/profile";

const UserProfilePage = ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = React.use(params);
  return <Profile username={username} />;
};

export default UserProfilePage;





