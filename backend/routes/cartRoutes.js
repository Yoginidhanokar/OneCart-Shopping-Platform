import express from 'express';
import { addToCart, getUserCart, updateCart } from '../controller/cartController.js';
import isAuth from '../middleware/isAuth.js';

const cartRoutes = express.Router();

cartRoutes.post('/get', isAuth, getUserCart);
cartRoutes.post('/add', isAuth, addToCart);
cartRoutes.post('/update', isAuth, updateCart);
cartRoutes.post('/add', isAuth, (req, res, next) => {
  console.log("🔥 /api/cart/add hit");
  next();
}, addToCart);

export default cartRoutes;