import { Component } from "react";
import LeftNavBar from "../components/widelyUsed/leftNavBar";
import UserCell from "../components/users/userCell";
import LoadingComponent from "../components/widelyUsed/loadingComponent";
import Css from "./UsersPage.module.css";
import { getFriends } from "../utilities/friends";
import { checkIfSessionExists } from "../utilities/session";
import { getNumberOfSameFriends } from "../utilities/friendUtils";
const friendRequestsUtils = require("../utilities/friendRequests");
const userUtils = require("../utilities/user");

class UsersPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: null,
            friendsOfCurrentUser: [],
        };
    }

    async componentDidMount() {
        try {
            await checkIfSessionExists("/users").then(async () => {
                this.waitForFriends();
                const usersArray = await userUtils.getUsers();

                this.setState({ users: usersArray });
            });
        } catch (e) {
            console.error("Error: ", e);
        }
    }

    waitForFriends = async () => {
        const friendsOfCurrentUser = await getFriends();
        const arrayOfFriends = friendsOfCurrentUser.arrayOfFriends.map(
            (user) => user._id
        );

        this.setState({ friendsOfCurrentUser: arrayOfFriends });
    };

    removeUserFromUsersArray = (id) => {
        const { users } = this.state;
        const newUsers = users.filter((usr) => usr._id !== id);
        this.setState({ users: newUsers });
    };

    render() {
        const { users, friendsOfCurrentUser } = this.state;

        return (
            <div className={Css.wrapDiv}>
                <LeftNavBar active={"users"} />
                <div className={Css.users}>
                    {users === null ? (
                        <div className={Css.center}>
                            <LoadingComponent color={"black"} />
                        </div>
                    ) : users.length > 0 ? (
                        users.map((user) => (
                            <UserCell
                                key={user._id}
                                profilePic={user.profilePicture}
                                name={user.username}
                                numberOfSameFriends={
                                    friendsOfCurrentUser
                                        ? getNumberOfSameFriends(
                                              friendsOfCurrentUser,
                                              user
                                          )
                                        : "-"
                                }
                                clickEvent={
                                    friendRequestsUtils.sendFriendRequest
                                }
                                id={user._id}
                                onButtonClick={this.removeUserFromUsersArray}
                            />
                        ))
                    ) : (
                        <div className={Css.center}>No users</div>
                    )}
                </div>
            </div>
        );
    }
}

export default UsersPage;
