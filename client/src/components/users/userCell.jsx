import React from "react";
import Css from "./userCell.module.css";
import Button from "../widelyUsed/button";

function UserCell({
    profilePic,
    name,
    numberOfSameFriends,
    clickEvent,
    id,
    onButtonClick,
}) {
    const handleClick = () => {
        clickEvent(id);
        onButtonClick(id);
    };

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
            <div>{numberOfSameFriends + " Common friends"}</div>
            <Button onclickEvent={handleClick} text={"Add friend"} />
            <div className={Css.gap}></div>
        </div>
    );
}

export default UserCell;
