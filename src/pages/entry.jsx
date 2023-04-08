import React, { useState, useEffect } from 'react'
import Input from "../components/input";

export default function Main() {
  const [state, setState] = useState({
    email: ""
  });

  const onChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  const onProceed = () => {
    console.log("proceed")
  }

  return (
    <div>
      <div>Please provide your email</div>
      <Input
        label="email"
        placeholder={"Please provide your email"}
        type="text"
        value={state.email}
        onChange={onChange}
        name="email"
      />
      <span>
        {state.email}
      </span>
      <button
        onClick={onProceed}
      >
        Proceed
      </button>
    </div>
  )
}
