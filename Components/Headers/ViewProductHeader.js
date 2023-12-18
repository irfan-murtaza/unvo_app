import { React } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { get_width, get_height } from "../../responsive_width_height";
import { SafeAreaView, StatusBar } from "react-native";
import { StyleSheet, View, Text, TouchableOpacity, Button } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserState } from "../../store/redux/userData";
import Modal from "react-native-modal";

import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function ViewProductHeader(props) {
  const stateUserData = useSelector((state) => state.userData);
  const [visible, setVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isLoggedIn = stateUserData["userEmail"];
  function navigateToDesigner() {
    navigation.navigate("DesignerProfile");
  }
  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  function addProduct() {
    hideMenu();
    navigation.navigate("AddProduct");
  }

  function activeOrders() {
    hideMenu();
    navigation.navigate("ViewActiveOrders");
  }
  function onPressNotifcation() {
    hideMenu();
    navigation.navigate("Notifications");
  }
  function onPressFeedback() {
    hideMenu();
    navigation.navigate("Feedback");
  }
  function onPressHelpAndFaq() {
    hideMenu();
    navigation.navigate("HelpAndFaq");
  }

  function onPressAboutUs() {
    hideMenu();
    navigation.navigate("AboutUs");
  }

  function deleteAccount() {
    setModalVisible(!isModalVisible);
    // hideMenu();
    // navigation.navigate("ViewActiveOrders");
  }

  const signOut = () => {
    hideMenu();
    dispatch(deleteUserState());
    navigation.navigate("CustomerProfile");
  };

  const manageOrders = async () => {
    hideMenu();
    navigation.navigate("DesignerOrders");
  };

  const LikedProducts = async () => {
    hideMenu();
    navigation.navigate("LikedProducts");
  };
  const onPressLogin = () => {
    hideMenu();
    navigation.navigate("Signin");
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor="black"
        showHideTransition={true}
        hidden={false}
      />
      <View style={styles.container1}>
        <View style={styles.header}>
          {stateUserData["userType"] == "customer" ? (
            <>
              <View style={styles.arrowstyle}>
                {/* <TouchableOpacity>
              <Ionicons name="arrow-back" size={32} color="white" />
            </TouchableOpacity> */}
              </View>
              <View style={styles.arrowstyle3}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("LikedProducts")}
                >
                  <AntDesign name="hearto" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.arrowstyle1}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("ShoppingCart")}
                >
                  <AntDesign name="shoppingcart" size={26} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.arrowstyle2}>
                <Menu
                  style={{
                    backgroundColor: "#C0C0C0",
                    width: get_width(60),
                    height: get_height(86),
                    marginLeft: get_width(3),
                    marginTop: get_height(4.75),
                  }}
                  visible={visible}
                  anchor={
                    <Text onPress={showMenu}>
                      <MaterialIcons name="menu" size={34} color="white" />
                    </Text>
                  }
                  onRequestClose={hideMenu}
                >
                  {stateUserData["userType"] == "designer" ? (
                    <>
                      <MenuItem
                        onPress={navigateToDesigner}
                        style={{
                          marginTop: get_height(3),
                          marginBottom: get_height(3),
                          height: get_height(3),
                        }}
                      >
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                          My Profile
                        </Text>
                      </MenuItem>

                      <MenuItem
                        onPress={addProduct}
                        style={{
                          marginTop: get_height(3),
                          marginBottom: get_height(3),
                          height: get_height(3),
                        }}
                      >
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                          Add Product
                        </Text>
                      </MenuItem>

                      <MenuItem
                        onPress={manageOrders}
                        style={{
                          marginTop: get_height(3),
                          marginBottom: get_height(3),
                          height: get_height(3),
                        }}
                      >
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                          Manage Orders
                        </Text>
                      </MenuItem>
                      <MenuItem
                        onPress={onPressNotifcation}
                        style={{
                          marginTop: get_height(3),
                          marginBottom: get_height(3),
                          height: get_height(3),
                        }}
                      >
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                          Notifications
                        </Text>
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      {isLoggedIn && (
                        <MenuItem
                          onPress={activeOrders}
                          style={{
                            marginTop: get_height(3),
                            marginBottom: get_height(3),
                            height: get_height(3.5),
                          }}
                        >
                          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                            Active orders
                          </Text>
                        </MenuItem>
                      )}

                      <MenuItem
                        onPress={onPressNotifcation}
                        style={{
                          marginTop: get_height(3),
                          marginBottom: get_height(3),
                          height: get_height(3.5),
                        }}
                      >
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                          Notifications
                        </Text>
                      </MenuItem>
                    </>
                  )}
                  <MenuItem
                    onPress={onPressFeedback}
                    style={{
                      marginTop: get_height(3),
                      marginBottom: get_height(3),
                      height: get_height(3.5),
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                      Feedback
                    </Text>
                  </MenuItem>
                  <MenuItem
                    onPress={onPressHelpAndFaq}
                    style={{
                      marginTop: get_height(3),
                      marginBottom: get_height(3),
                      height: get_height(3.5),
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                      Help {`&`} FAQ
                    </Text>
                  </MenuItem>

                  <MenuItem
                    onPress={onPressAboutUs}
                    style={{
                      marginTop: get_height(3),
                      marginBottom: get_height(3),
                      height: get_height(3.5),
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                      About Us
                    </Text>
                  </MenuItem>
                  <MenuItem
                    onPress={deleteAccount}
                    style={{
                      marginTop: get_height(3),
                      marginBottom: get_height(3),
                      height: get_height(3.5),
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                      Delete Account
                    </Text>
                  </MenuItem>
                  <Modal isVisible={isModalVisible}>
                    <View
                      style={{
                        flex: 1,
                        width: get_width(80),
                        alignSelf: "center",
                        marginTop: get_height(40),
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 20,
                          textAlign: "center",
                        }}
                      >
                        Are you sure! You want to delete this account!
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: 20,
                          marginHorizontal: 30,
                        }}
                      >
                        <TouchableOpacity
                          title="Cancel"
                          onPress={deleteAccount}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              fontSize: 20,
                              textAlign: "center",
                            }}
                          >
                            Cancel
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          title="Cancel"
                          onPress={deleteAccount}
                        >
                          <Text
                            style={{
                              color: "red",
                              fontSize: 20,
                              textAlign: "center",
                            }}
                          >
                            Delete
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                  <MenuDivider />
                  {isLoggedIn ? (
                    <MenuItem onPress={signOut}>
                      <Text style={{ fontSize: 20 }}>Sign Out</Text>
                    </MenuItem>
                  ) : (
                    <MenuItem onPress={onPressLogin}>
                      <Text style={{ fontSize: 20 }}>Login</Text>
                    </MenuItem>
                  )}
                </Menu>
              </View>
            </>
          ) : (
            <View style={styles.arrowstyle2}>
              <Menu
                style={{
                  backgroundColor: "#C0C0C0",
                  width: get_width(60),
                  height: get_height(86),
                  marginLeft: get_width(3),
                  marginTop: get_height(4.75),
                }}
                visible={visible}
                anchor={
                  <Text onPress={showMenu}>
                    <MaterialIcons name="menu" size={34} color="white" />
                  </Text>
                }
                onRequestClose={hideMenu}
              >
                {stateUserData["userType"] == "designer" ? (
                  <>
                    <MenuItem
                      onPress={navigateToDesigner}
                      style={{
                        marginTop: get_height(3),
                        marginBottom: get_height(3),
                        height: get_height(3),
                      }}
                    >
                      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                        My Profile
                      </Text>
                    </MenuItem>

                    <MenuItem
                      onPress={addProduct}
                      style={{
                        marginTop: get_height(3),
                        marginBottom: get_height(3),
                        height: get_height(3),
                      }}
                    >
                      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                        Add Product
                      </Text>
                    </MenuItem>

                    <MenuItem
                      onPress={manageOrders}
                      style={{
                        marginTop: get_height(3),
                        marginBottom: get_height(3),
                        height: get_height(3),
                      }}
                    >
                      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                        Manage Orders
                      </Text>
                    </MenuItem>
                    <MenuItem
                      onPress={onPressNotifcation}
                      style={{
                        marginTop: get_height(3),
                        marginBottom: get_height(3),
                        height: get_height(3),
                      }}
                    >
                      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                        Notifications
                      </Text>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <View style={styles.arrowstyle2}></View>
                   

                    {isLoggedIn && (
                        <MenuItem
                        onPress={activeOrders}
                        style={{
                          marginTop: get_height(3),
                          marginBottom: get_height(3),
                          height: get_height(3.5),
                        }}
                      >
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                          Active orders
                        </Text>
                      </MenuItem>
                      )}
                      

                    <MenuItem
                      onPress={onPressNotifcation}
                      style={{
                        marginTop: get_height(3),
                        marginBottom: get_height(3),
                        height: get_height(3.5),
                      }}
                    >
                      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                        Notifications
                      </Text>
                    </MenuItem>
                  </>
                )}
                <MenuItem
                  onPress={onPressFeedback}
                  style={{
                    marginTop: get_height(3),
                    marginBottom: get_height(3),
                    height: get_height(3.5),
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    Feedback
                  </Text>
                </MenuItem>
                <MenuItem
                  onPress={onPressHelpAndFaq}
                  style={{
                    marginTop: get_height(3),
                    marginBottom: get_height(3),
                    height: get_height(3.5),
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    Help {`&`} FAQ
                  </Text>
                </MenuItem>

                <MenuItem
                  onPress={onPressAboutUs}
                  style={{
                    marginTop: get_height(3),
                    marginBottom: get_height(3),
                    height: get_height(3.5),
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    About Us
                  </Text>
                </MenuItem>
                <MenuDivider />
                {isLoggedIn ? (
                  <MenuItem onPress={signOut}>
                    <Text style={{ fontSize: 20 }}>Sign Out</Text>
                  </MenuItem>
                ) : (
                  <MenuItem onPress={onPressLogin}>
                    <Text style={{ fontSize: 20 }}>Login</Text>
                  </MenuItem>
                )}
              </Menu>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    backgroundColor: "black",
  },
  container1: {
    width: get_width(100),
    marginTop: 0,
    paddingTop: get_width(2),
    backgroundColor: "black",
  },
  header: {
    flexDirection: "row",
  },
  arrowstyle: {
    paddingLeft: get_width(4),
    width: get_width(25),
    paddingBottom: get_height(0.5),
  },
  arrowstyle1: {
    paddingLeft: get_width(2.5),
    width: get_width(12.5),
    paddingTop: get_height(0.4),
  },
  arrowstyle2: {
    paddingLeft: get_width(2),
    width: get_width(12.5),
    paddingBottom: get_height(0.5),
  },
  arrowstyle3: {
    paddingLeft: get_width(2.5),
    width: get_width(12.5),
    paddingTop: get_height(0.4),
    marginLeft: get_width(30),
  },
  textstyle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  textdiv: {
    alignItems: "center",
    width: get_width(25),
    marginLeft: get_width(5),
    marginTop: get_height(0.5),
  },
});
