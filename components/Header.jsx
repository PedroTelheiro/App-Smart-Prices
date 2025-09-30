import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Header = ({ onClearList, onExport, onLongPressTitle, title, onShowHelp }) => {
  return (
    <View style={styles.header}>
      <View style={styles.sideContainer}>
        <TouchableOpacity style={styles.headerButton} onPress={onClearList}>
          <Feather name='file-plus' size={24} color={"#fff"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={onExport}>
          <Feather name='share' size={24} color={"#fff"} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onLongPress={onLongPressTitle} style={styles.headerTitleContainer}>
        <View>
          <Text style={styles.headerText} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={[styles.sideContainer, styles.rightSideContainer]}>
        <TouchableOpacity style={styles.headerButton} onPress={onShowHelp}>
          <Feather name='help-circle' size={24} color={"#fff"} />
        </TouchableOpacity>
        <View style={styles.headerButton} />
      </View>
    </View>
  );
};

const orangeColor = '#DA8625';

const styles = StyleSheet.create({
  header: {
    backgroundColor: orangeColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    paddingHorizontal: 5,
  },
  sideContainer: { 
    flexDirection: 'row' 
  },
  rightSideContainer: { 
    justifyContent: 'flex-end' 
  },
  headerTitleContainer: { 
    flex: 1, 
    alignItems: 'center', 
    marginHorizontal: 10 
  },
  headerText: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  headerButton: { 
    padding: 10 
  },
});

export default Header;