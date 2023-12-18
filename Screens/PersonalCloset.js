import React, { useEffect } from "react";
import { useState } from "react";
import ClosetProduct from "../Components/ClosetProduct";
import { get_width, get_height } from "../responsive_width_height";
import ViewProductHeader from "../Components/Headers/ViewProductHeader";
import Footer from "../Components/Footer/Footer";
import { useNavigation } from "@react-navigation/native";
import { app } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { ref, getDownloadURL } from "firebase/storage";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Alert
} from "react-native";

export default function PersonalCloset() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [error, setError] = useState("")
  const stateUserData = useSelector((state) => state.userData);
  const [brands, setBrands] = useState([])
  const navigation = useNavigation();

  const fetchLogo = async (brandName ,productID, productData) => {
    try {
      const fileRef = ref(app.storage(), productData["productRef"]);
      const URL = await getDownloadURL(fileRef);
      setFeaturedProducts((featuredProducts) => [
        ...featuredProducts,
        { brandName: brandName, productID: productID, productData: productData, imageURL: URL },
      ]);
    } catch (error) {
      setError("server error, please try again");
    }
  };

  useEffect(()=>{
    const fetchData = async () =>{
      try{
        const firestore = app.firestore();
        await firestore
        .collection("users")
        .where("userType", "==", "designer")
        .get()
        .then((querySnapshot) => {
          setFeaturedProducts([])
          setBrands([])
          querySnapshot.forEach((doc)=>{
            firestore
            .collection("products")
            .where("designer", "==", doc.data().email)
            .where("featured", "==", "featured")
            .get()
            .then((querySnapshot_1)=>{
              if(querySnapshot_1.size>0){
                setBrands((brands)=>[...brands, doc.data().brandname])
              }
              querySnapshot_1.forEach((doc_1)=>{
                fetchLogo(doc.data().brandname, doc_1.id, doc_1.data())
              })
            })
          })
        })
      }
      catch(e){
        Alert.alert("server Error")
      }
    }
    fetchData()
  }, [stateUserData["userEmail"]])

  function navigateViewProduct(product){
    navigation.navigate("ViewProduct", { product: product });
  }

  return (
    <>
      <View>
        <ViewProductHeader />
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.row}>
              <View style={styles.topdiv}>
                <View style={styles.logodiv}>
                  <Image
                    style={styles.imgdesign}
                    source={require("../assets/model1.jpg")}
                  />
                  <View style={styles.zgame}>
                    <Text style={styles.textdiv}>CLOTHING BRAND</Text>
                  </View>
                </View>
              </View>
            </View>

            {
              brands.map((brand, index)=>{
                return(
                  <View style={styles.row1} key = {index}>
                    <View style={styles.textalign}>
                      <Text style={styles.textdesign}>{brand}</Text>
                    </View>
                    <View style={styles.flexdisplay} key ={index}>
                      <ScrollView horizontal ={true}>
                        {
                          featuredProducts.map((featuredProduct, index)=>{
                            if(featuredProduct.brandName == brand){
                              return(
                                  <View style={styles.productdesign} key ={index}>
                                    <TouchableOpacity onPress={()=>navigateViewProduct(featuredProduct)}>
                                      <ClosetProduct imgurl={featuredProduct.imageURL} /> 
                                    </TouchableOpacity>
                                  </View>
                              )
                            }
                          })
                        }
                      </ScrollView>
                    </View>
                  </View>
                )
              })
            }
          </ScrollView>
        </View>
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: get_width(100),
    height: get_height(100),
    backgroundColor: "black",
  },
  row: {
    width: get_width(100),
  },
  row1: {
    marginTop: get_height(9.5),
  },
  topdiv: {
    height: get_height(30),
  },
  logodiv: {
    position: "relative",
  },
  textdiv: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: get_height(1.2),
  },
  zgame: {
    position: "absolute",
    marginTop: get_height(15),
    marginLeft: get_width(27),
    borderRadius: 1,
    backgroundColor: "rgba(128,128,128,0.7)",
    width: get_width(45),
    height: get_height(6),
  },
  imgdesign: {
    height: get_height(37),
    width: get_width(100),
    zIndex: 0,
  },
  textdesign: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
    marginTop: get_height(1),
  },
  textalign: {
    alignItems: "center",
  },
  flexdisplay: {
    flexDirection: "row",
    marginTop: get_height(2),
  },
  productdesign: {
    marginLeft: get_width(5.5),
    width: get_width(25),
  },
  container11: {
    flex: 0,
  },
  scrollView: {
    marginBottom: get_height(20),
  },
});
