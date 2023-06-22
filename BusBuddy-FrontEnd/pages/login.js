import React from 'react';
import LoginForm from '../components/LoginForm';
import styles from '../components/LoginForm.module.css';

const LoginPage = () => {
  return (
    <>
    <div classname={styles.DivGral}> 
      <LoginForm />
    </div>
    </>
  );
};

export default LoginPage;