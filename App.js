import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, Button, TouchableOpacity, Image } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import Constants from "expo-constants";
import logo from './assets/MeloLogo.png';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import AWS from "aws-sdk";

import useFonts from './hooks/useFonts';

const { REACT_APP_ACCESS_KEY, REACT_APP_SECRET_ACCESS_KEY } = Constants.manifest.extra;

AWS.config.update({
  region: "us-east-1",
  accessKeyId: REACT_APP_ACCESS_KEY,
  secretAccessKey: REACT_APP_SECRET_ACCESS_KEY,
});

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("");
  const [validTicket, setValidTicket] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [inputEventID, setInputEventID] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [IsReady, SetIsReady] = useState(false);

  const LoadFonts = async () => {
    await useFonts();
  };

  const docClient = new AWS.DynamoDB.DocumentClient();

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  const handleStartScanning = () => {
    if (inputEventID) {
      setIsScanning(true);
    } else {
      alert("Please enter an event ID before scanning.");
    }
  };

  const handleGoBack = () => {
    setIsScanning(false);
};

  const fetchTicketInformation = async (ticketId) => {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: "Ticket-zn4tkt5eivea5af5egpjlychcm-dev",
        FilterExpression: "id = :id",
        ExpressionAttributeValues: {
          ":id": ticketId,
        },
      };

      docClient.scan(params, (err, items) => {
        if (err) {
          console.error(
            "Unable to scan the table. Error JSON:",
            JSON.stringify(err, null, 2)
          );
          reject(err);
        } else {
          resolve(items);
        }
      });
    });
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setText(data);

    try {
      const items = await fetchTicketInformation(data);

      if (items.Count === 1) {
        if (items.Items[0].eventID === inputEventID && items.Items[0].validTicket) {
          setValidTicket(true);

          const updateParams = {
            TableName: "Ticket-zn4tkt5eivea5af5egpjlychcm-dev",
            Key: { "id": data },
            UpdateExpression: "set validTicket = :v",
            ExpressionAttributeValues: { ":v": false },
          };

          docClient.update(updateParams, (err, data) => {
            if (err) {
              console.error(
                "Unable to update ticket. Error JSON:",
                JSON.stringify(err, null, 2)
              );
            }
          });
        }
        else if (items.Items[0].eventID !== inputEventID) {
          setValidTicket("eventMismatch");
        } else {
          setValidTicket(false);
        }
      }

      setShowResult(true);

      setTimeout(() => {
        setScanned(false);
        setShowResult(false);
      }, 3000);
    } catch (err) {
      console.error("Error fetching ticket information:", err);
    }
  };

  const ResultOverlay = () => {
    if (!showResult) return null;

    if (validTicket === "eventMismatch") {
      return (
        <View style={[styles.overlay, { backgroundColor: "rgba(255, 255, 0, 0.7)" }]}>
          <Text style={styles.overlayText}>Incorrect Event</Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: validTicket
              ? "rgba(0, 255, 0, 0.7)"
              : "rgba(255, 0, 0, 0.7)",
          },
        ]}
      >
        <Text style={styles.overlayText}>
          {validTicket ? "✓ Valid Ticket" : "✕ Invalid Ticket"}
        </Text>
      </View>
    );
  };

  if (!IsReady) {
    return (
      <AppLoading
        startAsync={LoadFonts}
        onFinish={() => SetIsReady(true)}
        onError={() => {}}
      />
    );
  }

  return (
    <View style={styles.container}>
      {!isScanning && (
        <>
        <Image source={logo} style={styles.logo} />
          {/* <TextInput
            style={{ backgroundColor: "white", padding: 10, width: 300, marginBottom: 20 }}
            placeholder="Enter Event ID"
            value={inputEventID}
            onChangeText={setInputEventID}
          /> */}
          <TextInput
            style={styles.textInputStyle}
            placeholder="Ingrese código del evento..."
            placeholderTextColor="#777"
            value={inputEventID}
            onChangeText={setInputEventID}
          />
          <TouchableOpacity style={styles.btnMain} onPress={handleStartScanning}>
            <Text style={{ color: "#ffffff", fontSize: 30, fontFamily: 'BebasNeue-Regular', textAlign: "center" }}>Continuar</Text>
          </TouchableOpacity>
        </>
      )}
      {isScanning && (
        <>
          <View style={styles.barcodebox}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={{ height: 400, width: 400 }}
            />
            {ResultOverlay()}
          </View>
          <TouchableOpacity style={styles.btnSecondary} onPress={handleGoBack}>
            <Text style={{ color: "#ffffff", fontSize: 25, fontFamily: 'BebasNeue-Regular', textAlign: "center" }}>Volver</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B1CD4A",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: 400,
    width: 400,
    overflow: "hidden",
    borderRadius: 20,
  },
  btnMain: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 30,
    textAlign: "center",
    backgroundColor: "#f28d46",
    padding: 10,
    paddingHorizontal: 15,
    color: "#ffffff",
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
    marginTop: 15
  },
  btnSecondary: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 25,
    textAlign: "center",
    backgroundColor: "#f28d46",
    padding: 8,
    paddingHorizontal: 12,
    marginTop: 20,
    color: "#ffffff",
    borderRadius: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '90%'
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#fff",
  },
  logo: {
    width: 300, // or your desired size
    height: 150, // or your desired size
    resizeMode: 'contain',
    marginBottom: 20
},
textInputStyle: {
  backgroundColor: "#f2f2f2", // slightly darker than white
  padding: 10,
  width: 300,
  marginBottom: 20,
  borderRadius: 10, // soft corner effect
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.23,
  shadowRadius: 2.62,
  elevation: 4, // for Android shadow
  fontFamily: 'BebasNeue-Regular'
}
});