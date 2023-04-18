import React, { useState, useEffect, useContext } from 'react'
import Input from "../components/input";
import { auth, db } from '../firebase';
import { store, EventTypes, ErrorTypes } from "../store/index";
import { useNavigate } from "react-router-dom";
import confiLogo from "../assets/images/confiLogo.png"
import { getDoc, getDocs, setDoc, doc as fbDoc, collection, query, where } from "firebase/firestore";
import {
  createUserWithEmailAndPassword, sendPasswordResetEmail,
  signInWithEmailAndPassword, signInWithPopup
} from "firebase/auth";

export default function Main() {
  const [state, setState] = useState({
    email: "",
    password: ""
  });
  const [showFullForm, setShowFullForm] = useState(false);
  const [errorState, setErrorState] = useState({});

  const { state: globalState, dispatch } = useContext(store)

  const navigate = useNavigate();


  const onChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  const checkEmailExistance = async () => {

    if (state.email === "") {
      dispatch({
        type: EventTypes.NEW_NOTIFICATION,
        payload: ErrorTypes.EMAIL_NOT_PROVIDED
      });
      setErrorState({
        email: "Please provide an email"
      })
      return;
    }
    setErrorState({
    })
    const querySnapshot = await getDocs(query(collection(db, "users"), where("email", "==", state.email)));
    if (querySnapshot.docs.length === 0) {
      setErrorState({
        error: "User was not found with this email"
      })
      dispatch({
        type: EventTypes.NEW_NOTIFICATION,
        payload: ErrorTypes.USER_NOT_FOUND
      });
      return;
    } else {
      setShowFullForm(true);
      console.log('email exists');
    }
  };

  const renderFullForm = () => {
    return (
      <div className='form login-body' >


        <Input
          type='password'
          placeholder='Password'
          name='password'
          onChange={onChange}
          value={state.password}
          error={errorState.password}
        />
        <div style={{ marginTop: "22px" }}>
          <span
            className='login-forgot'
            onClick={() => {
              navigate("/auth/password")
            }}>
            Forgot your password
          </span>
        </div>

      </div>
    );
  }

  const onLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, state.email, state.password);
      if (result) {
        navigate("/main")
      }

    } catch (error) {
      dispatchError(error);

      console.log(error);
    }
  };
  const dispatchError = (error) => {
    if (error.code === "auth/user-not-found") {
      setErrorState({
        error: "User was not found with this email"
      })
      return;
    }
    if (error.code === "auth/network-request-failed") {
      setErrorState({
        error: "Please connect to the internet"
      })
      return;
    }
    if (error.code === "auth/account-exists-with-different-credential") {
      setErrorState({
        error: "Please contact technical support"
      })
      return;
    }
    if (error.code === "auth/wrong-password") {
      setErrorState({
        error: "Email and password do not match"
      })
      return;
    }
    if (error.code === "auth/too-many-requests") {
      setErrorState({
        error: "Too many requests"
      })
      return;
    }
    if (error.code === "auth/email-already-in-use") {
      setErrorState({
        error: "Email already registered"
      })
      return;
    } else {
      setErrorState({
        error: "Error occured. Please contact technical support"
      })
      return;
    }
  };

  return (
    <div
      className='box'
    >
      <img
        src={confiLogo}
        height="80"
        width="80"
      />
      <h2>
        Welcome to ConfiDance!
      </h2>
      <Input
        placeholder={"Email address"}
        type="text"
        value={state.email}
        onChange={onChange}
        name="email"
        error={errorState.email}

      />
      {showFullForm
        ? renderFullForm()
        : null
      }
      <button
        className='button button-action'
        onClick={
          !showFullForm ?
            () =>
              checkEmailExistance()
            :
            () => onLogin()
        }
      >
        {!showFullForm ? "Proceed" : "Login"}
      </button>
      <span
        className='error'
      >
        {errorState.error ? errorState.error : null}
      </span>
    </div>
  )
}
