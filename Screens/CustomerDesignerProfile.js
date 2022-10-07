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
  SafeAreaView,
  ActivityIndicator,
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

export default function CustomerDesignerProfile({ navigation, route }) {
  const dispatch = useDispatch();
  const [animating, setAnimating] = useState(true);
  const [products, setProducts] = useState([]);
  const stateUserData = useSelector((state) => state.userData);
  const stateProducts = useSelector((state) => state.products);
  const [brandLogoURL, setBrandLogoURL] = useState(null);
  const navigationhook = useNavigation();
  const [designer, setDesigner] = useState({});
  const [error, setError] = useState("");



  const fetchLogo = async (designerData) => {
    try{  
      const fileRef = ref(app.storage(), designerData["brandLogoRef"]);
      const URL = await getDownloadURL(fileRef);
      const firestore = app.firestore()
      let size = 0
      await firestore.collection("followers").where("followTo", "==", route.params.product.productData.designer)
      .get()
      .then((querySnapshot)=>{
        size = querySnapshot.size
      })
      setDesigner({designerLogo: URL, designerData: designerData, followSize: size})
    }catch(error){
      setError("server error, please try again")
    }
  };
  const fetchData = async () => {
    try{
      await app
      .firestore()
      .collection("users")
      .doc(route.params.product.productData.designer)
      .get()
      .then((docData) => {
        if (docData.exists) {
          fetchLogo(docData.data());

          setAnimating(false);
        }
      });
    }catch(error){
      setError("server error, please try again")
    }
  };

  useEffect(() => {
    setAnimating(true);
    fetchData();
  }, [route.params.product.productData.designer]);

  useEffect(() => {
    const fetchData = async () => {
      try{
        const firestore = app.firestore();
        const dbProducts = [];
        await firestore
        .collection("products")
        .where("designer", "==", route.params.product.productData.designer)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            dbProducts.push({ productID: doc.id, productData: doc.data() });
          });
        })
        .catch((error) => {
          setError("server error")
        });
        setProducts(dbProducts);
      }catch(error){
        setError("server error, please try again")
      }
    };
    fetchData();
  }, [route.params.product.productData.designer]);

  function viewProduct(product) {
    navigationhook.navigate("ViewProduct", { product: product });
  }

  const followToDesigner = async () =>{

    try{
      const firestore = app.firestore()
      await firestore.collection("followers").doc(`${stateUserData["userEmail"]}_${route.params.product.productData.designer}`)
      .set({
        followedBy: stateUserData["userEmail"],
        followTo: route.params.product.productData.designer,
        timestamp: Date.now()
      }).then(()=>{
        setAnimating(true);
        fetchData()
      }).catch((error)=>{
        setError("server error")
      })
    }catch(error){
      setError("server error, please try again")
    }
  }

  return (
    <>
      <View style={{backgroundColor:"black"}}>
        {animating ? (
          <ActivityIndicator
            animating={true}
            color="white"
            backgroundColor="black"
            size="large"
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
                          uri: designer.designerLogo,
                        }}
                      />
                    </View>
                    <View style={styles.brandnamedesign}>
                      <Text style={styles.textdesign}>
                        {designer.designerData
                          ? designer.designerData.brandname
                          : ""}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.followline}>
                  <View style={styles.col}>
                    <TouchableOpacity onPress={followToDesigner}>
                      <Text>
                        <SimpleLineIcons
                          name="user-follow"
                          size={26}
                          color="white"
                        />
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.col2}>
                    <Text style={styles.tagline}>{products.length}</Text>
                    <Text style={styles.tagline}> COLLECTION</Text>
                  </View>
                  <View style={styles.col1}>
                    <Text style={styles.tagline}>{designer.followSize? designer.followSize : "" }</Text>
                    <Text style={styles.tagline}> FOLLOWERS</Text>
                  </View>
                </View>
              </View>
              <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scrollView}>
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
              </SafeAreaView>
            </View>
          </>
        )}
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
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    marginHorizontal: 0,
    height: get_height(100),
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
  indicator: {
    paddingTop: get_height(50),
    paddingBottom: get_height(45),
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
    marginLeft: get_height(0.8),
  },
  col2: {
    width: get_width(27),
    alignItems: "center",
    marginLeft: get_width(8),
  },
  productdesign: {
    marginLeft: get_width(0.8),
    width: get_width(32),
  },
});
