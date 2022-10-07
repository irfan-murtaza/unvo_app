import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import { get_width, get_height } from "../responsive_width_height";

export const Search = (props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("all");
  const [items, setItems] = useState([
    { label: "All", value: "all" },
    { label: "Men", value: "men" },
    { label: "Women", value: "women" },
    { label: "Kids", value: "kids" },
  ]);

  // useEffect(() => {
  //   props.setCategory(value);
  // }, [value]);

  return (
    <View style={styles.outer_style}>
      <View style={styles.input}>
        <Searchbar
          placeholder="Search by name"
          placeholderTextColor="black"
          iconColor="black"
          onChangeText={(val) => {
            props.setSearch(val);
          }}
          // onChangeText={onChangeSearch}
          // value={searchQuery}
        />
      </View>
      <View style={styles.input}>
        <Searchbar
          placeholder="Search by category"
          placeholderTextColor="black"
          iconColor="black"
          onChangeText={(val) => {
            props.setCategory(val);
          }}
          // onChangeText={onChangeSearch}
          // value={searchQuery}
        />
      </View>
        {/* <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="All categories"
          zIndex={3000}
          zIndexInverse={1000}
        /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  outer_style: {
    backgroundColor: "black",
  },
  input: {
    marginLeft: get_width(10),
    marginRight: get_width(10),
    marginTop: get_height(2),
  },
  dropdown_style: {
    marginTop: get_height(3),
    width: get_width(80),
    marginLeft: get_width(10),
    paddingBottom: get_height(20),
  },
});
