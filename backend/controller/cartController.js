import User from "../model/userModel.js";


export const addToCart = async (req, res) => {
    try {
        const {itemId, size} = req.body;
        console.log("ADD TO CART REQUEST:", { userId: req.user.userId, itemId, size });

        const userData = await User.findById(req.user.userId);

        if(!userData){
            return res.status(404).json({message: "User not found"});
        }
        let cartData = userData.cartData || {}
        console.log("CURRENT CART DATA:", cartData);

        if (cartData[itemId]){
            if(cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        await User.findByIdAndUpdate(req.user.userId, {cartData});
        console.log("UPDATED CART DATA:", cartData);
        return res.status(201).json({success: true, message: "Add to cart"});
    } catch (error) {
        return res.status (500).json({message: "addToCart error"});    
    }
}

export const updateCart = async (req, res) => {
    try {
        const {itemId, size, quantity} = req.body
        const userData =await User.findById(req.user.userId)
        let cartData = await userData.cartData;
        
        cartData[itemId][size] = quantity

        await User.findByIdAndUpdate(req.user.userId, {cartData});
        return res.status(201).json({success: true, message: "Cart Updated"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"updateCart error"})
    }
    
}

export const getUserCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.cartData || {});
    } catch (error) {
        console.error("GET CART ERROR 👉", error);
        res.status(500).json({ message: error.message });
    }
};