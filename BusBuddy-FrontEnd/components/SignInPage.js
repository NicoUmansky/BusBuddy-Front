import React from 'react';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';
import alertaChofer from '../llamadaColectivo/alertaChofer';



const SignInPage = () => {
  return (
        <div>
          <SignUpForm />
          <LoginForm />
          <alertaChofer />
        </div>
      );
};

export default SignInPage;
