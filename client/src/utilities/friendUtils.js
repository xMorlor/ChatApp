export const getNumberOfSameFriends = (idsOfFriends, user) => {
    const friendsOfOtherUser = user.friends;

    const numberOfSameFriends = friendsOfOtherUser.filter((friend) =>
        idsOfFriends.includes(friend)
    ).length;

    return numberOfSameFriends;
};
