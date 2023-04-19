import React, { useEffect, useState, useContext } from 'react'
import UserHeader from '../components/userHeader';
import { store } from '../store';

export default function Home() {

  const { state, dispatch } = useContext(store);
  const { user } = state;
  console.log(user)
  return (
    <div>
      <UserHeader
        userName={user?.displayName}
        avatar={user?.photoURL}
      />

    </div>
  )
}
