import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUserSession = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        navigation.navigate("Home");
      }
    };

    checkUserSession();
  }, [navigation]);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Please fill in both fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid email format");
      return;
    }

    setLoading(true);

    try {
      // Check if user exists in AsyncStorage
      const storedUser = await AsyncStorage.getItem(email);

      if (!storedUser) {
        Alert.alert("User not found", "Please sign up first.");
        return;
      }

      const userData = JSON.parse(storedUser);

      // Validate password
      if (userData.password !== password) {
        Alert.alert("Invalid credentials", "Incorrect password.");
        return;
      }

      // Store user session token
      await AsyncStorage.setItem("userToken", "dummyToken"); // Simulated session token
      Alert.alert("Sign In Successful!");
      navigation.navigate("Recording"); // Navigate to the Home screen
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Sign In Failed", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#7f8c8d"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#7f8c8d"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#8e44ad" />
      ) : (
        <Button title="Sign In" onPress={handleSignIn} color="#8e44ad" />
      )}

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("signup")}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "black",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginBottom: 30,
  },
  input: {
    height: 50,
    width: "90%",
    borderColor: "#8e44ad",
    borderWidth: 1,
    marginBottom: 20,
    paddingVertical: 10,
    paddingLeft: 15,
    backgroundColor: "#333",
    color: "white",
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  link: {
    color: "white",
    fontSize: 16,
    textDecorationLine: "underline",
    marginTop: 10,
  },
});

export default SignInScreen;
