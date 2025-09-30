import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router'; // A correção não requer mudança aqui, mas o useCallback vem do 'react'
import { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PromptDialog } from '../components/dialogs/PromptDialog';
import { useBarcode } from '../Context/BarcodeContext';
import LibraryListItem from '../Context/LibraryListItem'; // Importar o novo componente

const LibraryScreen = () => {
  const [savedFiles, setSavedFiles] = useState([]);
  const { listSavedFiles, loadListFromFile, deleteFile, importList } = useBarcode();
  const router = useRouter();
  const navigation = useNavigation();

  // Estado para controlar o diálogo de nomeação
  const [promptVisible, setPromptVisible] = useState(false);
  const [importData, setImportData] = useState({ jsonString: '', originalName: '' });


  const fetchFiles = useCallback(async () => {
    const files = await listSavedFiles();
    setSavedFiles(files);
  }, [listSavedFiles]);

  useFocusEffect(
    useCallback(() => {
      fetchFiles();
    }, [fetchFiles])
  );

  const handleConfirmImport = useCallback(async (newFileName) => {
    setPromptVisible(false);
    const { jsonString } = importData;
    try {
      const trimmedName = newFileName?.trim();
      if (!trimmedName) {
        Alert.alert("Nome Inválido", "O nome do arquivo não pode ser vazio.");
        return;
      }

      const success = await importList(trimmedName, jsonString);

      if (success) {
        Alert.alert("Sucesso", `A lista "${trimmedName}" foi importada.`);
        fetchFiles();
      } else {
        Alert.alert("Erro", "Não foi possível salvar a lista importada.");
      }
    } catch (e) {
      console.error("Erro ao salvar a lista importada:", e);
      Alert.alert("Erro", "Ocorreu um erro inesperado ao salvar a lista importada.");
    }
  }, [importData, importList, fetchFiles]);

  const handleImportFile = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Permite todos os tipos de arquivo para maior compatibilidade
        copyToCacheDirectory: true, // Garante que o arquivo seja acessível
      });

      if (result.canceled) {
        return;
      }

      // Ler o conteúdo imediatamente para validar
      const fileUri = result.assets[0].uri;
      const jsonString = await FileSystem.readAsStringAsync(fileUri);
      const items = JSON.parse(jsonString);

      // Validação de estrutura (schema validation)
      if (!Array.isArray(items) || items.some(item => typeof item.code !== 'string')) {
        Alert.alert(
          "Estrutura Inválida",
          "O arquivo JSON não tem a estrutura esperada (um array de itens com uma propriedade 'code')."
        );
        return;
      }

      // Abrir o diálogo multiplataforma para obter o nome
      setImportData({ jsonString, originalName: result.assets[0].name });
      setPromptVisible(true);
    } catch (error) {
      console.error("Erro durante a importação:", error);
      Alert.alert(
        "Erro de Importação",
        "Não foi possível ler ou processar o arquivo. Verifique se ele é um JSON válido e possui a estrutura correta."
      );
    }
  }, []);

  useLayoutEffect(() =>
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleImportFile} style={{ paddingRight: 15 }}>
          <Feather name="download" size={24} color="white" />
        </TouchableOpacity>
      ),
    }), [navigation, handleImportFile]
  );

  const handleLoadFile = async (fileName) => {
    const success = await loadListFromFile(fileName);
    if (success) {
      router.back();
    } else {
      Alert.alert("Erro", "Não foi possível carregar este arquivo.");
    }
  };

  const handleDeleteFile = (fileName) => {
    Alert.alert(
      "Apagar Lista",
      `Tem certeza de que deseja apagar a lista "${fileName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          onPress: async () => {
            const success = await deleteFile(fileName);
            if (success) {
              fetchFiles(); 
            } else {
              Alert.alert("Erro", "Não foi possível apagar este arquivo.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <PromptDialog
        visible={promptVisible}
        title="Nomear Lista Importada"
        message={`Original: ${importData.originalName}`}
        initialValue={importData.originalName.replace('.json', '')}
        onCancel={() => setPromptVisible(false)}
        onConfirm={handleConfirmImport}
      />
      <View style={styles.container}>
        <FlatList
          data={savedFiles}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <LibraryListItem
              fileName={item}
              onLoad={handleLoadFile}
              onDelete={handleDeleteFile}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma lista salva ainda.</Text>
            </View>
          }
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default LibraryScreen;

const greenColor = '#598E8A';
const orangeColor = '#DA8625';

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: greenColor 
  },
  container: { 
    flex: 1 
  },
  emptyContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingTop: 50 
  },
  emptyText: { 
    fontSize: 16, 
    color: 'white' 
  },
});