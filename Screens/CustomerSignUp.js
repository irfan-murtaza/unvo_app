import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { get_width, get_height } from "../responsive_width_height";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { app } from "../config/firebase";
import "firebase/compat/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setNameEmailType } from "../store/redux/userData";
import { useNavigation } from "@react-navigation/native";

function validate(email, Password, confirmPassword, name) {
  if (email == "" || Password == "" || confirmPassword == "" || name == "") {
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

export default function CustomerSignUp() {
  const [email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isChecked, setChecked] = useState(false);

  const [animating, setAnimating] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);
  const navigation = useNavigation();

  function navigateToSignIn() {
    navigation.navigate("Signin");
  }

  function createUser() {
    if (validate(email, Password, confirmPassword, name) == false) {
      setErrorMessage("Fields can not be null");
      return false;
    }
    if (validatePassword(Password, confirmPassword) == false) {
      setErrorMessage("Password and Confirm Password Must be same");
      return false;
    }
    if (!isChecked) {
      setErrorMessage("Please accept the terms and condition");
      return false;
    } else {
      setAnimating(true);
    }

    const auth = app.auth();
    auth.createUserWithEmailAndPassword(email, Password).
      then(() => {
      const firestore = app.firestore();
      firestore
        .collection("users")
        .doc(email)
        .set({
          name: name,
          email: email,
          userType: "customer",
        })
          .then(() => {
            dispatch(
              setNameEmailType({ email: email, name: name, userType: "customer" })
            );
            navigation.navigate("CustomerProfile");
            setAnimating(false);
          })
          .catch((error) => {
            Alert.alert("Server Error")
            setAnimating(false);
          });
      }).catch((error) => {
        Alert.alert("Inavlid credentials")
        setAnimating(false);
      })
  }

  return (
    <>
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
            <View
              style={{
                borderBottomColor: "white",
                borderBottomWidth: StyleSheet.hairlineWidth,
                marginLeft: 10,
                marginRight: 10,
              }}
            />
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    height: get_height(100),
    width: get_width(100),
    paddingHorizontal: get_width(8),
    paddingTop: get_height(4),
  },
  headerTop: {
    justifyContent: "center",
    paddingLeft: get_width(33),
    paddingTop: get_height(10),
  },
  textdesign: {
    color: "#fff",
    fontSize: get_height(2.5),
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
  checkbox: {
    margin: get_width(1),
  },
  indicator: {
    paddingTop: get_height(50),
    paddingBottom: get_height(45),
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
