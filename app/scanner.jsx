import { Camera, CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBarcode } from '../Context/BarcodeContext';
import { isValidEAN } from '../utils/eanValidator';

const { width } = Dimensions.get('window');
const cameraSize = width * 0.8;

const ScannerScreen = () => {
    const { addBarcodeItem } = useBarcode(); 
    const router = useRouter();
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    
    useEffect(() => {
        const getCameraPermission = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };
        getCameraPermission();
    }, []);
    const handleBarCodeScanned = ({ data }) => {
        setScanned(true);

        if (isValidEAN(data)) {
            const newItem = {
                code: data,
                description: '',
                quantity: 1,
                expirationDate: '',
            };
            addBarcodeItem(newItem);
            router.back();
        } else {
            Alert.alert( "Código Inválido", `O código "${data}" não parece ser um EAN-13 válido. Por favor, tente novamente.`, [{ text: "OK", onPress: () => setScanned(false) }] );
        }
    };

    if (hasPermission === null) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>Solicitando permissão para a câmera...</Text>
            </View>
        );
    }
    if (hasPermission === false) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>Acesso à câmera negado.</Text>
            </View>
        );
    }
    return (
        <SafeAreaView style={styles.safeArea}>
            <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8'] }}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.container}><View style={styles.scannerBox} /></View>
        </SafeAreaView>
    );
};

export default ScannerScreen;

const greenColor = '#598E8A';
const orangeColor = '#DA8625';

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: 'black' 
},
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'transparent' 
},
  scannerBox: { 
    width: cameraSize, 
    height: cameraSize / 2, 
    borderWidth: 2, 
    borderColor: orangeColor, 
    borderRadius: 10 },
  permissionContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: greenColor 
},
  permissionText: { 
    color: '#fff', 
    fontSize: 18, 
    textAlign: 'center', 
    marginBottom: 10 
},
});