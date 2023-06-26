import React from 'react';
// import LoginForm from '../components/LoginForm';
import styles from '../components/LoginForm.module.css';
import AlertaChofer from '../llamadaColectivo/alertaChofer';

const LoginPage = () => {
  return (
    <>
    <div classname={styles.DivGral}> 
      <AlertaChofer />
      {/* <LoginForm /> */}
    </div>
    </>
  );
};

export default LoginPage;