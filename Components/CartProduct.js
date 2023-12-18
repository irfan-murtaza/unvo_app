import React, { useState, useEffect } from "react";

import { StyleSheet, Pressable, Text, Button, View, Image, TouchableOpacity } from "react-native";
import { app } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { addCartPrice } from "../store/redux/cart";
import { ref, getDownloadURL } from "firebase/storage";
import { setCartPrice } from "../store/redux/cart";
import "firebase/compat/storage";
import 'firebase/compat/firestore';
import { get_width, get_height } from "../responsive_width_height";


export default function CartProduct(props) {
  const [quantity, setQuantity] = useState(props.cart.cartData.quantity)
  const [error, setError] = useState('')
  
   const stateCart = useSelector((state) => state.cart)
   const dispatch = useDispatch()

  function increment(){
    try{
      const firestore = app.firestore()
      firestore.collection("carts").doc(props.cart.cartID).update({
        quantity: (quantity+1)
      }).then(()=>{
        setQuantity(quantity=>quantity+1)
        dispatch(addCartPrice({cartPrice: props.cart.cartData.productPrice}))
      }).catch((error)=>{
        setError("server error")
      })
    }catch(error){
      setError("server error, please try again")
    }
  }

  function decrement(){
    if(quantity>0){
      try{
        const firestore = app.firestore()
        firestore.collection("carts").doc(props.cart.cartID).update({
          quantity: (quantity-1)
        }).then(()=>{
          setQuantity(quantity=>quantity-1)
          dispatch(addCartPrice({cartPrice: props.cart.cartData.productPrice * (-1) }))
        }).catch((error)=>{
          setError("server error")
        })
      }catch(error){
        setError("server error, please try again")
      }
    }
  }
  return (
    <>
      {quantity>0 &&
        <View style={styles.container}>
          <View style={[styles.flexdiv,{justifyContent:'space-between'}]}>
          <View style={[styles.flexdiv]}>
            <View style={styles.imgdiv}>
            <Image
                style={styles.selectedProduct}
                source={{
                    uri: props.cart.productImage,
                }}
            />
            </View>
            <View style={styles.producttitlediv}>
              <Text style={[styles.textdesign,{}]}> {props.cart.cartData.productName}</Text>
              <Text style={styles.textdesign}> ${props.cart.cartData.productPrice}</Text>
            </View>
          </View>
            <View style={styles.incredecrediv}>
              <TouchableOpacity style={styles.button1} onPress={increment}>
                <Text style={styles.text1}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.text}>{quantity}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button1} onPress = {decrement}>
                <Text style={styles.text1}>-</Text>
              </TouchableOpacity>
            </View>
            </View>
        </View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    width: "100%",
    paddingTop: 40,
    // paddingHorizontal:20
  },
  row: {
    // width: "100%",
  },
  flexdiv: {
    flexDirection: "row",
    alignItems:'center'
  },

  textdesign: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
  },
  imgdiv: {
    marginLeft:30,
    width:get_width(25)

  },
  producttitlediv: {
    paddingHorizontal:10,
    width:get_width(52)

  },
  selectedProduct: {
    width: 90,
    height: 90,
    borderRadius: 20,
  },
  incredecrediv: {
    marginRight:20,
    width:get_width(10)

  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "white",
  },
  button1: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
  text1: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
});
