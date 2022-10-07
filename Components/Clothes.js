import { StyleSheet, Text, View, Image } from "react-native";
import { FontAwesome5, Ionicons, Feather } from "@expo/vector-icons";
import { get_width, get_height } from "../responsive_width_height";
import Hr from "reggie3-react-native-hr";
export default function Clothes(props) {
  const BOTTOMS_IMAGE_SRC =
    "../assets/model1.jpg";

  return (
    <View style={styles.flex_property}>
      <View style={styles.left_box_style}>
        <Text style={styles.text_style}>{props.name}</Text>
        <Hr
          marginLeft={get_width(10)}
          marginRight={get_width(10)}
          lineStyle={{
            backgroundColor: "#a5a9aa",
            height: 2,
          }}
        />
        <Text></Text>
        <Hr
          marginLeft={get_width(20)}
          marginRight={get_width(20)}
          lineStyle={{
            backgroundColor: "#a5a9aa",
            height: 2,
          }}
        />
      </View>
      <View style={styles.image_div_style}>
        <Image
          source={require(BOTTOMS_IMAGE_SRC)}
          style={styles.image_style}
        ></Image>
      </View>
    </View>
  );
}

var styles = StyleSheet.create({
  flex_property: {
    flexDirection: "row",
    marginTop: get_height(2),
  },
  image_div_style: {
    width: get_width(30),
    height: get_height(20),
  },
  left_box_style: {
    width: get_width(70),
    height: get_height(20),
    backgroundColor: "#dadedf",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image_style: {
    width: get_width(30),
    height: get_height(20),
    resizeMode: "contain",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  text_style: {
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "italic",
    paddingBottom: get_height(1.5),
  },
});
