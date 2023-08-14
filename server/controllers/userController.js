import User from "../models/User.js"

//getuser (read) 
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
        console.log(user);
    }
    catch (err) {
        res.status(404).json({ message: err.message })
    }
};
//get user friends
export const getUserFriends = async (req, res) => {
    try {
        //1-get the user
        const { id } = req.params;
        const user = await User.findById(id);
        //2-get friends ? by mapiing through user.friends and find there id
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        //3- reformatt friends to send to the front end
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return ({ _id, firstName, lastName, occupation, location, picturePath })
            }
        );
        res.status(200).json(formattedFriends);
        console.log(friends)
        console.log(user);
        console.log(formattedFriends)
    }
    catch (err) {
        res.status(403).json({ message: err.message })
    }
}
export const addRemoveFriend = async (req, res) => {
    try {
        //take id of user and the friend id to remove or add
        const { id, friendId } = req.params;
        //get the user and friend by there ids
        const user = await User.findById(id);
        const friend = await User.findById(friendId);
        //check if the user.friends include the friend to remove 
        if (user.friends.includes(friendId)) {
            //remove the friend by filtering check the id equal to friendid
            user.friends = user.friends.filter((id) => id !== friendId);
            //then remove from the friend the user

            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            //add friend to user and user to friend
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        //save changes 
        await user.save();
        await friend.save();
        // reformatt friends to send to the front end
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};