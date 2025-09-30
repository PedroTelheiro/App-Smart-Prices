import React from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';

export const PromptDialog = ({ visible, title, message, initialValue, onCancel, onConfirm }) => {
  const [text, setText] = React.useState(initialValue || '');

  React.useEffect(() => {
    setText(initialValue || '');
  }, [initialValue]);

  const handleConfirm = () => {
    onConfirm(text);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{title}</Text>
          {message && <Text style={styles.modalMessage}>{message}</Text>}
          <TextInput
            style={styles.input}
            onChangeText={setText}
            value={text}
            autoFocus={true}
          />
          <View style={styles.buttonContainer}>
            <Button title="Cancelar" onPress={onCancel} color="#ff5c5c" />
            <View style={{ width: 20 }} />
            <Button title="Salvar" onPress={handleConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalView: { margin: 20, backgroundColor: 'white', borderRadius: 10, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, width: '90%' },
  modalTitle: { marginBottom: 15, textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
  modalMessage: { marginBottom: 20, textAlign: 'center', fontSize: 14, color: 'gray' },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, width: '100%', padding: 10, borderRadius: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', width: '100%' },
});