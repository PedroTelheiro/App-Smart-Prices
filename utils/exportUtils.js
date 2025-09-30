import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

/**
 * Exporta um array de dados para um arquivo JSON e abre o diálogo de compartilhamento.
 * @param {Array<Object>} data O array de objetos a ser exportado.
 * @param {string} fileName O nome do arquivo a ser criado (ex: 'produtos.json').
 */
export const exportDataAsJson = async (data, fileName) => {
  try {
    // Converte o array de dados para uma string JSON formatada (com 2 espaços de indentação)
    const jsonString = JSON.stringify(data, null, 2);

    // Define o caminho completo para o novo arquivo no diretório de cache do aplicativo
    const fileUri = FileSystem.cacheDirectory + fileName;

   
    await FileSystem.writeAsStringAsync(fileUri, jsonString, {
      encoding: 'utf8',
    });

    // Verifica se o compartilhamento está disponível no dispositivo
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("Erro", "O compartilhamento não está disponível neste dispositivo.");
      return;
    }

    // Abre o menu de compartilhamento nativo com o arquivo gerado
    await Sharing.shareAsync(fileUri, { dialogTitle: `Compartilhar ${fileName}` });

  } catch (error) {
    console.error("Falha ao exportar JSON:", error);
    Alert.alert("Erro de Exportação", "Ocorreu um erro ao tentar gerar o arquivo JSON.");
  }
};