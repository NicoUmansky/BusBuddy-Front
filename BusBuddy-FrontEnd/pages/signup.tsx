import React from "react";
import SignUpForm from "../components/SignUpForm";
import styles from "../components/SignUpForm.module.css";

import { useEffect } from "react";

const SignUpPage = () => {
  useEffect(() => {
    fetch("http://localhost:3001/lineas", { mode: "cors" })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className={styles.DivGral}>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
