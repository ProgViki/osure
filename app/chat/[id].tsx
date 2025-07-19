import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { chats } from '../../constants/dummyData';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const chat = chats.find(c => c.id === id);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" />
        <Image source={{ uri: chat.user.avatar }} style={styles.headerAvatar} />
        <View style={styles.headerText}>
          <Text style={styles.headerName}>{chat.user.name}</Text>
          <Text style={styles.headerStatus}>online</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="videocam-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={chat.messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble,
            item.sender === 'me' ? styles.myMessage : styles.theirMessage
          ]}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTime}>{item.time}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.emojiButton}>
          <MaterialCommunityIcons name="emoticon-outline" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.attachButton}>
          <MaterialCommunityIcons name="paperclip" size={24} color="gray" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          placeholderTextColor="gray"
        />
        <TouchableOpacity style={styles.micButton}>
          <MaterialCommunityIcons name="microphone" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5ded8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#128C7E',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 15,
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerStatus: {
    color: 'lightgray',
    fontSize: 12,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callButton: {
    marginHorizontal: 15,
  },
  messagesContainer: {
    padding: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 0,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 10,
    color: 'gray',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 10,
  },
  emojiButton: {
    padding: 5,
  },
  attachButton: {
    padding: 5,
  },
  micButton: {
    backgroundColor: '#128C7E',
    borderRadius: 20,
    padding: 8,
  },
});