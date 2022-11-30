import { useEffect, useState, Fragment } from "react";
import { FaCommentsDollar, FaPlus } from "react-icons/fa";

import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  createStyles,
  useMantineTheme,
  Group,
  Center,
  Stack,
  Input,
  Button,
  Checkbox,
  Title
} from "@mantine/core";
const multer = require("multer");


export default function HomePage() {
  // toDo: an array of tasks that need to be done; setToDo: a function that allows you to modify the task variable.

  const [tasks, setTasks] = useState([]);
  const [selectedFile, setSelectedFile] = useState();

  useEffect(() => {

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + window.localStorage.getItem("token"));

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://localhost:5001/todo/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const temp = [];
        for (let i = 0; i < result.length; i++) {
          temp[i] = {
            name: result[i].todo,
            finished: false,
            uid: result[i].uid
          };
        }
        setTasks(temp);
      })
      .catch((error) => console.log("error", error));
  }, []);

  // useEffect(() => {
  //   console.log(tasks);
  // }, [tasks]);

  // taskName: a string of the name of task that you want to add; setToDo: a function that allows you to edit the taskName
  const [taskName, setTaskName] = useState("");

  // addTask: adds a task to toDo by adding the taskName
  function addTask() {
    console.log("addTask function called");
    // makes sure that taskName is not blank
    if (taskName) {
      // makes sure that taskName is a new task
      if (tasks.includes(taskName)) {
        alert("Task already exists");
      } else {
        console.log("creating task");
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + window.localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "todo": taskName
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch("http://localhost:5001/todo/", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log("result", result);
            setTasks(
              tasks.concat({
                name: taskName,
                completed: false,
                uid: result.uid
              })
            );
          })
          .catch((error) => console.log("error", error));
      }
      setTaskName("");
    }
  }

  // function addTaskByName(name) {
  //   console.log("adding");
  //   console.log(name);
  //   // makes sure that name is not blank
  //   if (name) {
  //     // makes sure that name is a new task
  //     if (tasks.includes(name)) {
  //       alert("Task already exists");
  //     } else {
  //       var myHeaders = new Headers();
  //       myHeaders.append("Authorization", "Bearer " + window.localStorage.getItem("token"));
  //       myHeaders.append("Content-Type", "application/json");

  //       var raw = JSON.stringify({
  //         "todo": name
  //       });

  //       var requestOptions = {
  //         method: 'POST',
  //         headers: myHeaders,
  //         body: raw,
  //         redirect: 'follow'
  //       };

  //       fetch("http://localhost:5001/todo/", requestOptions)
  //         .then((response) => response.json())
  //         .then((result) => {
  //           setTasks(
  //             tasks.concat({
  //               name: name,
  //               completed: false,
  //               uid: result.uid
  //             })
  //           );
  //         })
  //         .catch((error) => console.log("error", error));
  //     }
  //     setTaskName("");
  //   }
  // }

  function addTaskToServer(name) {
    var myHeaders = new Headers();
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + window.localStorage.getItem("token"));
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "todo": name
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:5001/todo/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const newTasks = tasks.map((task) => {
          if (task.name === name) {
            task.uid = result.uid;
          }
          return task;
        });
        setTasks(newTasks);
      })
      .catch((error) => console.log("error", error));
  }

  async function addTaskToServer(name, tasksTemp) {
    var myHeaders = new Headers();
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + window.localStorage.getItem("token"));
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "todo": name
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:5001/todo/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        tasksTemp = tasksTemp.map((task) => {
          if (task.name === name) {
            task.uid = result.uid;
          }
          return task;
        });
      })
      .catch((error) => console.log("error", error));
  }

  function removeTaskFromServer(taskUID) {

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + window.localStorage.getItem("token"));
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "uid": taskUID
    });

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:5001/todo/", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }

  function updateTask(name) {
    const newTasks = tasks.map((task) => {
      if (task.name === name) {
        task.finished = !task.finished;
        if (task.finished) {
          removeTaskFromServer(task.uid);
        } else {
          console.log(addTaskToServer(task.name));
        }
      }
      return task;
    });
    setTasks(newTasks);
  }

  function getSummary() {
    let unfinishedTasks = 0;
    tasks.forEach((task) => {
      if (task.completed === false) {
        unfinishedTasks += 1;
      }
    });
    if (unfinishedTasks === 1) {
      return <Title order={2}>You have 1 unfinished task</Title>;
    } else if (unfinishedTasks >= 1) {
      return (
        <Title order={2}>You have {unfinishedTasks} tasks left to do</Title>
      );
    }
  }

  function exportTasks() {
    let a = document.createElement('a');
    const fileData = JSON.stringify({ tasks: tasks });
    const blob = new Blob([fileData], { fileData: "text/plain" });
    console.log(blob);
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = 'tasks.json';
    a.click();
    // img.click();
    // console.log(tasks)
  }

  function importTasks(selectedFile) {
    let fileReader = new FileReader();

    fileReader.onloadend = (e) => {
      console.log('start');
      const content = JSON.parse(fileReader.result);
      let tasksTemp = tasks;
      let i = 0
      content.tasks.forEach(e => {
        // addTaskByName(e.name);
        const name = e.name;
        console.log(name);
        if (name && !tasks.includes(name.toString())) {
          tasksTemp = tasksTemp.concat([{
            name: name,
            completed: false
          }]);
          // console.log(tasksTemp);
          // addTaskToServer(name);
        }
      });
      // console.log(tasksTemp);
      content.tasks.forEach(e => {
        const name = e.name;
        if (name && !tasks.includes(name.toString())) {
          addTaskToServer(name, tasksTemp)
            .then(() => {
              setTasks(tasksTemp);
            })
        }
      });


    };

    fileReader.readAsText(selectedFile);

    setSelectedFile(null);
  }

  useEffect(() => {
    console.log(tasks);
  })

  return (
    <Stack align="center" justify="center" p="xl">
      {getSummary}
      <Group>
        <Input
          value={taskName}
          placeholder="Type your task here"
          onChange={(event) => setTaskName(event.target.value)}
        ></Input>
        <Button rightIcon={<FaPlus />} onClick={() => addTask()}>
          Add
        </Button>
      </Group>
      <Stack>
        {tasks.map((task, index) => (
          <Checkbox
            checked={task.finished}
            key={task.name}
            index={index}
            label={task.name}
            onChange={(event) => updateTask(task.name)}
          ></Checkbox>
        ))}
      </Stack>

      <Group>
        <Button onClick={() => exportTasks()}>
          Export
        </Button>
        <input type="file" name="file" onChange={() => setSelectedFile(event.target.files[0])} />
        <Button onClick={() => importTasks(selectedFile)}>Import</Button>
      </Group >
    </Stack >
  );
}
