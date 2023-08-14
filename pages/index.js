import React from 'react';
import { useRouter } from 'next/router';
import SignUpForm from '../components/SignUpForm';
import "../components/SignUpForm.module.css"

const HomePage = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };
  return (

    <div>
      <SignUpForm />
    </div>
  );
};

export default HomePage;
