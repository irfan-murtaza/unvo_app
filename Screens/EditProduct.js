import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import Footer from "../Components/Footer/Footer";
import { get_width, get_height } from "../responsive_width_height";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  Alert,
  Modal,
} from "react-native";
import { app } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import "firebase/compat/firestore";
import { ref, uploadBytes, getStorage, getDownloadURL } from "firebase/storage";
import { setRecentEditedProductName } from "../store/redux/products";
import "firebase/compat/storage";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { uploadImage } from "../utils/uploadImage";

export default function EditProduct({ navigation, route }) {
  let closemodaal;

  const [productName, setProductName] = useState(
    route.params.product.productData.productName
  );
  const [productDesc, setProductDesc] = useState(
    route.params.product.productData.productDesc
  );
  const [productPrice, setProductPrice] = useState(
    route.params.product.productData.productPrice.toString()
  );
  const [productCategory, setProductCategory] = useState(
    route.params.product.productData.productCategory
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const stateUserDate = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const [error, setError] = useState("")

  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  async function verifyPermissions() {
    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    return true;
  }

  function validateProduct(name, price) {
    if (name == "" || price == "") {
      setError("name and price can not be null");
      return false;
    }
    return true;
  }

  function editProduct() {
    setModalVisible(true);
    if (validateProduct == false) {
      return false;
    } else if (image == null) {
      setError("Image can not be null");
      return false;
    }

    const edit = async () => {
      const fileRef = `products/${stateUserDate["userEmail"]}_${
        route.params.product.productData.productName
      }_${Date.now().toString()}`;
      uploadImage(image, fileRef);

      try{

        const firestore = app.firestore();
        firestore
          .collection("products")
          .doc(
            `${stateUserDate["userEmail"]}_${stateUserDate["brandName"]}_${route.params.product.productData.productName}`
          )
          .update({
            productName: route.params.product.productData.productName,
            productDesc: productDesc,
            productPrice: parseInt(productPrice),
            productCategory: productCategory,
            designer: stateUserDate["userEmail"],
            productRef: fileRef,
          })
          .then(() => {
            firestore
              .collection("products")
              .doc(
                `${stateUserDate["userEmail"]}_${stateUserDate["brandName"]}_${route.params.product.productData.productName}`
              )
              .get()
              .then((docData) => {
                dispatch(
                  setRecentEditedProductName({
                    productName: route.params.product.productData.productName,
                  })
                );

                navigation.navigate("ViewProduct", {
                  product: { productData: docData.data(), productID: docData.id },
                });
              });
          });
        }catch(error){
          setError("server error, please try again")
        }
    };
    edit();
  }

  async function chooseImageHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const image = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [10, 9],
      quality: 0.5,
    });
    if (image.assets != null) {
      setImage(image.assets[0].uri);
    }
  }
  function viewProduct() {
    navigation.navigate("ViewProduct", { product: route.params.product });
  }

  return (
    <>
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
            <Text style={styles.modalText}>Product Edited Successfully!</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={closemodaal}
            >
              <Text style={styles.textStyle}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <View style={styles.loginmanage}>
          <Text style={styles.loginstyle}>Edit Product</Text>
        </View>
        <View style={styles.credsdesign}>
          <View style={styles.textfielddesign}>
            <TextInput
              style={styles.input}
              placeholder="Product Name"
              placeholderTextColor={"white"}
              keyboardType="email-address"
              value={productName}
              editable={false}
              onChangeText={(val) => {
                setProductName(val);
              }}
            />
          </View>

          <View
            style={{
              borderBottomColor: "white",
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginLeft: 10,
              marginRight: 10,
            }}
          />

          <View style={styles.icondesign}>
            <View style={styles.textfielddesign}>
              <TextInput
                style={styles.input}
                placeholder="Product Description"
                placeholderTextColor={"white"}
                keyboardType="name-phone-pad"
                value={productDesc}
                onChangeText={(val) => {
                  setProductDesc(val);
                }}
              />
            </View>
          </View>

          <View
            style={{
              borderBottomColor: "white",
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginLeft: 10,
              marginRight: 10,
            }}
          />

          <View style={styles.icondesign}>
            <View style={styles.textfielddesign}>
              <TextInput
                style={styles.input}
                placeholder="Price"
                placeholderTextColor={"white"}
                keyboardType="name-phone-pad"
                value={productPrice}
                onChangeText={(val) => {
                  setProductPrice(val);
                }}
              />
            </View>
          </View>

          <View
            style={{
              borderBottomColor: "white",
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginLeft: 10,
              marginRight: 10,
            }}
          />

          <View style={styles.icondesign}>
            <View style={styles.textfielddesign}>
              <TextInput
                style={styles.input}
                placeholder="Category"
                placeholderTextColor={"white"}
                keyboardType="name-phone-pad"
                value={productCategory}
                onChangeText={(val) => {
                  setProductCategory(val);
                }}
              />
            </View>
          </View>

          <View
            style={{
              borderBottomColor: "white",
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginLeft: 10,
              marginRight: 10,
            }}
          />

          <View
            style={{
              borderBottomColor: "white",
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginLeft: 10,
              marginRight: 10,
            }}
          />
          <View style={styles.icondesign}>
            <TouchableOpacity onPress={chooseImageHandler}>
              <View style={styles.iconitself}>
                <Feather name="upload-cloud" size={24} color="white" />
              </View>
            </TouchableOpacity>
            <View style={styles.uploadimgdesign}>
              <Text style={styles.textdesign1}>Upload Image</Text>
            </View>
            <View style={{ marginLeft: 20, marginTop: 20 }}>
              {image && (
                <Image
                  source={{ uri: image }}
                  style={{ width: 70, height: 70 }}
                />
              )}
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.addbutton}>
              <View>
                <TouchableOpacity
                  onPress={editProduct}
                  style={styles.appButtonContainer}
                >
                  <Text style={styles.appButtonText}>Edit Product</Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginLeft: get_width(8), width: get_width(32) }}>
                <TouchableOpacity
                  onPress={viewProduct}
                  style={styles.appButtonContainer}
                >
                  <Text style={styles.appButtonText}>cancel</Text>
                </TouchableOpacity>
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
    backgroundColor: "#000000",
    height: get_height(100),
    width: get_width(100),
    paddingHorizontal: get_width(10),
    paddingTop: get_height(5),
  },
  loginmanage: {
    paddingLeft: get_width(13),
    paddingTop: get_height(10),
  },
  loginstyle: {
    fontSize: get_height(4),
    color: "white",
  },
  icondesign: {
    flexDirection: "row",
    width: get_width(100),
  },
  iconitself: {
    marginTop: get_height(5),
    marginLeft: get_width(6),
    width: get_width(7),
  },
  textfielddesign: {
    width: get_width(60),
  },
  credsdesign: {
    padding: get_width(4.5),
    paddingTop: get_height(3.5),
    width: get_width(80),
  },
  input: {
    height: get_height(5),
    marginTop: get_height(4),
    borderWidth: 1,
    padding: get_width(3),
    backgroundColor: "black",
    marginLeft: get_width(4),
    color: "white",
  },
  registerbutton: {
    marginTop: get_height(8),
  },
  textdesign1: {
    color: "#fff",
    fontSize: get_height(2),
  },
  uploadimgdesign: {
    marginTop: get_height(5.2),
    marginLeft: get_width(5),
  },
  row: {
    width: get_width(85),
  },
  addbutton: {
    flexDirection: "row",
    paddingTop: get_width(13),
    width: get_width(50),
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
    backgroundColor: "#2196F3",
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
