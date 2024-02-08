import React from "react";
import Css from "./leftNavBar.module.css";
import LeftBarButton from "../home/leftBarButton";
import { Link } from "react-router-dom";
import { logOut } from "../../utilities/authentication";
const icons = require("../icons/icons");

function LeftNavBar({
    active,
    targetProfileId = "myProfile",
    onClickEvent = null,
}) {
    const handleLogOut = async () => {
        try {
            await logOut();
            window.location.href = "/login";
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className={Css.leftNavBar}>
            <Link to={`/profile/${targetProfileId}`} onClick={onClickEvent}>
                <LeftBarButton
                    icon={icons.personIcon}
                    active={active == "profile" ? true : false}
                />
            </Link>

            <Link to="/home">
                <LeftBarButton
                    icon={icons.homeIcon}
                    active={active == "home" ? true : false}
                />
            </Link>

            <Link to="/users">
                <LeftBarButton
                    //onClickEvent={utils.getUsers}
                    icon={icons.peopleIcon}
                    active={active == "users" ? true : false}
                />
            </Link>

            <Link to="/friends">
                <LeftBarButton
                    icon={icons.friendRequestsIcon}
                    active={active == "friends" ? true : false}
                />
            </Link>

            {/*<Link to="/login" onClick={handleLogOut}>
                <LeftBarButton
                    //onClickEvent={async () => {
                    //    await logOut();
                    //}}
                    icon={icons.logOutIcon}
                    //active={active == "friends" ? true : false}
                />
            </Link>*/}
            <LeftBarButton
                onClickEvent={handleLogOut}
                icon={icons.logOutIcon}
                //active={active == "friends" ? true : false}
            />
        </div>
    );
}

export default LeftNavBar;
