import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import Footer from "../Components/Footer/Footer";
import { get_width, get_height } from "../responsive_width_height";
import { RadioButton } from 'react-native-paper';
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  Image,
  TextInput,
  ScrollView
} from "react-native";
import ViewProductHeader from "../Components/Headers/ViewProductHeader";
import { app } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import "firebase/compat/firestore";
import { setRecentAddedProductName } from "../store/redux/products";
import { useNavigation } from "@react-navigation/native";
import { uploadImage } from "../utils/uploadImage";


export default function AddProduct() {
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [featured, setFeatured] = useState('not featured');
  const [size, setSize] = useState('medium');



  const dataSelector = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [error, setError] = useState("");

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
    if (name == "" || price == null) {
      setError("name and price can not be null");
      return false;
    }
    return true;
  }  

  function addProduct() {
    if (validateProduct == false) {
      return false;
    } else if (image == null) {
      setError("Image can not be null");
      return false;
    }

    const fileRef = `products/${
      dataSelector["userEmail"]
    }_${productName}_${Date.now().toString()}`;
    uploadImage(image, fileRef);

    try{
      const firestore = app.firestore();
      firestore
      .collection("products")
      .doc(
        `${dataSelector["userEmail"]}_${dataSelector["brandName"]}_${productName}`
      )
      .set({
        productName: productName,
        productDesc: productDesc,
        productPrice: parseInt(productPrice),
        productCategory: productCategory.toLowerCase(),
        designer: dataSelector["userEmail"],
        featured: featured,
        size: size,
        productRef: fileRef,
        brandLogo: dataSelector["brandLogo"]
      })
      .then(() => {
        dispatch(setRecentAddedProductName({ productName: productName }));
        setModalVisible(true);
      })
      .catch((error) => {
        Alert.alert("Server error")
      });
    }catch(error){
      Alert.alert("Server error")
    }
  }

  const closemodaal = () => {
    setModalVisible(!modalVisible);
    navigation.navigate("DesignerProfile");
  };

  async function chooseImageHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const image = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [15, 15],
      quality: 1,
    });
    if (image.assets != null) {
      setImage(image.assets[0].uri);
    }
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
            <Text style={styles.modalText}>Product Uploaded Successfully!</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={closemodaal}
            >
              <Text style={styles.textStyle}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ViewProductHeader />
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.loginmanage}>
            <Text style={styles.loginstyle}>Upload Product</Text>
          </View>
          <View style={styles.credsdesign}>
            <View style={styles.textfielddesign}>
              <TextInput
                style={styles.input}
                placeholder="Product Name"
                placeholderTextColor={"white"}
                keyboardType="email-address"
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

            <View>
              <Text style = {styles.textDesignDropdown}>Select Product Type</Text>          
              <RadioButton.Group onValueChange={value => setFeatured(value)} value={featured}>
                <RadioButton.Item label="not featured" value="not featured" color="green" labelStyle = {styles.lableColor}  />
                <RadioButton.Item label="featured" value="featured" color="green" labelStyle = {styles.lableColor}/>
              </RadioButton.Group>
              <Text style = {styles.textDesignDropdown}>Select Product Size</Text>
              <RadioButton.Group onValueChange={value => setSize(value)} value={size}>
                <RadioButton.Item label="small" value="small" color="green" labelStyle = {styles.lableColor}  />
                <RadioButton.Item label="medium" value="medium" color="green" labelStyle = {styles.lableColor}/>
                <RadioButton.Item label="large" value="large" color="green" labelStyle = {styles.lableColor}/>
              </RadioButton.Group>
            </View>

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

            <View style={styles.registerbutton}>
              <TouchableOpacity
                onPress={addProduct}
                style={styles.appButtonContainer}
              >
                <Text style={styles.appButtonText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  lableColor:{
    color: "green",
    marginLeft: get_width(5)
  },
  textDesignDropdown: {
    color: "white",
    paddingLeft: get_width(4),
    marginTop: get_height(2)
  },
  container: {
    backgroundColor: "#000000",
    height: get_height(100),
    width: get_width(100),
    paddingHorizontal: get_width(10),
    paddingTop: get_height(5),
  },
  loginmanage: {
    paddingLeft: get_width(13),
    paddingTop: get_height(5),
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
    marginBottom: get_height(18)
  },
  textdesign1: {
    color: "#fff",
    fontSize: get_height(2),
  },
  uploadimgdesign: {
    marginTop: get_height(5.2),
    marginLeft: get_width(5),
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
  tinyLogo: {
    height: 150,
    width: "100%",
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
