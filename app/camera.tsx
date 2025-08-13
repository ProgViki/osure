import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CameraScreen() {
//   const [flash, setFlash] = useState<FlashMode>(FlashMode.off);
 const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [cameraReady, setCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
    const cameraRef = useRef<CameraView>(null);
    const timerRef = useRef<number | null>(null);
  const navigation = useNavigation();

   useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
  return () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    //   timerRef.current = null;
    }
  };
}, []);

  const startTimer = () => {
  setRecordingTime(0);
  // Clear any existing timer first
  if (timerRef.current) {
    clearInterval(timerRef.current);
  }
  timerRef.current = setInterval(() => {
    setRecordingTime(prev => prev + 1);
  }, 1000);
};

   const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

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
   const toggleRecording = async () => {
    if (cameraRef.current && cameraReady) {
      try {
        if (isRecording) {
          await cameraRef.current.stopRecording();
          setIsRecording(false);
          stopTimer();
          return;
        }
        
        setIsRecording(true);
        startTimer();
        const video = await cameraRef.current.recordAsync();
        
        if (!video) {
          console.log('Recording was stopped without saving');
          return;
        }

        console.log('Video recorded:', video.uri);
      } catch (e) {
        console.log('Error recording video:', e);
        setIsRecording(false);
        stopTimer();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        // flashMode={flash}
        onCameraReady={() => setCameraReady(true)}
        // video={mode === 'video'}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          {mode === 'video' && isRecording && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
            </View>
          )}
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
             onPress={mode === 'photo' ? takePicture : toggleRecording}
            // onLongPress={recordVideo}
            // delayLongPress={300}
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

      <View style={styles.modeSwitcherContainer}>
            <TouchableOpacity 
              style={[styles.modeButton, mode === 'photo' && styles.activeMode]}
              onPress={() => setMode('photo')}
            >
              <Text style={styles.modeText}> Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modeButton, mode === 'video' && styles.activeMode]}
              onPress={() => setMode('video')}
            >
              <Text style={styles.modeText}> Video</Text>
            </TouchableOpacity>
          </View>
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
   timerContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  timerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 20, // Add bottom padding
    position: 'absolute',
    bottom: 0,
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
  modeSwitcherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    marginBottom: 32,
    padding: 18,
  },
  modeButton: {
    paddingHorizontal: 25,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeMode: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  modeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
});