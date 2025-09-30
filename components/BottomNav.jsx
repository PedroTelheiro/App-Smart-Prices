import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const BottomNav = ({ onSave }) => {
  return (
    <View style={styles.bottomNav}>
      <Link href="/library" asChild>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name='folder' size={30} color={"#fff"} />
        </TouchableOpacity>
      </Link>
      <Link href="/scanner" asChild>
        <TouchableOpacity style={styles.cameraButton}>
          <Feather name='camera' size={40} color={"#fff"} />
        </TouchableOpacity>
      </Link>
      <TouchableOpacity style={styles.iconButton} onPress={onSave}>
        <Feather name='save' size={30} color={"#fff"} />
      </TouchableOpacity>
    </View>
  );
};

const orangeColor = '#DA8625';

const baseIconButton = {
  backgroundColor: orangeColor,
  width: 60,
  height: 60,
  borderRadius: 30,
  justifyContent: 'center',
  alignItems: 'center',
};

const styles = StyleSheet.create({
  bottomNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    transform: [{ translateY: 10 }], 
  },
  iconButton: baseIconButton,
  cameraButton: { 
    ...baseIconButton, 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    transform: [{ translateY: -20 }], 
  },
});

export default BottomNav;