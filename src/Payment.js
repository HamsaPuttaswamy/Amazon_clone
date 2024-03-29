import React, { useState, useEffect } from 'react';
import './Payment.css';
import { useStateValue } from './StateProvider';
import CheckoutProduct from './CheckoutProduct';
import {Link} from "react-router-dom";
import { CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "./reducer";
import axios from "./axios"
import { useNavigate } from "react-router-dom";
import {db} from './Firebase';

function Payment() {
  const [{basket,user},dispatch] = useStateValue();

  const stripe = useStripe();
  const elements = useElements();

  const [succeeded,setSucceeded] = useState(false);
  const [processing,setProcessing] = useState("");
  const [error,setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState(true);

  const navigate = useNavigate();

  useEffect (()=>{  
    const getClientSecret = async() =>{

        const response = await axios({
            method: 'post',
            // strip requires the values to be sent in cents
            url: `/payments/create?total=${getBasketTotal(basket)* 100}`
        });
        setClientSecret(response.data.clientSecret)

    }

    getClientSecret();
  
  },[basket])

    console.log("client secret >>>",clientSecret);

  const handleSubmit = async (event) =>{
        event.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret,{
            payement_method:{
                card: elements.getElement(CardElement)
            }
        }).then(({paymentIntent})=>{
            //payment confirmation

            db
              .collection('users')
              .doc(user?.uid)
              .collection('orders')
              .doc(paymentIntent.id)
              .set({
                basket: basket,
                amount: paymentIntent.amount,
                created: paymentIntent.created
              })
            setSucceeded(true);
            setError(null);
            setProcessing(false)

            dispatch({
                type:'EMPTY_BASKET'
            })

            navigate('/orders')
        }) 
           

  }

  const handleChange = event => {

    setDisabled(event.empty);
    setError(event.error ? event.error.message:"");

  }

  return (
    <div className = 'payment'>
        <div className='payment__container'>
             <h1>
                Checkout(
                    <Link to="/checkout">{basket?.length} items</Link>
                )
             </h1>
            <div className='payment__section'>
                <div className='payment__title'>
                    <h3>Delivery address</h3>
                </div>
                <div className='payment__address'>
                    <p>{user?.email}</p>
                    <p>123 lane</p>
                    <p>seattle WA</p>
                </div>
            </div >

            <div className='payment__section'>
                <div className='payment__title'>
                    <h3>Review items and delivery</h3>
                </div>
                <div className='payement__items'>
                    {basket.map(item => (
                        <CheckoutProduct
                            id={item.id}
                            title={item.title}
                            image={item.image}
                            price={item.price}
                            rating={item.rating}
                        />
                    ))}
                </div>

            </div>
            <div className='payment__section'>
                <div className='payment__title'>
                    <h3>Review items and delivery</h3>
                </div>
                <div className='payment__details'>
                    <form onSubmit={handleSubmit}>
                        <CardElement onChange={handleChange}/>

                        <div className='payment__priceContainer'>
                            <CurrencyFormat
                                renderText={(value) => (
                                    <h3>Order Total:{value}</h3>
                                )}
                                decimalScale={2}
                                value={getBasketTotal(basket)} // Part of the homework
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"$"}
                            />    
                            <button disabled={processing || disabled || succeeded}>
                                <span>{ processing ? 
                                    <p>processing</p> : "buy now"}
                                </span>
                            </button>
                        </div>
                        {error && <div>{error}</div>}
                    </form>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Payment
