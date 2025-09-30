import { StyleSheet } from 'react-native';
import Dialog from "react-native-dialog";

export const ExpirationDateDialog = ({ visible, onCancel, onConfirm, date, onChangeDate }) => (
  <Dialog.Container visible={visible}>
    <Dialog.Title>Alterar Data de Validade</Dialog.Title>
    <Dialog.Description>Digite a data de validade (ex: DD/MM/AAAA).</Dialog.Description>
    <Dialog.Input value={date} onChangeText={onChangeDate} style={styles.dialogInput} underlineColorAndroid="transparent" placeholder="DD/MM/AAAA" keyboardType="numeric" maxLength={10} />
    <Dialog.Button label="Cancelar" onPress={onCancel} color="grey" />
    <Dialog.Button label="Confirmar" onPress={onConfirm} bold={true} />
  </Dialog.Container>
);

const styles = StyleSheet.create({
  dialogInput: { 
    color: '#598E8A',
    borderWidth: 1,
    borderColor: '#d3d3d3', 
    borderRadius: 5, 
    padding: 10, 
  }
});