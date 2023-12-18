import React, { useEffect } from "react";
import { useState } from "react";
import { get_width, get_height } from "../responsive_width_height";
import ViewProductHeader from "../Components/Headers/ViewProductHeader";
import CartProduct from "../Components/CartProduct";
import Footer from "../Components/Footer/Footer";
import OrderedCartProduct from "../Components/OrderedCartProduct";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../config/firebase";
import "firebase/compat/storage";
import "firebase/compat/firestore";
import { useNavigation } from "@react-navigation/native";

export default function ViewMyOrder({ navigation, route }) {
  const stateUserData = useSelector((state) => state.userData);
  const [orderDetails, setOrderDetails] = useState({});
  const [carts, setCarts] = useState([]);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try{
        const firestore = app.firestore();
        await firestore
          .collection("orders")
          .doc(route.params.orderID)
          .get()
          .then(async (doc) => {
            if (doc.exists) {
              setOrderDetails(doc.data());
              setCarts([]);
              const carts = doc.data().carts;
              if (carts) {
                carts.forEach(async (cartID) => {
                  await firestore
                    .collection("carts")
                    .doc(cartID)
                    .get()
                    .then((docData) => {
                      setCarts((carts) => [...carts, docData.data()]);
                    })
                    .catch((error) => {
                      setError("server error")
                    });
                });
              }
            }
          })
          .catch((error) => {
            setError("server error")

          });
        }catch(error){
          setError("server error, please try again")
        }
    };
    fetchData();
  }, [route.params.orderID]);

  return (
    <>
      <View>
        <ViewProductHeader />
        <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.row}>
            <View style={styles.topdiv}>
              <Text style={styles.pricetextdesign}>Order Details</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.pricetext}>
              <Text style={styles.pricetextdesign}>Address</Text>
            </View>
            <View style={styles.pricetext}>
              <Text style={styles.textdesign}>
                {orderDetails ? orderDetails.homeAddress : ""}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.pricetext}>
              <Text style={styles.pricetextdesign}>Phone No</Text>
            </View>
            <View style={styles.pricetext}>
              <Text style={styles.textdesign}>
                {orderDetails ? orderDetails.phone : ""}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.pricetext}>
              <Text style={styles.pricetextdesign}>Additional Information</Text>
            </View>
            <View style={styles.pricetext}>
              <Text style={styles.textdesign}>
                {orderDetails ? orderDetails.additionalInfo : ""}
              </Text>
            </View>
          </View>

          {carts.map((cart, index) => {
            return <OrderedCartProduct cart={cart} key={index} />;
          })}

          <View style={styles.row}>
            <View style={styles.pricediv}>
              <View style={styles.price1}>
                <Text style={styles.textdesign}>Total</Text>
              </View>
              <View style={styles.price2}>
                <Text style={styles.textdesign}>
                  ${orderDetails ? orderDetails.totalPrice : ""}
                </Text>
              </View>
            </View>
          </View>
        </View>
        </ScrollView>
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
    height: get_height(93),
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
    fontSize: 24,
    color: "white",
  },
  topdiv: {
    paddingTop: get_height(2),
    alignItems: "center",
    paddingBottom: get_height(5),
  },
  discountdiv: {
    paddingTop: get_height(4),
    paddingHorizontal: get_width(16),
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
    alignItems: "center",
  },
  textdesign: {
    fontSize: get_height(2.3),
    color: "white",
  },
  pricetext: {
    paddingLeft: get_width(12.5),
    marginTop: get_height(1),
  },
  pricetextdesign: {
    fontSize: get_height(3),
    color: "white",
    fontWeight: "bold",
  },
  registerbutton: {
    width: get_width(80),
    paddingLeft: get_width(17),
    paddingBottom: get_height(6),
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
    paddingBottom: get_height(20),
  },
});
