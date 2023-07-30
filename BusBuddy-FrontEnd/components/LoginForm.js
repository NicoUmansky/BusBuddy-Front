import { useRouter } from "next/router";
import { useRef, useState } from 'react'
import styles from './LoginForm.module.css';


export default function Login() {
  const router = useRouter();
  const emailInput = useRef();
  const passwordInput = useRef();
  const [error, setError] = useState('');


  const handleError = (e) => {
    setError(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = emailInput.current.value;
    const password = passwordInput.current.value;

    const response = await fetch("http://localhost:3001/FindUser", {
      method: "POST",
            body: JSON.stringify({
              email: email,
              password: password
            }),
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json"
            }
          })
          .then(response => response.json())
          .then(response => {
            if(response == null){
           handleError('Usuario o contraseña incorrectos');

            }
            else{
              alert("Usuario logueado");
            } 
          });

  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h2 className={styles.title}><b>Iniciar Sesión</b></h2>
      <input
        type="email"
        placeholder="Correo electrónico"
        
        ref={emailInput}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Contraseña"
        ref={passwordInput}
        className={styles.input}
      />
      <p className={styles.error}>{error}</p>
      <button type="submit" className={styles.button}><b>Iniciar sesión</b> 
      </button>
      <p className={styles.text}>
        ¿No tenés una cuenta?</p>
      <a href="./signup" className={styles.lblRegistrate}><b>Registrate</b></a>
    </form>
  );
}