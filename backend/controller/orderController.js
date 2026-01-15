import User from "../model/userModel.js";
import Order from "../model/orderModel.js";

export const placeOrder = async (req, res) => {
    try {
        const {items, amount , address} = req.body;
        const userId = req.user.userId;
        const orderData = {
            items,
            amount,
            userId,
            address,
            paymentMethod: 'COD',
            payment:false,
            date: Date.now()
        }

        const newOrder = new Order(orderData)
        await newOrder.save()

        await User.findByIdAndUpdate(userId, { cartData: {} })


        return res.status(201).json({message:'Order Place'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Order Place error'})
    }
}

export const userOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.log("USER ORDERS ERROR 👉", error);
    res.status(500).json({ message: error.message });
  }
};