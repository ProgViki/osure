import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const statusUpdates = [
  {
    id: '1',
    user: {
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      time: 'Just now',
    },
    media: 'https://picsum.photos/500/800',
    type: 'image', // or 'video'
  },
  {
    id: '2',
    user: {
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      time: '30 minutes ago',
    },
    media: 'https://picsum.photos/500/800',
    type: 'video',
  },
  // Add more status updates...
];

export default function UpdatesScreen() {
  return (
    <View style={styles.container}>
      {/* My Status */}
      <TouchableOpacity style={styles.myStatus}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/2.jpg' }}
          style={styles.myStatusAvatar}
        />
        <View style={styles.myStatusContent}>
          <Text style={styles.myStatusTitle}>My Status</Text>
          <Text style={styles.myStatusText}>Tap to add status update</Text>
        </View>
        <MaterialIcons name="add-circle" size={24} color="#128C7E" />
      </TouchableOpacity>

      {/* Recent Updates */}
      <Text style={styles.sectionTitle}>Recent updates</Text>
      <FlatList
        data={statusUpdates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.statusItem}>
            <Image source={{ uri: item.user.avatar }} style={styles.statusAvatar} />
            <View style={styles.statusContent}>
              <Text style={styles.statusName}>{item.user.name}</Text>
              <Text style={styles.statusTime}>{item.user.time}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Viewed Updates */}
      <Text style={styles.sectionTitle}>Viewed updates</Text>
      <FlatList
        data={statusUpdates.slice(1)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.statusItem}>
            <Image 
              source={{ uri: item.user.avatar }} 
              style={[styles.statusAvatar, { opacity: 0.6 }]} 
            />
            <View style={styles.statusContent}>
              <Text style={[styles.statusName, { color: '#888' }]}>{item.user.name}</Text>
              <Text style={styles.statusTime}>{item.user.time}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
  },
  myStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    marginBottom: 15,
  },
  myStatusAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  myStatusContent: {
    flex: 1,
  },
  myStatusTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  myStatusText: {
    color: 'gray',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#128C7E',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  statusAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#128C7E',
  },
  statusContent: {
    flex: 1,
  },
  statusName: {
    fontWeight: '600',
    fontSize: 16,
  },
  statusTime: {
    color: 'gray',
    fontSize: 14,
  },
});