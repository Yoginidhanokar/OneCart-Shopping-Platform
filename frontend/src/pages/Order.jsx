import React, { useContext, useEffect, useState } from 'react'
import Title from '../component/Title'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/authContext'
import axios from 'axios'

function Order() {
    let [orderData, setOrderData] = useState([])
    let {currency} = useContext(shopDataContext)
    let {serverUrl} = useContext(authDataContext)

    const loadOrderData = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;
    const result = await axios.post(
      serverUrl + '/api/order/list',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(token)}`,
        },
      }
    )

    if (Array.isArray(result.data)) {
      const allOrderItem = []

      result.data.forEach(order => {
        order.items.forEach(item => {
          allOrderItem.push({
            ...item,
            status: order.status,
            payment: order.payment,
            paymentMethod: order.paymentMethod,
            date: order.date,
          })
        })
      })

      setOrderData(allOrderItem.reverse())
    }
  } catch (error) {
    console.error("Order fetch error:", error)
  }
}


    useEffect(()=>{
        loadOrderData()
    },[])

  return (
    <div className='w-[99vw] min-h-[100vh] p-[20px] pb-[150px] overflow-hidden bg-gradient-to-l from-[#141414] to-[#0c2025]'>
        <div className='h-[8%] w-[100%] text-center mt-[80px]'>
            <Title text1={'MY'} text2={'ORDER'}/>
        </div>
        <div className='w-[100%] h-[92%] flex flex-wrap gap-[20px]'>
            {orderData.length === 0 ? (
                <div className='w-[100%] text-center py-[50px]'>
                    <p className='text-[20px] text-white'>No orders found</p>
                    <p className='text-[16px] text-gray-400 mt-2'>You haven't placed any orders yet.</p>
                </div>
            ) : (
                orderData.map((item,index)=>(
                    <div key={index} className='w-[100%] h-[10%] border-t border-b'>
                        <div className='w-[100%] h-[80%] flex items-start gap-6 bg-[#51808048] py-[10px] px-[20px] rounded-2xl relative'>
                            <img src={item?.image1} alt="" className='w-[130px] h-[130px] rounded-md'/>
                            <div className='flex items-start justify-center flex-col gap-[5px]'>
                                <p className='text-[18px] font-semibold text-white'>{item.name}</p>
                                <div className='flex items-center gap-[8px] md:gap-[20px]'>
                                  <p className='md:text-[18px] text-[12px] text-[#aaf4e7]'>{currency} {item.price}</p>
                                  <p className='md:text-[18px] text-[12px] text-[#aaf4e7]'>Quantity {item.quantity}</p>
                                  <p className='md:text-[18px] text-[12px] text-[#aaf4e7]'>Size {item.size}</p>
                                </div>
                                <div className='flex items-center'>
                                  <p className='md:text-[18px] text-[12px] text-[#aaf4e7]'>Date: <span className='text-[#e4fbff] pl-[10px] md:text-[16px] text-[11px]'>{new Date(item.date).toDateString()}</span></p> 
                                </div>
                                <div className='flex items-center'>
                                  <p className='md:text-[16px] text-[12px] text-[#aaf4e7]'>Payment Method: {item.paymentMethod}</p> 
                                </div>
                                <div className='absolute md:left-[55%] md:top-[40%] right-[2%] top-[2%]'>
                                  <div className='flex items-center gap-[5px]'>
                                    <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                                    <p className='md:text-[17px] text-[10px] text-[#f3f9fc]'>{item.status}</p>
                                  </div>
                                </div>
                                <div className='absolute md:right-[5%] right-[1%] md:top-[40%] top-[70%]'>
                                  <button className='md:px-[15px] px-[5px] py-[3px] md:py-[7px] rounded-md bg-[#101919] text-[#f3f9fc] text-[12px] md:text-[16px] cursor-pointer active:bg-slate-500' onClick={loadOrderData}>Track Order</button> </div>
                                {/* <p className='text-[16px] text-gray-300'>Size: {item.size}</p>
                                <p className='text-[16px] text-gray-300'>Quantity: {item.quantity}</p>
                                <p className='text-[16px] text-gray-300'>Price: {currency}{item.price}</p>
                                <p className='text-[16px] text-gray-300'>Status: <span className={`px-2 py-1 rounded ${item.status === 'Order Placed' ? 'bg-green-600' : 'bg-yellow-600'}`}>{item.status}</span></p>
                                <p className='text-[16px] text-gray-300'>Payment: {item.payment ? 'Paid' : 'Pending'}</p>
                                <p className='text-[14px] text-gray-400'>Date: {new Date(item.date).toLocaleDateString()}</p> */}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

    </div>
  )
}

export default Order
