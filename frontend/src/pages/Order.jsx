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
    const result = await axios.get(
      serverUrl + '/api/order/userorders',
      { withCredentials: true }
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
            {
                orderData.map((item,index)=>(
                    <div key={index} className='w-[100%] h-[10%] border-t border-b'>
                        <div className='w-[100%] h-[80%] flex items-start gap-6 bg-[#51808048] py-[10px] px-[20px] rounded-2xl relative'>
                            <img src={item?.image1} alt="" className='w-[130px] h-[130px] rounded-md'/>
                            <div className='flex items-start justify-center flex-col  gap-[5px]'>
                                <p></p>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>

    </div>
  )
}

export default Order
