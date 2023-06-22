import React, { useState } from 'react';
import styles from './SignUpForm.module.css';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign-up logic here
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h2 className={styles.title}>Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        className={styles.input}
      />
      <button type="submit" className={styles.button}>Sign Up</button>
      <p>¿Ya tiene una cuenta? <a href="./login"><b>Inicie sesión</b></a></p>
    </form>
  );
  
};


export default SignUpForm;
