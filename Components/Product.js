import React, { useState, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import "firebase/compat/storage";
import { app } from "../config/firebase";


import { StyleSheet, View, Image } from "react-native";


export default function Product(props) {
  const [imageURL, setImageURL] = useState(null)
  const [error, setError] = useState('')


  useEffect(()=>{
    
    const fetchImage = async () =>{
      if(props.productData["productRef"]){
        try{
          const fileRef = ref(app.storage(), props.productData["productRef"]);
          const URL = await getDownloadURL(fileRef);
          setImageURL(URL)
        }catch(error){
          setError("server error, please try again")
        }
      }
    }
    fetchImage()
  }, [props.productData])

  return (
    <View style={styles.container}>
      <Image
        style={styles.tinyLogo}
        source={{
          uri: imageURL,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  
  },
  tinyLogo:{
    height:150,
    width:"100%"
  }
});
