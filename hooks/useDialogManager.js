import { useState } from 'react';
import { Alert } from 'react-native';

const DIALOG_TYPES = {
  SAVE: 'save',
  RENAME: 'rename',
  QUANTITY: 'quantity',
  DATE: 'date',
};

const initialDialogState = {
  type: null,
  visible: false,
  data: {},
};

export const useDialogManager = (barcodeContext) => {
  const {
    currentFileName,
    saveListToFile,
    deleteFile,
    updateItemQuantity,
    updateItemExpirationDate,
  } = barcodeContext;

  const [dialogState, setDialogState] = useState(initialDialogState);

  const openDialog = (type, data = {}) => {
    setDialogState({ type, visible: true, data });
  };

  const closeDialog = () => {
    setDialogState(initialDialogState);
  };

  const updateDialogData = (newData) => {
    setDialogState(prev => ({ ...prev, data: { ...prev.data, ...newData } }));
  };

  const handleConfirm = async () => {
    const { type, data } = dialogState;
    let success = false;
    let message = '';

    switch (type) {
      case DIALOG_TYPES.SAVE:
        const saveName = data.fileName?.trim();
        if (saveName) {
          success = await saveListToFile(saveName);
          message = success ? `A lista "${saveName}" foi salva.` : 'Não foi possível salvar a lista.';
          Alert.alert(success ? 'Sucesso!' : 'Erro', message);
        }
        break;

      case DIALOG_TYPES.RENAME:
        const oldName = currentFileName;
        const newName = data.fileName?.trim();
        if (newName && newName !== oldName) {
          success = await saveListToFile(newName);
          if (success) {
            await deleteFile(oldName);
            message = `A lista foi renomeada para "${newName}".`;
            Alert.alert("Sucesso", message);
          } else {
            Alert.alert("Erro", "Não foi possível renomear a lista.");
          }
        }
        break;

      case DIALOG_TYPES.QUANTITY:
        const quantity = parseInt(data.quantity, 10);
        if (quantity > 999) {
          Alert.alert("Limite Excedido", "A quantidade não pode ser maior que 999.");
          return; 
        }
        if (data.itemId && !isNaN(quantity) && quantity >= 1) {
          updateItemQuantity(data.itemId, String(quantity));
        }
        break;

      case DIALOG_TYPES.DATE:
        const { date, itemId, isValidDate } = data;
        if (date && !isValidDate(date)) {
          Alert.alert("Data Inválida", "Por favor, insira uma data válida no formato DD/MM/AAAA.");
          return; 
        }
        if (itemId) {
          updateItemExpirationDate(itemId, date);
        }
        break;

      default:
        break;
    }

    closeDialog();
  };

  return {
    DIALOG_TYPES,
    dialogState,
    openDialog,
    closeDialog,
    updateDialogData,
    handleConfirm,
  };
};