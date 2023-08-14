import React from 'react';
// import LoginForm from '../components/LoginForm';
import styles from '../components/LoginForm.module.css';
// import AlertaChofer from '../llamadaColectivo/alertaChofer';
import PantallaPrincipal from '../llamadaColectivo/pantallaPrincipal';
  

const mainPage = () => {
  return (
    <>
    <div className={styles.DivGral}> 
      <PantallaPrincipal/>
    </div>
    </>
  );
};

export default mainPage;