import React from "react";
import { useState, useEffect } from "react";
import { get_width, get_height } from "../responsive_width_height";
import {
  StyleSheet,
  Text,
  Image,
  View,
  SafeAreaView,
  StatusBar,
} from "react-native";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setInterval(() => {
      setVisible(visible);
    }, 8000);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor="black"
        showHideTransition={true}
        hidden={false}
      />
      <View style={styles.logodiv}>
        <Image
          style={styles.tinyLogo}
          source={require("../assets/unvologo.png")}
        />
      </View>
      <View style={styles.unvotextdiv}>
        <Text style={styles.unvotext}>UNVO</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    width: get_width(100),
    height: get_height(100),
  },
  row: {
    width: get_width(100),
  },
  logodiv: {
    alignItems: "center",
    paddingTop: get_height(20),
  },
  tinyLogo: {
    width: get_width(40),
    height: get_height(20),
  },
  unvotextdiv: {
    alignItems: "center",
    paddingTop: get_height(10),
  },
  unvotext: {
    fontSize: 55,
    color: "white",
  },
});
