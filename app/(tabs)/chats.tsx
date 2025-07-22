import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ChatItem from '../../components/ChatItem';
import { chats } from '@/constants/dummyData';

export default function ChatsScreen() {
  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabTextActive}>All</Text>
          <View style={styles.activeTabIndicator} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabText}>Unread</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabText}>Groups</Text>
        </TouchableOpacity>
      </View>

      {/* Chats List */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/chat/${item.id}`} asChild>
            <TouchableOpacity>
              <ChatItem chat={item} />
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  tabText: {
    color: 'gray',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#128C7E',
    fontWeight: 'bold',
  },
  activeTabIndicator: {
    height: 3,
    backgroundColor: '#128C7E',
    width: '50%',
    marginTop: 5,
  },
});