import React, { useState } from 'react';
import styles from './SignUpForm.module.css';
import { Result } from 'postcss';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };


  // let form = document.querySelector("form");
  // form.addEventListener('submit', handleSubmit)

 

  function handleSubmit(e){
    e.preventDefault();
    const newUser = fetch("http://localhost:3001/CreateUser", {
      method: "POST",
      body: JSON.stringify({
        nombreapellido: "Mica Viegas",
        email: "roby@outlook.com",
        password: "1234"
      }),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(response => console.log(response)); 

  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h2 className={styles.title}>Registrarse</h2>
      <input
        type="text"
        placeholder="Nombre y Apellido"
        value={username}
        onChange={handleUsernameChange}
        className={styles.input}
      />
      <input
        type="email"
        placeholder="Mail"
        value={email}
        onChange={handleEmailChange}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={handlePasswordChange}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Repetir contraseña"
        value={password}
        onChange={handlePasswordChange}
        className={styles.input}
      />
      <button type="submit" className={styles.button}>Registrarse</button>

      <div classname={styles.title}>
        ¿Ya tenés una cuenta? 
          <a href="./login"><b> Iniciá sesión</b>
          </a>
      </div>
    </form>
  );
  
};


export default SignUpForm;
