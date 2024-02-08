import React from "react";
import Css from "./friendRequestCell.module.css";
import Button from "../widelyUsed/button";
import { createRoom } from "../../utilities/rooms";

function FriendRequestCell({
    profilePic,
    name,
    numberOfSameFriends,
    clickEventAccept,
    clickEventDecline,
    id,
    onButtonClick,
}) {
    const handleClickAccept = () => {
        clickEventAccept(id);
        onButtonClick(id); // remove cell from ui
        createRoom([id], null, false);
    };

    const handleClickDecline = () => {
        clickEventDecline(id);
        onButtonClick(id); // remove cell from ui
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
            <Button onclickEvent={handleClickAccept} text={"Accept"} />
            <Button onclickEvent={handleClickDecline} text={"Decline"} />
            <div className={Css.gap}></div>
        </div>
    );
}

export default FriendRequestCell;
