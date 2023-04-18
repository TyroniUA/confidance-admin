import "./assets/styles/index.scss";
import { app, analytics } from "./firebase";
import Routes from './routes/routes';

function App() {
  return (
    <div
      className="App"
    >
      <Routes />
    </div>
  )
}

export default App
