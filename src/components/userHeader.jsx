import React from 'react';
import { signOut } from "firebase/auth";
import OptionWithImage from './optionWithImage';
import noAvatar from "../assets/images/noAvatar.png";
import myVideos from "../assets/images/myVideos.png";
import logout from "../assets/images/logout.png";

export default function UserHeader({ avatar, userName, userId }) {

  const listVideos = () => {
    console.log("list")
  }

  return (
    <div className="user">
      <div className="userHeader">
        <img
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
        <div className="flex flex-column">
          <OptionWithImage
            image={myVideos}
            title="My Videos"
            callBack={listVideos}
          />
          <OptionWithImage
            image={logout}
            title="Log Out"
            callBack={() => {
              signOut()
            }}
          />
        </div>
      </div>
    </div>
  )
}
