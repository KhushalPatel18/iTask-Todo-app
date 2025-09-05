import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import './App.css'
import { v4 as uuidv4 } from 'uuid';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function App() {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [showFinished, setshowFinished] = useState(true)

  const saveToLS = (params) => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }

  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if (todoString) {
      let todos = JSON.parse(localStorage.getItem("todos"))
      setTodos(todos)
    }
  }, [])

  const handleChange = (e) => {
    setTodo(e.target.value)
  }
  const handleAdd = () => {
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }])
    setTodo("")
    saveToLS()
  }

  const handleCheckbox = (e) => {
    let id = e.target.name
    let index = todos.findIndex(item => {
      return item.id === id
    })
    let newTodos = [...todos]
    newTodos[index].isCompleted = !newTodos[index].isCompleted
    setTodos(newTodos)
    saveToLS()
  }

  const handleEdit = (e, id) => {
    let t = todos.filter(i => i.id === id)
    setTodo(t[0].todo)
    let newTodos = todos.filter(item => {
      return item.id !== id
    })
    setTodos(newTodos)
    saveToLS()
  }

  const handleDelete = (e, id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this task?");
    if (isConfirmed) {
      let newTodos = todos.filter(item => {
        return item.id !== id
      })
      setTodos(newTodos)
    }
    saveToLS()
  }

  const toggleFinished = () => {
    setshowFinished(!showFinished)
  }


  return (
    <>
      <Navbar />

      <div className="md:container mx-3 bg-blue-100 md:mx-auto md:w-[35%] my-4 rounded-xl p-5 min-h-[80vh]">
        <h1 className='font-bold text-3xl text-center'>iTask - Manage your todos at one place</h1>
        <div className="addTodo my-5">
          <h2 className='text-2xl font-bold'>Add a Todo</h2>
          <input type="text" onChange={handleChange} value={todo} className='bg-white w-[75%] rounded-sm' />
          <button onClick={handleAdd} disabled={todo.length < 2} className='bg-blue-800 hover:bg-blue-900 text-white text-sm font-bold p-2 py-1 mx-5 rounded-md'>Save</button>
        </div>
        <input onChange={toggleFinished} type="checkbox" checked={showFinished} />Show finished
        <hr className="w-full border-t-4 border-gray-400 my-6" />


        <h2 className='text-2xl font-bold'>Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && <div className='m-5'>No tasks yet</div>}
          {todos.map(item => {
            return (showFinished || !item.isCompleted) && (
              <div key={item.id} className="todo flex w-full  justify-between my-3">
                <div className='flex gap-5'>
                  <input name={item.id} onChange={handleCheckbox} checked={item.isCompleted} type="checkbox" />
                  <div className={item.isCompleted ? "line-through " : ""}>{item.todo}</div>
                </div>
                <div className="buttons flex h-full">
                  <button onClick={(e) => handleEdit(e, item.id)} className='bg-blue-800 hover:bg-blue-900 text-white text-sm font-bold p-2 py-1 mx-2 rounded-md'><FaEdit /></button>
                  <button onClick={(e) => { handleDelete(e, item.id) }} className='bg-blue-800 hover:bg-blue-900 text-white text-sm font-bold p-2 py-1 mx-2 rounded-md'><MdDelete /></button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default App
