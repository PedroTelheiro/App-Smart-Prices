import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LibraryListItem = ({ fileName, onLoad, onDelete }) => {
  return (
    <View style={styles.fileItemContainer}>
      <View style={styles.fileInfoContainer}>
        <TouchableOpacity style={styles.loadFileButton} onPress={() => onLoad(fileName)}>
          <Feather name="file-text" size={24} color="white" />
          <Text style={styles.fileName}>{fileName}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(fileName)}>
          <Feather name="trash-2" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const orangeColor = '#DA8625';

const styles = StyleSheet.create({
  fileItemContainer: {
    backgroundColor: orangeColor,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  fileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loadFileButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: "center"
  },
  fileName: { 
    fontSize: 18, 
    marginLeft: 15, 
    color: 'white', 
    fontWeight: 'bold', 
    flex: 1 
  },
  deleteButton: {
    padding: 20,
    backgroundColor: '#c0392b',
    flex:0,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default LibraryListItem;