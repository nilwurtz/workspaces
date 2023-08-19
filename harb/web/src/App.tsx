import React, { useState } from 'react'
import './App.css'
import { is_prime } from "../pkg";

function App() {
  const [error, setError] = useState<boolean>(false)
  const [result, setResult] = useState<boolean>(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false)
    if (event.target.value === '') return

    try {
      const num = BigInt(event.target.value)
      setResult(is_prime(num))
    } catch (error) {
      setError(true)
      return
    }

  }

  return (
    <>
      <h1>PrimeQuest</h1>
      <div className="card">
        <input className="input"onChange={handleChange} placeholder='Input number'/>
        {result ? <p>It's a prime number!!</p> : <p>It's not a prime number</p>}
        {error && <p style={{color:"red"}}>Invalid input</p>}
      </div>
    </>
  )
}

export default App
