import React, { Component } from "react";
import Css from "./HomePage.module.css";
import Chat from "../components/home/chat";
import Message from "../components/home/message";
import ActiveChatUpperBar from "../components/home/activeChatUpperBar";
import ChatInput from "../components/home/chatInput";
import ChatInfo from "../components/home/chatInfo";
import LeftNavBar from "../components/widelyUsed/leftNavBar";
import { getFriends } from "../utilities/friends";
import { getRooms } from "../utilities/rooms";
import LoadingComponent from "../components/widelyUsed/loadingComponent";
import { joinRoom, leaveRoom } from "../utilities/socket/room";
import { socket } from ".././socket";
import { checkIfSessionExists } from "../utilities/session";
import { getMessages } from "../utilities/messages";
import GroupChatButton from "../components/home/groupChatButton";
import { getUsersThatAreNotMyFriends } from "../utilities/user";
import {
    Element,
    Events,
    animateScroll as scroll,
    scroller,
} from "react-scroll";
import { Toaster, toast } from "sonner";

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomsAndFriends: null,
            currentChat: null,
            currentUserId: null,
            messages: [],
            roomUsers: [],
            allUsers: [],
            bioIsDisplayed: false,
            chatsAreDisplayed: false,
            windowWidth: null,
            chatsClassName: null,
            currentChatClassName: "wrapChatAndInfo",
            displayChatsOptionIsDisplayed: false,
        };
    }

    async componentDidMount() {
        try {
            await checkIfSessionExists("/home");

            socket.on("received-message", (message) =>
                this.handleReceivedAndSentMessage(message)
            );
            socket.on("change-of-groupchat-profilePicture", (data) =>
                this.changeCurrentGroupchatProfilePicture(data)
            );
            socket.on("changed-groupchat-name", (data) =>
                this.changeCurrentGroupchatNameOnReceivedEvent(data)
            );
            socket.on("change-of-groupchat-users", (data) =>
                this.changeOfGroupchatUsers(data)
            );

            Events.scrollEvent.register("begin", function () {
                console.log("begin", arguments);
            });

            Events.scrollEvent.register("end", function () {
                console.log("end", arguments);
            });

            let currentUserId;
            let notMyFriends = [];
            let everyUser = [];

            const windowWidth = window.innerWidth;
            this.setState({ windowWidth: windowWidth });

            let displayBioBool;
            let displayChatsBool;

            // jména css tříd
            let chatsClass;

            if (windowWidth <= 480) {
                displayBioBool = false;
                displayChatsBool = false;

                chatsClass = "chatsMobile";
                this.setState({ displayChatsOptionIsDisplayed: true });
            } else if (windowWidth > 480 && windowWidth < 1024) {
                displayBioBool = false;
                displayChatsBool = true;

                chatsClass = "chatsNormal";
            } else if (windowWidth >= 1024 && windowWidth < 1200) {
                displayBioBool = true;
                displayChatsBool = true;

                chatsClass = "chatsNormal";
            } else {
                // větší nebo rovno 1200
                displayBioBool = true;
                displayChatsBool = true;

                chatsClass = "chatsNormal";
            }

            this.setState({
                bioIsDisplayed: displayBioBool,
                chatsAreDisplayed: displayChatsBool,
                chatsClassName: chatsClass,
            });

            const roomsAndFriends = await Promise.all([
                getRooms(),
                getFriends(),
            ]).then(async (values) => {
                let arrayOfFriends = [];
                let arrayOfGroupChats = [];

                currentUserId = values[1].currentUserId;

                for (let i = 0; i < values[0].length; i++) {
                    for (let x = 0; x < values[1].arrayOfFriends.length; x++) {
                        if (
                            values[0][i].name === "friends room" &&
                            values[0][i].users.includes(
                                values[1].arrayOfFriends[x]._id
                            )
                        ) {
                            arrayOfFriends.push({
                                isGroupChat: false,
                                roomId: values[0][i]._id,
                                roomName: values[0][i].name,
                                roomUsers: values[0][i].users,
                                friendsUsername:
                                    values[1].arrayOfFriends[x].username,
                                friendsProfilePicture:
                                    values[1].arrayOfFriends[x].profilePicture,
                                friendsBio: values[1].arrayOfFriends[x].bio,
                                friendsLocation:
                                    values[1].arrayOfFriends[x].location,
                                friendsId: values[1].arrayOfFriends[x]._id,
                            });
                        }
                    }
                    if (values[0][i].name !== "friends room") {
                        arrayOfGroupChats.push({
                            isGroupChat: true,
                            roomId: values[0][i]._id,
                            roomName: values[0][i].name,
                            roomUsers: values[0][i].users,
                            roomProfilePicture:
                                values[0][i].groupChatProfilePicture,
                        });
                    }
                }

                for (let i = 0; i < values[1].arrayOfFriends.length; i++) {
                    everyUser.push(values[1].arrayOfFriends[i]);
                }

                if (
                    values[1] &&
                    values[1].arrayOfFriends &&
                    values[1].arrayOfFriends.length > 0
                ) {
                    let friendIds = values[1].arrayOfFriends.map(
                        (friend) => friend._id
                    );
                    friendIds.push(values[1].currentUserId);

                    let usersThatAreNotMyFriends = [];

                    for (let i = 0; i < values[0].length; i++) {
                        for (let x = 0; x < values[0][i].users.length; x++) {
                            const userId = values[0][i].users[x];

                            // Check if the user is not a friend
                            if (!friendIds.includes(userId)) {
                                // Add the user to the list of users that are not your friends
                                usersThatAreNotMyFriends.push(userId);
                            }
                        }
                    }

                    notMyFriends = await getUsersThatAreNotMyFriends(
                        usersThatAreNotMyFriends
                    );

                    everyUser = everyUser.concat(notMyFriends);
                }

                return [...arrayOfFriends, ...arrayOfGroupChats];
            });

            this.setState({ allUsers: everyUser });
            this.setState({ currentUserId: currentUserId });

            if (roomsAndFriends.length > 0) {
                const messages = await getMessages(roomsAndFriends[0].roomId);

                this.setState({ messages: messages });

                joinRoom(roomsAndFriends[0].roomId);
            }

            this.setState({ roomsAndFriends: roomsAndFriends });
            this.setState({ currentChat: roomsAndFriends[0] });

            if (roomsAndFriends.length > 0) {
                if (roomsAndFriends[0].isGroupChat) {
                    let arr = [];

                    roomsAndFriends.forEach((chat) => {
                        if (!chat.isCurrentChat) {
                            if (
                                roomsAndFriends[0].roomUsers.includes(
                                    chat.friendsId
                                )
                            ) {
                                arr.push({
                                    friendsProfilePicture:
                                        chat.friendsProfilePicture,
                                    friendsUsername: chat.friendsUsername,
                                });
                            }
                        }
                    });

                    this.setState({ roomUsers: arr });
                }
            }

            if (localStorage.getItem("errorValue") === "true") {
                toast.error("An error occured");
            }
            localStorage.setItem("errorValue", "false");

            this.scrollToBottomOfChat();
        } catch (e) {
            console.error("Error: ", e);
        }
    }

    componentDidCatch() {
        localStorage.setItem("errorValue", "true");
        window.location.reload();
    }

    componentWillUnmount() {
        socket.off("received-message", this.handleReceivedAndSentMessage);
        socket.off(
            "change-of-groupchat-profilePicture",
            this.changeCurrentGroupchatProfilePicture
        );
        socket.off(
            "changed-groupchat-name",
            this.changeCurrentGroupchatNameOnReceivedEvent
        );
        socket.off("change-of-groupchat-users", this.changeOfGroupchatUsers);

        Events.scrollEvent.remove("begin");
        Events.scrollEvent.remove("end");
    }

    handleReceivedAndSentMessage = (message) => {
        const { messages } = this.state;

        let arr = messages.concat(message);

        this.setState({ messages: arr }, () => {
            this.scrollToBottomOfChat(); // Scroll after messages are updated
        });
    };

    handleMessages = async (roomId) => {
        this.setState({ messages: null });
        const messages = await getMessages(roomId);

        this.setState({ messages: messages }, () => {
            this.scrollToBottomOfChat(); // Scroll after messages are updated
        });
    };

    selectChat = (chat) => {
        const { currentChat, allUsers, windowWidth } = this.state;

        if (currentChat !== chat) {
            leaveRoom(currentChat.roomId);

            this.handleMessages(chat.roomId);
            this.setState({ currentChat: chat });

            joinRoom(chat.roomId);
        }

        let arr = [];

        if (chat.isGroupChat) {
            allUsers.forEach((user) => {
                if (chat.roomUsers.includes(user._id)) {
                    arr.push({
                        userId: user._id,
                        friendsProfilePicture: user.profilePicture,
                        friendsUsername: user.username,
                    });
                }
            });

            this.setState({ roomUsers: arr });
        }

        if (windowWidth <= 480) {
            this.setState({
                chatsAreDisplayed: false,
                currentChatClassName: "wrapChatAndInfo",
            });
        }
    };

    scrollToBottomOfChat() {
        scroller.scrollTo("target", {
            duration: 800,
            delay: 0,
            smooth: "easeInOutQuart",
            containerId: "container",
        });

        console.log("SCROLL");
    }

    changeOfGroupchatUsers = (data) => {
        const { roomUsers, currentChat, allUsers, roomsAndFriends } =
            this.state;
        let arr = [];

        if (Array.isArray(data.users)) {
            // Filter out users that are already in roomUsers
            const usersToAdd = data.users.filter(
                (user) =>
                    !roomUsers.some(
                        (existingUser) => existingUser.userId === user.userId
                    )
            );

            // Add the filtered users to arr
            arr = [
                ...roomUsers,
                ...usersToAdd.map((user) => ({
                    userId: user.userId,
                    friendsUsername: user.friendsUsername,
                    friendsProfilePicture: user.friendsProfilePicture,
                })),
            ];
        } else {
            arr = roomUsers.filter((user) => user.userId !== data.userId);
        }

        const updatedRoomsAndFriends = roomsAndFriends.map((chat) => {
            if (chat.roomId === currentChat.roomId) {
                // Update the chat's room users here
                return {
                    ...chat,
                    roomUsers: arr.map((user) => user.userId),
                };
            }
            return chat;
        });

        const modifiedData = [];
        data.users.forEach((user) => {
            modifiedData.push({
                username: user.friendsUsername,
                profilePicture: user.friendsProfilePicture,
                _id: user.userId,
            });
        });

        const arrForAllUsers = allUsers.concat(modifiedData);
        const updatedChat = { ...currentChat, roomUsers: arr };

        this.setState({
            roomsAndFriends: updatedRoomsAndFriends,
            allUsers: arrForAllUsers,
            currentChat: updatedChat,
            roomUsers: arr,
        });
    };

    changeCurrentGroupchatName = (newName) => {
        this.setState((prevState) => {
            const updatedCurrentChat = { ...prevState.currentChat };
            updatedCurrentChat.roomName = newName;

            // aby se změnilo jméno i chatu
            const updatedRoomsAndFriends = prevState.roomsAndFriends.map(
                (chat) => {
                    if (chat.roomId === updatedCurrentChat.roomId) {
                        return {
                            ...chat,
                            roomName: newName,
                        };
                    }
                    return chat;
                }
            );

            return {
                currentChat: updatedCurrentChat,
                roomsAndFriends: updatedRoomsAndFriends,
            };
        });
    };

    changeCurrentGroupchatNameOnReceivedEvent = (newName) => {
        this.setState((prevState) => {
            const updatedCurrentChat = { ...prevState.currentChat };
            updatedCurrentChat.roomName = newName.name;

            // aby se změnilo jméno i chatu
            const updatedRoomsAndFriends = prevState.roomsAndFriends.map(
                (chat) => {
                    if (chat.roomId === updatedCurrentChat.roomId) {
                        return {
                            ...chat,
                            roomName: newName.name,
                        };
                    }
                    return chat;
                }
            );

            return {
                currentChat: updatedCurrentChat,
                roomsAndFriends: updatedRoomsAndFriends,
            };
        });
    };

    changeCurrentGroupchatProfilePicture = (newProfilePicture) => {
        this.setState((prevState) => {
            const updatedCurrentChat = { ...prevState.currentChat };
            if (updatedCurrentChat.isGroupChat) {
                updatedCurrentChat.roomProfilePicture =
                    newProfilePicture.profilePicture;
            } else {
                updatedCurrentChat.friendsProfilePicture =
                    newProfilePicture.profilePicture;
            }

            // Update the profile picture for the corresponding group chat in roomsAndFriends
            const updatedRoomsAndFriends = prevState.roomsAndFriends.map(
                (chat) => {
                    if (chat.roomId === updatedCurrentChat.roomId) {
                        if (chat.isGroupChat) {
                            return {
                                ...chat,
                                roomProfilePicture:
                                    newProfilePicture.profilePicture,
                            };
                        } else {
                            return {
                                ...chat,
                                friendsProfilePicture:
                                    newProfilePicture.profilePicture,
                            };
                        }
                    }
                    return chat;
                }
            );

            return {
                currentChat: updatedCurrentChat,
                roomsAndFriends: updatedRoomsAndFriends,
            };
        });
    };

    addGroupchatToStateVariable = (newGroupchat) => {
        this.setState((prevState) => {
            const updatedRoomsAndFriends = [
                ...prevState.roomsAndFriends,
                {
                    isGroupChat: true,
                    roomId: newGroupchat.roomId,
                    roomName: newGroupchat.roomName,
                    roomProfilePicture: undefined,
                    roomUsers: newGroupchat.roomUsers,
                },
            ];
            return { roomsAndFriends: updatedRoomsAndFriends };
        });
    };

    displayChats = () => {
        this.setState({
            chatsAreDisplayed: true,
            currentChatClassName: "hidden",
        });
    };

    render() {
        const {
            roomsAndFriends,
            currentChat,
            currentUserId,
            messages,
            roomUsers,
            allUsers,
            bioIsDisplayed,
            chatsAreDisplayed,
            chatsClassName,
            currentChatClassName,
            displayChatsOptionIsDisplayed,
        } = this.state;

        return (
            <div className={Css.wrapDiv}>
                <Toaster richColors />
                <LeftNavBar active={"home"} />

                {chatsAreDisplayed ? (
                    <div className={Css[chatsClassName]}>
                        {roomsAndFriends ? (
                            <GroupChatButton
                                friends={roomsAndFriends.filter(
                                    (chat) => chat.isGroupChat === false
                                )}
                                currentUserId={currentUserId}
                                refreshUI={(e) => {
                                    this.addGroupchatToStateVariable(e);
                                }}
                            />
                        ) : null}
                        {roomsAndFriends ? (
                            roomsAndFriends.length > 0 ? (
                                roomsAndFriends.map((chat) => (
                                    <div
                                        onClick={() => {
                                            this.selectChat(chat);
                                        }}
                                    >
                                        <Chat
                                            picture={
                                                chat.isGroupChat
                                                    ? chat.roomProfilePicture
                                                    : chat.friendsProfilePicture
                                            }
                                            name={
                                                chat.isGroupChat
                                                    ? chat.roomName
                                                    : chat.friendsUsername
                                            }
                                            isCurrentChat={
                                                currentChat.roomId ===
                                                chat.roomId
                                            }
                                        />
                                    </div>
                                ))
                            ) : null
                        ) : (
                            <div className={Css.center}>
                                <LoadingComponent color={"black"} />
                            </div>
                        )}
                    </div>
                ) : null}

                {currentChat ? (
                    <div className={Css[currentChatClassName]}>
                        <div className={Css.currentChat}>
                            <ActiveChatUpperBar
                                id={
                                    currentChat.isCurrentChat
                                        ? null
                                        : currentChat.friendsId
                                }
                                name={
                                    currentChat.isGroupChat
                                        ? currentChat.roomName
                                        : currentChat.friendsUsername
                                }
                                picture={
                                    currentChat.isGroupChat
                                        ? currentChat.roomProfilePicture
                                        : currentChat.friendsProfilePicture
                                }
                                status={"Online/Offline"}
                                isGroupChat={currentChat.isGroupChat}
                                roomId={currentChat.roomId}
                                updateHomePageUIRoomName={
                                    this.changeCurrentGroupchatName
                                }
                                updateHomePageUIRoomProfilePicture={
                                    this.changeCurrentGroupchatProfilePicture
                                }
                                roomUsers={roomUsers}
                                userId={currentUserId}
                                availableUsers={roomsAndFriends.filter(
                                    (chat) => !chat.isGroupChat
                                )}
                                updateUsersInRoomEvent={
                                    this.changeOfGroupchatUsers
                                }
                                displayChats={this.displayChats}
                                displayChatsOptionIsDisplayed={
                                    displayChatsOptionIsDisplayed
                                }
                            />

                            <div className={Css.messages} id="container">
                                {messages ? (
                                    messages.length > 0 ? (
                                        messages.map((message) => (
                                            <Message
                                                text={message.message}
                                                isSender={
                                                    currentUserId ===
                                                    message.sender
                                                        ? true
                                                        : false
                                                }
                                                sender={
                                                    currentUserId ===
                                                    message.sender
                                                        ? null
                                                        : allUsers.find(
                                                              (user) =>
                                                                  user._id ===
                                                                  message.sender
                                                          )
                                                }
                                                sendersProfileImage={
                                                    currentUserId ===
                                                    message.sender
                                                        ? null
                                                        : false
                                                }
                                                date={message.date}
                                            />
                                        ))
                                    ) : (
                                        <div
                                            className={Css.center}
                                            style={{ color: "#242424" }}
                                        >
                                            No messages
                                        </div>
                                    )
                                ) : (
                                    <div className={Css.center}>
                                        <LoadingComponent color={"black"} />
                                    </div>
                                )}
                                <Element name="target"></Element>
                            </div>

                            <ChatInput
                                sender={currentUserId}
                                roomId={currentChat.roomId}
                                handleSentMessage={
                                    this.handleReceivedAndSentMessage
                                }
                            />
                        </div>

                        {bioIsDisplayed ? (
                            <div className={Css.info}>
                                <ChatInfo
                                    picture={
                                        currentChat.isGroupChat
                                            ? currentChat.roomProfilePicture
                                            : currentChat.friendsProfilePicture
                                    }
                                    name={
                                        currentChat.isGroupChat
                                            ? currentChat.roomName
                                            : currentChat.friendsUsername
                                    }
                                    country={
                                        currentChat.isGroupChat
                                            ? ""
                                            : currentChat.friendsLocation
                                                  .country
                                    }
                                    town={
                                        currentChat.isGroupChat
                                            ? ""
                                            : currentChat.friendsLocation.town
                                    }
                                    bio={
                                        currentChat.isGroupChat
                                            ? ""
                                            : currentChat.friendsBio
                                    }
                                />
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <div className={Css.center} style={{ color: "black" }}>
                        There is none chat to be opened
                    </div>
                )}
            </div>
        );
    }
}

export default HomePage;
