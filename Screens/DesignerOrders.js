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
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../config/firebase";
import "firebase/compat/storage";
import "firebase/compat/firestore";
import { useNavigation } from "@react-navigation/native";

export default function DesignerOrders() {
  const stateUserData = useSelector((state) => state.userData);
  const [orderDetails, setOrderDetails] = useState([]);
  const navigation = useNavigation();
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try{

        const firestore = app.firestore();
        await firestore
          .collection("orders")
          .where("designer", "==", stateUserData["userEmail"])
          .where("status", "==", "active")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
              if (doc.exists) {
                setOrderDetails((orderDetails) => [...orderDetails, doc.data()]);
              }
            });
          });
        }catch(error){
          setError("server error, please try again")
        }
    };
    fetchData();
  }, [stateUserData["userEmail"]]);

  const viewOrder = (orderID) => {
    navigation.navigate("ViewMyOrder", { orderID: orderID });
  };

  return (
    <>
      <View>
        <ViewProductHeader />
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.row}>
              <View style={styles.topdiv}>
                <Text style={styles.textdesign}>Orders Detail</Text>
              </View>
            </View>
            {orderDetails.map((order, index) => {
              const d = new Date(order.timestamp);
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    viewOrder(`${order.customerID}_${order.timestamp}`);
                  }}
                >
                  <View style={styles.row}>
                    <View style={styles.pricetext}>
                      <Text style={styles.pricetextdesign}>Order ID</Text>
                    </View>
                    <View style={styles.pricetext}>
                      <Text
                        style={styles.textdesignn}
                      >{`${order.customerID}_${order.timestamp}`}</Text>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.pricetext}>
                      <Text style={styles.pricetextdesign}>
                        Customer Address
                      </Text>
                    </View>
                    <View style={styles.pricetext}>
                      <Text style={styles.textdesignn}>
                        {order.homeAddress}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.pricetext}>
                      <Text style={styles.pricetextdesign}>Customer Phone</Text>
                    </View>
                    <View style={styles.pricetext}>
                      <Text style={styles.textdesignn}>{order.phone}</Text>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.pricetext}>
                      <Text style={styles.pricetextdesign}>Order Date</Text>
                    </View>
                    <View style={styles.pricetext}>
                      <Text style={styles.textdesignn}>{d.toDateString()}</Text>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.pricetext}>
                      <Text style={styles.pricetextdesign}>Order Status</Text>
                    </View>
                    <View style={styles.pricetext}>
                      <Text style={styles.textdesignn}>{order.status}</Text>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.pricetext}>
                      <Text style={styles.pricetextdesign}>Order Price</Text>
                    </View>
                    <View style={styles.pricetext}>
                      <Text style={styles.textdesignn}>
                        ${order.totalPrice}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.discountdiv}>
                    <View style={styles.textdesigndots}></View>
                  </View>
                </TouchableOpacity>
              );
            })}
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
    paddingBottom: get_height(3),
  },
  pricetext: {
    paddingLeft: get_width(12.5),
    marginTop: get_height(1),
  },
  pricetextdesign: {
    fontSize: get_height(2.5),
    color: "white",
    fontWeight: "bold",
  },
  textdesignn: {
    fontSize: get_height(2.3),
    color: "white",
  },
  discountdiv: {
    paddingTop: get_height(4),
    paddingBottom: get_height(4),
    paddingHorizontal: get_width(16),
  },
  scrollView: {
    marginBottom: get_height(20),
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
});
