import React, { useState } from 'react';
import styles from './LoginForm.module.css';

const LoginForm = () => {
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
    // Handle login logic here
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h2 className={styles.title}>Iniciar Sesión</h2>
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
      <button type="submit" className={styles.button}>Iniciar sesión</button>

      <p classname={styles.text}>
        ¿No tenés una cuenta? 
          <a href="./signup"><b>Registrate</b></a>
      </p>
    </form>
      
  );
};

export default LoginForm;
