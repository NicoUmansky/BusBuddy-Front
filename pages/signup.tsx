import React from "react";
import SignUpForm from "../components/SignUpForm";
import styles from "../components/SignUpForm.module.css";

import { useEffect } from "react";

const SignUpPage = () => {
  // useEffect(() => {
  //   fetch("http://localhost:3001/user/8", { mode: "cors" })
  //     .then((res) => res.json())
  //     .then((data) => console.log(data))
  //     .catch((err) => console.log(err));
  // }, []);

  return (
    
      <SignUpForm />
    
  )
};

export default SignUpPage;
