import React, { useState, useRef, useEffect } from "react";
import Css from "./activeChatUpperBar.module.css";
import Option from "./option";
import Button from "../widelyUsed/button";
import { useNavigate } from "react-router-dom";
import { getBinaryData } from "../../utilities/binaryData";
import { changeOfGroupchatName } from "../../utilities/socket/groupChat";
import { leaveGroupchat } from "../../utilities/socket/groupChat";
import { changeOfGroupchatProfilePicture } from "../../utilities/socket/groupChat";
import { addUsersToGroupchat } from "../../utilities/socket/groupChat";
import { removeUserFromFriends } from "../../utilities/socket/friends";
const Icons = require("../icons/icons");

function ActiveChatUpperBar({
    id,
    name,
    picture,
    status,
    isGroupChat,
    roomId,
    updateHomePageUIRoomName,
    updateHomePageUIRoomProfilePicture,
    roomUsers,
    availableUsers,
    updateUsersInRoomEvent,
    displayChats,
    displayChatsOptionIsDisplayed,
}) {
    const navigate = useNavigate();

    const groupchatPhotoInput = useRef(null);
    const dialogGroupchatNameChange = useRef(null);
    const dialogShowUsers = useRef(null);
    const dialogAddUsers = useRef(null);

    const [optionsAreDisplayed, setOptionsAreDisplayed] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const [clickedFriends, setClickedFriends] = useState([]);
    const [searchedText, setSearchedText] = useState("");
    const [searchedFriends, setSearchedFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);

    const [optionsHeight, setOptionsHeight] = useState("");

    const navigateToProfile = () => {
        navigate(`/profile/${id}`);
    };

    function arraysAreEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }

        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }

        return true;
    }

    useEffect(() => {
        if (isGroupChat) {
            let roomUsersIds = [];
            roomUsers.forEach((user) => roomUsersIds.push(user.userId));

            const newFilteredUsers = availableUsers.filter(
                (user) => !roomUsersIds.includes(user.friendsId)
            );

            if (!arraysAreEqual(newFilteredUsers, filteredUsers)) {
                setFilteredUsers(newFilteredUsers);
            }
        }

        const windowWidth = window.innerWidth;

        if (windowWidth <= 480) {
            setOptionsHeight(isGroupChat ? "26vh" : "14.5vh");
        } else if (windowWidth > 480 && windowWidth < 1024) {
            setOptionsHeight(isGroupChat ? "36vh" : "11vh");
        } else if (windowWidth >= 1024 && windowWidth < 1200) {
            setOptionsHeight(isGroupChat ? "36vh" : "11vh");
        } else {
            // větší nebo rovno 1200
            setOptionsHeight(isGroupChat ? "31vh" : "9vh");
        }
    }, [roomId, filteredUsers, roomUsers]);

    const searchFriends = (text) => {
        if (text.length > 0) {
            const filteredFriends = filteredUsers.filter((friend) =>
                friend.friendsUsername
                    .toLowerCase()
                    .includes(text.toLowerCase())
            );

            let filteredAndNotClicked = filteredFriends.filter(
                (friend) => !clickedFriends.includes(friend)
            );

            // filtrování userů, který jsou ve skupině, aby jsme je nemohli přidat znova (ty co jsme přidali zrovna do skupiny)
            const filteredUsersNotInRoom = filteredAndNotClicked.filter(
                (user) =>
                    !roomUsers.some(
                        (roomUser) => roomUser.userId === user.friendsId
                    )
            );

            setSearchedFriends(filteredUsersNotInRoom);

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
        // z dialogu pro add users to groupchat
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

    const addUsersToGc = () => {
        let users = [];
        selectedFriends.forEach((friend) =>
            users.push({
                userId: friend.friendsId,
                friendsUsername: friend.friendsUsername,
                friendsProfilePicture: friend.friendsProfilePicture,
            })
        );

        updateUsersInRoomEvent({ users: users });

        if (users.length >= 1) {
            addUsersToGroupchat(roomId, users);
        }

        setSearchedText("");
        setClickedFriends([]);
        setSearchedFriends([]);
        setSelectedFriends([]);

        dialogAddUsers.current.close();
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            getBinaryData(selectedFile, (resolvedData) => {
                changeOfGroupchatProfilePicture(resolvedData, roomId);
                let obj = {
                    // musí se to udělat takhle, aby na to nemuseli být dvě funkce jako se jménem
                    profilePicture: resolvedData,
                };
                updateHomePageUIRoomProfilePicture(obj);
            });
        }
    };

    const options = isGroupChat ? (
        <div
            style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                zIndex: "380",
            }}
        >
            <Option
                text={"Name of groupchat"}
                clickEvent={() => {
                    dialogGroupchatNameChange.current.showModal();
                    setOptionsAreDisplayed(false);
                }}
                icon={Icons.penIcon}
            />
            <Option
                text={"Change chat's profile picture"}
                clickEvent={() => {
                    groupchatPhotoInput.current.click();
                    setOptionsAreDisplayed(false);
                }}
                icon={Icons.imageIcon}
            />
            <Option
                text={"Add users"}
                clickEvent={() => {
                    dialogAddUsers.current.showModal();
                    setOptionsAreDisplayed(false);
                }}
                icon={Icons.addPerson}
            />
            <Option
                text={"Show users"}
                clickEvent={() => {
                    dialogShowUsers.current.showModal();
                    setOptionsAreDisplayed(false);
                }}
                icon={Icons.peopleIcon}
            />
            {/*<Option dělá to brikule, pak to znovu přidat
                text={"Opustit skupinu"}
                clickEvent={() => {
                    leaveGroupchat(roomId, userId);
                    setOptionsAreDisplayed(false);
                }}
                icon={Icons.logOutIcon}
            />*/}
        </div>
    ) : (
        <div
            style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                zIndex: "300",
            }}
        >
            <Option
                text={"Show profile"}
                clickEvent={() => {
                    navigateToProfile();
                    setOptionsAreDisplayed(false);
                }}
                icon={Icons.personIcon}
            />
            {displayChatsOptionIsDisplayed ? (
                <Option
                    text={"Display chats"}
                    clickEvent={() => {
                        displayChats();
                        setOptionsAreDisplayed(false);
                    }}
                    icon={Icons.chats}
                />
            ) : null}

            {/*<Option              //dělá to brikule, takže to pak implementuju kdyžtak
                text={"Odebrat přítele"}
                clickEvent={() => {
                    removeUserFromFriends(userId, id, roomId);
                    setOptionsAreDisplayed(false);
                }}
                icon={Icons.removePerson}
            />*/}
        </div>
    );

    const openOrCloseOptions = (event) => {
        const { clientX, clientY } = event;
        setPosition({ x: clientX, y: clientY });

        setOptionsAreDisplayed(!optionsAreDisplayed);
    };

    const submitChangeOfGroupchatName = () => {
        const newName = document.getElementById("groupchatInputId").value;

        if (newName !== "friends room") {
            // z groupchatu by byl normální chat v homepage
            changeOfGroupchatName(newName, roomId);
        }

        updateHomePageUIRoomName(newName);
        dialogGroupchatNameChange.current.close();
    };

    return (
        <div className={Css.wrapDiv}>
            {picture ? (
                <img src={picture} className={Css.profilePicture} />
            ) : (
                <img
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    className={Css.profilePicture}
                />
            )}
            <div className={Css.wrapForNameAndStatus}>
                <div className={Css.name}>{name}</div>
                <div className={Css.status}>{status}</div>
            </div>

            <div className={Css.buttonIcons}>
                <button
                    className={Css.icon}
                    onClick={(e) => openOrCloseOptions(e)}
                >
                    {Icons.threeDots}
                </button>
            </div>

            <input
                type="file"
                ref={groupchatPhotoInput}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />

            {optionsAreDisplayed && (
                <div
                    style={{
                        top: position.y + 30 + "px",
                        left:
                            position.x - (27 * window.innerHeight) / 100 + "px",
                        position: "fixed",
                        zIndex: 100,
                        width: "34vh",
                        height: optionsHeight,
                        backgroundColor: "#ECECEC",
                        borderRadius: "11px",
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {options}
                </div>
            )}

            <dialog className={Css.dialog} ref={dialogGroupchatNameChange}>
                <div className={Css.dialogWrap}>
                    <h1 className={Css.dialogHeader}>
                        Change groupchat's name
                    </h1>

                    <input
                        type="text"
                        className={Css.textInput}
                        id="groupchatInputId"
                    />

                    <div className={Css.buttons}>
                        <Button
                            text={"Submit"}
                            onclickEvent={submitChangeOfGroupchatName}
                        />
                        <Button
                            text={"Close"}
                            onclickEvent={() => {
                                dialogGroupchatNameChange.current.close();
                            }}
                        />
                    </div>
                </div>
            </dialog>

            <dialog className={Css.dialog} ref={dialogShowUsers}>
                <div className={Css.dialogWrap}>
                    <h1 className={Css.dialogHeader}>Groupchat users</h1>

                    <div className={Css.users}>
                        {roomUsers
                            ? roomUsers.map((user) => (
                                  <div className={Css.user} onClick={() => {}}>
                                      {user.friendsProfilePicture ? (
                                          <img
                                              src={user.friendsProfilePicture}
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
                                      <div>{user.friendsUsername}</div>
                                  </div>
                              ))
                            : null}
                    </div>

                    <div className={Css.buttons}>
                        <Button
                            text={"Close"}
                            onclickEvent={() => {
                                dialogShowUsers.current.close();
                            }}
                        />
                    </div>
                </div>
            </dialog>

            <dialog className={Css.usersDialog} ref={dialogAddUsers}>
                <div className={Css.usersDialogWrap}>
                    <h1 className={Css.dialogHeader}>Add users to groupchat</h1>

                    <input
                        className={Css.textInput}
                        type="text"
                        onChange={(e) => searchFriends(e.target.value)}
                        placeholder="Search friends"
                    />

                    <div className={Css.usersDialogRowWrap}>
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
                        <Button text={"Submit"} onclickEvent={addUsersToGc} />
                        <Button
                            text={"Close"}
                            onclickEvent={() => {
                                dialogAddUsers.current.close();
                            }}
                        />
                    </div>
                </div>
            </dialog>
        </div>
    );
}

export default ActiveChatUpperBar;
