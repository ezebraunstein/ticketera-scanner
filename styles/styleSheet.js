'use strict';

var React = require('react-native');

import {StyleSheet} from "react-native";

var stylesSheet = StyleSheet.create({
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
      fontFamily: 'BebasNeue-Regular',
      fontSize: 50,
      fontWeight: "bold",
      color: "#fff",
    },
    logo: {
      width: 300, 
      height: 150, 
      resizeMode: 'contain',
      marginBottom: 20
  },
  textInputStyle: {
    backgroundColor: "#f2f2f2", 
    padding: 10,
    width: 300,
    marginBottom: 20,
    borderRadius: 10, 
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4, 
    fontFamily: 'BebasNeue-Regular'
  },
  softbox: {
    backgroundColor: '#f28d46',
    padding: 10,
    borderRadius: 5,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  softText: {
    fontFamily: 'BebasNeue-Regular',
    color: "#ffffff",
    fontSize: 30,
    
  },
  eventNameText: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 10,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.43,
    shadowRadius: 4.62,
    elevation: 4,
  },
  someTextStyle: {
    fontFamily: 'BebasNeue-Regular',
    color: "gray",
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 4.62,
    elevation: 4,
  }
  });

module.exports = stylesSheet;