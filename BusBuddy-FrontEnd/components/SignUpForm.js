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
    let formData = new FormData(form);
    let data = Object.fromEntries(formData);
    let jsonData = JSON.stringify(data);
    fetch('http://localhost:3001/CreateUser',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonData
    }).then(res => res.json())
    .then(result => console.log(result.data))
    .catch(err => console.log(err))
    // Handle sign-up logic here
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
