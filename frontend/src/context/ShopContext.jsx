import React, { useState, useEffect, useContext } from 'react'
import { authDataContext } from './authContext'
import axios, { Axios } from 'axios'
import { userDataContext } from './UserContext'
import { toast } from "react-toastify"  

 export const shopDataContext = React.createContext()

function ShopContext({children}) { 

    let [products,setProducts] = useState([])
    let [search,setSearch] = useState('')
    let {userData} = useContext(userDataContext)
    let [showSearch,setShowSearch] = useState(false)
    let {serverUrl} = useContext(authDataContext)
    let [cartItem,setCartItem] = useState({})
    let currency = "$";
    let delivery_fee = 40;

    const getProducts = async () => {
        try {
            let result = await axios.get(serverUrl + "/api/product/list")
            console.log(result.data)
            setProducts(result.data)
        } catch (error) {
            console.log(error)
        }
    }

      const addtoCart = async (itemId, size) => {
        if (!size) {
          alert("Please select a size.");
          return;
        }
        
        try {
          const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login to add items to cart.");
          return;
        }

        const response = await axios.post(
          serverUrl + "/api/cart/add",
          { itemId, size },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setCartItem(prev => {
            const updated = structuredClone(prev);
            if (!updated[itemId]) updated[itemId] = {};
            if (!updated[itemId][size]) updated[itemId][size] = 0;
            updated[itemId][size] += 1;
            return updated;
          });
        }
      } catch (error) {
        console.log("Add to cart error:", error);
      }
    };


    const getUserCart = async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        console.log("No token found")
        return
      }

      const response = await axios.post(
        serverUrl + "/api/cart/get",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setCartItem(response.data)
    } catch (error) {
      console.log("Get cart error:", error)
    }
  }

    
    const updateQuantity = async (itemId, size, quantity) => {
      let cartData = structuredClone(cartItem);
      cartData[itemId][size] = quantity
      setCartItem(cartData)

      if(userData) {
        try {
          const token = localStorage.getItem("token");
          await axios.post(serverUrl + "/api/cart/update", {itemId, size ,quantity}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        } catch (error) {
          console.log(error)
          toast.error(error.message)
          
        }
      }
    }

    const getCartCount = () => {
      let totalCount = 0;
      for (const items in cartItem) {
        for (const item in cartItem[items]){
          try {
            if (cartItem[items][item] > 0) {
              totalCount += cartItem[items][item]
            }
          }catch (error) {

          }
        }
      }
      return totalCount
    }

    const getCartAmount = () => {
  let totalAmount = 0;

  for (const items in cartItem) {
    const itemInfo = products.find(
      (product) => product._id === items
    );

    if (!itemInfo) continue;

    for (const size in cartItem[items]) {
      const quantity = cartItem[items][size];

      if (quantity > 0) {
        totalAmount += itemInfo.price * quantity;
      }
    }
  }

  return totalAmount;
};



    useEffect(()=>{
        getProducts()
    },[])

    useEffect(() => {
      getUserCart()
    },[userData])

    let value = {
        products, currency, delivery_fee,getProducts, search,setSearch,showSearch,setShowSearch, cartItem, addtoCart, getCartCount, setCartItem, updateQuantity, getCartAmount
    }
  return (
    <div>
      <shopDataContext.Provider value={value}>
        {children}
      </shopDataContext.Provider>
    </div>
  )
}

export default ShopContext
