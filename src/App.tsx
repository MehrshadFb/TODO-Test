import { useEffect, useState } from 'react'
import './App.css'
import { fetchData } from "./API"


interface TODO {
  title: string,
  id: number;
}

let nextId = 0;

function App() {
  const [list, setList] = useState<TODO[]>([])
  const [task, setTask] = useState<string>('')
  const [editMode, setEditMode] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)


  // this function handles addding tasks to the list.
  // pre-condition: checks the input is not empty.
  const handleAdd = () => {
    if (task !== '') {
      const newTask: TODO = {
        title: task,
        id: nextId++,
      }
      setList([...list, newTask])
      setTask('')
    }
  }

  // this function handles renaming the title of tasks.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, key: string) => {
    setList((prev) => {
      // check the value of input for edited task is not empty
      if(e.target.value === "") {
        window.alert("set a name for your task!")
      } 
      else {
      // make a copy of previous state and save it in copiedList.
      const copiedList = JSON.parse(JSON.stringify(prev));
      copiedList[index][key] = e.target.value
      return copiedList
      }
    })
  }

  // this function handles deleting tasks from the list.
  const handleDelete = (index: number) => {
    // make a copy of previous state and save it in copiedList.
    setList((prev) => {
      const copiedList = JSON.parse(JSON.stringify(prev));
      // used splice for removing element from a list.
      copiedList.splice(index, 1);
      return copiedList
    })
  }

  // calling API and fetching data.
  useEffect(() => {
    const Fetch = async () => {
      const res = await fetchData()
      if (res != null) {
        setList(res.slice(0,10))
        setLoading(false)
      }
      else {
        setError(true)
        setLoading(false)
      }
    }
    Fetch()
  },[])


  

  return (
    <>
    <h1>To-Do List</h1>
    {
      loading?
        <p>Loading...</p>
      :
        error?
          <p>Something went wrong!</p>
        :       
        <div>
          <input placeholder='task' value={task} onChange={(e) => setTask(e.target.value)}></input>
          <button onClick={handleAdd}>Add</button>
          <button onClick={() =>setEditMode((prev) => !prev)}>Edit</button>
          <ul>
            {list.map((item, index) => <li key={index}>
              {editMode ? (<input placeholder='edit' value={item.title} onChange={(e) => handleChange(e, index, 'title')}/>) : (<span>{item.title} <button onClick={()=>handleDelete(index)}>Delete</button></span>)}
              </li>)}
          </ul>
        </div>
    }
    
    </>
  )
}

export default App
