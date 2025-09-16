import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ActiveCallScreen() {
  const params = useLocalSearchParams();
  
  const callId = params.callId as string;
  const isCaller = params.isCaller === 'true';
  const calleeName = params.calleeName as string;
  const calleeAvatar = params.calleeAvatar as string;
  const type = params.type as 'audio' | 'video';

  const handleEndCall = () => {
    router.back();
  };

  const handleToggleMute = () => {
    // Implement mute functionality
  };

  const handleToggleSpeaker = () => {
    // Implement speaker functionality
  };

  return (
    <View style={styles.container}>
      {/* Caller Info */}
      <View style={styles.callerInfo}>
        <Image source={{ uri: calleeAvatar }} style={styles.avatar} />
        <Text style={styles.callerName}>{calleeName}</Text>
        <Text style={styles.callStatus}>
          {isCaller ? 'Calling...' : 'Incoming call'}
        </Text>
      </View>

      {/* Call Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={handleToggleMute}>
          <Ionicons name="mic-off" size={24} color="white" />
          <Text style={styles.controlText}>Mute</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={handleToggleSpeaker}>
          <Ionicons name="volume-high" size={24} color="white" />
          <Text style={styles.controlText}>Speaker</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, styles.endCallButton]} 
          onPress={handleEndCall}
        >
          <Ionicons name="call" size={24} color="white" />
          <Text style={styles.controlText}>End</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  callerInfo: {
    alignItems: 'center',
    marginTop: 100,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  callerName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  callStatus: {
    color: 'white',
    fontSize: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  controlButton: {
    alignItems: 'center',
    padding: 15,
  },
  endCallButton: {
    backgroundColor: 'red',
    borderRadius: 30,
    padding: 20,
  },
  controlText: {
    color: 'white',
    marginTop: 5,
    fontSize: 12,
  },
});