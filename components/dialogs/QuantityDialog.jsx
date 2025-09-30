import { StyleSheet } from 'react-native';
import Dialog from "react-native-dialog";

export const QuantityDialog = ({ visible, onCancel, onConfirm, quantity, setQuantity }) => (
  <Dialog.Container visible={visible}>
    <Dialog.Title>Alterar Quantidade</Dialog.Title>
    <Dialog.Description>Digite a nova quantidade para este item.</Dialog.Description>
    <Dialog.Input value={quantity} onChangeText={setQuantity} style={styles.dialogInput} underlineColorAndroid="transparent" keyboardType="numeric" />
    <Dialog.Button label="Cancelar" onPress={onCancel} color="grey" />
    <Dialog.Button label="Confirmar" onPress={onConfirm} bold={true} />
  </Dialog.Container>
);

const styles = StyleSheet.create({
  dialogInput: { color: '#598E8A', borderWidth: 1, borderColor: '#d3d3d3', borderRadius: 5, padding: 10, }
});