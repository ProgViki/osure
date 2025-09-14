import { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInfo, setChatInfo] = useState<any>(null);
  const [input, setInput] = useState("");

  // Fetch messages
  useEffect(() => {
    if (!id) return;

    // Listen to chat info
    const unsubChat = onSnapshot(collection(db, "chats"), (snapshot) => {
      const chat = snapshot.docs.find((doc) => doc.id === id);
      if (chat) setChatInfo(chat.data());
    });

    // Listen to messages
    const q = query(
      collection(db, "chats", id as string, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubMessages = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });

    return () => {
      unsubChat();
      unsubMessages();
    };
  }, [id]);

  // Send a message
  const sendMessage = async () => {
    if (!input.trim()) return;
    await addDoc(collection(db, "chats", id as string, "messages"), {
      text: input,
      sender: "me", // TODO: replace with auth user
      createdAt: serverTimestamp(),
    });
    setInput("");
  };

  if (!chatInfo) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Loading chat...</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" onPress={() => router.back()} />
        <Image source={{ uri: chatInfo.user.avatar }} style={styles.headerAvatar} />
        <View style={styles.headerText}>
          <Text style={styles.headerName}>{chatInfo.user.name}</Text>
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
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === "me" ? styles.myMessage : styles.theirMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
            {item.createdAt?.seconds && (
              <Text style={styles.messageTime}>
                {new Date(item.createdAt.seconds * 1000).toLocaleTimeString()}
              </Text>
            )}
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
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.micButton} onPress={sendMessage}>
          <MaterialCommunityIcons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#e5ded8', }, center: { justifyContent: 'center', alignItems: 'center', }, backButton: { color: '#6B21A8', marginTop: 10, fontSize: 16, }, header: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#6B21A8', }, headerAvatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 15, }, headerText: { flex: 1, }, headerName: { color: 'white', fontWeight: 'bold', fontSize: 18, }, headerStatus: { color: 'lightgray', fontSize: 12, }, headerIcons: { flexDirection: 'row', alignItems: 'center', }, callButton: { marginHorizontal: 15, }, messagesContainer: { padding: 10, }, messageBubble: { maxWidth: '80%', padding: 10, borderRadius: 8, marginBottom: 10, }, myMessage: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6', borderTopRightRadius: 0, }, theirMessage: { alignSelf: 'flex-start', backgroundColor: 'white', borderTopLeftRadius: 0, }, messageText: { fontSize: 16, }, messageTime: { fontSize: 10, color: 'gray', alignSelf: 'flex-end', marginTop: 5, }, inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'white', }, input: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, marginHorizontal: 10, }, emojiButton: { padding: 5, }, attachButton: { padding: 5, }, micButton: { backgroundColor: '#6B21A8', borderRadius: 20, padding: 8, }, });