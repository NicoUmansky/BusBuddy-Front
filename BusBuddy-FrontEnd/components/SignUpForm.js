import React, { useState } from 'react';
import styles from './SignUpForm.module.css';

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

  const handleSubmit = (e) => {
    e.preventDefault();
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
      <p>¿Ya tenés una cuenta? <a href="./login"><b>Iniciá sesión</b></a></p>
    </form>
  );
  
};


export default SignUpForm;
