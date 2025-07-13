import {
  Feather,
  FontAwesome,
  FontAwesome6,
} from '@expo/vector-icons';

import {
  CameraType,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Linking,
  PanResponder,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.7;

export default function QRScannerScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const drawerAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [scannedData, setScannedData] = useState<{ data: string; timestamp: number } | null>(null);
  const [zoom, setZoom] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [cameraSupported, setCameraSupported] = useState(true);

  const sliderWidth = 200;
  const panX = useRef(zoom * sliderWidth);

  const updateZoomFromPan = (dx: number) => {
    const clamped = Math.min(Math.max(dx, 0), sliderWidth);
    const newZoom = parseFloat((clamped / sliderWidth).toFixed(2));
    setZoom(newZoom);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      updateZoomFromPan(panX.current + gesture.dx);
    },
    onPanResponderRelease: (_, gesture) => {
      panX.current = Math.min(Math.max(panX.current + gesture.dx, 0), sliderWidth);
    },
  });

  const router = useRouter();

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleBarcodeScanned = ({ data, type }: { data: string; type: string }) => {
    try {
      if (scanned) return;
      
      if (isValidUrl(data)) {
        setScanned(true);
        setScannedData({ data, timestamp: Date.now() });
      } else {
        Alert.alert('Invalid QR Code', 'This QR code is not a valid URL.', [
          { text: 'OK', onPress: () => setScanned(false) },
        ]);
      }
    } catch (e) {
      console.error("Barcode scan error:", e);
      Alert.alert('Error', 'Something went wrong while processing the QR code.');
    }
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

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need camera access to scan QR codes</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.text}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDrawerAction = (label: string) => {
    toggleDrawer();
    switch (label) {
      case 'Switch Camera':
        setFacing(prev => (prev === 'back' ? 'front' : 'back'));
        break;
      case 'Create QR':
        router.push('/create-qr');
        break;
      case 'History':
        router.push('/history');
        break;
    }
  };

  const drawerItems = [
    { icon: 'camera', label: 'Switch Camera' },
    { icon: 'edit', label: 'Create QR' },
    { icon: 'history', label: 'History' },
  ];

  return (
    <View style={styles.container}>
      {cameraSupported ? (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          zoom={zoomLevel / 100}
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />
      ) : (
        <View style={styles.center}>
          <Text style={styles.text}>Camera Scanning not supported on this device.</Text>
        </View>
      )}

      <View style={styles.zoomControls}>
        <View style={styles.zoomButton}>
          <TouchableOpacity onPress={() => setZoom((prev) => Math.max(0, prev - 0.1))}>
            <FontAwesome name="minus-circle" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.zoomLabel}>Out</Text>
        </View>

        <View style={styles.sliderContainer}>
          <View
            style={[styles.sliderTrack, { width: sliderWidth }]}
            {...panResponder.panHandlers}
          >
            <View
              style={[styles.sliderFill, { width: zoom * sliderWidth }]}
            />
          </View>
          <Text style={styles.zoomValue}>Zoom: {zoom.toFixed(1)}</Text>
        </View>

        <View style={styles.zoomButton}>
          <TouchableOpacity onPress={() => setZoom((prev) => Math.min(1, prev + 0.1))}>
            <FontAwesome name="plus-circle" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.zoomLabel}>In</Text>
        </View>
      </View>

      {scannedData && (
        <TouchableWithoutFeedback onPress={() => {
          setScannedData(null);
          setScanned(false);
        }}>
          <View style={styles.resultContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.resultCard}>
                <Text style={styles.resultText}>Scanned: {scannedData.data}</Text>
                <Text style={styles.resultTimestamp}>
                  {new Date(scannedData.timestamp).toLocaleString()}
                </Text>

                <View style={styles.iconRow}>
                  {isValidUrl(scannedData.data) && (
                    <TouchableOpacity onPress={() => Linking.openURL(scannedData.data)}>
                      <Feather name="external-link" size={22} color="#007AFF" />
                      <Text style={{ fontSize: 12, textAlign: 'center' }}>Open</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => Share.share({ message: scannedData.data })}>
                    <Feather name="share-2" size={22} color="#007AFF" />
                    <Text style={{ fontSize: 12, textAlign: 'center' }}>Share</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => Clipboard.setStringAsync(scannedData.data)}>
                    <Feather name="copy" size={22} color="#007AFF" />
                    <Text style={{ fontSize: 12, textAlign: 'center' }}>Copy</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.qrCodeContainer}>
                  <QRCode value={scannedData.data} size={200} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}

      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleDrawer}>
          <Feather name="menu" size={28} color="white" />
        </TouchableOpacity>

        <View style={styles.topIcons}>
          <TouchableOpacity
            onPress={() => setFacing(prev => (prev === 'back' ? 'front' : 'back'))}
            style={styles.iconButton}
          >
            <FontAwesome6 name="camera-rotate" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {drawerVisible && (
        <>
          <TouchableOpacity activeOpacity={1} onPress={toggleDrawer} style={styles.drawerOverlay} />
          <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerAnim }] }]}>
            {drawerItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.drawerItem, index === 0 && styles.drawerItemPrimary]}
                onPress={() => handleDrawerAction(item.label)}
              >
                <FontAwesome name={(item.icon) as any} size={24} color="white" />
                <Text style={styles.drawerLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </>
      )}

      <View style={styles.frame}>
        <View style={styles.cornerTopLeft} />
        <View style={styles.cornerTopRight} />
        <View style={styles.cornerBottomLeft} />
        <View style={styles.cornerBottomRight} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  message: { textAlign: 'center', padding: 20, fontSize: 16 },
  permissionButton: {
    alignSelf: 'center',
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  text: { color: 'white', fontSize: 16 },
  topBar: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 5,
  },
  topIcons: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  iconButton: {
    paddingHorizontal: 5,
  },
  frame: {
    position: 'absolute',
    top: '30%',
    left: '15%',
    width: '70%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: 'white',
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: 'white',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: 'white',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: 'white',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#111',
    paddingTop: 25,
    paddingHorizontal: 0,
    zIndex: 10,
    elevation: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#444',
  },
  drawerItemPrimary: {
    backgroundColor: '#0f1c2e',
    borderRadius: 2,
  },
  drawerLabel: {
    marginLeft: 20,
    fontSize: 16,
    color: '#fff',
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 5,
  },
  resultContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 20,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '90%',
    elevation: 4,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  resultTimestamp: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  qrCodeContainer: {
    marginTop: 10,
  },
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 50,
    backgroundColor: '#333',
  },
  zoomButton: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  zoomLabel: {
    color: '#fff',
    marginTop: 5,
    fontSize: 12,
  },
  sliderContainer: {
    alignItems: 'center',
  },
  sliderTrack: {
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  zoomValue: {
    color: '#fff',
    fontSize: 12,
  },
});