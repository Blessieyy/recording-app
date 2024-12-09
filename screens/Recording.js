import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import React, { useState } from "react";

export default function Recording() {
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [newName, setNewName] = useState("");

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    try {
      await recording.stopAndUnloadAsync();
      const { sound, status } = await recording.createNewLoadedSoundAsync();
      const newRecording = {
        id: Date.now(),
        sound: sound,
        duration: getDurationFormatted(status.durationMillis),
        file: recording.getURI(),
        name: `Recording #${recordings.length + 1}`,
        date: new Date(),
      };
      setRecordings((prevRecordings) => [...prevRecordings, newRecording]);
      setRecording(undefined);
    } catch (err) {
      console.error("Error stopping recording:", err);
    }
  }

  function getDurationFormatted(milliseconds) {
    const minutes = Math.floor(milliseconds / 1000 / 60);
    const seconds = Math.round((milliseconds / 1000) % 60);
    return seconds < 10
      ? `${minutes}:0${seconds}`
      : `${minutes}:${seconds}`;
  }

  function getRecordingLines() {
    return recordings.map((recording, index) => (
      <View key={recording.id} style={styles.recordingItem}>
        <Text style={styles.recordingText}>
          {recording.name} | {recording.duration} | {recording.date.toLocaleString()}
        </Text>
        <TouchableOpacity onPress={() => recording.sound.replayAsync()} style={styles.button}>
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteRecording(recording.id)} style={styles.button}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => startEdit(index)} style={styles.button}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    ));
  }

  function deleteRecording(id) {
    setRecordings((prevRecordings) =>
      prevRecordings.filter((recording) => recording.id !== id)
    );
  }

  function startEdit(index) {
    setEditIndex(index);
    setNewName(recordings[index].name);
  }

  function saveEdit() {
    setRecordings((prevRecordings) =>
      prevRecordings.map((recording, index) =>
        index === editIndex ? { ...recording, name: newName } : recording
      )
    );
    setEditIndex(null);
    setNewName("");
  }

  function clearRecording() {
    setRecordings([]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Recorder</Text>
      <TouchableOpacity
        style={styles.recordButton}
        onPress={recording ? stopRecording : startRecording}
      >
        <Text style={styles.recordButtonText}>
          {recording ? "Stop Recording" : "Start Recording"}
        </Text>
      </TouchableOpacity>

      {getRecordingLines()}

      {editIndex !== null && (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
            placeholder="Edit Name"
            placeholderTextColor="#7f8c8d"
          />
          <TouchableOpacity style={styles.button} onPress={saveEdit}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setEditIndex(null)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {recordings.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearRecording}>
          <Text style={styles.clearButtonText}>Clear Recordings</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

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
    color: "white",
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#8e44ad",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: "#333",
    color: "white",
    fontSize: 16,
    borderRadius: 5,
  },
  recordingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#8e44ad",
  },
  recordingText: {
    color: "white",
    flex: 1,
    fontSize: 14,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#8e44ad",
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
  },
  recordButton: {
    backgroundColor: "#8e44ad",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  recordButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  clearButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  clearButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
});
