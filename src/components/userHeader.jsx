import React from 'react';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import OptionWithImage from './optionWithImage';
import noAvatar from "../assets/images/noAvatar.png";
import myVideos from "../assets/images/myVideos.svg";
import logout from "../assets/images/logout.svg";

export default function UserHeader({ avatar, userName, userId }) {

  const listVideos = () => {
    console.log("list")

  }

  return (
    <div className="user box">
      <div className="flex flex-align-items user-header">
        <img
          className='avatar'
          src={avatar ? avatar : noAvatar}
          width="50"
          height="50"
          alt="confidance profile"
        />
        <span>
          {userName}
        </span>
      </div>
      <div className="divider"></div>
      <div className="userLogic">
        <OptionWithImage
          image={myVideos}
          title="My Videos"
          callBack={listVideos}
        />
        <OptionWithImage
          image={logout}
          title="Log Out"
          callBack={() => { signOut(auth) }}
        />
      </div>
    </div>
  )
}
