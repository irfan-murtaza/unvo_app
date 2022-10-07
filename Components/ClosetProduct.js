import React from "react";
import { get_width } from "../responsive_width_height";
import { StyleSheet, View, Image } from "react-native";
import { get_height } from "../responsive_width_height";

export default function ClosetProduct(props) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.tinyLogo}
        source={{
          uri: props.imgurl,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  
  },
  tinyLogo:{
    height: get_height(17),
    width: get_width(28)
  }
});
