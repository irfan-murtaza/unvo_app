import React, { useState, useEffect } from "react";

import { SimpleLineIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  Button,
  View,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import Footer from "../Components/Footer/Footer";
import ViewProductHeader from "../Components/Headers/ViewProductHeader";
import { get_width, get_height } from "../responsive_width_height";
import Product from "../Components/Product";
import { app } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { ref, getDownloadURL } from "firebase/storage";
import "firebase/compat/storage";
import "firebase/compat/firestore";
import { useNavigation } from "@react-navigation/native";
import { async } from "@firebase/util";

export default function DesignerProfile() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [animating, setAnimating] = useState(false);
  const stateUserData = useSelector((state) => state.userData);
  const stateProducts = useSelector((state) => state.products);
  const [brandLogoURL, setBrandLogoURL] = useState(null);
  const navigation = useNavigation();
  const [followSize, setFollowSize] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log('stateUserData["brandLogo"]',stateUserData["brandLogo"])
    const fetchImage = async () => {
      if (stateUserData["brandLogo"]) {
        try {
          const fileRef = ref(app.storage(), stateUserData["brandLogo"]);
          const URL = await getDownloadURL(fileRef);
          const firestore = app.firestore();
          let size = 0;
          await firestore
            .collection("followers")
            .where("followTo", "==", stateUserData["userEmail"])
            .get()
            .then((querySnapshot) => {
              size = querySnapshot.size;
            });
          setBrandLogoURL(URL);
          setFollowSize(size);
        } catch (error) {
          setError("server error, please try again");
        }
      }
    };
    fetchImage();
  }, [stateUserData["brandLogo"]]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firestore = app.firestore();
        const dbProducts = [];
        await firestore
          .collection("products")
          .where("designer", "==", stateUserData["userEmail"])
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              dbProducts.push({ productID: doc.id, productData: doc.data() });
            });
          })
          .catch((error) => {
            setError("server error");
          });
        setProducts(dbProducts);
      } catch (error) {
        setError("server error, please try again");
      }
    };
    fetchData();
  }, [
    stateUserData["userEmail"],
    stateProducts["recentAddedProductName"],
    stateProducts["recentEditedProductName"],
    stateProducts["recentDeletedProductName"],
  ]);

  function viewProduct(product) {
    navigation.navigate("ViewProduct", { product: product });
  }

  return (
    <>
      <View style={{ backgroundColor: "black" }}>
        <ScrollView>
        {animating ? (
          <ActivityIndicator
            animating={animating}
            color="white"
            size="large"
            backgroundColor="black"
            style={styles.indicator}
          />
        ) : (
          <>
            <ViewProductHeader/>
            
            <View style={styles.theme}>
              <View style={styles.container1}>
                <View style={styles.row}>
                  <View style={styles.topHeader}>
                    <View style={styles.imgdiv}>
                      <Image
                        style={styles.tinyLogo}
                        source={{
                          uri: brandLogoURL,
                        }}
                      />
                    </View>
                    <View style={styles.brandnamedesign}>
                      <Text style={styles.textdesign}>
                        {stateUserData["brandName"]}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.followline}>
                  <View style={styles.col2}>
                    <Text style={styles.tagline}>{products.length}</Text>
                    <Text style={styles.tagline}> COLLECTION</Text>
                  </View>
                  <View style={styles.col1}>
                    <Text style={styles.tagline}>{followSize}k</Text>
                    <Text style={styles.tagline}> FOLLOWERS</Text>
                  </View>
                </View>
              </View>

              <ScrollView>
                <View style={styles.row1}>
                  <View style={styles.flexdisplay}>
                    {products.map((product, index) => {
                      return (
                        <View style={styles.productdesign} key={index}>
                          <TouchableOpacity
                            onPress={() => {
                              viewProduct(product);
                            }}
                          >
                            <Product productData={product.productData} />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </ScrollView>
            </View>
          </>
        )}
        </ScrollView>
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  theme: {
    backgroundColor: "black",
  },
  container: {
    zIndex: 1,
  },
  scrollView: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container1: {
    width: get_width(100),
    paddingHorizontal: get_height(4),
  },
  row: {
    width: get_width(100),
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
  topHeader: {
    flexDirection: "row",
    paddingTop: get_height(3),
  },
  followline: {
    flexDirection: "row",
    paddingTop: get_height(2),
  },
  tinyLogo: {
    width: get_width(25),
    height: get_height(13),
    borderRadius: 50,
  },
  imgdiv: {
    paddingLeft: get_width(3),
  },
  textdesign: {
    color: "white",
    padding: get_width(8),
    fontSize: 22,
    fontWeight: "bold",
  },
  tagline: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  brandnamedesign: {
    paddingLeft: get_width(8),
  },
  col: {
    width: get_width(25),
    alignItems: "center",
    marginTop: get_height(0.8),
  },
  col1: {
    width: get_width(27),
    alignItems: "center",
    marginLeft: get_height(4),
  },
  col2: {
    width: get_width(27),
    alignItems: "center",
    marginLeft: get_width(15),
  },
  productdesign: {
    marginLeft: get_width(0.8),
    width: get_width(32),
  },
  indicator: {
    paddingTop: get_height(50),
    paddingBottom: get_height(45),
  },
});
