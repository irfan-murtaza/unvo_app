import React, { useState } from "react";
import { get_width, get_height } from "../responsive_width_height";
import { SafeAreaView, StatusBar} from "react-native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  KeyboardAvoidingView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { app } from "../config/firebase";
import { useDispatch } from "react-redux";
import "firebase/compat/firestore";
import {
  setUserBrandName,
  setBrandLogo,
  setNameEmailType,
} from "../store/redux/userData";
import { useNavigation } from "@react-navigation/native";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [animating, setAnimating] = useState(false);
  const [error, setError] = useState("");

  const closemodaal = () => {
    setModalVisible(!modalVisible);
  };

  function loginUser() {
    if (email == "" || password == "") {
      setError("fields can't be Empty");
      setModalVisible(true);
      return false;
    } else {
      //setAnimating(true);
    }
    try {
      const auth = app.auth();
      auth
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          const firestore = app.firestore();
          firestore
            .collection("users")
            .doc(email)
            .get()
            .then((docData) => {
              if (docData.exists) {
                const userData = docData.data();

                dispatch(
                  setNameEmailType({
                    email: email,
                    name: userData["name"],
                    userType: userData["userType"],
                  })
                );
                if (userData["userType"] == "designer") {
                  dispatch(
                    setUserBrandName({ brandName: userData["brandname"] })
                  );
                  dispatch(
                    setBrandLogo({ brandLogo: userData["brandLogoRef"] })
                  );
                  navigation.navigate("DesignerProfile");
                  setAnimating(false);
                } else {
                  navigation.navigate("CustomerProfile");
                  setAnimating(false);
                }
              }else{
                setError("Invalid Email & Password");
                setAnimating(false);
                setModalVisible(true);
              }
            })
            .catch((error) => {
              setError("server error :(");
              setAnimating(false);
              setModalVisible(true);
            });
        })
        .catch((error) => {
          setError("Invalid Email & Password :(");
          setAnimating(false);
          setModalVisible(true);
        });
    } catch (error) {
      setError("server error, please try again");
      setAnimating(false);
      setModalVisible(true);
    }
  }

  function navigateToSignup() {
    navigation.navigate("LoginDecider");
  }

  return (
    <SafeAreaView style={styles.container1}>
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container11}
        >
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
                <Text style={styles.modalText}>{error}</Text>
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
              <Text style={[styles.loginstyle]}>Login</Text>
            </View>
            <View style={styles.credsdesign}>
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
                    keyboardType="password"
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

              <View style={styles.registerbutton}>
                <TouchableOpacity
                  onPress={loginUser}
                  style={styles.appButtonContainer}
                >
                  <Text style={styles.appButtonText}>LOGIN</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.alreadydesign}>
                <Text style={styles.textdesign1}>Don't have an Account?</Text>
                <TouchableOpacity onPress={navigateToSignup}>
                  <Text style={[styles.textdesign1, styles.signupdesign]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
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
    paddingTop: get_height(3),
  },
  container11: {
    flex: 1,
  },
  container1: {
    justifyContent: "center",
    backgroundColor: "black",
  },
  loginmanage: {
    paddingLeft: get_width(28),
    paddingTop: get_height(16),
  },
  loginstyle: {
    fontSize: 40,
    color: "white",
  },
  icondesign: {
    flexDirection: "row",
    width: get_width(100),
    marginTop: get_height(2),
  },
  iconitself: {
    marginTop: get_height(4.75),
    marginLeft: get_width(6),
    width: get_width(7),
  },
  textfielddesign: {
    width: get_width(80),
  },
  indicator: {
    paddingTop: get_height(50),
    paddingBottom: get_height(45),
  },
  credsdesign: {
    padding: get_width(5),
    paddingTop: get_height(3),
    width: get_width(83),
  },
  input: {
    height: get_height(5),
    marginTop: get_height(4),
    borderWidth: 1,
    padding: 10,
    backgroundColor: "black",
    width: get_width(100),
    marginLeft: get_width(4),
    color: "white",
  },
  registerbutton: {
    marginTop: get_height(9),
  },
  signupdesign: {
    marginLeft: get_width(2),
  },
  alreadydesign: {
    marginTop: get_height(4),
    marginLeft: get_width(7),
    flexDirection: "row",
  },
  textdesign1: {
    color: "#fff",
    fontSize: 14,
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
});
