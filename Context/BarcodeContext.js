import * as FileSystem from 'expo-file-system/legacy';
import React, { createContext, useContext, useState } from 'react';

// --- CONFIGURAÇÃO INICIAL ---
const dataDir = FileSystem.documentDirectory + 'barcodelists/';
const BarcodeContext = createContext();

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(dataDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dataDir, { intermediates: true });
  }
};

// --- COMPONENTE PRINCIPAL DO CONTEXTO ---
export const BarcodeProvider = ({ children }) => {
  // --- ESTADOS GLOBAIS ---
  // Função interna para sanitizar e construir o URI completo do arquivo
  const getFileUri = (fileName) => {
    // Remove caracteres de path traversal e outros caracteres potencialmente perigosos.
    const sanitizedName = fileName.replace(/[\\/.]/g, '');
    return `${dataDir}${sanitizedName}.json`;
  };
  const [scannedItems, setScannedItems] = useState([]);
  const [currentFileName, setCurrentFileName] = useState(null);

  // --- AÇÕES DE MANIPULAÇÃO DA LISTA ATUAL ---
  const addBarcodeItem = (newItem) => {
    // Gera um ID único para cada item, permitindo duplicados de código.
    const itemWithId = { ...newItem, id: `${Date.now()}-${Math.random()}` };
    if (itemWithId && itemWithId.code) {
      setScannedItems(prevItems => [...prevItems, itemWithId]);
    }
  };

  const updateItemDescription = (idToUpdate, newDescription) => {
    setScannedItems(prevItems =>
      prevItems.map(item =>
        item.id === idToUpdate ? { ...item, description: newDescription } : item
      )
    );
  };

  const updateItemQuantity = (idToUpdate, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    if (isNaN(quantity) || quantity < 1) return;
    setScannedItems(prevItems =>
      prevItems.map(item =>
        item.id === idToUpdate ? { ...item, quantity: quantity } : item
      )
    );
  };

  const updateItemExpirationDate = (idToUpdate, newDate) => {
    setScannedItems(prevItems =>
      prevItems.map(item =>
        item.id === idToUpdate ? { ...item, expirationDate: newDate } : item
      )
    );
  };

  const deleteItem = (idToDelete) => {
    setScannedItems(prevItems =>
      prevItems.filter(item => item.id !== idToDelete)
    );
  };

  const clearCurrentList = () => {
    setScannedItems([]);
    setCurrentFileName(null);
  };

  // --- OPERAÇÕES DE ARQUIVO (SALVAR, CARREGAR, LISTAR, DELETAR) ---
  const saveListToFile = async (fileName) => {
    await ensureDirExists();
    const fileUri = getFileUri(fileName);
    const jsonString = JSON.stringify(scannedItems);

    try {
      await FileSystem.writeAsStringAsync(fileUri, jsonString);
      setCurrentFileName(fileName); // Define o nome do arquivo após salvar
      return true;
    } catch (error) {
      console.error("Erro ao salvar arquivo:", error);
      return false;
    }
  };

  const loadListFromFile = async (fileName) => {
    await ensureDirExists();
    const fileUri = getFileUri(fileName);

    try {
      const jsonString = await FileSystem.readAsStringAsync(fileUri);
      const itemsFromFile = JSON.parse(jsonString);

      // Garante que cada item tenha um ID, para compatibilidade com listas antigas.
      const itemsWithId = itemsFromFile.map(item => 
        item.id ? item : { ...item, id: `${Date.now()}-${Math.random()}` }
      );
      setScannedItems(itemsWithId);
      setCurrentFileName(fileName);
      return true;
    } catch (error) {
      console.error("Erro ao carregar arquivo:", error);
      return false;
    }
  };

  const listSavedFiles = async () => {
    await ensureDirExists();
    try {
      const files = await FileSystem.readDirectoryAsync(dataDir);
      return files.filter(file => file.endsWith('.json')).map(file => file.replace('.json', ''));
    } catch (error) {
      console.error("Erro ao listar arquivos:", error);
      return [];
    }
  };

  const deleteFile = async (fileName) => {
    await ensureDirExists();
    const fileUri = getFileUri(fileName);
    try {
      await FileSystem.deleteAsync(fileUri);
      return true;
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
      return false;
    }
  };

  const importList = async (fileName, jsonContent) => {
    await ensureDirExists();
    const fileUri = getFileUri(fileName);

    try {
      const itemsFromFile = JSON.parse(jsonContent);
      // Garante que cada item tenha um ID, para compatibilidade com listas antigas.
      const itemsWithId = itemsFromFile.map(item => 
        item.id ? item : { ...item, id: `${Date.now()}-${Math.random()}` }
      );
      const newJsonContent = JSON.stringify(itemsWithId);
      await FileSystem.writeAsStringAsync(fileUri, newJsonContent);
      return true;
    } catch (error) {
      console.error("Erro ao importar arquivo:", error);
      return false;
    }
  };


  // Objeto de valor que será compartilhado com todo o app
  const value = {
    scannedItems,
    currentFileName,
    addBarcodeItem,
    updateItemDescription,
    updateItemQuantity,
    updateItemExpirationDate,
    deleteItem,
    clearCurrentList,
    saveListToFile,
    loadListFromFile,
    listSavedFiles,
    deleteFile,
    importList,
  };

  return (
    <BarcodeContext.Provider value={value}>
      {children}
    </BarcodeContext.Provider>
  );
};

export const useBarcode = () => {
  return useContext(BarcodeContext);
};