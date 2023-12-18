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
                        Help & FAQ
                    </Text>
                </View>
                <View style={{ alignSelf: 'center', marginTop: 30 }}>
                    <Text style={{ fontSize: 16, marginHorizontal: 20, textAlign: 'justify', color: 'black' }}>
                        Help:
                        {'\n'}{'\n'}
                        If you need help using UNVO App or have any questions, please don't hesitate to contact our customer service team. You can reach us via email or phone, and we'll be happy to assist you with any issues or concerns.
                        {'\n'}
                        FAQs:
                        {'\n'}
                        {'\n'}
                        Q: What is UNVO App?{'\n'}{'\n'}
                        A: UNVO App is an e-commerce platform that connects consumers with a wide selection of products from leading brands and unique items that you won't find anywhere else.
                        {'\n'}{'\n'}
                        Q: How do I create an account on UNVO App?{'\n'}{'\n'}
                        A: To create an account on UNVO App, simply download the app and follow the on-screen prompts. You'll need to provide some basic information, such as your name and email address, and choose a password.
                        {'\n'}{'\n'}
                        Q: Is my personal information secure on UNVO App?{'\n'}{'\n'}
                        A: Yes, we take the security of your personal information very seriously. We use the latest encryption and security measures to protect your data and ensure your privacy.
                        {'\n'}{'\n'}
                        Q: How do I place an order on UNVO App?{'\n'}{'\n'}
                        A: To place an order on UNVO App, simply find the product you want, add it to your cart, and proceed to checkout. You'll need to provide your shipping and payment information, and then confirm your order.
                        {'\n'}{'\n'}
                        Q: What payment methods does UNVO App accept?{'\n'}{'\n'}
                        A: UNVO App accepts a variety of payment methods, including credit/debit cards, PayPal, and Apple Pay.
                        {'\n'}{'\n'}
                    
                        Q: What is UNVO App's return policy?{'\n'}{'\n'}
                        A: UNVO App offers a 30-day return policy for most products. If you're not satisfied with your purchase, simply contact our customer service team to initiate a return.
                        {'\n'}   {'\n'}
                        Q: How can I track my order on UNVO App?{'\n'}{'\n'}
                        A: You can track your order on UNVO App by logging into your account and checking the order status. You'll also receive email notifications with tracking information once your order has shipped.
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
