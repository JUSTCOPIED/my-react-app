import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState('A')

  return (
    <>

    <h1>Vansh Project  </h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 'B')}>
          count is {count}
        </button>
  
      </div>
    </>
  )
}

export default App
