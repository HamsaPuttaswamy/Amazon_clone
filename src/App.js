import React, { useEffect } from "react"
import './App.css';
import Header from './Header.js'
import Home from './Home.js'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Checkout from "./Checkout"
import Login from './Login.js'
import {auth} from './Firebase'
import { useStateValue } from "./StateProvider";
import Payment from './Payment';
import {loadStripe} from "@stripe/stripe-js"
import { Elements } from '@stripe/react-stripe-js';
import Orders from './Orders.js'

const promise = loadStripe("pk_test_51J8nrkDWH0Vk4WOGU5IeUzjCYXqPhYlbc9rE1om0eGJN3kSz3J96kxgTWQA9Ww9mKNJOuJXTxRqH0BCf64rmWlCB00SJDG481g");

function App() {
  const [{},dispatch] = useStateValue();


  useEffect(()=>{
    //will only run when app component loads
    auth.onAuthStateChanged(authUser => {
      console.log("the user is >>>>",authUser);

      if (authUser){
        //user is logged in 
        dispatch({
          type: 'SET_USER',
          user: authUser
        })

      } else {
        //user is logged out
        dispatch({
          type: 'SET_USER',
          user: null
        })
      }
    })
  },[])

  return (
      <Router>
          <Routes>
            <Route path="/login" element={<><Login/></>}/>
            <Route path="/checkout" element={<><Header/><Checkout/></>}/> 
            <Route path="/checkout" element={<><Orders/></>}/> 
            <Route path="/payment" element={<><Header/><Elements stripe ={promise}><Payment/></Elements></>}/>  
            <Route exact path="/" element={<><Header/><Home/></>}/>
          </Routes>
      </Router>
  );
}

export default App;
