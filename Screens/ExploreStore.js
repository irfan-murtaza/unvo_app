import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import ViewProductHeader from "../Components/Headers/ViewProductHeader";
import Footer from "../Components/Footer/Footer";
import CustomerSignUp from "./CustomerSignUp";
import { get_width, get_height } from "../responsive_width_height";
import Signin from "./Signin";
import DesignerSignUp from "./DesignerSignUp";
import SignUpDecider from "./SignUpDecider";


export default function ExploreStore() {
  const BOTTOMS_IMAGE_SRC = "./assets/bottoms.png";

  return (
    <>
      {/* <View style={styles.body}>
        <Search />
        <ScrollView>
          <Clothes name={"Bottoms"}></Clothes>
          <Clothes name={"Shoes"}></Clothes>
          <Clothes name={"Kids"}></Clothes>
          <Clothes name={"Shirt Pack"}></Clothes>
        </ScrollView>
      </View> */}
      {/* <Home></Home> */}
      {/* <DesignerSignUp></DesignerSignUp> */}
      {/* <Signin></Signin> */}
      <SignUpDecider/>
    </>
  );
}

var styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
    height: get_height(89),
    width: get_width(100),
  },
});
