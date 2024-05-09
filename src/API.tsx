export const fetchData = async () => {
    try {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos")
    if (res.ok) {
      const data = await res.json()
      return data
    }
    else {
      return null
    }
  } catch (error) {
    return null
  }
}

