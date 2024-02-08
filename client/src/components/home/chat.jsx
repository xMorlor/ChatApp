import Css from "./chat.module.css";

function Chat({ picture, name, isCurrentChat }) {
    return (
        <div className={isCurrentChat ? Css.selectedChat : Css.chat}>
            <div className={Css.wrapPictureAndName}>
                {picture ? (
                    <img src={picture} className={Css.profilePicture} />
                ) : (
                    <img
                        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        className={Css.profilePicture}
                    />
                )}
                <div>
                    <div className={Css.username}>{name}</div>
                    <div className={Css.status}>Online/Offline</div>
                </div>
            </div>

            <div className={Css.lastMessage}>Last message in chat</div>
        </div>
    );
}

export default Chat;
