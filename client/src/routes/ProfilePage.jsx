import { Component } from "react";
import LeftNavBar from "../components/widelyUsed/leftNavBar";
import LoadingComponent from "../components/widelyUsed/loadingComponent";
import Profile from "../components/profile/profile";
import { getProfile } from "../utilities/profile";
import { getLoggedUserId } from "../utilities/user";
import Css from "./ProfilePage.module.css";
import { checkIfSessionExists } from "../utilities/session";

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPowerUser: false,
            profileIconIsActive: false,
            profile: null,
            friends: null,
            loggedUserId: "",
        };
    }

    async componentDidMount() {
        try {
            await checkIfSessionExists("/profile").then(async () => {
                const partsOfUrl = window.location.pathname.split("/");
                const id = partsOfUrl[partsOfUrl.length - 1];

                const loggedUserId = await getLoggedUserId();

                let profileAndFriends;
                if (id === "myProfile" || id === loggedUserId) {
                    profileAndFriends = await getProfile();
                } else {
                    profileAndFriends = await getProfile(id);
                }

                this.setState({
                    profile: profileAndFriends.profile,
                    friends: profileAndFriends.friends,
                    loggedUserId: loggedUserId,
                    isPowerUser: id === "myProfile" || id === loggedUserId,
                    profileIconIsActive:
                        id === "myProfile" || id === loggedUserId,
                });
            });
        } catch (e) {
            console.error("Error: ", e);
        }
    }

    displayNewProfile = async (userId = "myProfile") => {
        const { loggedUserId } = this.state;

        let profileAndFriends;
        if (userId === loggedUserId || userId === "myProfile") {
            profileAndFriends = await getProfile();
        } else {
            profileAndFriends = await getProfile(userId);
        }

        this.setState({
            isPowerUser: userId === "myProfile" || userId === loggedUserId,
            profileIconIsActive:
                userId === "myProfile" || userId === loggedUserId,
            profile: profileAndFriends.profile,
            friends: profileAndFriends.friends,
        });
    };

    render() {
        const { profile, friends, isPowerUser, profileIconIsActive } =
            this.state;

        return (
            <div className={Css.wrapDiv}>
                <LeftNavBar
                    active={profileIconIsActive ? "profile" : ""}
                    onClickEvent={() => {
                        this.displayNewProfile(); /* musí být takhle, jinak type error: Converting circular structure to JSON */
                    }}
                />
                <div className={Css.s}>
                    {profile && friends ? (
                        <Profile
                            displayNewProfileEvent={this.displayNewProfile}
                            profilePic={profile.profilePicture}
                            name={profile.username}
                            location={profile.location}
                            bio={profile.bio}
                            isPowerUser={isPowerUser}
                            friends={friends}
                        />
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

export default ProfilePage;
