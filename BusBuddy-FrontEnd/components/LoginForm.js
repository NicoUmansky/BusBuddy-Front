import React, { useState } from 'react';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const findUser = fetch("http://localhost:3001/FindUser", {
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
      .then(response => console.log(response))
      .then(response => { window.location.href = '/mainPage';
      });
    };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h2 className={styles.title}>Iniciar Sesión</h2>
      <input
        type="email"
        placeholder="Correo electrónico"
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
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.button}>
        Iniciar sesión
      </button>
      <p className={styles.text}>
        ¿No tienes una cuenta? <a href="./signup"><b>Regístrate</b></a>
      </p>
    </form>
  );
};

export default LoginForm;
