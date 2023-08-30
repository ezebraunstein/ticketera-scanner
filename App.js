import React, { useState, useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity, Image, Animated, Easing } from "react-native";
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

var s = require('./styles/styleSheet');

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("");
  const [validTicket, setValidTicket] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [inputEventID, setInputEventID] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [IsReady, SetIsReady] = useState(false);
  const [logoAnim] = useState(new Animated.Value(0));
  const [showIntro, setShowIntro] = useState(true);
  const [ticketData, setTicketData] = useState(null);
  const [eventName, setEventName] = useState("");
  const [validTicketCount, setValidTicketCount] = useState(0);
  const [prevEventID, setPrevEventID] = useState("");


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

  useEffect(() => {
    Animated.timing(logoAnim, {
      toValue: 1,
      duration: 1500,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start(() => setShowIntro(false));
  }, []);

  useEffect(() => {
    if (inputEventID !== prevEventID) {
        setValidTicketCount(0);
        setPrevEventID(inputEventID);  
        setTicketData(null);  
    }
}, [inputEventID]);

  const handleStartScanning = async () => {
    if (inputEventID) {
      setIsScanning(true);
      try {
        const name = await fetchEventName(inputEventID);
        setEventName(name);
      } catch (err) {
        console.error("Error fetching event name:", err);
      }
    } else {
      alert("Ingrese un código de evento válido antes de continuar");
    }
};

  const handleGoBack = () => {
    setIsScanning(false);
  };

  const fetchEventName = async (eventID) => {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: "Event-zn4tkt5eivea5af5egpjlychcm-dev",
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
          ":id": eventID,
        },
      };

      docClient.query(params, (err, items) => {
        if (err) {
          console.error(
            "Unable to query the event table. Error JSON:",
            JSON.stringify(err, null, 2)
          );
          reject(err);
        } else {
          resolve(items.Items[0]?.nameEvent || null);
        }
      });
    });
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

  const fetchTicketTypeName = async (typeTicketID) => {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: "TypeTicket-zn4tkt5eivea5af5egpjlychcm-dev",
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
          ":id": typeTicketID,
        },
      };

      docClient.query(params, (err, items) => {
        if (err) {
          console.error(
            "Unable to query the table. Error JSON:",
            JSON.stringify(err, null, 2)
          );
          reject(err);
        } else {
          resolve(items.Items[0]?.nameTT || null);
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

        const typeName = await fetchTicketTypeName(items.Items[0].typeticketID);

        setTicketData({
          dniTicket: items.Items[0].dniTicket,
          typeticketID: typeName
        });

        setValidTicketCount(prevCount => prevCount + 1); // Increase the count by 1

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
        setTicketData(null);

      } else {

        setValidTicket(false);
        const typeName = await fetchTicketTypeName(items.Items[0].typeticketID);
        setTicketData({
          dniTicket: items.Items[0].dniTicket,
          typeticketID: typeName
        });

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
        <View style={[s.overlay, { backgroundColor: "rgba(255, 255, 0, 0.7)" }]}>
          <Text style={s.overlayText}>NO RECONOCIDO</Text>
        </View>
      );
    }

    return (
      <View
        style={[
          s.overlay,
          {
            backgroundColor: validTicket
              ? "rgba(0, 255, 0, 0.7)"
              : "rgba(255, 0, 0, 0.7)",
          },
        ]}
      >
        <Text style={s.overlayText}>
          {validTicket ? "✓ VÁLIDO" : "✕ INVÁLIDO"}
        </Text>
      </View>
    );
  };

  const logoStyles = {
    transform: [
      {
        scale: logoAnim
      }
    ],
    opacity: logoAnim
  };

  if (!IsReady || showIntro) {
    if (showIntro) {
      return (
        <View style={s.container}>
          <Animated.Image source={logo} style={[s.logo, logoStyles]} />
        </View>
      );
    } else {
      return (
        <AppLoading
          startAsync={LoadFonts}
          onFinish={() => SetIsReady(true)}
          onError={() => {}}
        />
      );
    }
  }

  return (
    <View style={s.container}>
      {!isScanning && (
        <>
        <Image source={logo} style={s.logo} />
          <TextInput
            style={s.textInputStyle}
            placeholder="Ingrese código del evento..."
            placeholderTextColor="#777"
            value={inputEventID}
            onChangeText={setInputEventID}
          />
          <TouchableOpacity style={s.btnMain} onPress={handleStartScanning}>
            <Text style={{ color: "#ffffff", fontSize: 30, fontFamily: 'BebasNeue-Regular', textAlign: "center" }}>Continuar</Text>
          </TouchableOpacity>
        </>
      )}
      {isScanning && (
        <>
            <Text style={s.eventNameText}>{eventName}</Text>
            <Text style={{ ...s.someTextStyle, textAlign: 'center' }}>
              Asistentes: {validTicketCount}
            </Text>
            <View style={s.barcodebox}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={{ height: 400, width: 400 }}
            />
            {ResultOverlay()}
          </View>
          <View style={s.softbox}>
            {ticketData ? (
              <>
                <Text style={s.softText} >DNI: {ticketData.dniTicket}</Text>
                <Text style={s.softText}>TIPO ENTRADA: {ticketData.typeticketID}</Text>
                <Text style={[s.softText, { color: validTicket ? "#8fac24" : "#ee593c" }]}>
                <Text style={s.softText}>ESTADO: </Text>
                {validTicket ? "✓ Válido" : "✕ Inválido"}
            </Text>
              </>
            ) : validTicket === "eventMismatch" ? (
              <>
              <Text style={s.softText}>DNI: --------</Text>
              <Text style={s.softText}>TIPO ENTRADA: --------</Text>
              <Text style={s.softText}>ESTADO: --------</Text>
              </>
            ) : (
              <>
              <Text style={s.softText}>DNI: --------</Text>
              <Text style={s.softText}>TIPO ENTRADA: --------</Text>
              <Text style={s.softText}>ESTADO: --------</Text>
              </>
            )}
          </View>
          <TouchableOpacity style={s.btnSecondary} onPress={handleGoBack}>
            <Text style={{ color: "#ffffff", fontSize: 25, fontFamily: 'BebasNeue-Regular', textAlign: "center" }}>Volver</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
