'use strict';

var React = require('react-native');

import { StyleSheet } from "react-native";

var stylesSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#272727",
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
    fontFamily: 'DisplayExtraBold',
    fontSize: 30,
    textAlign: "center",
    backgroundColor: "#E4FF1A",
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
    marginTop: 15,
    textTransform: 'uppercase'
  },
  btnSecondary: {
    fontFamily: 'DisplayExtraBold',
    fontSize: 25,
    textAlign: "center",
    backgroundColor: "#E4FF1A",
    padding: 8,
    paddingHorizontal: 12,
    marginTop: 20,
    color: "#ffffff",
    borderRadius: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '90%',
    textTransform: 'uppercase'
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
    fontFamily: 'DisplayExtraBold',
    fontSize: 50,
    fontWeight: "bold",
    color: "#fff",
    textTransform: 'uppercase',
    textAlign: 'center',
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
    fontFamily: 'DisplayExtraBold',
    textTransform: 'uppercase'
  },
  textInputStyle: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    width: 300,
    marginBottom: 20,
    borderRadius: 10,
    fontFamily: 'DisplayExtraBold',
    textTransform: 'uppercase'
  },
  softbox: {
    backgroundColor: '#E4FF1A',
    padding: 10,
    borderRadius: 5,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  softText: {
    fontFamily: 'DisplayExtraBold',
    color: "#272727",
    fontSize: 20,
    textTransform: 'uppercase',
    textAlign: 'center',

  },
  eventNameText: {
    fontFamily: 'DisplayExtraBold',
    fontSize: 50,
    color: "#E4FF1A",
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  someTextStyle: {
    fontFamily: 'DisplayExtraBold',
    color: "#E4FF1A",
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    textTransform: 'uppercase',
  }
});

module.exports = stylesSheet;