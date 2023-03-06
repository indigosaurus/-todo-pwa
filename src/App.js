import React, { useEffect, useState } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { nanoid } from "nanoid";

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};
const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  //geoFindMe
  function geoFindMe() {
    console.log("geoFindMe", lastInsertedId);
    function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      //mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
      console.log(`Latitude: ${latitude}°, Longitude: ${longitude}°`);
      locateTask(lastInsertedId, {latitude: latitude, longitude: longitude, error: ""});
      }
      function error() {
        console.log('Unable to retrieve your location');
      }
      if(!navigator.geolocation) {
        console.log('Geolocation is not supported by your browser');
      } else {
        console.log('Locating...');
        navigator.geolocation.getCurrentPosition(success, error);
      }
  }

  const [tasks, setTasks] = useState('tasks',[]); //useState(props.tasks);
  const [filter, setFilter] = useState('All');
  const [lastInsertedId, setLastInsertedId] = useState('');

 //toggleTaskCompleted
  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
    localStorage.setItem('tasks',JSON.stringify(updatedTasks));
  }
  //deleteTask
  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
    localStorage.setItem('tasks',JSON.stringify(remainingTasks));
  }
  //editTask
  function editTask(id, newName) {
    console.log("editTask before");
    console.log(tasks);
    const editedTaskList = tasks.map(task => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        //
        return { ...task, name: newName };
      }
      return task;
    });
    setTasks(editedTaskList); 
    localStorage.setItem('tasks',JSON.stringify(editedTaskList));
  }
  //locateTask
  function locateTask(id, location) {
    console.log("locate Task", id, " before");
    console.log(location, tasks);
    const locatedTaskList = tasks.map(task => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        return {...task, location: location}
      }
      return task;
    });
  console.log(locatedTaskList);
  setTasks(locatedTaskList);
  }
 //TODO
  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        latitude={task.location.latitude}
        longitude={task.location.longitude}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));
  //filter 
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));
 //addTask
  function addTask(name) {
    const id = "todo-" + nanoid();
    const newTask = { id: id, name: name, completed: false, location: {latitude:"##", longitude:"##", error:"##"} };
    setLastInsertedId(id);
    setTasks([...tasks, newTask]);
    // const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    // setTasks([...tasks, newTask]);
    // localStorage.setItem('tasks',JSON.stringify(newTask));
  }
  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;
 //html to return
  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} geoFindMe={geoFindMe}/>
      <div className="filters btn-group stack-exception">
        {filterList}
        </div>
      <h2 id="list-heading" tabIndex="-1" >{headingText}</h2>
      <li
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </li>
    </div>
  );
}

export default App;
