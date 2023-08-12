import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import Constants from "expo-constants";
import AWS from "aws-sdk";

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
    console.log("Type: " + type + "\nData: " + data);

    try {
      const items = await fetchTicketInformation(data);

      console.log("Scan succeeded. Data:", items);
      if (items.Count === 1) {
        setValidTicket(items.Items[0].validTicket);

        if (items.Items[0].validTicket) {
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
            } else {
              console.log("Ticket updated successfully:", data);
            }
          });
        }
      }

      setShowResult(true);

      setTimeout(() => {
        setScanned(false);
        setShowResult(false);
      }, 1000);
    } catch (err) {
      console.error("Error fetching ticket information:", err);
    }
  };

  const ResultOverlay = () => {
    if (validTicket === null || !showResult) return null;

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

  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }}
        />
        {ResultOverlay()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },

  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: 350,
    width: 350,
    overflow: "hidden",
    borderRadius: 20,
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
});
