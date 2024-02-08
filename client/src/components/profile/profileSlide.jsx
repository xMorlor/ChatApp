import React from "react";
import Css from "./profileSlide.module.css";
import Button from "../widelyUsed/button";
import { Link } from "react-router-dom";

function ProfileSlide({
    profilePic,
    name,
    numberOfSameFriends,
    clickEvent,
    id,
}) {
    return (
        <div className={Css.userCell}>
            {profilePic ? (
                <img src={profilePic} className={Css.profilePic} />
            ) : (
                <img
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    className={Css.profilePic}
                />
            )}
            <div className={Css.name}>{name}</div>
            <div className={Css.numberOfSameFriends}>
                {numberOfSameFriends + " Common friends"}
            </div>
            <Link to={`/profile/${id}`} onClick={() => clickEvent(id)}>
                <Button onclickEvent={null} text={"Show profile"} />
            </Link>
            <div className={Css.gap}></div>
        </div>
    );
}

export default ProfileSlide;
