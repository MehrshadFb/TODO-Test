import { useEffect, useState } from 'react'

import './App.css'
import { ClipLoader } from 'react-spinners';

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
      // make a copy of previous state and save it in copiedList.
      const copiedList = JSON.parse(JSON.stringify(prev));
      copiedList[index][key] = e.target.value
      return copiedList
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
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(res => res.json())
      .then(res => setList(res.slice(0,10)))
      .catch(err => console.log(err))
    // setting timeout for a 5 seconds to fetch data
    setLoading(true)
    setTimeout(() => {
    setLoading(false)
    },5000)
  }, [])


  

  return (
    <>
    <h1>To-Do List</h1>
    {
      loading?
      <ClipLoader color="red" loading={loading} size={50}/>
      :
      <div>
      <input value={task} onChange={(e) => setTask(e.target.value)}></input>
      <button onClick={handleAdd}>Add</button>
      <button onClick={() =>setEditMode((prev) => !prev)}>Edit</button>
      <ul>
        {list.map((item, index) => <li key={index}>
          {editMode ? (<input value={item.title} onChange={(e) => handleChange(e, index, 'title')}/>) : (<span>{item.title} <button onClick={()=>handleDelete(index)}>Delete</button></span>)}
          </li>)}
      </ul>
    </div>
    }
    
    </>
  )
}

export default App
