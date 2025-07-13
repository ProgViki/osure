import Drawer from '@/components/Drawer';
import ResultCard from '@/components/Resultcard';
import ScannerFrame from '@/components/ScannerFrame';
import { Entypo, Feather, FontAwesome6 } from '@expo/vector-icons';
import * as CameraAPI from 'expo-camera';
import { CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.7;

export default function QRScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<{
    data: string;
    type: string;
    timestamp: number;
  } | null>(null);

  const [cameraType, setCameraType] = useState<'back' | 'front'>('back'); // Changed here

  const drawerAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const [drawerVisible, setDrawerVisible] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const [permission, requestPermission] = CameraAPI.useCameraPermissions();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    } else {
      setHasPermission(permission.granted);
    }
  }, [permission]);

  const handleBarcodeScanned = ({ data, type }: { data: string; type: string }) => {
    if (scanned) return;
    setScanned(true);
    setScannedData({ data, type, timestamp: Date.now() });
  };

  const flipCamera = () => {
    setCameraType((prev) => (prev === 'back' ? 'front' : 'back')); // Changed here
  };

  const toggleDrawer = () => {
    if (drawerVisible) {
      Animated.timing(drawerAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDrawerVisible(false));
    } else {
      setDrawerVisible(true);
      Animated.timing(drawerAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      try {
        const scannedResults = await CameraAPI.scanFromURLAsync(result.assets[0].uri, [
          'qr',
          'ean13',
          'ean8',
          'code128',
          'upc_a',
          'upc_e',
        ]);

        if (scannedResults.length > 0) {
          const { data, type } = scannedResults[0];
          setScannedData({
            data,
            type: typeof type === 'string' ? type : 'unknown',
            timestamp: Date.now(),
          });
          setScanned(true);
        } else {
          Alert.alert('No QR code found', 'We could not detect any barcode in the selected image.');
        }
      } catch (error) {
        console.error('Error scanning image:', error);
        Alert.alert('Error', 'An error occurred while scanning the image.');
      }
    }
  };

  const drawerItems = [
    { icon: 'qrcode', label: 'Scan' },
    { icon: 'image', label: 'Scan Image' },
    { icon: 'edit', label: 'Create QR' },
    { icon: 'star', label: 'Favorites' },
    { icon: 'history', label: 'History' },
  ];

  const handleDrawerAction = (label: string) => {
    toggleDrawer();
    switch (label) {
      case 'Scan':
        break;
      case 'Scan Image':
        pickImageFromGallery();
        break;
      case 'Create QR':
        router.push('/create-qr');
        break;
      case 'Favorites':
        router.push('/favorites');
        break;
      case 'History':
        router.push('/history');
        break;
    }
  };

  if (hasPermission === null) return <Text>Requesting camera permission...</Text>;
  if (hasPermission === false) return <Text>No camera access</Text>;

  return (
    <View style={{ flex: 1 }}>
      {/* CameraView underneath */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={cameraType}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'upc_a', 'upc_e'],
        }}
      />

      {/* UI Overlay */}
      {!scannedData && (
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={toggleDrawer}>
              <Feather name="menu" size={28} color="white" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 15 }}>
              <TouchableOpacity onPress={pickImageFromGallery}>
                <Entypo name="image" size={26} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={flipCamera}>
                <FontAwesome6 name="camera-rotate" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <ScannerFrame />
        </View>
      )}

      {/* Result Card */}
      {scannedData && (
        <ResultCard
          data={scannedData.data}
          type={typeof scannedData.type === 'string' ? scannedData.type : 'unknown'}
          timestamp={scannedData.timestamp}
          onReset={() => {
            setScannedData(null);
            setScanned(false);
          }}
        />
      )}

      {/* Drawer */}
      <Drawer
        visible={drawerVisible}
        drawerAnim={drawerAnim}
        items={drawerItems}
        onSelect={handleDrawerAction}
        onClose={toggleDrawer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
});