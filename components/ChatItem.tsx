import { View, Text, Image, StyleSheet } from 'react-native';

export default function ChatItem({ chat } : any) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: chat.user.avatar }} style={styles.avatar} />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name}>{chat.user.name}</Text>
          <Text style={styles.time}>{chat.lastMessage.time}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.message} numberOfLines={1}>
            {chat.lastMessage.text}
          </Text>
          {chat.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{chat.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
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
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
  },
  time: {
    color: 'gray',
    fontSize: 12,
  },
  message: {
    color: 'gray',
    flex: 1,
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: '#25D366',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});