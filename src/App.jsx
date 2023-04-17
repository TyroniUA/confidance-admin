import { useState } from 'react'
import "./assets/styles/index.scss";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { app, analytics } from "./firebase";
import Routes from './routes/routes';
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="App">
      <Routes />
    </div>
  )
}

export default App
