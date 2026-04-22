const UserProfilePage = ({ params }: { params: { username: string } }) => {
  return (
    <div>
      <h1>Profile Page for {params.username}</h1>
    </div>
  );
};

export default UserProfilePage;
