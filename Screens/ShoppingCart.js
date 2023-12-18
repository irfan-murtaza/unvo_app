import React, { useState, useEffect } from "react";
import { get_width, get_height } from "../responsive_width_height";
import ViewProductHeader from "../Components/Headers/ViewProductHeader";
import CartProduct from "../Components/CartProduct";
import Footer from "../Components/Footer/Footer";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { app } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { ref, getDownloadURL } from "firebase/storage";
import { setRecentDeletedProductName } from "../store/redux/products";
import {
  setCartPrice,
  addCartPrice,
  resetCartPrice,
  addProductInCart,
  resetCartProduct,
} from "../store/redux/cart";
import "firebase/compat/storage";
import "firebase/compat/firestore";

export default function ShoppingCart() {
  const [carts, setCarts] = useState([]);
  const stateUserData = useSelector((state) => state.userData);
  const stateCart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [error, setError] = useState("");

  const fetchLogo = async (cartID, cartData) => {
    try {
      const fileRef = ref(app.storage(), cartData["productImageRef"]);
      const URL = await getDownloadURL(fileRef);
      if (cartData.quantity > 0) {
        dispatch(
          addProductInCart({
            product: { productImage: URL, cartID: cartID, cartData: cartData },
          })
        );
      }
      dispatch(
        addCartPrice({
          cartPrice: cartData["productPrice"] * cartData["quantity"],
        })
      );
    } catch (error) {
      setError("server error, please try again");
    }
  };

  useEffect(() => {
    try {
      const firestore = app.firestore();
      firestore
        .collection("carts")
        .where("customerID", "==", stateUserData["userEmail"])
        .where("status", "==", "active")
        .get()
        .then((querySnapshot) => {
          dispatch(resetCartProduct());
          dispatch(resetCartPrice());
          querySnapshot.forEach((doc) => {
            fetchLogo(doc.id, doc.data());
          });
        })
        .catch((error) => {
          setError("server error");
        });
    } catch (error) {
      setError("server error, please try again");
    }
  }, [stateUserData["userEmail"]]);

  function checkoutNavigation() {
    navigation.navigate("CardPayment");
  }

  return (
    <>
      <View>
        <ViewProductHeader />
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.row}>
              <View style={styles.topdiv}>
                <Text style={styles.textdesign}>My Cart Items</Text>
              </View>
            </View>

            {stateCart.cartPrice ? (
              stateCart.cartProducts.map((cart, index) => {
                if (cart.cartData.quantity > 0) {
                  return <CartProduct cart={cart} key={index} />;
                }
              })
            ) : (
              <View style={styles.discountdiv}>
                <Text style={styles.textdesign1}>Your Cart is Empty</Text>
              </View>
            )}
            <View style={styles.row}>
              <View style={styles.discountdiv}>
                <Text style={styles.textdesign1}>
                  Do you have any Discount Code?
                </Text>
              </View>
              <View style={styles.discountdiv2}>
                <TextInput
                  style={styles.input}
                  placeholder="Discount Code"
                  placeholderTextColor={"black"}
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.discountdiv}>
                <View style={styles.textdesigndots}></View>
              </View>
              <View style={styles.pricediv}>
                <View style={styles.price1}>
                  <Text style={styles.textdesign}>Total</Text>
                </View>
                <View style={styles.price2}>
                  <Text style={styles.textdesign}>${stateCart.cartPrice}</Text>
                </View>
              </View>
              <View style={styles.registerbutton}>
                <TouchableOpacity
                  style={styles.appButtonContainer}
                  onPress={checkoutNavigation}
                >
                  <Text style={styles.appButtonText}>CHECKOUT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    width: get_width(100),
    paddingTop: get_height(1),
  },
  row: {
    width: get_width(100),
  },
  textdesign: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  textdesign1: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  textdesigndots: {
    color: "white",
    borderBottomWidth: get_width(0.5),
    borderBottomColor: "white",
  },
  topdiv: {
    paddingTop: get_height(2),
    alignItems: "center",
  },
  discountdiv: {
    paddingTop: get_height(6),
    paddingHorizontal: get_width(15),
    width: get_width(94),
  },
  discountdiv2: {
    paddingTop: 10,
    paddingLeft: get_width(15),
  },
  pricediv: {
    flexDirection: "row",
    padding: get_width(8),
  },
  price1: {
    paddingLeft: get_width(10),
  },
  price2: {
    paddingLeft: get_width(35),
  },
  input: {
    height: get_height(5),
    borderRadius: 1,
    backgroundColor: "white",
    width: get_width(65),
    color: "black",
    padding: 10,
  },
  registerbutton: {
    width: get_width(80),
    paddingLeft: get_width(17),
    paddingBottom: get_height(46),
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "white",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  scrollView: {
    marginBottom: get_height(0),
  },
});
