import React from 'react';
// import LoginForm from '../components/LoginForm';
import styles from '../components/LoginForm.module.css';
import AlertaChofer from '../llamadaColectivo/alertaChofer';
  

const mainPage = () => {
  return (
    <>
    <div className={styles.DivGral}> 
      <AlertaChofer />
    </div>
    </>
  );
};

export default mainPage;