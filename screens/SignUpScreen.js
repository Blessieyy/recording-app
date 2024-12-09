import React, { useState } from "react";
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

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Please fill in all fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid email format");
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      Alert.alert("Password should be at least 6 characters");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Check if user already exists
      const existingUser = await AsyncStorage.getItem(email);
      if (existingUser) {
        Alert.alert("User already exists", "Please use another email.");
        return;
      }

      // Save user credentials to AsyncStorage
      await AsyncStorage.setItem(email, JSON.stringify({ email, password }));
      Alert.alert("Sign Up Successful!", "You can now sign in.");
      navigation.navigate("signin");
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Sign Up Failed", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

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

      <TextInput
        style={styles.input}
        placeholder="Confirm your password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor="#7f8c8d"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#8e44ad" />
      ) : (
        <Button title="Sign Up" onPress={handleSignUp} color="#8e44ad" />
      )}

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("signin")}>
          <Text style={styles.link}>Already have an account? Sign In</Text>
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

export default SignUpScreen;
