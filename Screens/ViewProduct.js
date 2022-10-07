import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer/Footer";
import { AntDesign } from "@expo/vector-icons";
import { get_width, get_height } from "../responsive_width_height";
import DropDownPicker from "react-native-dropdown-picker";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Modal,
} from "react-native";
import ViewProductHeader from "../Components/Headers/ViewProductHeader";
import { useNavigation } from "@react-navigation/native";
import { app } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { ref, getDownloadURL } from "firebase/storage";
import { setRecentDeletedProductName } from "../store/redux/products";
import { setCart, resetCart } from "../store/redux/userCart";
import { addCartPrice } from "../store/redux/cart";

export default function ViewProduct({ navigation, route }) {
  let cartEligibility = false;
  const navigationhook = useNavigation();
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const stateUserData = useSelector((state) => state.userData);
  const stateUserCart = useSelector((state) => state.userCart);
  const [userEligibleForCart, setuserEligibleForCart] = useState(false);
  const [error, setError] = useState("");
  const isLoggedIn = stateUserData["userEmail"];

  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (route.params.product.productData.productRef) {
          const fileRef = ref(
            app.storage(),
            route.params.product.productData.productRef
          );
          const URL = await getDownloadURL(fileRef);
          setImageURL(URL);
        }
      } catch (error) {
        setError("server error, please try again");
      }
    };
    fetchImage();
  }, [route.params.product]);

  const isUserEligibleForCart = async () => {
    if (stateUserCart["designerEmail"] != "") {
      if (
        stateUserCart["designerEmail"] ==
        route.params.product.productData.designer
      ) {
        cartEligibility = true;
      } else {
        setError("You have an already cart from other designer");
        cartEligibility = false;
      }
    } else {
      try {
        const firestore = app.firestore();
        await firestore
          .collection("carts")
          .where("customerID", "==", stateUserData["userEmail"])
          .where("status", "==", "active")
          .where("quantity", ">", 0)
          .get()
          .then(async (querySnapshot) => {
            if (querySnapshot.size == 0) {
              cartEligibility = true;
            } else {
              querySnapshot.forEach(async (doc) => {
                if (
                  doc.data().designer ==
                  route.params.product.productData.designer
                ) {
                  dispatch(
                    setCart({
                      userEmail: stateUserData["userEmail"],
                      designerEmail: doc.data().designer,
                    })
                  );
                  cartEligibility = true;
                } else {
                  setError("You have an already cart from other designer");
                  cartEligibility = false;
                }
              });
            }
          });
      } catch {
        setError("server error, please try again");
      }
    }
  };

  const navigateEditProduct = async () => {
    if (!isLoggedIn) {
      navigation.navigate("Signin");
      return;
    }

    //for customer it will add the product into the cart
    if (stateUserData["userType"] == "customer") {
      await isUserEligibleForCart();

      if (cartEligibility == false) {
        return false;
      } else {
        try {
          let cart = false;
          const cartID = `${stateUserData["userEmail"]}_${route.params.product.productID}`;

          const firestore = app.firestore();

          await firestore
            .collection("carts")
            .where("cartID", "==", cartID)
            .where("status", "==", "active")
            .get()
            .then(async (querySnapshot) => {
              querySnapshot.forEach(async (doc) => {
                if (cart == false) {
                  cart = true;
                  await firestore
                    .collection("carts")
                    .doc(doc.id)
                    .update({
                      quantity: 1,
                    })
                    .then(() => {
                      navigation.navigate("ShoppingCart");
                    })
                    .catch((error) => {
                      setError("server error");
                    });
                }
              });
              if (cart == false) {
                firestore
                  .collection("carts")
                  .doc(`${cartID}_${Date.now().toString()}`)
                  .set({
                    cartID: cartID,
                    quantity: 1,
                    customerID: stateUserData["userEmail"],
                    productID: route.params.product.productID,
                    productImageRef:
                      route.params.product.productData.productRef,
                    productPrice: parseInt(
                      route.params.product.productData.productPrice
                    ),
                    productName: route.params.product.productData.productName,
                    status: "active",
                    designer: route.params.product.productData.designer,
                  })
                  .then(() => {
                    navigation.navigate("ShoppingCart");
                  })
                  .catch((error) => {
                    setError("server error");
                  });
              }
            });
        } catch (error) {
          setError("server error, please try again");
        }
      }
    }
    //for designer it will navigate to edit product page
    else if (stateUserData["userType"] == "designer") {
      navigationhook.navigate("EditProduct", { product: route.params.product });
    }
  };

  function deleteProduct() {
    const del = async () => {
      setModalVisible(!modalVisible);
      try {
        const firestore = app.firestore();
        firestore
          .collection("products")
          .doc(
            `${stateUserData["userEmail"]}_${stateUserData["brandName"]}_${route.params.product.productData.productName}`
          )
          .delete()
          .then(() => {
            dispatch(
              setRecentDeletedProductName({
                productName: route.params.product.productData.productName,
              })
            );
            navigationhook.navigate("DesignerProfile");
          })
          .catch((error) => {
            setError("server error");
          });
      } catch (error) {
        setError("server error, please try again");
      }
    };
    del();
  }

  const likeProduct = async () => {
    try {
      const firestore = app.firestore();
      firestore
        .collection("likedProducts")
        .doc(`${route.params.product.productID}_${stateUserData["userEmail"]}`)
        .set({
          user: stateUserData["userEmail"],
          product: route.params.product.productID,
        })
        .then(() => {
          Alert.alert("You have liked this product");
        })
        .catch((error) => {
          Alert.alert("Server Error");
        });
    } catch (error) {
      Alert.alert("Server Error");
    }
  };

  return (
    <>
      <View>
        <ViewProductHeader />
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
              <Text style={styles.modalText}>Are you Sure to Delete?</Text>
              <View style={{ flexDirection: "row" }}>
                <View>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={deleteProduct}
                  >
                    <Text style={styles.textStyle}>Yes</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ marginLeft: 10 }}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text style={styles.textStyle}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.container}>
          <View style={styles.topDiv}>
            <View style={styles.imgdiv}>
              <Image
                style={styles.tinyLogo}
                source={{
                  uri: imageURL,
                }}
              />
            </View>
          </View>
          <View style={styles.bottomDiv}>
            <View style={styles.row}>
              <View style={styles.pricetext}>
                <View style={{ flexDirection: "row" }}>
                  <View>
                    <Text style={styles.pricetextdesign}>Price</Text>
                  </View>
                  <View
                    style={{
                      marginLeft: get_width(30),
                      marginTop: get_height(0.3),
                    }}
                  >
                    <TouchableOpacity onPress={likeProduct}>
                      <AntDesign name="hearto" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.pricetext}>
                <Text style={styles.textdesign}>
                  ${route.params.product.productData.productPrice}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.pricetext}>
                <Text style={styles.pricetextdesign}>Description</Text>
              </View>
              <View style={styles.pricetext}>
                <Text style={styles.textdesign}>
                  {route.params.product.productData.productDesc}
                </Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.addbutton}>
                <View
                  style={
                    stateUserData["userType"] == "designer"
                      ? { marginLeft: get_width(3) }
                      : { marginLeft: get_width(25) }
                  }
                >
                  <TouchableOpacity
                    onPress={() => {
                      navigateEditProduct();
                    }}
                    style={styles.appButtonContainer}
                  >
                    <Text style={styles.appButtonText}>
                      {stateUserData["userType"] == "designer"
                        ? "Edit Product"
                        : "Add to Cart"}
                    </Text>
                  </TouchableOpacity>
                </View>
                {stateUserData["userType"] == "designer" && (
                  <View style={{ marginLeft: get_width(10) }}>
                    <TouchableOpacity
                      onPress={() => setModalVisible(true)}
                      style={styles.appButtonContainer}
                    >
                      <Text style={styles.appButtonText}>Delete Product</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
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
    width: get_width(85),
  },
  topDiv: {
    borderBottomLeftRadius: get_height(10),
    borderBottomRightRadius: get_height(10),
    backgroundColor: "white",
    padding: get_width(5),
    width: get_width(100),
    height: get_height(40),
  },
  bottomDiv: {
    backgroundColor: "black",
    padding: get_height(4),
    width: get_width(100),
    height: get_height(60),
  },
  pricetext: {
    paddingLeft: get_width(12.5),
    marginTop: get_height(1),
  },
  producttext: {
    textAlign: "justfy",
    paddingTop: get_height(3),
    paddingLeft: get_width(3),
    paddingRight: get_width(3),
  },
  dropdowndesign: {
    paddingLeft: get_width(13),
    paddingRight: get_width(13),
    paddingTop: get_height(4),
    paddingBottom: get_height(4),
  },
  dropdowndiv: {
    paddingTop: get_height(1),
    width: get_width(50),
  },
  pricetextdesign: {
    fontSize: get_height(3),
    color: "white",
    fontWeight: "bold",
  },
  textdesign: {
    fontSize: get_height(2.3),
    color: "white",
  },
  textdesignbold: {
    fontSize: get_height(2),
    color: "white",
    fontWeight: "bold",
  },
  addbutton: {
    flexDirection: "row",
    paddingTop: get_width(13),
    width: get_width(100),
  },
  productimg: {
    width: get_width(55),
    height: get_height(35),
  },
  imgdiv: {
    paddingLeft: get_width(18),
    paddingRight: get_width(18),
    marginTop: get_height(1),
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
  },
  tinyLogo: {
    height: get_height(35),
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
});
