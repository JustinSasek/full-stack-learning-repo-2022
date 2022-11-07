// based on the tutorial from https://usehooks.com/useAuth/

import { createContext, useState } from "react";
// a bug with this hook prevented me from using it 😢
// import { useLocalStorage } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

let AuthContext = createContext();

// This is what we export from this file
export default AuthContext;

// Provider hook that creates auth object and handles state
export function useProvideAuth() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(
    window.localStorage.getItem("loggedIn")
  );


  async function login(values, form) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      email: values.email,
      password: values.password
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:5001/auth/login/", requestOptions)
      .then((response) => {
        console.log(response.status);
        if (response.status !== 201) {
          throw new Error();
        }
        return response.json();
      })
      .then((response) => {
        window.localStorage.setItem("loggedIn", true);
        window.localStorage.setItem("token", response.token);
        window.localStorage.setItem("username", response.username);
        setLoggedIn(true);
        navigate("../");
      })
      .catch((e) => {
        register(values, form);
      });
  }

  function register(values, form) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      email: values.email,
      password: values.password,
      username: values.username
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:5001/auth/register/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        window.localStorage.setItem("loggedIn", true);
        window.localStorage.setItem("token", result.token);
        window.localStorage.setItem("username", result.username);
        setLoggedIn(true);
        navigate("../");
      })
      .catch((error) => {
        form.setErrors({ email: true, password: "Invalid login/registration" });
      });
  }

  function logout() {
    // In Class TODO: Implement this function
    window.localStorage.clear("loggedIn");
    setLoggedIn(false);
    console.log(loggedIn);
  }

  return {
    loggedIn,
    login,
    logout
  };
}
