import React, { useEffect, useState } from 'react'
import './Orders.css'
import { useStateValue } from './StateProvider'
import { db } from './Firebase';

function Orders() {
    const [{basket,user},dispatch] = useStateValue();
    const [orders,setOrders] = useState([]);

    useEffect(() =>{
        if (user){
            db
              .collection('users')
              .doc(user?.uid)
              .collections('orders')
              .orderBy('created','desc')
              .onSnapshot(snapshot=>(
                setOrders(snapshot.docs.map(doc=>({
                    id: doc.id,
                    data: doc.data()
                })))
              ))
        } else {
            setOrders([])
        }

    },[])

    return (
        <div className='orders'>
            //create order.js and send all the orders for display
        </div>
    )
}

export default Orders
