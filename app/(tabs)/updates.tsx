import { db } from '@/firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


const statusUpdates = [
  {
    id: '1',
    user: {
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      time: 'Just now',
    },
    media: 'https://picsum.photos/500/800',
    type: 'image',
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
];

// Define TypeScript interfaces
interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Timestamp | Date;
}

// Mock Gemini AI function (replace with actual Gemini API call)
const generateGeminiResponse = async (message: string): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock responses - replace with actual Gemini API integration
  const responses = [
    "I'm Gemini AI! How can I assist you today?",
    "That's an interesting question! Based on my knowledge...",
    "I'd be happy to help with that. Here's what I think...",
    "Great question! Let me provide some insights...",
    "I understand your query. Here's my response..."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export default function UpdatesScreen() {
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const modalContentRef = useRef<View>(null);

  // Load chat history from Firebase
  useEffect(() => {
    if (chatModalVisible) {
      const q = query(
        collection(db, 'geminiChats'),
        orderBy('timestamp', 'asc')
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messagesData: ChatMessage[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          messagesData.push({ 
            id: doc.id, 
            text: data.text,
            sender: data.sender,
            timestamp: data.timestamp
          });
        });
        setMessages(messagesData);
      });

      return () => unsubscribe();
    }
  }, [chatModalVisible]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Omit<ChatMessage, 'id'> = {
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    // Add user message to Firestore
    await addDoc(collection(db, 'geminiChats'), {
      ...userMessage,
      timestamp: serverTimestamp(),
    });

    setInputMessage('');
    setIsLoading(true);

    try {
      // Get AI response
      const aiResponse = await generateGeminiResponse(inputMessage);
      
      const aiMessage: Omit<ChatMessage, 'id'> = {
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      // Add AI response to Firestore
      await addDoc(collection(db, 'geminiChats'), {
        ...aiMessage,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
      Alert.alert('Error', 'Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    // Note: In a real app, you'd want to implement proper chat clearing
    // This is a simplified version
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => setMessages([])
        }
      ]
    );
  };

  const handleBackdropPress = (event: any) => {
  // Check if the press is outside the modal content
  if (modalContentRef.current) {
    modalContentRef.current.measure((fx, fy, width, height, px, py) => {
      const { locationX, locationY } = event.nativeEvent;
      const isOutside = locationY < 0 || locationY > height || locationX < 0 || locationX > width;
      
      if (isOutside) {
        setChatModalVisible(false);
      }
    });
  }
};

  const formatMessageTime = (timestamp: Timestamp | Date): string => {
    if (timestamp instanceof Date) {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
        <MaterialIcons name="add-circle" size={24} color="#6B21A8" />
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

      {/* Gemini AI Chat Button */}
      <TouchableOpacity 
        style={styles.chatButton}
        onPress={() => setChatModalVisible(true)}
      >
        <MaterialIcons name="smart-toy" size={24} color="white" />
        <Text style={styles.chatButtonText}>Chat with Gemini AI</Text>
      </TouchableOpacity>

      {/* Gemini AI Chat Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={chatModalVisible}
        onRequestClose={() => setChatModalVisible(false)}
      >
         <TouchableOpacity 
    style={styles.modalContainer}
    activeOpacity={1}
    onPress={handleBackdropPress}
  >
     <View 
      ref={modalContentRef}
      style={styles.modalContent}
      onStartShouldSetResponder={() => true}
    >
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.aiHeader}>
                <MaterialIcons name="smart-toy" size={28} color="#6B21A8" />
                <Text style={styles.modalTitle}>Gemini AI Assistant</Text>
              </View>
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={clearChat}
              >
                <MaterialIcons name="delete" size={20} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setChatModalVisible(false)}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Chat Messages */}
            <ScrollView 
              ref={scrollViewRef}
              style={styles.chatContainer}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.length === 0 && (
                <View style={styles.welcomeMessage}>
                  <Text style={styles.welcomeText}>
                    Hello! I'm Gemini AI. Ask me anything and I'll do my best to help you!
                  </Text>
                </View>
              )}
              
              {messages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageBubble,
                    message.sender === 'user' ? styles.userMessage : styles.aiMessage
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    message.sender === 'user' && styles.userMessageText
                  ]}>
                    {message.text}
                  </Text>
                  <Text style={styles.messageTime}>
                    {formatMessageTime(message.timestamp)}
                  </Text>
                </View>
              ))}
              
              {isLoading && (
                <View style={[styles.messageBubble, styles.aiMessage]}>
                  <Text style={styles.messageText}>Gemini is typing...</Text>
                </View>
              )}
            </ScrollView>

            {/* Input Area */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={inputMessage}
                onChangeText={setInputMessage}
                placeholder="Ask Gemini AI anything..."
                multiline
                maxLength={500}
              />
              <TouchableOpacity 
                style={[
                  styles.sendButton,
                  (!inputMessage.trim() || isLoading) && styles.sendButtonDisabled
                ]}
                onPress={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
              >
                <MaterialIcons 
                  name="send" 
                  size={20} 
                  color={!inputMessage.trim() || isLoading ? "#999" : "#fff"} 
                />
              </TouchableOpacity>
        </View>
        </View>
        </TouchableOpacity>
      </Modal>
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
    color: '#6B21A8',
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
    borderColor: '#6B21A8',
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
  // Chat Button Styles
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderWidth: 1,
    borderColor: '#6B21A8',
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 10,
  },
  chatButtonText: {
    color: '#6B21A8',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    padding: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#6B21A8',
  },
  closeButton: {
    padding: 5,
  },
  clearButton: {
    padding: 5,
    marginRight: 10,
  },
  chatContainer: {
    flex: 1,
    paddingVertical: 15,
  },
  welcomeMessage: {
    backgroundColor: '#f8f5ff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  welcomeText: {
    color: '#6B21A8',
    fontSize: 14,
    textAlign: 'center',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#6B21A8',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f2f2f2',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
  userMessageText: {
    color: 'white',
  },
  messageTime: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f2f2f2',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#6B21A8',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ddd',
  },
});