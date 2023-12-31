import React, { useState } from 'react';
import styles from './SignUpForm.module.css';
import { useUser } from "../components/UserContext";
import { useRouter } from "next/router";

const SignUpForm = () => {
  const router = useRouter();
  const { userId, setUserId } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreapellido, setUsername] = useState('');
  const[RepeatPassword, setRepeatPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const HandleRepeatPassChange = (e) => {
    setRepeatPassword(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password == RepeatPassword){
          const newUser = fetch("https://breakable-turtleneck-shirt-foal.cyclic.app/CreateUser", {
            method: "POST",
            body: JSON.stringify({
              nombreapellido: nombreapellido,
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
          setUserId(response.id);
        })
        .then(response => {
          router.push({
            pathname: '/mainPage',
          });
         })
      }
    else{
      alert("Las contraseñas no coinciden");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h2 className={styles.title}><b>Registrarse</b></h2>
      <input
        type="text"
        placeholder="Nombre y Apellido"
        value={nombreapellido}
        onChange={handleUsernameChange}
        className={styles.input}
        required
      />
      <input
        type="email"
        placeholder="Mail"
        value={email}
        onChange={handleEmailChange}
        className={styles.input}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={handlePasswordChange}
        className={styles.input}
        required
      />
      <input
        type="password"
        placeholder="Repetir contraseña"
        value={RepeatPassword}
        onChange={HandleRepeatPassChange}
        className={styles.input}
        required
      />
      <button type="submit" className={styles.button}><b>Registrarse</b></button>

      <div className={styles.text}>
        ¿Ya tenés una cuenta?
        <a href="./login"><b> Iniciá sesión</b></a>
      </div>
    </form>
  );
};

export default SignUpForm;