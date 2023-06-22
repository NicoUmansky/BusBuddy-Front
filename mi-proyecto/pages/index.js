import React from 'react';
import { useRouter } from 'next/router';
import SignUpForm from '../components/SignUpForm';

const HomePage = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };
  return (

    <div>
      <SignUpForm />
      <p>
        {response}
        ¿Ya tenés una cuenta?{' '}
        <a onClick={handleLogin} style={{ cursor: 'pointer' }}>
          Iniciar sesión
        </a>
      </p>
    </div>
  );
};

export default HomePage;
