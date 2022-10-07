import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { FontAwesome5, Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { get_width, get_height } from "../../responsive_width_height";

export default function Footer() {
  const stateUserData = useSelector((state) => state.userData);
  const LOGO_IMAGE_SRC = "../../assets/logo.png";
  const navigation = useNavigation();

  function navigateToSearchPage() {
    navigation.navigate("SearchPage");
  }

  function navigateToHomePage() {
    navigation.navigate("CustomerProfile");
  }

  function navigateToClosetPage() {
    navigation.navigate("ClosetPage");
  }

  return (
    <>
      {stateUserData["userType"] == "designer" ? (
        <></>
      ) : (
        <>
          <View style={footer.footer_style}>
            <TouchableOpacity onPress={navigateToHomePage}>
              <Ionicons name="shirt-outline" size={34} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToClosetPage}>
              <Image
                style={footer.imgstyle}
                source={require(LOGO_IMAGE_SRC)}
              ></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToSearchPage}>
              <Feather name="search" size={34} color="white" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
}

var footer = StyleSheet.create({
  footer_style: {
    borderTopWidth: 1,
    paddingTop: get_height(1),
    backgroundColor: "black",
    flexDirection: "row",
    justifyContent: "space-around",
    height: get_height(9),
    bottom: 0,
    width: get_width(100),
    position: "absolute",
  },
  imgstyle: {
    height: get_height(5),
    width: get_width(12),
  },
});
