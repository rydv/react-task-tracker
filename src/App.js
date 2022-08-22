import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { useState, useEffect } from "react"


function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks,setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    
    getTasks()
  }, [])

  // Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:3000/tasks')
    const data = await res.json()

    return data
  }
  // Fetch Task
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:3000/tasks/${id}`)
    const data = await res.json()

    return data
  }

  //Togggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = { ...taskToToggle, 
    reminder: !taskToToggle.reminder}

    const res = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updTask)
    })

    const data = await res.json()

    setTasks(tasks.map((task) => 
      task.id === id ? { ...task, reminder: data.reminder} : task
    ))
  }

  // Task Delete
  const deleteTask = async (id) => {
    const res = await fetch(`http://localhost:3000/tasks/${id}`, {method: 'DELETE'})
    
    res.status === 200
     ? setTasks(tasks.filter((task) => task.id !== id))
     : alert('Error Deleting This Task')
  }


  

  // Add Task
  const addTask = async (task) => {
    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = {id, ...task}
    // setTasks([...tasks, newTask])
    const res = await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task),
    })

    const data = await res.json()

    setTasks([...tasks, data])

  }

  return (
    <Router>
    <div className="container">
      <Header 
      title='Task Tracker' 
      onAdd = {() => setShowAddTask(!showAddTask)}
      showAdd={showAddTask}/>
      
      <Routes>
      <Route path='/' 
      element = {
        <>
          {showAddTask && <AddTask onAdd={addTask}/>}
          {tasks.length > 0 ? (
            <Tasks tasks={tasks} 
              onDelete={deleteTask}
              onToggle={toggleReminder}
            />
          ) : (
            'No Tasks To Show'
          )}
        </>
      } 
        
    />
      <Route path='/about' element={<About />} />
      </Routes>
      <Footer />
    </div>
    </Router>
  );
}

export default App;
