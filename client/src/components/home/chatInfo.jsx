import Css from "./chatInfo.module.css";

function ChatInfo({ isGroupchat, picture, name, country, town, bio }) {
    const getDisplayedLocation = (country, town) => {
        if (country === "" && town === "") {
            return "";
        } else if (country !== "" && town !== "") {
            return `${country}, ${town}`;
        } else if (country !== "" && town === "") {
            return country;
        } else if (country === "" && town !== "") {
            return town;
        }
    };

    return (
        <div className={Css.wrapDiv}>
            {picture ? (
                <img src={picture} className={Css.picture} />
            ) : (
                <img
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    className={Css.picture}
                />
            )}
            <div className={Css.name}>{name}</div>
            <div className={Css.location}>
                {isGroupchat ? null : getDisplayedLocation(country, town)}
            </div>
            {isGroupchat ? null : bio.length > 0 ? (
                <div className={Css.bio}>{isGroupchat ? null : bio}</div>
            ) : null}
        </div>
    );
}

export default ChatInfo;
