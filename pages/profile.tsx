import React from 'react';
import Profile from '../src/components/Profile';
import Header from '../src/components/Header';
import '../src/app/Profile.css'; // Add this line if there's a Profile.css file

const ProfilePage: React.FC = () => {
  return (
    <>
      <Header backgroundImage="/images/profile/profile circle.svg" logoImageName='profile/users/kadi2.jpg' showText={false} />
      <main>
        <Profile />
      </main>
    </>
  );
};

export default ProfilePage;