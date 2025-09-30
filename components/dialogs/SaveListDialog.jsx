import React from 'react';
import { StyleSheet } from 'react-native';
import Dialog from "react-native-dialog";

export const SaveListDialog = ({ visible, onCancel, onConfirm, fileName, setFileName }) => (
  <Dialog.Container visible={visible}>
    <Dialog.Title>Salvar Nova Lista</Dialog.Title>
    <Dialog.Description>Digite um nome para este grupo de códigos.</Dialog.Description>
    <Dialog.Input value={fileName} onChangeText={setFileName} style={styles.dialogInput} underlineColorAndroid="transparent" />
    <Dialog.Button label="Cancelar" onPress={onCancel} color="grey" />
    <Dialog.Button label="Salvar" onPress={onConfirm} bold={true} />
  </Dialog.Container>
);

const styles = StyleSheet.create({
  dialogInput: { color: "#598E8A", borderWidth: 1, borderColor: '#d3d3d3', borderRadius: 5, padding: 10, }
});