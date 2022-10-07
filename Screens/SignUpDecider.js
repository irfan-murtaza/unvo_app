import React from "react";
import { useState } from "react";
import { get_width, get_height } from "../responsive_width_height";
import ViewProductHeader from "../Components/Headers/ViewProductHeader";
import { useNavigation } from "@react-navigation/native";
import Footer from "../Components/Footer/Footer";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";

export default function SignUpDecider() {
  const navigation = useNavigation();
  const [person, setPerson] = useState("");

  return (
    <>
      <View>
        <View style={styles.container}>
          <View style={styles.row}>
            <View style={styles.topdiv}>
              <View style={styles.logodiv}>
                <Image
                  style={styles.tinyLogo}
                  source={require("../assets/unvologo.png")}
                />
              </View>
              <View>
                <Text style={styles.textdesign1}>UNVO</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.downdiv}>
              <View style={styles.logindesign}>
                <Text style={styles.textdesign}>Register as a</Text>
              </View>
              <View style={styles.flexx}>
                <View style={styles.marleft}>
                  <TouchableOpacity
                    style={styles.appButtonContainer}
                    onPress={() => {
                      navigation.navigate("CustomerSignup");
                      setPerson("Customer");
                    }}
                  >
                    <Text style={styles.appButtonText}>CUSTOMER</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.marleft1}>
                  <TouchableOpacity
                    style={styles.appButtonContainer}
                    onPress={() => {
                      navigation.navigate("DesignerSignup");
                      setPerson("Designer");
                    }}
                  >
                    <Text style={styles.appButtonText}>DESIGNER</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
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
    fontSize: 44,
    color: "black",
    fontWeight: "bolder",
  },
  topdiv: {
    paddingTop: get_height(10),
    alignItems: "center",
    height: get_height(50),
    backgroundColor: "white",
  },
  downdiv: {
    backgroundColor: "black",
    height: get_height(50),
    borderTopEndRadius: get_height(7),
    borderTopLeftRadius: get_height(7),
  },
  logindesign: {
    paddingTop: get_height(4),
    alignItems: "center",
  },
  flexx: {
    flexDirection: "row",
  },
  marleft: {
    paddingTop: get_height(7),
    paddingLeft: get_width(12),
  },
  marleft1: {
    paddingTop: get_height(7),
    paddingLeft: get_width(13),
  },
  logodiv: {
    alignItems: "center",
    paddingTop: get_height(4),
  },
  tinyLogo: {
    width: get_width(50),
    height: get_height(25),
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
    width: get_width(32.5),
  },
  appButtonText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
