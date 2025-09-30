import { StyleSheet } from 'react-native';
import Dialog from "react-native-dialog";

export const RenameListDialog = ({ visible, onCancel, onConfirm, fileName, setFileName }) => (
  <Dialog.Container visible={visible}>
    <Dialog.Title>Renomear Lista</Dialog.Title>
    <Dialog.Description>Digite o novo nome para esta lista.</Dialog.Description>
    <Dialog.Input value={fileName} onChangeText={setFileName} style={styles.dialogInput} underlineColorAndroid="transparent" />
    <Dialog.Button label="Cancelar" onPress={onCancel} color="grey" />
    <Dialog.Button label="Renomear" onPress={onConfirm} bold={true} />
  </Dialog.Container>
);

const styles = StyleSheet.create({
  dialogInput: { color: '#598E8A', borderWidth: 1, borderColor: '#d3d3d3', borderRadius: 5, padding: 10, }
});