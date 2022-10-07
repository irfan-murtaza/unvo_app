import React, { useState, useEffect } from "react";
// import Clothes from "../Components/Clothes";
import ViewProductHeader from "../../Components/Headers/ViewProductHeader";
import Footer from "../../Components/Footer/Footer";
import { get_width, get_height } from "../../responsive_width_height";
// import { Search } from "../Components/SearchBar";

// import { useNavigation } from "@react-navigation/native";
// import { app } from "../config/firebase";
// import { useDispatch, useSelector } from "react-redux";
// import { ref, getDownloadURL } from "firebase/storage";
// import Product from "../Components/Product";
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


    return (
        <>
            <ViewProductHeader />
            <ScrollView>
                <View style={{ alignSelf: 'center', marginTop: 50 }}>
                    <Text style={{ fontSize: 22, color: 'black', fontWeight: 'bold' }}>
                        About Us
                    </Text>
                </View>
                <View style={{ alignSelf: 'center', marginTop: 30 }}>
                    <Text style={{ fontSize: 16, marginHorizontal: 20, textAlign: 'justify', color: 'black' }}>
                        UNVO App is an innovative e-commerce platform that connects consumers with their favorite brands and products. Our mission is to provide a seamless and enjoyable shopping experience for our customers, while also offering unparalleled support and service.

                        At UNVO App, we pride ourselves on our commitment to quality, convenience, and affordability. Our user-friendly interface makes it easy for shoppers to find what they're looking for and make purchases with just a few clicks. We offer a wide selection of products from leading brands, as well as unique items that you won't find anywhere else.

                        Our team of experienced professionals is dedicated to providing exceptional customer service. We're always available to answer your questions, address your concerns, and help you find the products that are right for you. Whether you're shopping for yourself or someone else, we're here to make the process as easy and stress-free as possible.

                        In addition to our commitment to quality and service, we're also committed to sustainability and ethical business practices. We work closely with our suppliers to ensure that all of our products are ethically sourced, and we take steps to minimize our impact on the environment.

                        Thank you for choosing UNVO App as your preferred e-commerce platform. We look forward to serving you and helping you find the products you need to live your best life.
                    </Text>
                </View>
            </ScrollView>
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
