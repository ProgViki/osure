import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CallItem({ call } : any) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: call.user.avatar }} style={styles.avatar} />
      <View style={styles.content}>
        <Text style={styles.name}>{call.user.name}</Text>
        <View style={styles.callInfo}>
          <Ionicons
            name={call.type === 'video' ? 'videocam' : 'call'}
            size={16}
            color={call.missed ? 'red' : 'gray'}
          />
          <Text style={[styles.details, call.missed && styles.missed]}>
            {call.direction} • {call.time}
          </Text>
        </View>
      </View>
      <TouchableOpacity>
        <Ionicons
          name={call.type === 'video' ? 'videocam-outline' : 'call-outline'}
          size={24}
          color="#128C7E"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 5,
  },
  callInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  details: {
    color: 'gray',
    marginLeft: 5,
  },
  missed: {
    color: 'red',
  },
});