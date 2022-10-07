import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  AppRegistry,
  Image,
  TouchableOpacity,
} from "react-native";
import { get_width, get_height } from "../responsive_width_height";
import Swiper from "react-native-swiper";
import { app } from "../config/firebase";
import Footer from "../Components/Footer/Footer";
import ViewProductHeader from "../Components/Headers/ViewProductHeader";
import "firebase/compat/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import "firebase/compat/storage";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const CustomerProfile = () => {
  const dispatch = useDispatch();
  const stateUserData = useSelector((state) => state.userData);
  const [products, setProducts] = useState([]);
  const navigationhook = useNavigation();
  const [error, setError] = useState("");


  const fetchImages = async (product, productID) => {
    try{
      const fileRef = ref(app.storage(), product["productRef"]);
      const URL = await getDownloadURL(fileRef);

      const brandLogoRef = ref(app.storage(), product["brandLogo"])
      const brandLogoURL = await getDownloadURL(brandLogoRef)
      setProducts((products) => [
        ...products,
        { imageURL: URL, brandURL: brandLogoURL, productData: product, productID: productID },
      ]);
      return { imageURL: URL, brandURL: brandLogoURL, productData: product, productID: productID };
    }catch(error){
      setError("server error, please try again")
      return {}
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try{
        const firestore = app.firestore();
        await firestore
        .collection("products")
        .get()
        .then((querySnapshot) => {
          setProducts([]);
          querySnapshot.forEach((doc) => {
            if (doc.data()["productRef"]) {
              fetchImages(doc.data(), doc.id);
            }
          });
        })
        .catch((error) => {
          setError("server error")
        });
      }catch(error){
        setError("server error, please try again")
      }
    };
    fetchData();
  }, [stateUserData["userEmail"]]);

  const [active_image, set_active_image] = useState(0);

  function navigateToProductDetail(product) {
    navigationhook.navigate("ViewProduct", { product: product });
  }

  function navigateLogo(){
    navigationhook.navigate("CustomerDesignerProfile", {
      product: products[active_image],
    });
  }

  return (
    <>
      <ViewProductHeader />
      <View style={styles.container}>

        <Swiper
          key={products.length}
          loop={false}
          showsButtons={true}
          dot={<View style={styles.hide_dots}></View>}
          activeDot={<View style={styles.hide_dots}></View>}
          onIndexChanged={(index) => {
            set_active_image(index);
          }}
          // autoplay
        >
          {products.map((product, index) => {
            return (

              <TouchableOpacity onPress={()=>{navigateToProductDetail(product)}} key={index}>
                <Image
                  source={{
                    uri: product.imageURL,
                  }}
                  style={styles.image_style}
                />

                <TouchableOpacity style={styles.image_style1} onPress = {navigateLogo}>
                  <Image
                    source={{
                      uri: product.brandURL,
                    }}
                    style={styles.image_style1}
                  />
                </TouchableOpacity>
              </TouchableOpacity>

            );
          })}
        </Swiper>
      </View>
      <Footer />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "red",
  },
  image_style: {
    width: get_width(100),
    height: get_height(100),
    borderWidth: get_width(1),
    position: "relative",
  },
  image_style1: {
    width: get_width(20),
    height: get_height(10),
    borderRadius: get_width(10),
    position: "absolute",
    marginLeft: get_width(2),
    marginTop: get_height(1)
  },
  text_style: {
    backgroundColor: "red",
  },
  hide_dots: {
    display: "none",
  },
});
AppRegistry.registerComponent("UNVO", () => CustomerProfile);
export default CustomerProfile;
