import React, { useState, useEffect } from "react";
import Clothes from "../Components/Clothes";
import ViewProductHeader from "../Components/Headers/ViewProductHeader";
import Footer from "../Components/Footer/Footer";
import { get_width, get_height } from "../responsive_width_height";
import { Search } from "../Components/SearchBar";

import { useNavigation } from "@react-navigation/native";
import { app } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { ref, getDownloadURL } from "firebase/storage";
import Product from "../Components/Product";
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
  const [products, setProducts] = useState([]);
  const stateUserData = useSelector((state) => state.userData);
  const [searchVal, setSearchVal] = useState("");
  const [categoryVal, setCategoryVal] = useState("");
  const navigation = useNavigation();
  const [error, setError] = useState("");

  const fetchLogo = async (docID, docData) => {
    try {
      const fileRef = ref(app.storage(), docData["productRef"]);
      const URL = await getDownloadURL(fileRef);
      setProducts((products) => [
        ...products,
        { productID: docID, productData: docData, imageURL: URL },
      ]);
    } catch (error) {
      setError("server error, please try again");
    }
  };

  const RandomfetchProducts = async () => {
    const firestore = app.firestore();
    try {
      await firestore
        .collection("products")
        .limit(10)
        .get()
        .then((querySnapshot) => {
          setProducts([]);
          querySnapshot.forEach((doc) => {
            fetchLogo(doc.id, doc.data());
          });
        });
    } catch (error) {
      setError("server error, please try again");
    }
  };

  const fetchProductsOnSearch = async () => {
    const firestore = app.firestore();
    try {
      await firestore
        .collection("products")
        .where("productName", ">=", searchVal.toUpperCase())
        .get()
        .then((querySnapshot) => {
          setProducts([]);
          querySnapshot.forEach((doc) => {
            if (
              doc
                .data()
                .productName.toLowerCase()
                .includes(searchVal.toLowerCase())
            ) {
              fetchLogo(doc.id, doc.data());
            }
          });
        });
    } catch (error) {
      setError("server error, please try again");
    }
  };

  const fetchProductsOnCategory = async () => {
    const firestore = app.firestore();
    try {
      await firestore
        .collection("products")
        .where("productCategory", "==", categoryVal)
        .get()
        .then((querySnapshot) => {
          setProducts([]);
          querySnapshot.forEach((doc) => {
            fetchLogo(doc.id, doc.data());
          });
        });
    } catch (error) {
      setError("server error, please try again");
    }
  };

  function navigateToDesignerPage(product) {
    navigation.navigate("CustomerDesignerProfile", { product: product });
  }

  useEffect(() => {
    if (searchVal == "" && categoryVal == "") {
      RandomfetchProducts();
    }
  }, [stateUserData["userEmail"], searchVal, categoryVal]);

  useEffect(() => {
    if (searchVal != "") {
      fetchProductsOnSearch();
    }
  }, [searchVal]);

  useEffect(() => {
    if (categoryVal != "") {
      fetchProductsOnCategory();
    }
  }, [categoryVal]);

  return (
    <>
      <ViewProductHeader />
      <View style={styles.body}>
        <Search setSearch={setSearchVal} setCategory={setCategoryVal} />
        {/* The image name should be the same with name like name = Bottoms, image name should also be bottoms */}
        <View style={styles.theme}>
          <ScrollView style={styles.scrollView}>
            <SafeAreaView style={styles.container}>
              <View style={styles.row1}>
                <View style={styles.flexdisplay}>
                  {products.map((product, index) => {
                    return (
                      <View style={styles.productdesign} key={index}>
                        <TouchableOpacity
                          onPress={() => {
                            navigateToDesignerPage(product);
                          }}
                        >
                          <Product productData={product.productData} />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>
            </SafeAreaView>
          </ScrollView>
        </View>
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
