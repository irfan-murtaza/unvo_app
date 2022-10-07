import React, { useState, useEffect } from "react";
// import Clothes from "../Components/Clothes";
import ViewProductHeader from "../../Components/Headers/ViewProductHeader";
import Footer from "../../Components/Footer/Footer";
import { get_width, get_height } from "../../responsive_width_height";
// import { Search } from "../Components/SearchBar";

// import { useNavigation } from "@react-navigation/native";
// import { app } from "../config/firebase";
// import { useDispatch, useSelector } from "react-redux";
// import { ref, getDownloadURL } from "firebase/storage";
// import Product from "../Components/Product";
import {
  StyleSheet,
  Text,
  Button,
  View,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";

export default function SearchPage() {


  return (
    <>
      <ViewProductHeader />
      <View style={{ alignSelf: 'center', marginTop: 50 }}>
                    <Text style={{ fontSize: 22, color: 'black', fontWeight: 'bold' }}>
                        Notification
                    </Text>
                </View>
    <View style={{alignSelf:'center',marginTop:50}}>
      <Text>No Notification Found</Text>
      </View>
      <Footer />
    </>
  );
}

var styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
    height: get_height(89),
    width: get_width(100),
  },
  container: {
    paddingBottom: get_height(10),
  },
  // container: {
  //   paddingTop: StatusBar.currentHeight,
  // },
  scrollView: {
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0
  },
  row1: {
    width: get_width(100),
    height: get_height(100),
    marginTop: get_height(5),
    paddingBottom: get_height(5),
  },
  flexdisplay: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  productdesign: {
    marginLeft: get_width(0.8),
    width: get_width(32),
  },
  theme: {
    backgroundColor: "black",
  },
});
