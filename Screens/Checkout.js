import React from "react";
import { useState } from "react";
import { get_width, get_height } from "../responsive_width_height";
import ViewProductHeader from "../Components/Headers/ViewProductHeader";
import Footer from "../Components/Footer/Footer";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../config/firebase";
import "firebase/compat/storage";
import "firebase/compat/firestore";
import { useNavigation } from "@react-navigation/native";
import { setCart, resetCart} from "../store/redux/userCart";


export default function Checkout({navigation_, route}) {
  const stateUserData = useSelector((state) => state.userData);
  const stateCart = useSelector((state) => state.cart);
  const [homeAddress, setHomeAddress] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [orderid, setOrderid] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [error, setError] = useState("");
  const naviagtion = useNavigation();
  const dispatch = useDispatch();


  const closemodaal = () => {
    setModalVisible(!modalVisible);
    naviagtion.navigate("ViewMyOrder", { orderID: orderid });
  };

  const placeOrder = async () => {
    if (homeAddress == "" || phoneNum == "") {
      setError(error);
      return false;
    }

    const firestore = app.firestore();
    let cartProducts = [];
    let designer = ""
    try {
      await firestore
        .collection("carts")
        .where("customerID", "==", stateUserData["userEmail"])
        .where("status", "==", "active")
        .where("quantity", ">", 0)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            cartProducts.push(doc.id);
            designer = doc.data().designer
            await firestore
              .collection("carts")
              .doc(doc.id)
              .update({
                status: "checkout",
              })
              .then(() => {
              })
              .catch((error) => {
                setError("server error");
              });
          });
        })
        .catch((error) => {
          setError("server error");
        });
    } catch (error) {
      setError("server error, please try again");
    }
    if (cartProducts.length > 0) {
      const date = Date.now();
      const orderID = `${stateUserData["userEmail"]}_${date.toString()}`;
      try {
        await firestore
          .collection("orders")
          .doc(orderID)
          .set({
            customerID: stateUserData["userEmail"],
            carts: cartProducts,
            totalPrice: stateCart["cartPrice"],
            timestamp: date,
            status: "active",
            homeAddress: homeAddress,
            phone: phoneNum,
            additionalInfo: additionalInfo,
            designer: designer
          })
          .then(() => {
            setModalVisible(true);
            setOrderid(orderID);
            dispatch(resetCart())
          })
          .catch((error) => {
            setError("server error");
          });
      } catch (error) {
        setError("server error, please try again");
      }
    }
  };

  return (
    <>
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Order Placed Successfully!</Text>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={closemodaal}
              >
                <Text style={styles.textStyle}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <ViewProductHeader/>
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.row}>
              <View style={styles.topdiv}>
                <Text style={styles.textdesign}>Contact Information</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.discountdiv2}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Home Address"
                  placeholderTextColor={"black"}
                  keyboardType="name-phone-pad"
                  onChangeText={(val) => {
                    setHomeAddress(val);
                  }}
                />
              </View>
              <View style={styles.discountdiv2}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Phone No"
                  placeholderTextColor={"black"}
                  keyboardType="name-phone-pad"
                  onChangeText={(val) => {
                    setPhoneNum(val);
                  }}
                />
              </View>
              <View style={styles.discountdiv2}>
                <TextInput
                  style={styles.input}
                  placeholder="Additional Information"
                  placeholderTextColor={"black"}
                  keyboardType="name-phone-pad"
                  onChangeText={(val) => {
                    setAdditionalInfo(val);
                  }}
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
                  <Text style={styles.textdesign}>
                    ${stateCart["cartPrice"]}
                  </Text>
                </View>
              </View>
              <View style={styles.registerbutton}>
                <TouchableOpacity
                  style={styles.appButtonContainer}
                  onPress={placeOrder}
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
    paddingTop: get_height(3),
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
    paddingTop: get_height(5),
    alignItems: "center",
  },
  discountdiv: {
    paddingTop: get_height(9),
    paddingHorizontal: get_width(15),
    width: get_width(99),
  },
  discountdiv2: {
    paddingTop: get_height(7),
    paddingLeft: get_width(17),
  },
  pricediv: {
    flexDirection: "row",
    paddingLeft: get_width(9),
    paddingTop: get_width(5),
    paddingBottom: get_height(5),
  },
  price1: {
    paddingLeft: get_width(5),
  },
  price2: {
    paddingLeft: get_width(42),
  },
  input: {
    height: get_height(5),
    borderRadius: get_height(5),
    backgroundColor: "white",
    width: get_width(65),
    color: "black",
    alignItems: "center",
    padding: get_height(1.5),
  },
  registerbutton: {
    width: get_width(75),
    paddingLeft: "20%",
    paddingBottom: get_height(16),
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "black",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  scrollView: {
    marginBottom: get_height(20),
  },
});
