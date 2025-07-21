import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Camera, CameraType, CameraView, FlashMode } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

export default function CameraScreen() {
//   const [flash, setFlash] = useState<FlashMode>(FlashMode.off);
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [cameraReady, setCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation();

   useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

//    useEffect(() => {
//     if (!permission) {
//       requestPermission();
//     } else {
//       setHasPermission(permission.granted);
//     }
//   }, [permission]);

  const takePicture = async () => {
    if (cameraRef.current && cameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log('Photo taken:', photo.uri);
        // Handle the photo
      } catch (e) {
        console.log('Error taking photo:', e);
      }
    }
  };

  const recordVideo = async () => {
  if (cameraRef.current && cameraReady) {
    try {
      if (isRecording) {
        await cameraRef.current.stopRecording();
        setIsRecording(false);
        return;
      }
      
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync();
      
      if (!video) {
        console.log('Recording was stopped without saving');
        return;
      }

      console.log('Video recorded:', video.uri);
      // Handle the video (e.g., upload or display preview)
      
    } catch (e) {
      console.log('Error recording video:', e);
      setIsRecording(false);
    }
  }
};

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Selected media:', result.assets[0].uri);
    }
  };

  const pickVideo = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'videos',
    // ... other options
  });
  // Handle video
};

 const flipCamera = () => {
    setCameraType((prev) => (prev === 'back' ? 'front' : 'back'));
    // setZoom(0);
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        // flashMode={flash}
        onCameraReady={() => setCameraReady(true)}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            // onPress={() => setFlash(
            //   flash === FlashMode.off ? FlashMode.on : FlashMode.off
            // )}
          >
            <MaterialIcons 
              name={
                // flash === FlashMode.off ? "flash-off" :
                 "flash-off"} 
              size={30} 
              color="white" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton} onPress={pickImage}>
            <MaterialCommunityIcons name="image" size={30} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.captureButton}
            onPress={takePicture}
            onLongPress={recordVideo}
            delayLongPress={300}
          >
            <View style={[
              styles.captureButtonInner,
              isRecording && styles.recordingButton
            ]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.footerButton}
            onPress={flipCamera}
          >
            <MaterialCommunityIcons name="camera-flip" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

// Keep the same styles as before
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 20, // Add bottom padding
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)', // Optional: semi-transparent background
  },
  footerButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  recordingButton: {
    backgroundColor: 'red',
    width: 40,
    height: 40,
    borderRadius: 4,
  },
});