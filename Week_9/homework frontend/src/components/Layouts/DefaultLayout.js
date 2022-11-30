import React, { useContext, useEffect, useState } from "react";
import {
  AppShell,
  Header,
  createStyles,
  Group,
  Title,
  Button
} from "@mantine/core";
import { Outlet, Navigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import img from './Default.jpeg'

const headerHeight = 80;

// create Styles: define classes and their properties in JS object, can be applied within components
const useStyles = createStyles((theme, _params, getRef) => {
  return {
    appShellMain: {
      minHeight: `calc(100vh - ${headerHeight}px)`,
      display: "flex",
      flexDirection: "column",
      marginTop: `${headerHeight}px`
    },
    header: {
      backgroundColor: theme.primaryColor
    },
    headerGroup: {
      height: "100%",
      display: "flex",
      alignItems: "center",
      margin: 0,
      color: theme.primaryColor
    }
  };
});

export default function DefaultLayout() {
  const { classes } = useStyles();
  const auth = useContext(AuthContext);
  const username = window.localStorage.getItem("username");
  const [uploadShowing, setUploadShowing] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const submit = (selectedFile) => {
    console.log(selectedFile);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + window.localStorage.getItem("token"));

    var formdata = new FormData();
    formdata.append("pic", selectedFile, username + ".jpg");

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch("http://localhost:5001/pic/", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
    setUploadShowing(false)
    setSelectedFile(null);
  }
  const changeHandler = (event) => {
    console.log("change handler called")
    console.log(event.target.files[0])
    setSelectedFile(event.target.files[0]);
    // console.log("2")
    setIsSelected(true);
    // console.log("3")
  };
  const HeaderContent = (
    <Group className={classes.headerGroup} position="apart">
      <Group>
        <img src={img} height="50px" onClick={() => { setUploadShowing(!uploadShowing)}} />
        {uploadShowing && <Group>
          <input type="file" name="file" onChange={() => setSelectedFile(event.target.files[0]) }/>
          <button onClick={() => submit(selectedFile)}>Submit</button>
        </Group>}
        <Title>{username}'s Todo App</Title>
      </Group>
      <Group >
        <Button variant="light" color="red" onClick={() => auth.logout()}>
          Logout
        </Button>
      </Group>
    </Group>
  );

  return (
    <AppShell
      header={
        <Header className={classes.header} height={headerHeight} p="md" fixed>
          {HeaderContent}
        </Header>
      }
      classNames={{
        main: classes.appShellMain
      }}
    >
      {
        // sends user to login screen whenever the user is logged out
        // based off the tutorial here: https://blog.utsavkumar.tech/private-routes-in-react-router-v6
        // If logged in, navigate towards child components, else go to the login page

        // In class TODO: implement navigation
        auth.loggedIn ? <Outlet></Outlet> : <Navigate to="/login" replace />
      }
    </AppShell>
  );
}
