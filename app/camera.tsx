import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, Linking } from 'react-native';

export default function CameraScreen() {
  const [flash, setFlash] = useState<'on' | 'off' | 'auto'>('off');
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [cameraType, setCameraType] = useState<'front' | 'back'>('back');
  const [cameraReady, setCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState<boolean | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const timerRef = useRef<number | null>(null);
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    (async () => {
      // Request camera permissions
      if (permission && !permission.granted) {
        await requestPermission();
      }

      // Check media library permissions
      await checkMediaLibraryPermission();
    })();
  }, [permission]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const checkMediaLibraryPermission = async () => {
    try {
      const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
      console.log('Media Library Permission Status:', status, 'Can ask again:', canAskAgain);
      setMediaLibraryPermission(status === 'granted');
      return status === 'granted';
    } catch (error) {
      console.log('Error checking media library permission:', error);
      return false;
    }
  };

  const requestMediaLibraryPermission = async () => {
    try {
      console.log('Requesting media library permission...');
      const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();
      console.log('Permission request result:', status, 'Can ask again:', canAskAgain);
      
      setMediaLibraryPermission(status === 'granted');
      
      if (status !== 'granted') {
        if (!canAskAgain) {
          // Permission permanently denied, show settings alert
          showPermissionSettingsAlert();
          return false;
        }
        return false;
      }
      return true;
    } catch (error) {
      console.log('Error requesting media library permission:', error);
      return false;
    }
  };

  const showPermissionSettingsAlert = () => {
    Alert.alert(
      'Permission Required',
      'Media library permission is required to save photos to your gallery. Please enable it in Settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Settings', 
          onPress: () => Linking.openSettings() 
        }
      ]
    );
  };

  const startTimer = () => {
    setRecordingTime(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000) as unknown as number;
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const saveToMediaLibrary = async (uri: string, type: 'photo' | 'video') => {
    try {
      setIsSaving(true);
      
      console.log('Attempting to save:', uri);
      
      // Check current permission status
      const hasPermission = await checkMediaLibraryPermission();
      
      if (!hasPermission) {
        console.log('No permission, requesting...');
        const permissionGranted = await requestMediaLibraryPermission();
        if (!permissionGranted) {
          Alert.alert(
            'Cannot Save to Gallery',
            'Please grant media library permissions to save photos to your gallery.',
            [
              { text: 'OK' },
              { 
                text: 'Open Settings', 
                onPress: () => Linking.openSettings() 
              }
            ]
          );
          return false;
        }
      }

      console.log('Permission granted, creating asset...');
      
      // Create asset
      const asset = await MediaLibrary.createAssetAsync(uri);
      console.log('Asset created:', asset);
      
      // Try to save to album (optional)
      try {
        let album = await MediaLibrary.getAlbumAsync('Camera');
        if (!album) {
          album = await MediaLibrary.createAlbumAsync('Camera', asset, false);
          console.log('Album created');
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
          console.log('Added to existing album');
        }
      } catch (albumError) {
        console.log('Album operation failed, but asset was created:', albumError);
        // Continue even if album operations fail
      }
      
      Alert.alert('Success!', `${type === 'photo' ? 'Photo' : 'Video'} saved to gallery.`);
      return true;
      
    } catch (error) {
      console.log('Error saving to media library:', error);
      Alert.alert(
        'Save Failed',
        `Could not save ${type === 'photo' ? 'photo' : 'video'} to gallery. The file is saved temporarily at: ${uri}`,
        [{ text: 'OK' }]
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current && cameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8, // Reduced quality for better performance
          base64: false,
          skipProcessing: false, // Changed back to false for better compatibility
          exif: false
        });
        
        console.log('Photo taken:', photo?.uri);
        
        if (photo?.uri) {
          // Set the captured photo and show preview
          setCapturedPhoto(photo.uri);
          setShowPreview(true);
          
          // Save to media library in background (don't wait for it)
          saveToMediaLibrary(photo.uri, 'photo');
        }
      } catch (e) {
        console.log('Error taking photo:', e);
        Alert.alert('Error', 'Failed to take photo. Please try again.');
      }
    }
  };

  const toggleRecording = async () => {
    if (cameraRef.current && cameraReady) {
      try {
        if (isRecording) {
          console.log('Stopping recording...');
          cameraRef.current.stopRecording();
          setIsRecording(false);
          stopTimer();
          return;
        }
        
        console.log('Starting recording...');
        setIsRecording(true);
        startTimer();
        
        const video = await cameraRef.current.recordAsync();
        
        if (video && video.uri) {
          console.log('Video recorded:', video.uri);
          // Save to media library
          saveToMediaLibrary(video.uri, 'video');
        } else {
          console.log('No video data returned');
        }
        
      } catch (e) {
        console.log('Error recording video:', e);
        Alert.alert('Error', 'Failed to record video. Please try again.');
        setIsRecording(false);
        stopTimer();
      }
    } else {
      console.log('Camera not ready or ref not available');
    }
  };

  const handleRetake = () => {
    setShowPreview(false);
    setCapturedPhoto(null);
  };

  const handleUsePhoto = async () => {
    if (capturedPhoto) {
      setShowPreview(false);
      Alert.alert('Success', 'Photo is ready to use!');
      // You can add additional logic here to use the photo
    }
  };

  const handleSaveToGallery = async () => {
    if (capturedPhoto) {
      await saveToMediaLibrary(capturedPhoto, 'photo');
    }
  };

  const pickImage = async () => {
    try {
      // Request gallery permissions first
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        setCapturedPhoto(result.assets[0].uri);
        setShowPreview(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery.');
    }
  };

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        console.log('Selected video:', result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video from gallery.');
    }
  };

  const flipCamera = () => {
    setCameraType((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => {
      switch (current) {
        case 'off':
          return 'on';
        case 'on':
          return 'auto';
        case 'auto':
          return 'off';
        default:
          return 'off';
      }
    });
  };

  const getFlashIcon = () => {
    switch (flash) {
      case 'on':
        return "flash-on";
      case 'off':
        return "flash-off";
      case 'auto':
        return "flash-auto";
      default:
        return "flash-off";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!permission) {
    return <View style={styles.container}><Text style={styles.message}>Requesting camera permission...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          This app needs camera access to take photos and videos.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!showPreview ? (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={cameraType}
          flash={flash}
          onCameraReady={() => setCameraReady(true)}
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
                <View style={styles.recordingDot} />
                <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={toggleFlash}
            >
              <MaterialIcons 
                name={getFlashIcon()} 
                size={30} 
                color="white" 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerButton} onPress={mode === 'photo' ? pickImage : pickVideo}>
              <MaterialCommunityIcons name={mode === 'photo' ? "image" : "video"} size={30} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={mode === 'photo' ? takePicture : toggleRecording}
              disabled={!cameraReady}
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
      ) : (
        // Photo Preview Screen
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedPhoto! }} style={styles.previewImage} />
          <View style={styles.previewButtons}>
            <TouchableOpacity 
              style={styles.previewButton} 
              onPress={handleRetake}
            >
              <Ionicons name="camera-reverse" size={30} color="white" />
              <Text style={styles.previewButtonText}>Retake</Text>
            </TouchableOpacity>
            
            {!mediaLibraryPermission && (
              <TouchableOpacity 
                style={styles.previewButton} 
                onPress={handleSaveToGallery}
              >
                <Ionicons name="save" size={30} color="white" />
                <Text style={styles.previewButtonText}>Save to Gallery</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.previewButton} 
              onPress={handleUsePhoto}
            >
              <Ionicons name="checkmark" size={30} color="white" />
              <Text style={styles.previewButtonText}>Use Photo</Text>
            </TouchableOpacity>
          </View>
          
          {isSaving && (
            <View style={styles.savingOverlay}>
              <Text style={styles.savingText}>Saving to gallery...</Text>
            </View>
          )}
        </View>
      )}

      {!showPreview && (
        <View style={styles.modeSwitcherContainer}>
          <TouchableOpacity 
            style={[styles.modeButton, mode === 'photo' && styles.activeMode]}
            onPress={() => setMode('photo')}
          >
            <Text style={styles.modeText}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modeButton, mode === 'video' && styles.activeMode]}
            onPress={() => setMode('video')}
          >
            <Text style={styles.modeText}>Video</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
    width: '100%',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginRight: 6,
  },
  timerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
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
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 4,
  },
  modeButton: {
    paddingHorizontal: 25,
    paddingVertical: 8,
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
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  // Preview Styles
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  previewImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  previewButton: {
    alignItems: 'center',
    padding: 15,
  },
  previewButtonText: {
    color: 'white',
    marginTop: 5,
    fontSize: 14,
  },
  savingOverlay: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    borderRadius: 10,
  },
  savingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});