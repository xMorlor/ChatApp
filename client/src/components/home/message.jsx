import React, { useState, useRef, useEffect } from "react";
import Css from "./message.module.css";

function Message({ text, isSender, sender, date }) {
    const style = isSender ? Css.sentMessage : Css.receivedMessage;

    return (
        <div>
            {isSender ? (
                <div className={Css.wrp}>
                    <div className={style}>{text}</div>
                    <div
                        className={Css.date}
                        style={{ marginTop: "45px", marginRight: "0.8vw" }}
                    >
                        {date}
                    </div>
                </div>
            ) : (
                <div>
                    <div className={Css.senderName}>{sender.username}</div>

                    <div className={Css.wrap}>
                        {sender.profilePicture ? (
                            <img
                                src={sender.profilePicture}
                                className={Css.image}
                                alt="Profile"
                            />
                        ) : (
                            <img
                                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                className={Css.image}
                                alt="Default Profile"
                            />
                        )}

                        <div>
                            <div className={style}>{text}</div>
                            <div className={Css.date}>{date}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Message;
