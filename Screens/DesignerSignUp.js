import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { get_width, get_height } from "../responsive_width_height";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { Alert, SafeAreaView, StatusBar } from "react-native";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/compat/auth";
import { app } from "../config/firebase";
import "firebase/compat/firestore";
import { useDispatch } from "react-redux";
import {
  setUserBrandName,
  setNameEmailType,
  setBrandLogo,
} from "../store/redux/userData";
import { useNavigation } from "@react-navigation/native";
import { uploadImage } from "../utils/uploadImage";
import { async } from "@firebase/util";

function validate(email, Password, confirmPassword, name, brandName) {
  if (
    (email == "" || Password == "" || confirmPassword == "" || name == "",
    brandName == "")
  ) {
    return false;
  }
  return true;
}

function validatePassword(Password, confirmPassword) {
  if (Password == confirmPassword) {
    return true;
  }
  return false;
}

export default function DesignerSignUp() {
  const [email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [image, setImage] = useState(null);
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

  async function createUser() {
    if (!validate(email, Password, confirmPassword, name, brandName)) {
      setError("Fields can not be empty");
      return false;
    }
    if (validatePassword(Password, confirmPassword) == false) {
      setError("Password and Confirm Password Must be same");
      return false;
    }
    if (!isChecked) {
      setError("Please accept the terms and condition");
      return false;
    } else {
      setAnimating(true);
    }
    try {
      const check = false;
      const firestore = app.firestore();
      await firestore
        .collection("users")
        .where("brandname", "==", brandName)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size > 0) {
            setAnimating(false);
            Alert.alert("Brand Name already exist");
            return false;
          } else {
            const auth = app.auth();
            auth
              .createUserWithEmailAndPassword(email, Password)
              .then((result) => {
                const fileRef = `BrandLogos/${email}_${Date.now().toString()}`;
                if (image) {
                  uploadImage(image, fileRef);
                }
                const firestore = app.firestore();
                firestore
                  .collection("users")
                  .doc(email)
                  .set({
                    name: name,
                    email: email,
                    brandname: brandName,
                    userType: "designer",
                    brandLogoRef: image ? fileRef : null,
                  })
                  .then(() => {
                    dispatch(
                      setNameEmailType({
                        email: email,
                        name: name,
                        userType: "designer",
                      })
                    );
                    dispatch(setUserBrandName({ brandName: brandName }));
                    if (image) {
                      dispatch(setBrandLogo({ brandLogo: fileRef }));
                    }
                    setAnimating(false);
                    setTimeout(() => {
                      navigation.navigate("DesignerProfile");
                    }, 100);
                  })
                  .catch((error) => {
                    console.log("error:", error);
                    Alert.alert("Server Error");
                    setAnimating(false);
                  });
              })
              .catch((error) => {
                console.log("error:", error);
                Alert.alert("Error");
                setAnimating(false);
              });
          }
        });
    } catch (error) {
      setError("server error, please try again");
    }
  }
  function navigateToSignIn() {
    navigation.navigate("Signin");
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

  return (
    <SafeAreaView style={{ backgroundColor: "black" }}>
      <StatusBar
        animated={true}
        backgroundColor="black"
        showHideTransition={true}
        hidden={false}
      />
      {animating ? (
        <ActivityIndicator
          animating={true}
          color="white"
          backgroundColor="black"
          size="large"
          style={styles.indicator}
        />
      ) : (
        <View style={styles.container}>
          <View style={styles.headerTop}>
            <Text style={styles.textdesign}>SIGN UP</Text>
          </View>

          <View style={styles.credsdesign}>
            <View style={styles.icondesign}>
              <View style={styles.iconitself}>
                <Ionicons name="person" size={24} color="white" />
              </View>
              <View style={styles.textfielddesign}>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor={"white"}
                  keyboardType="name-phone-pad"
                  onChangeText={(val) => {
                    setName(val);
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
              <View style={styles.iconitself}>
                <MaterialIcons name="email" size={24} color="white" />
              </View>
              <View style={styles.textfielddesign}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={"white"}
                  keyboardType="email-address"
                  onChangeText={(val) => {
                    setEmail(val);
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
              <View style={styles.iconitself}>
                <Entypo name="lock" size={24} color="white" />
              </View>
              <View style={styles.textfielddesign}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={"white"}
                  keyboardType="name-phone-pad"
                  onChangeText={(val) => {
                    setPassword(val);
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
              <View style={styles.iconitself}>
                <Entypo name="lock" size={24} color="white" />
              </View>
              <View style={styles.textfielddesign}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor={"white"}
                  keyboardType="name-phone-pad"
                  onChangeText={(val) => {
                    setConfirmPassword(val);
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
              <View style={styles.iconitself}>
                <MaterialIcons name="business-center" size={24} color="white" />
              </View>
              <View style={styles.textfielddesign}>
                <TextInput
                  style={styles.input}
                  placeholder="Brand Name"
                  placeholderTextColor={"white"}
                  keyboardType="name-phone-pad"
                  onChangeText={(val) => {
                    setBrandName(val);
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
            <TouchableOpacity onPress={chooseImageHandler}>
              <View style={styles.icondesign}>
                <View style={styles.iconitself}>
                  <Feather name="upload-cloud" size={24} color="white" />
                </View>

                <View style={styles.uploadimgdesign}>
                  <Text style={styles.textdesign11}>Upload Brand Logo</Text>
                </View>
                <View style={{ marginLeft: 20, marginTop: 20 }}>
                  {image && (
                    <Image
                      source={{ uri: image }}
                      style={{ width: 50, height: 50 }}
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.checkboxparent}>
              <View>
                <Checkbox
                  style={styles.checkbox}
                  value={isChecked}
                  onValueChange={setChecked}
                  color={isChecked ? "#4630EB" : undefined}
                />
              </View>
              <View>
                <Text style={styles.textdesigncheckbox}>
                  I accept all Terms and Conditions
                </Text>
              </View>
            </View>

            <View style={styles.registerbutton}>
              <TouchableOpacity
                onPress={createUser}
                style={styles.appButtonContainer}
              >
                <Text style={styles.appButtonText}>SIGN UP</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.alreadydesign}>
              <Text style={styles.textdesign1}>Already have an Account?</Text>
              <TouchableOpacity onPress={navigateToSignIn}>
                <Text style={[styles.textdesign1, styles.signupdesign]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    height: get_height(100),
    width: get_width(100),
    paddingHorizontal: get_width(8),
    paddingTop: get_height(1),
  },
  container11: {
    mardinBottom: 100,
  },
  headerTop: {
    justifyContent: "center",
    paddingLeft: get_width(33),
    paddingTop: get_height(7),
  },
  textdesign: {
    color: "#fff",
    fontSize: get_height(2.5),
  },
  indicator: {
    paddingTop: get_height(50),
    paddingBottom: get_height(45),
  },
  textdesign1: {
    color: "#fff",
    fontSize: get_height(2),
  },
  textdesigncheckbox: {
    color: "#fff",
    fontSize: get_height(2),
    marginTop: get_height(0.4),
    marginLeft: get_width(2),
  },
  credsdesign: {
    padding: get_width(4),
    paddingTop: get_height(1.5),
  },
  input: {
    height: get_height(5),
    marginTop: get_height(4.5),
    borderWidth: 1,
    padding: get_width(2),
    backgroundColor: "black",
    marginLeft: get_width(4),
    color: "white",
  },
  iconitself: {
    marginTop: get_height(5),
    marginLeft: get_width(6),
    width: get_width(7),
  },
  textdesign11: {
    color: "#fff",
    fontSize: get_height(2),
  },
  uploadimgdesign: {
    marginTop: get_height(5.2),
    marginLeft: get_width(5),
  },
  checkbox: {
    margin: get_width(1),
  },
  checkboxparent: {
    flexDirection: "row",
    marginTop: get_height(4),
    marginLeft: get_width(4),
  },
  registerbutton: {
    marginTop: get_height(7),
  },
  alreadydesign: {
    marginTop: get_height(3),
    marginLeft: get_width(5),
    flexDirection: "row",
  },
  icondesign: {
    flexDirection: "row",
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
  iconitself: {
    marginTop: get_height(5.2),
    marginLeft: get_width(4),
    width: get_width(7),
  },
  textfielddesign: {
    width: get_width(60),
  },
  signupdesign: {
    marginLeft: get_width(2),
  },
});
