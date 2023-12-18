import React, { useEffect } from "react";
import { StyleSheet, TextInput, View, Button, Text, Alert } from "react-native";
import { get_width, get_height } from "../responsive_width_height";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Footer from "../Components/Footer/Footer";
import ViewProductHeader from "../Components/Headers/ViewProductHeader";
import { useDispatch, useSelector } from "react-redux";
import { CardField, useStripe } from "@stripe/stripe-react-native";

let clientSecret = "sk_test_ML4DFHLhx6gqBm2NlFjBF9Qp";
const CardPayment = () => {
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCvv] = useState("");
  const navigation = useNavigation();
  const stateCart = useSelector((state) => state.cart);
  const stripe = useStripe();
  function onSubmit() {
    navigation.navigate("Checkout", {
      cardHolder: name,
      cardNumber: cardNumber,
      expiration: expiration,
      cvv: cvv,
    });
  }

  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(`https://eegamesstudio.com/dev/twitter/api/MainController/createPaymentIntent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: parseFloat(stateCart["cartPrice"] * 100),
       
      }),
    });
    const responseJson = await response.json();
    const clientSecret = responseJson['data']['client_secret'];
    return clientSecret;
  };


  const handlePayPress = async () => {
      try {
        
        const clientSecret = await fetchPaymentIntentClientSecret();

        const initSheet = await stripe.initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: 'UNVO-APP',
        });
        if (initSheet.error) {
          console.error(initSheet.error);
          return Alert.alert(initSheet.error.message);
        }
        const presentSheet = await stripe.presentPaymentSheet({
          clientSecret: clientSecret,
        });
        if (presentSheet.error) {
          console.error(presentSheet.error);
          return Alert.alert(presentSheet.error.message);
        }
        // navigation.goBack();
        Alert.alert("Payment successfully compeleted!");
        navigation.navigate("Checkout")
      } catch (err) {
        console.error(err);
        Alert.alert("Payment failed!");
      }

    // const clientSecret = await fetchPaymentIntentClientSecret();
    // const billingDetails = {
    //   email: "email@stripe.com",
    //   phone: "+48888000888",
    //   addressCity: "Houston",
    //   addressCountry: "US",
    //   addressLine1: "1459  Circle Drive",
    //   addressLine2: "Texas",
    //   addressPostalCode: "77063",
    // };
    // const { error, paymentIntent } = await confirmPayment(clientSecret, {
    //   paymentMethodType: "Card",
    //   billingDetails,
    // });
    // if (error) {
    //   // Handle error
    // } else if (paymentIntent) {
    //  alert('payment successful')
    // }
    // step 4
  };

  return (
    <>
      <ViewProductHeader />
      <View style={styles.container}>
        <View style={styles.loginmanage}>
          <Text style={[styles.loginstyle]}>Card Payment</Text>
        </View>

    

        {/* <View style={{ marginLeft: get_width(17) }}>
          <TextInput
            style={styles.textField}
            placeholder="Cardholder Name"
            placeholderTextColor={"black"}
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>
        <View style={{ marginLeft: get_width(17) }}>
          <TextInput
            style={styles.textField}
            placeholder="Card Number"
            placeholderTextColor={"black"}
            value={cardNumber}
            onChangeText={(text) => setCardNumber(text)}
          />
        </View>
        <View style={{ marginLeft: get_width(17) }}>
          <View>
            <TextInput
              style={[
                styles.textField,
                {
                  marginRight: 24,
                },
              ]}
              placeholder="Expiration Date"
              placeholderTextColor={"black"}
              value={expiration}
              onChangeText={(text) => setExpiration(text)}
            />
          </View>
          <View>
            <TextInput
              style={styles.textField}
              placeholder="Security Code"
              placeholderTextColor={"black"}
              value={cvv}
              onChangeText={(text) => setCvv(text)}
            />
          </View>
        </View> */}

        <View
          style={{
            width: get_width(60),
            marginLeft: get_width(21),
            marginTop: get_height(10),
            marginBottom: get_height(30),
          }}
        >
          <Button
            title={`Pay $${stateCart["cartPrice"]}`}
            onPress={handlePayPress}
          />
        </View>
      </View>
      <Footer />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    width: get_width(100),
    backgroundColor: "black",
    flex:1
  },
  loginmanage: {
    paddingLeft: get_width(19),
    paddingTop: get_height(20),
    paddingBottom: get_height(5),
  },
  loginstyle: {
    fontSize: 40,
    color: "white",
  },
  title: {
    color: "black",
    fontSize: 32,
    marginBottom: 32,
  },
  textField: {
    height: get_height(5),
    marginTop: get_height(4),
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white",
    width: get_width(60),
    marginLeft: get_width(4),
    color: "black",
  },
});
export default CardPayment;
