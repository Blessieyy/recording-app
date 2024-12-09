import { StyleSheet, Text, View, ImageBackground, Button } from "react-native";
import React from "react";

import mixer from "../image/saso-tusar-QtgGYlug6Cw-unsplash.jpg";

const Intro = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ImageBackground source={mixer} resizeMode="cover" style={styles.image}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to the App</Text>
          <View style={styles.buttons}>
            <Button
              onPress={() => navigation.navigate("signin")}
              title="Sign In"
            />
            <Button
              onPress={() => navigation.navigate("signup")}
              title="Sign Up"
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Intro;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  buttons: {
    display: "flex",
    flexDirection: "row",
  },

  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
});
