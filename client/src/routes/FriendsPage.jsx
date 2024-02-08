import { Component } from "react";
import LeftNavBar from "../components/widelyUsed/leftNavBar";
import FriendRequestCell from "../components/users/friendRequestCell";
import LoadingComponent from "../components/widelyUsed/loadingComponent";
import Css from "./FriendsPage.module.css";
import { checkIfSessionExists } from "../utilities/session";
import { getFriends } from "../utilities/friends";
import { getNumberOfSameFriends } from "../utilities/friendUtils";
const friendRequestUtils = require("../utilities/friendRequests");

class FriendsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friendRequests: null,
            friendsOfCurrentUser: null,
        };
    }

    async componentDidMount() {
        try {
            await checkIfSessionExists("/friends").then(async () => {
                this.waitForFriends();

                const friendRequests =
                    await friendRequestUtils.getFriendRequests();
                this.setState({ friendRequests: friendRequests });
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

    removeRequestFromRequestArray = (id) => {
        const { friendRequests } = this.state;
        const newFriendRequests = friendRequests.filter(
            (request) => request._id !== id
        );
        this.setState({ friendRequests: newFriendRequests });
    };

    render() {
        const { friendRequests, friendsOfCurrentUser } = this.state;

        return (
            <div className={Css.wrapDiv}>
                <LeftNavBar active={"friends"} />
                <div className={Css.users}>
                    {friendRequests ? (
                        friendRequests.length > 0 ? (
                            friendRequests.map((request) => (
                                <FriendRequestCell
                                    name={request.username}
                                    profilePic={request.profilePicture}
                                    numberOfSameFriends={
                                        friendsOfCurrentUser
                                            ? getNumberOfSameFriends(
                                                  friendsOfCurrentUser,
                                                  request
                                              )
                                            : "-"
                                    }
                                    clickEventAccept={
                                        friendRequestUtils.acceptFriendRequest
                                    }
                                    clickEventDecline={
                                        friendRequestUtils.declineFriendRequest
                                    }
                                    id={request._id}
                                    onButtonClick={
                                        this.removeRequestFromRequestArray
                                    }
                                />
                            ))
                        ) : (
                            <div className={Css.center}>No friend requests</div>
                        )
                    ) : (
                        <div className={Css.center}>
                            <LoadingComponent color={"black"} />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default FriendsPage;
