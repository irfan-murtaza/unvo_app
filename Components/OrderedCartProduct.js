import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  Pressable,
  Text,
  Button,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { get_width, get_height } from "../responsive_width_height";
import { app } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { addCartPrice } from "../store/redux/cart";
import { ref, getDownloadURL } from "firebase/storage";
import { setCartPrice } from "../store/redux/cart";
import "firebase/compat/storage";
import "firebase/compat/firestore";

export default function OrderedCartProduct(props) {
  const [quantity, setQuantity] = useState(props.cart.quantity);
  const [imageURL, setImageURL] = useState(null);
  const [error, setError] = useState('')
  

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try{
        const fileRef = ref(app.storage(), props.cart.productImageRef);
        const URL = await getDownloadURL(fileRef);
        setImageURL(URL);
      }catch(error){
        setError("server error, please try again")
      }
    };
    fetchData();
  }, [props.cart]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.flexdiv}>
          <View style={styles.imgdiv}>
            <Image
              style={styles.selectedProduct}
              source={{
                uri: imageURL,
              }}
            />
          </View>
          <View style={styles.producttitlediv}>
            <Text style={styles.textdesign}> {props.cart.productName}</Text>
            <Text style={styles.textdesign}> ${props.cart.productPrice}</Text>
          </View>
          <View style={styles.incredecrediv}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.text}>{quantity}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    width: get_width(100),
    paddingTop: 40,
  },
  row: {
    width: get_width(100),
  },
  flexdiv: {
    flexDirection: "row",
  },
  textdesign: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
  },
  imgdiv: {
    paddingLeft: get_width(10),
    paddingTop: get_height(1),
  },
  producttitlediv: {
    paddingLeft: get_width(5),
    paddingTop: get_height(2.5),
  },
  selectedProduct: {
    width: 90,
    height: 90,
    borderRadius: 20,
  },
  incredecrediv: {
    paddingLeft: get_width(15),
    paddingTop: get_height(4),
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
