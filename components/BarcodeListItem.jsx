import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BarcodeDisplay from './BarcodeDisplay';

const BarcodeListItem = ({ item, onUpdateDescription, onOpenQuantityDialog, onOpenDateDialog, onDeleteItem }) => {
  return (
    <View style={styles.itemContainer}>
      <BarcodeDisplay item={item} />
      <View style={styles.rowContainer}>
        <TouchableOpacity style={styles.dateButton} onPress={() => onOpenDateDialog(item)}>
          <Feather name="calendar" size={18} color="#555" />
          <Text style={styles.expirationDateText}>
            {item.expirationDate ? `Validade: ${item.expirationDate}` : 'Adicionar Validade'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDeleteItem(item)}>
          <Feather name="trash-2" size={20} color="#c0392b" />
        </TouchableOpacity>
      </View>
      <View style={styles.detailsContainer}>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Adicionar descrição..."
          placeholderTextColor="#999"
          value={item.description}
          onChangeText={(text) => onUpdateDescription(item.id, text)}
        />
        <TouchableOpacity style={styles.quantityBox} onPress={() => onOpenQuantityDialog(item)}>
          <MaterialCommunityIcons name="counter" size={24} color={'#DA8625'} />
          <Text style={styles.quantityText}>
            {item.quantity || 1}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  deleteButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },
  expirationDateText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    marginHorizontal: 10,
    color: '#DA8625',
    fontWeight: 'bold',
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 10,
  },
  descriptionInput: { 
    flex: 1, 
    height: 40, 
    borderColor: '#e0e0e0', 
    borderWidth: 1, 
    borderRadius: 5, 
    padding: 10, 
    fontSize: 16, 
  },
  quantityBox: { 
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 10,
      padding: 8, 
    },
  quantityText: {
     fontSize: 16, 
      fontWeight: 'bold',
      marginLeft: 5, 
    },
});

export default BarcodeListItem;