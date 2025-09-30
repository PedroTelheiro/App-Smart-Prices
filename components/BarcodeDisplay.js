import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Barcode } from 'react-native-svg-barcode';

const BarcodeDisplay = ({ item }) => {
  if (!item || !item.code) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Barcode value={String(item.code)} format="EAN13" width={2.7} height={120}/>
      <Text style={styles.barcodeText}>{item.code}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  barcodeText: {
    fontSize: 16,
    color: '#000',
    marginTop: 5,
  }
});

export default BarcodeDisplay;