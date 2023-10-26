import React from "react";
import SignUpForm from "../components/SignUpForm";
import styles from "../components/SignUpForm.module.css";

import { useEffect } from "react";

const SignUpPage = () => {

  return (
    <div className={styles.DivGral}>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
