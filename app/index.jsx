import { Feather } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import React from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BarcodeListItem from '../components/BarcodeListItem';
import BottomNav from '../components/BottomNav';
import { ExpirationDateDialog } from '../components/dialogs/ExpirationDateDialog';
import { QuantityDialog } from '../components/dialogs/QuantityDialog';
import { RenameListDialog } from '../components/dialogs/RenameListDialog';
import { SaveListDialog } from '../components/dialogs/SaveListDialog';
import Header from '../components/Header';
import { useBarcode } from '../Context/BarcodeContext';
import { useDialogManager } from '../hooks/useDialogManager';
import { exportDataAsJson } from '../utils/exportUtils';


const EmptyListPlaceholder = () => (
  <View style={styles.placeholderContainer}>
    <Feather name="maximize" size={50} color="#ccc" />
    <Text style={styles.placeholderText}>Nenhum código escaneado</Text>
  </View>
);

const HomeScreen = () => {
  const barcodeContext = useBarcode();
  const { scannedItems, currentFileName, updateItemDescription, clearCurrentList, deleteItem } = barcodeContext;

  const {
    DIALOG_TYPES,
    dialogState,
    openDialog,
    closeDialog,
    updateDialogData,
    handleConfirm,
  } = useDialogManager(barcodeContext);

  const handleDeleteItem = (item) => {
    Alert.alert(
      "Apagar Item",
      `Tem certeza de que deseja apagar o item "${item.code}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          onPress: () => deleteItem(item.id),
          style: "destructive"
        }
      ]
    );
  };

  //  --- SALVAR ---
  const handleSave = async () => {
    if (scannedItems.length === 0) {
      Alert.alert("Atenção", "Não há itens na tela para salvar.");
      return;
    }

    if (currentFileName) {
      const success = await barcodeContext.saveListToFile(currentFileName);
      const message = success ? `A lista "${currentFileName}" foi atualizada.` : 'Não foi possível atualizar a lista.';
      Alert.alert(success ? 'Sucesso!' : 'Erro', message);
    } else {
      openDialog(DIALOG_TYPES.SAVE, { fileName: '' });
    }
  };

  // --- RENOMEAR ---
  const handleLongPressTitle = () => {
    if (currentFileName) {
      openDialog(DIALOG_TYPES.RENAME, { fileName: currentFileName });
    } else {
      Alert.alert("Atenção", "Salve a lista primeiro para poder renomeá-la.");
    }
  };

  // --- QUANTIDADE ---
  const handleOpenQuantityDialog = (item) => {
    openDialog(DIALOG_TYPES.QUANTITY, { itemId: item.id, quantity: String(item.quantity || 1) });
  };

  // --- DATA DE VALIDADE ---
  const formatDateInput = (text) => {
    // Remove tudo que não for dígito
    const digits = text.replace(/\D/g, '');
    // Adiciona as barras conforme o usuário digita
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };

  const handleDateInputChange = (text) => {
    updateDialogData({ date: formatDateInput(text) });
  };

  const isValidDate = (dateString) => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!regex.test(dateString)) return false;

    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  };

  const handleOpenDateDialog = (item) => {
    openDialog(DIALOG_TYPES.DATE, { itemId: item.id, date: item.expirationDate || '', isValidDate });
  };

  // --- EXPORTAÇÃO ---
  const handleExport = () => {
    if (scannedItems.length === 0) {
      Alert.alert("Atenção", "Não há itens na lista para exportar.");
      return;
    }

    Alert.alert(
      "Exportar Lista",
      "Escolha o formato para exportar a lista:",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "PDF", onPress: () => handleExportPdf() },
        { text: "JSON", onPress: () => handleExportJson() }
      ]
    );
  };

  const handleExportJson = async () => {
    const fileName = `${currentFileName || 'Nova-Lista'}.json`;
    await exportDataAsJson(scannedItems, fileName);
  };
  const handleExportPdf = async () => {
    // Função para escapar caracteres HTML e prevenir XSS
    const escapeHtml = (unsafe) => {
      if (typeof unsafe !== 'string') return unsafe;
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };
    // Função para converter DD/MM/YYYY para um objeto Date
    const parseDate = (dateString) => {
      if (!dateString) return null;
      const [day, month, year] = dateString.split('/').map(Number);
      // O mês no construtor do Date é 0-indexed (0-11)
      return new Date(year, month - 1, day);
    };

    // Cria uma cópia e ordena os itens
    const sortedItems = [...scannedItems].sort((a, b) => {
      const dateA = parseDate(a.expirationDate);
      const dateB = parseDate(b.expirationDate);

      if (!dateA && !dateB) return 0; // Ambos sem data, mantém a ordem
      if (!dateA) return 1;  // 'a' não tem data, vai para o fim
      if (!dateB) return -1; // 'b' não tem data, vai para o fim

      return dateA - dateB; // Ordena da data mais próxima para a mais distante
    });
    const itemsHtml = sortedItems.map(item => `
      <tr>
        <td>${escapeHtml(item.code)}</td>
        <td>${escapeHtml(item.description || '')}</td>
        <td style="text-align: center;">${escapeHtml(String(item.quantity || 1))}</td>
        <td style="text-align: center;">${escapeHtml(item.expirationDate || '')}</td>
        <td></td>
      </tr>
    `).join('');

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #dddddd; text-align: left; padding: 8px; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Lista: ${escapeHtml(currentFileName || 'Nova Lista')}</h1>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th style="text-align: center;">Qtd.</th>
                <th style="text-align: center;">Validade</th>
                <th>Curva</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await Sharing.shareAsync(uri, { dialogTitle: 'Exportar como PDF' });
  };

  // --- AJUDA ---
  const showHelp = () => {
    Alert.alert(
      "Como Usar o App",
      "1. TÍTULO: Toque e segure no título da lista atual para alterá-lo.\n\n" +
      "2. SALVAR (ícone de disquete): Salva a lista atual. Se a lista já foi salva, atualiza as alterações.\n\n" +
      "3. PASTA: Abre a biblioteca para ver, carregar ou apagar listas salvas.\n\n" +
      "4. NOVO (ícone de arquivo com '+'): Limpa a tela para começar uma nova lista.\n\n" +
      "5. EXPORTAR (ícone de compartilhamento): Exporta a lista ATUAL em formato .pdf ou .JSON.\n\n" +
      "6. IMPORTAR (ícone de importação na biblioteca): Importa uma lista APENAS em formato .JSON.\n\n",
      [{ text: "Entendi!" }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          onClearList={clearCurrentList}
          onExport={handleExport}
          onLongPressTitle={handleLongPressTitle}
          title={currentFileName || 'Nova Lista'}
          onShowHelp={showHelp}
        />

        {/* --- ÁREA DA LISTA --- */}
        <View style={styles.listArea}>
          {scannedItems.length > 0 ? (
            <FlatList
              data={scannedItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <BarcodeListItem
                item={item}
                onUpdateDescription={updateItemDescription}
                onOpenQuantityDialog={handleOpenQuantityDialog}
                onOpenDateDialog={handleOpenDateDialog}
                onDeleteItem={handleDeleteItem}
              />
              }
            />
          ) : (
            <EmptyListPlaceholder />
          )}
        </View>

        {/* --- BOTÕES INFERIORES --- */}
        <BottomNav onSave={handleSave} />

        {/* --- DIÁLOGO DE SALVAR --- */}
        <SaveListDialog
          visible={dialogState.type === DIALOG_TYPES.SAVE}
          onCancel={closeDialog}
          onConfirm={handleConfirm}
          fileName={dialogState.data.fileName}
          setFileName={(fileName) => updateDialogData({ fileName })}
        />

        <RenameListDialog
          visible={dialogState.type === DIALOG_TYPES.RENAME}
          onCancel={closeDialog}
          onConfirm={handleConfirm}
          fileName={dialogState.data.fileName}
          setFileName={(fileName) => updateDialogData({ fileName })}
        />

        <QuantityDialog
          visible={dialogState.type === DIALOG_TYPES.QUANTITY}
          onCancel={closeDialog}
          onConfirm={handleConfirm}
          quantity={dialogState.data.quantity}
          setQuantity={(quantity) => updateDialogData({ quantity })}
        />

        <ExpirationDateDialog
          visible={dialogState.type === DIALOG_TYPES.DATE}
          onCancel={closeDialog}
          onConfirm={handleConfirm}
          date={dialogState.data.date}
          onChangeDate={handleDateInputChange}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

// --- ESTILOS ---
const greenColor = '#598E8A';
const orangeColor = '#DA8625';

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: 
    greenColor 
  },
  container: { 
    flex: 1
  },
  listArea: {
    flex: 1,
    backgroundColor: '#fff',
    marginVertical: 6,
    marginBottom: 15,
  },
  placeholderContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  placeholderText: { 
    fontSize: 16, 
    color: '#aaa', 
    marginTop: 10 
  },
});