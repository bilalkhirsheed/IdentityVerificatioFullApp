import React from "react";
import BackButton from "../components/BackButton";

const Login: React.FC = () => {
  return (
    <div className="page">
      <BackButton />

      <h1>Login</h1>
      <p>
        Welcome to the Login page. Please enter your credentials to access your
        account.
      </p>
    </div>
  );
};

export default Login;
