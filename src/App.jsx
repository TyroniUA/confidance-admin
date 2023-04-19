import "./assets/styles/index.scss";
import { useEffect, useContext } from "react";
import { store, EventTypes } from "./store/index";
import { app, analytics, auth, db } from "./firebase";
import { getDoc, doc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import Routes from './routes/routes';

function App() {
  const { state, dispatch } = useContext(store);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user && user.uid && !state.user) {
        console.log(user);
        if (user) {
          dispatch({
            type: EventTypes.SET_USER,
            payload: user
          });
        }

        return;
      } else {
      }
    });

  }, [state.user, db])
  return (
    <div
      className="App"
    >
      <Routes />
    </div>
  )
}

export default App
