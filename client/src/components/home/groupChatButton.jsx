import { useState } from "react";
import Css from "./groupChatButton.module.css";
import Button from "../widelyUsed/button";
import { createGroupChat } from "../../utilities/groupChat";

function GroupChatButton({ friends, currentUserId, refreshUI }) {
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [searchedFriends, setSearchedFriends] = useState([]);
    const [clickedFriends, setClickedFriends] = useState([]);
    const [searchedText, setSearchedText] = useState("");

    const openDialog = () => {
        const dialog = document.querySelector("dialog");
        dialog.showModal();
    };

    const closeDialog = () => {
        const dialog = document.querySelector("dialog");
        dialog.close();
    };

    const waitForGroupchat = async (users) => {
        const newGroupchat = await createGroupChat(users);
        console.log("NEWGC", newGroupchat);
        refreshUI(newGroupchat);
    };

    const handleSubmitButtonClick = async () => {
        let users = selectedFriends.map((friend) => friend.friendsId);
        users.push(currentUserId);
        if (users.length > 1) {
            waitForGroupchat(users);
        }

        setSearchedText("");
        setClickedFriends([]);
        setSearchedFriends([]);
        setSelectedFriends([]);

        closeDialog();
    };

    const searchFriends = (text) => {
        if (text.length > 0) {
            const filteredFriends = friends.filter((friend) =>
                friend.friendsUsername
                    .toLowerCase()
                    .includes(text.toLowerCase())
            );

            const filteredAndNotClicked = filteredFriends.filter(
                (friend) => !clickedFriends.includes(friend)
            );

            setSearchedText(text);
            setSearchedFriends(filteredAndNotClicked);
        } else {
            setSearchedText("");
            setSearchedFriends([]);
        }
    };

    const addFriend = (friend) => {
        setSelectedFriends((prevSelectedFriends) => {
            if (Array.isArray(prevSelectedFriends)) {
                return [...prevSelectedFriends, friend];
            } else {
                return [friend];
            }
        });

        setClickedFriends((prev) => [...prev, friend]);

        setSearchedFriends((prevSearchedFriends) =>
            prevSearchedFriends.filter((f) => f !== friend)
        );
    };

    const removeFriend = (friend) => {
        setSelectedFriends((prevSelectedFriends) => {
            return prevSelectedFriends.filter(
                (selectedFriend) => selectedFriend !== friend
            );
        });

        setClickedFriends((prevClickedFriends) => {
            return prevClickedFriends.filter(
                (clickedFriend) => clickedFriend !== friend
            );
        });

        setSearchedFriends((prev) => {
            if (
                searchedText.length > 0 &&
                friend.friendsUsername
                    .toLowerCase()
                    .includes(searchedText.toLowerCase())
            ) {
                return [...prev, friend];
            } else {
                return [...prev];
            }
        });
    };

    return (
        <div className={Css.wrap}>
            <div className={Css.text}>Create group</div>
            <button onClick={openDialog} className={Css.button}>
                +
            </button>

            <dialog className={Css.dialog}>
                <div className={Css.dialogWrap}>
                    <h1 className={Css.dialogHeader}>Create groupchat</h1>

                    <input
                        className={Css.search__input}
                        type="text"
                        onChange={(e) => searchFriends(e.target.value)}
                        placeholder="Search friends"
                    />

                    <div className={Css.rowWrap}>
                        <div className={Css.usersText}>Users:</div>

                        <div className={Css.friends}>
                            {selectedFriends
                                ? selectedFriends.map((friend) => (
                                      <div className={Css.selectedFriend}>
                                          {friend.friendsUsername}
                                          <div
                                              className={Css.x}
                                              onClick={() => {
                                                  removeFriend(friend);
                                              }}
                                          >
                                              X
                                          </div>
                                      </div>
                                  ))
                                : null}
                        </div>
                    </div>

                    <div className={Css.searchedFriends}>
                        {searchedFriends
                            ? searchedFriends.map((friend) => (
                                  <div
                                      className={Css.searchedFriend}
                                      onClick={() => {
                                          addFriend(friend);
                                      }}
                                  >
                                      {friend.friendsProfilePicture ? (
                                          <img
                                              src={friend.friendsProfilePicture}
                                              className={Css.profileImage}
                                          ></img>
                                      ) : (
                                          <img
                                              src={
                                                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                              }
                                              className={Css.profileImage}
                                          ></img>
                                      )}
                                      <div>{friend.friendsUsername}</div>
                                  </div>
                              ))
                            : null}
                    </div>

                    <div className={Css.buttons}>
                        <Button
                            text={"Submit"}
                            onclickEvent={handleSubmitButtonClick}
                        />
                        <Button text={"Close"} onclickEvent={closeDialog} />
                    </div>
                </div>
            </dialog>
        </div>
    );
}

export default GroupChatButton;
