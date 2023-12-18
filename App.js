import React, { useEffect } from "react";
import ExploreStore from "./Screens/ExploreStore";
import CustomerSignUp from "./Screens/CustomerSignUp";
import DesignerSignUp from "./Screens/DesignerSignUp";
import Signin from "./Screens/Signin";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import { store } from "./store/redux/store";
import DesignerProfile from "./Screens/DesignerProfile";
import AddProduct from "./Screens/AddProduct";
import ViewProduct from "./Screens/ViewProduct";
import EditProduct from "./Screens/EditProduct";
import CustomerProfile from "./Screens/CustomerProfile";
import CustomerDesignerProfile from "./Screens/CustomerDesignerProfile";
import ShoppingCart from "./Screens/ShoppingCart";
import SearchPage from "./Screens/SearchPage";
import PersonalCloset from "./Screens/PersonalCloset";
import Checkout from "./Screens/Checkout";
import ViewMyOrder from "./Screens/ViewMyOrder";
import ViewActiveOrders from "./Screens/ViewActiveOrders";
import CardPayment from "./Screens/CardPayment";
import DesignerOrders from "./Screens/DesignerOrders";
import LikedProducts from "./Screens/LikedProducts";
import Notifications from "./Screens/sideMenuScreens/Notification";
import Feedback from "./Screens/sideMenuScreens/Feedback";
import AboutUs from "./Screens/sideMenuScreens/AboutUs";
import HelpAndFaq from "./Screens/sideMenuScreens/HelpAndFaq";


import { StripeProvider,initStripe } from "@stripe/stripe-react-native";

let publishableKey = "pk_live_51MgON0DDq3y8h1nkvsQtsqgB0qg9jxkgkZ4AInVofSzKqLC3zcDu5WgoZN16Hc5sMt2SxinpjXzBMv5Ih978Kv2N00vo5Eo02L";
export default function App() {
  const Stack = createStackNavigator();

  useEffect(() => {
    initStripe({
      publishableKey: publishableKey,
    });
  }, []);

  return (
    <StripeProvider publishableKey={publishableKey}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
          <Stack.Screen
              name="CustomerProfile"
              component={CustomerProfile}
              options={{ header: () => null }}
            />
            <Stack.Screen
              name="Signin"
              component={Signin}
              options={{ header: () => null }}
            />
            <Stack.Screen
              name="LoginDecider"
              component={ExploreStore}
              options={{ header: () => null }}
            />
            <Stack.Screen
              name="CustomerSignup"
              component={CustomerSignUp}
              options={{ header: () => null }}
            />
            <Stack.Screen
              name="DesignerSignup"
              component={DesignerSignUp}
              options={{ header: () => null }}
            />
            <Stack.Screen
              name="DesignerProfile"
              component={DesignerProfile}
              options={{ header: () => null }}
            />
            <Stack.Screen
              name="AddProduct"
              component={AddProduct}
              options={{ header: () => null }}
            />
            <Stack.Screen
              name="ViewProduct"
              component={ViewProduct}
              options={{ header: () => null }}
            />
            <Stack.Screen
              name="EditProduct"
              component={EditProduct}
              options={{ header: () => null }}
            />

            <Stack.Screen
              name="CustomerDesignerProfile"
              component={CustomerDesignerProfile}
              options={{ header: () => null }}
            />
            <Stack.Screen
              name="ShoppingCart"
              component={ShoppingCart}
              options={{ header: () => null }}
            />
            <Stack.Screen
              name="SearchPage"
              component={SearchPage}
              options={{ header: () => null }}
            />
            <Stack.Screen
              name="ClosetPage"
              component={PersonalCloset}
              options={{ header: () => null }}
            />
            <Stack.Screen
              name="Checkout"
              component={Checkout}
              options={{ header: () => null }}
            />
            <Stack.Screen
              name="ViewMyOrder"
              component={ViewMyOrder}
              options={{ header: () => null }}
            />
            <Stack.Screen
              name="CardPayment"
              component={CardPayment}
              options={{ header: () => null }}
            />
            <Stack.Screen
              name="ViewActiveOrders"
              component={ViewActiveOrders}
              options={{ header: () => null }}
            />
            <Stack.Screen
              name="DesignerOrders"
              component={DesignerOrders}
              options={{ header: () => null }}
            />
             <Stack.Screen
              name="Notifications"
              component={Notifications}
              options={{ header: () => null }}
            />
             <Stack.Screen
              name="Feedback"
              component={Feedback}
              options={{ header: () => null }}
            />
             <Stack.Screen
              name="HelpAndFaq"
              component={HelpAndFaq}
              options={{ header: () => null }}
            />
             <Stack.Screen
              name="AboutUs"
              component={AboutUs}
              options={{ header: () => null }}
            />

            <Stack.Screen
              name="LikedProducts"
              component={LikedProducts}
              options={{ header: () => null }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </StripeProvider>
  );
}
