import React, { useEffect, useState } from "react";
import Css from "./profile.module.css";
import PowerUserButton from "./powerUserButton";
import ProfileSlide from "./profileSlide";
import Slider from "react-slick";
import Button from "../widelyUsed/button";
import { getLocation } from "../../utilities/countriesAndCitiesApi";
import { updateProfile } from "../../utilities/profile";
import { getBinaryData } from "../../utilities/binaryData";
import { getFriends } from "../../utilities/friends";
import { getNumberOfSameFriends } from "../../utilities/friendUtils";
import { Toaster, toast } from "sonner";

function Profile({
    profilePic,
    name,
    location,
    bio,
    friends,
    isPowerUser,
    displayNewProfileEvent,
}) {
    const [locationData, setLocationData] = useState([]);
    const [cityData, setCityData] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedTown, setSelectedTown] = useState("");
    const [nameState, setName] = useState("");
    const [bioState, setBio] = useState("");
    const [profilePictureState, setProfilePicture] = useState("");
    const [arrayOfFriends, setArrayOfFriends] = useState(null);
    const [sliderSettings, setSliderSettings] = useState(null);
    const [profileDirection, setProfileDirection] = useState(null);

    const getLocationData = async () => {
        return await getLocation();
    };

    useEffect(() => {
        const fetchData = async () => {
            let locationData = await getLocationData();
            setLocationData(locationData);

            const friendsOfCurrentUser = await getFriends();
            const arrayOfFriends = friendsOfCurrentUser.arrayOfFriends.map(
                (user) => user._id
            );
            setArrayOfFriends(arrayOfFriends);
        };

        const windowWidth = window.innerWidth;
        let direction;

        if (windowWidth <= 480) {
            setSliderSettings({
                dots: false,
                infinite: false,
                speed: 400,
                slidesToShow: 1,
                slidesToScroll: 1,
            });

            direction = "profileColumn";
        } else if (windowWidth > 480 && windowWidth < 1024) {
            setSliderSettings({
                dots: false,
                infinite: false,
                speed: 400,
                slidesToShow: 2,
                slidesToScroll: 1,
            });

            direction = "profileRow";
        } else if (windowWidth >= 1024 && windowWidth < 1200) {
            setSliderSettings({
                dots: false,
                infinite: false,
                speed: 400,
                slidesToShow: 4,
                slidesToScroll: 2,
            });

            direction = "profileRow";
        } else {
            // větší nebo rovno 1200
            setSliderSettings({
                dots: false,
                infinite: false,
                speed: 400,
                slidesToShow: 4,
                slidesToScroll: 2,
            });

            direction = "profileRow";
        }
        setProfileDirection(direction);

        setName(name);
        setSelectedCountry(location.country);
        setSelectedTown(location.town);
        setBio(bio);
        setProfilePicture(profilePic);

        fetchData();
    }, [isPowerUser]);

    const handleCountryChange = (selectedCountry) => {
        if (selectedCountry && selectedCountry !== "Unchanged") {
            const country = locationData.find(
                (country) => country.country === selectedCountry
            );

            setCityData(country.cities);
        }
    };

    const openDialog = () => {
        const dialog = document.querySelector("dialog");
        dialog.showModal();
    };

    const closeDialog = () => {
        const dialog = document.querySelector("dialog");
        dialog.close();
    };

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
        <div className={Css.wrap}>
            <Toaster richColors />
            {
                //musí být ternary na všechno, protože by se jinak na každým profilu ukazovalo info přihlášenýho usera
                isPowerUser ? (
                    <div className={Css[profileDirection]}>
                        {profilePictureState ? (
                            <img
                                src={profilePictureState}
                                className={Css.profilePic}
                            />
                        ) : (
                            <img
                                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                className={Css.profilePic}
                            />
                        )}

                        <div className={Css.flexColumn}>
                            <div className={Css.name}>{nameState}</div>
                            <div className={Css.location}>
                                {getDisplayedLocation(
                                    selectedCountry,
                                    selectedTown
                                )}
                            </div>
                        </div>

                        {bioState !== "" ? (
                            <div className={Css.bioAndButtonWrap}>
                                <div className={Css.bio}>{bioState}</div>

                                {isPowerUser ? (
                                    <PowerUserButton
                                        onclickEvent={openDialog}
                                    />
                                ) : null}
                            </div>
                        ) : (
                            <div className={Css.powerButtonWrap}>
                                {isPowerUser ? (
                                    <PowerUserButton
                                        onclickEvent={openDialog}
                                    />
                                ) : null}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={Css[profileDirection]}>
                        {profilePic ? (
                            <img src={profilePic} className={Css.profilePic} />
                        ) : (
                            <img
                                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                className={Css.profilePic}
                            />
                        )}

                        <div className={Css.flexColumn}>
                            <div className={Css.name}>{name}</div>
                            <div className={Css.location}>
                                {getDisplayedLocation(
                                    location.country,
                                    location.town
                                )}
                            </div>
                        </div>

                        {bio !== "" ? (
                            <div className={Css.bio}>{bio}</div>
                        ) : null}
                    </div>
                )
            }

            <dialog className={Css.dialog}>
                <div className={Css.dialogWrap}>
                    <h1 className={Css.dialogHeader}>Update profile</h1>

                    <label htmlFor="username" className={Css.label}>
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        defaultValue={nameState}
                        className={Css.inputField}
                    />

                    <label for="country" className={Css.label}>
                        Country
                    </label>
                    <select
                        id="country"
                        onChange={(e) => {
                            handleCountryChange(e.target.value);
                        }}
                        className={Css.select}
                    >
                        <option value={null}>Unchanged</option>
                        {locationData.map((country) => (
                            <option value={country.country}>
                                {country.country}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="town" className={Css.label}>
                        Town
                    </label>
                    <select id="town" className={Css.select}>
                        <option value={null}>Unchanged</option>
                        {cityData.map((city) => (
                            <option value={city}>{city}</option>
                        ))}
                    </select>

                    <label htmlFor="bio" className={Css.label}>
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        rows="3"
                        defaultValue={bioState}
                        maxLength={320}
                        className={Css.textarea}
                    />

                    <label htmlFor="profilePicture" className={Css.label}>
                        Profile picture
                    </label>
                    <input
                        type="file"
                        id="profilePicture"
                        className={Css.picInput}
                        accept="image/png, image/jpeg"
                    />
                    <div className={Css.buttonsWrap}>
                        <Button
                            text={"Submit"}
                            onclickEvent={() => {
                                let usernameInput =
                                    document.getElementById("username").value;
                                let countryInput =
                                    document.getElementById("country").value;
                                let townInput =
                                    document.getElementById("town").value;
                                let bioInput =
                                    document.getElementById("bio").value;
                                let profilePictureInput =
                                    document.getElementById("profilePicture")
                                        .files[0];

                                const usernameRegExp = new RegExp(
                                    "^[A-Za-z0-9]{1,16}$"
                                );

                                if (
                                    usernameRegExp.test(usernameInput) === true
                                ) {
                                    countryInput =
                                        countryInput !== "Unchanged"
                                            ? countryInput
                                            : selectedCountry;
                                    townInput =
                                        townInput !== "Unchanged"
                                            ? townInput
                                            : selectedTown;

                                    if (profilePictureInput) {
                                        getBinaryData(
                                            profilePictureInput,
                                            (resolvedData) => {
                                                updateProfile(
                                                    usernameInput,
                                                    countryInput,
                                                    townInput,
                                                    bioInput,
                                                    resolvedData
                                                );

                                                setName(usernameInput);
                                                setSelectedCountry(
                                                    countryInput
                                                );
                                                setSelectedTown(townInput);
                                                setBio(bioInput);
                                                setProfilePicture(resolvedData);
                                            }
                                        );
                                    } else {
                                        updateProfile(
                                            usernameInput,
                                            countryInput,
                                            townInput,
                                            bioInput,
                                            profilePictureState
                                        );

                                        setName(usernameInput);
                                        setSelectedCountry(countryInput);
                                        setSelectedTown(townInput);
                                        setBio(bioInput);
                                    }
                                } else {
                                    toast.error(
                                        "Invalid username. Only characters and numbers are allowed. 1 - 16 length"
                                    );
                                }

                                closeDialog();
                            }}
                        />
                        <Button text={"Close"} onclickEvent={closeDialog} />
                    </div>
                </div>
            </dialog>

            <div className={Css.sliderWrap}>
                {
                    <Slider {...sliderSettings}>
                        {friends.map((friend) => (
                            <ProfileSlide
                                profilePic={friend.profilePicture}
                                name={friend.username}
                                numberOfSameFriends={
                                    arrayOfFriends
                                        ? getNumberOfSameFriends(
                                              arrayOfFriends,
                                              friend
                                          )
                                        : "-"
                                }
                                clickEvent={displayNewProfileEvent}
                                id={friend._id}
                            />
                        ))}
                    </Slider>
                }
            </div>
        </div>
    );
}

export default Profile;
