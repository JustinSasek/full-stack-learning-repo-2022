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

export default function HomePage() {
  // toDo: an array of tasks that need to be done; setToDo: a function that allows you to modify the task variable.

  const [tasks, setTasks] = useState([]);

  useEffect(() => {

    console.log("fetching items")
    var requestOptions = {
      method: 'GET',
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
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          todo: taskName
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch("http://localhost:5001/todo", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
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

  function addTaskToServer(name) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    console.log("creating task");
    var raw = JSON.stringify({
      todo: name
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:5001/todo", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
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

  function removeTaskFromServer(taskUID) {

    console.log("deleting task");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      uid: taskUID
    });

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:5001/todo", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }

  function updateTask(name) {
    const newTasks = tasks.map((task) => {
      if (task.name === name) {
        console.log(name)
        task.finished = !task.finished;
        if (task.finished) {
          console.log("finished")
          removeTaskFromServer(task.uid);
        } else {
          // console.log("return");
          // console.log(addTaskToServer(task.name));
        }
      }
      return task;
    });
    setTasks(newTasks);
  }

  function getSummary() {
    console.log("updated");
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
    </Stack>
  );
}
