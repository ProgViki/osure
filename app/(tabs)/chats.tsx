import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Alert, TextInput, Linking } from "react-native";
import { Link } from "expo-router";
import { collection, onSnapshot, query, orderBy, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import ChatItem from "../../components/ChatItem";
import { Ionicons } from "@expo/vector-icons";
import * as Contacts from 'expo-contacts';
import { getAuth } from "firebase/auth";

type Chat = {
  id: string;
  user: {
    name: string;
    avatar: string;
    phone: string;
  };
  lastMessage?: {
    text: string;
    time: string;
  };
  unreadCount: number;
  isFavorite: boolean;
  isGroup: boolean;
  participants?: string[];
  lastActivity: any; // Changed to any for Firebase timestamp compatibility
};

type TabType = "all" | "unread" | "favorites" | "groups";

type Contact = {
  id: string;
  name: string;
  phone: string;
  selected: boolean;
};

export default function ChatsScreen() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "chats"), orderBy("lastActivity", "desc")),
      (snapshot) => {
        const chatData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Chat[];
        setChats(chatData);
      }
    );

    return unsubscribe;
  }, []);

  // Filter chats based on active tab
  useEffect(() => {
    let filtered: Chat[] = [];

    switch (activeTab) {
      case "all":
        filtered = chats;
        break;
      case "unread":
        filtered = chats.filter(chat => chat.unreadCount > 0);
        break;
      case "favorites":
        filtered = chats.filter(chat => chat.isFavorite);
        break;
      case "groups":
        filtered = chats.filter(chat => chat.isGroup);
        break;
      default:
        filtered = chats;
    }

    setFilteredChats(filtered);
  }, [chats, activeTab]);

  // Filter contacts based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredContacts(contacts);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(query) ||
        contact.phone.includes(query)
      );
      setFilteredContacts(filtered);
    }
  }, [contacts, searchQuery]);

  const handleContactsPress = async () => {
    console.log("Contacts button pressed");
    setIsLoadingContacts(true);
    
    try {
      // Check current permission status first
      const { status: existingStatus } = await Contacts.getPermissionsAsync();
      console.log("Existing contacts permission:", existingStatus);
      
      let finalStatus = existingStatus;
      
      // If permission not granted, request it
      if (existingStatus !== 'granted') {
        console.log("Requesting contacts permission...");
        const { status } = await Contacts.requestPermissionsAsync();
        finalStatus = status;
        console.log("Permission request result:", status);
      }
      
      if (finalStatus === 'granted') {
        console.log("Permission granted, fetching contacts...");
        
        // Fetch contacts with more detailed options
        const contactData = await Contacts.getContactsAsync({
          fields: [
            Contacts.Fields.Name,
            Contacts.Fields.PhoneNumbers,
            Contacts.Fields.Image
          ],
          sort: Contacts.SortTypes.FirstName,
        });

        console.log(`Found ${contactData.data.length} contacts`);

        if (contactData.data.length > 0) {
          const formattedContacts: Contact[] = contactData.data
            .filter(contact => {
              // Filter out contacts without name
              if (!contact.name) {
                console.log("Skipping contact without name");
                return false;
              }
              
              // Filter out contacts without phone numbers
              if (!contact.phoneNumbers || contact.phoneNumbers.length === 0) {
                console.log(`Skipping contact ${contact.name} - no phone numbers`);
                return false;
              }
              
              // Get the first valid phone number
              const firstPhoneNumber = contact.phoneNumbers[0];
              if (!firstPhoneNumber || !firstPhoneNumber.number) {
                console.log(`Skipping contact ${contact.name} - invalid phone number`);
                return false;
              }
              
              return true;
            })
            .map(contact => {
              const phoneNumber = contact.phoneNumbers![0].number!;
              console.log(`Adding contact: ${contact.name} - ${phoneNumber}`);
              
              return {
                id: contact.id,
                name: contact.name,
                phone: phoneNumber,
                selected: false
              };
            })
            .sort((a, b) => a.name.localeCompare(b.name));

          console.log(`Formatted ${formattedContacts.length} contacts`);
          
          setContacts(formattedContacts);
          setFilteredContacts(formattedContacts);
          setSearchQuery("");
          setShowContactsModal(true);
        } else {
          Alert.alert(
            "No Contacts Found", 
            "We couldn't find any contacts with phone numbers on your device."
          );
        }
      } else {
        Alert.alert(
          "Permission Required", 
          "Contacts permission is required to select people to chat with. Please enable it in your device settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() }
          ]
        );
      }
    } catch (error) {
      console.error("Error accessing contacts:", error);
      Alert.alert(
        "Error", 
        "Failed to access contacts. Please make sure the app has permission to access your contacts."
      );
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const toggleContactSelection = (contactId: string) => {
    const updatedContacts = contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, selected: !contact.selected }
        : contact
    );
    
    setContacts(updatedContacts);
    
    // Also update filtered contacts to maintain selection state
    const updatedFilteredContacts = filteredContacts.map(contact =>
      contact.id === contactId
        ? { ...contact, selected: !contact.selected }
        : contact
    );
    setFilteredContacts(updatedFilteredContacts);
  };

  const getSelectedContacts = () => {
    return contacts.filter(contact => contact.selected);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const startNewChat = async () => {
    const selected = getSelectedContacts();
    
    if (selected.length === 0) {
      Alert.alert("No Contacts Selected", "Please select at least one contact to start a chat.");
      return;
    }

    setIsCreatingChat(true);

    try {
      console.log("Starting new chat with selected contacts:", selected);

      if (selected.length === 1) {
        // Start individual chat
        await createIndividualChat(selected[0]);
      } else {
        // Start group chat
        await createGroupChat(selected);
      }

      setShowContactsModal(false);
      // Reset selections and search
      setContacts(prev => prev.map(contact => ({ ...contact, selected: false })));
      setSearchQuery("");
      
    } catch (error) {
      console.error("Error creating chat:", error);
      // Show more detailed error message
      let errorMessage = "Failed to create chat. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = `Failed to create chat: ${error.message}`;
        console.error("Error details:", error.stack);
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setIsCreatingChat(false);
    }
  };


// In your component
const auth = getAuth();

const createIndividualChat = async (contact: Contact) => {
  try {
    const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log("Creating individual chat with ID:", chatId);
    
    const currentUser = auth.currentUser;
    
    const newChat: any = {
      id: chatId,
      user: {
        name: contact.name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=6B21A8&color=fff`,
        phone: contact.phone
      },
      unreadCount: 0,
      isFavorite: false,
      isGroup: false,
      lastActivity: new Date(),
      // Add user ID for security rules
      createdBy: currentUser?.uid || 'anonymous',
      participants: [currentUser?.uid || 'anonymous', contact.phone] // Store both user ID and phone
    };

    console.log("Chat data to save:", newChat);

    // Validate Firebase connection
    if (!db) {
      throw new Error("Firebase is not initialized");
    }

    // Create the document in Firebase
    await setDoc(doc(db, "chats", chatId), newChat);
    
    console.log("Chat created successfully in Firebase");
    Alert.alert("Chat Created", `Started chat with ${contact.name}`);
    
  } catch (error) {
    console.error("Error in createIndividualChat:", error);
    throw error;
  }
};

const createGroupChat = async (selectedContacts: Contact[]) => {
  try {
    const chatId = `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log("Creating group chat with ID:", chatId);
    
    const currentUser = auth.currentUser;
    const groupName = selectedContacts.map(c => c.name).join(', ');
    
    const newChat: any = {
      id: chatId,
      user: {
        name: `${groupName.substring(0, 20)}${groupName.length > 20 ? '...' : ''}`,
        avatar: `https://ui-avatars.com/api/?name=Group&background=6B21A8&color=fff`,
        phone: ''
      },
      unreadCount: 0,
      isFavorite: false,
      isGroup: true,
      participants: selectedContacts.map(c => c.phone),
      lastActivity: new Date(),
      // Add user ID for security rules
      createdBy: currentUser?.uid || 'anonymous',
      memberIds: [currentUser?.uid || 'anonymous', ...selectedContacts.map(c => `phone_${c.phone}`)]
    };

    console.log("Group chat data to save:", newChat);

    // Validate Firebase connection
    if (!db) {
      throw new Error("Firebase is not initialized");
    }

    // Create the document in Firebase
    await setDoc(doc(db, "chats", chatId), newChat);
    
    console.log("Group chat created successfully in Firebase");
    Alert.alert("Group Created", `Started group chat with ${selectedContacts.length} people`);
    
  } catch (error) {
    console.error("Error in createGroupChat:", error);
    throw error;
  }
};

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity 
      style={[
        styles.contactItem,
        item.selected && styles.contactItemSelected
      ]}
      onPress={() => toggleContactSelection(item.id)}
    >
      <View style={styles.contactAvatar}>
        <Text style={styles.contactAvatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </View>
      
      <View style={[
        styles.contactCheckbox,
        item.selected && styles.contactCheckboxSelected
      ]}>
        {item.selected && (
          <Ionicons name="checkmark" size={16} color="white" />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSearchHeader = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmptySearch = () => (
    <View style={styles.emptySearchContainer}>
      <Ionicons name="search-outline" size={60} color="#E9D5FF" />
      <Text style={styles.emptySearchTitle}>No contacts found</Text>
      <Text style={styles.emptySearchSubtitle}>
        {`No contacts match "${searchQuery}"`}
      </Text>
      <TouchableOpacity onPress={clearSearch} style={styles.emptySearchButton}>
        <Text style={styles.emptySearchButtonText}>Clear Search</Text>
      </TouchableOpacity>
    </View>
  );

  // Empty state component
  const EmptyState = () => {
    const getEmptyStateContent = () => {
      switch (activeTab) {
        case "unread":
          return {
            icon: "mail-open-outline",
            title: "No Unread Messages",
            subtitle: "You're all caught up! No unread messages right now.",
            buttonText: "View All Chats"
          };
        case "favorites":
          return {
            icon: "star-outline",
            title: "No Favorite Chats",
            subtitle: "Mark chats as favorites to see them here for quick access.",
            buttonText: "Browse Chats"
          };
        case "groups":
          return {
            icon: "people-outline",
            title: "No Group Chats",
            subtitle: "Start a group chat to collaborate with multiple people at once.",
            buttonText: "Create Group"
          };
        default:
          return {
            icon: "chatbubble-ellipses-outline",
            title: "No Chats Yet",
            subtitle: "Start a conversation by messaging your contacts",
            buttonText: "Start Chatting"
          };
      }
    };

    const content = getEmptyStateContent();

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <Ionicons name={content.icon as any} size={80} color="#E9D5FF" />
        </View>
        <Text style={styles.emptyTitle}>{content.title}</Text>
        <Text style={styles.emptySubtitle}>{content.subtitle}</Text>
        <TouchableOpacity 
          style={[
            styles.emptyButton,
            isLoadingContacts && styles.emptyButtonDisabled
          ]} 
          onPress={handleContactsPress}
          disabled={isLoadingContacts}
        >
          <Text style={styles.emptyButtonText}>
            {isLoadingContacts ? "Loading..." : content.buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => setActiveTab("all")}
      >
        <Text style={activeTab === "all" ? styles.tabTextActive : styles.tabText}>
          All
        </Text>
        {activeTab === "all" && <View style={styles.activeTabIndicator} />}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => setActiveTab("unread")}
      >
        <View style={styles.tabWithBadge}>
          <Text style={activeTab === "unread" ? styles.tabTextActive : styles.tabText}>
            Unread
          </Text>
          {chats.some(chat => chat.unreadCount > 0) && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>
                {chats.filter(chat => chat.unreadCount > 0).length}
              </Text>
            </View>
          )}
        </View>
        {activeTab === "unread" && <View style={styles.activeTabIndicator} />}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => setActiveTab("favorites")}
      >
        <Text style={activeTab === "favorites" ? styles.tabTextActive : styles.tabText}>
          Favorites
        </Text>
        {activeTab === "favorites" && <View style={styles.activeTabIndicator} />}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => setActiveTab("groups")}
      >
        <Text style={activeTab === "groups" ? styles.tabTextActive : styles.tabText}>
          Groups
        </Text>
        {activeTab === "groups" && <View style={styles.activeTabIndicator} />}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      {renderTabBar()}

      {/* Chats List or Empty State */}
      {filteredChats.length > 0 ? (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link href={`/chat/${item.id}`} asChild>
              <TouchableOpacity>
                <ChatItem 
                  chat={item} 
                  onToggleFavorite={() => toggleFavorite(item.id)}
                  onMarkAsRead={() => markAsRead(item.id)}
                />
              </TouchableOpacity>
            </Link>
          )}
        />
      ) : (
        <EmptyState />
      )}

      {/* Contacts Button */}
      <TouchableOpacity 
        style={[
          styles.contactsButton,
          isLoadingContacts && styles.contactsButtonDisabled
        ]} 
        onPress={handleContactsPress}
        disabled={isLoadingContacts}
      >
        {isLoadingContacts ? (
          <Ionicons name="refresh" size={24} color="white" />
        ) : (
          <Ionicons name="people" size={24} color="white" />
        )}
      </TouchableOpacity>

      {/* Contacts Modal */}
      <Modal
        visible={showContactsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowContactsModal(false);
          setSearchQuery("");
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Contacts</Text>
            <TouchableOpacity 
              onPress={() => {
                setShowContactsModal(false);
                setSearchQuery("");
              }}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#6B21A8" />
            </TouchableOpacity>
          </View>

          {/* Search Header */}
          {renderSearchHeader()}

          <Text style={styles.modalSubtitle}>
            {getSelectedContacts().length} selected • {filteredContacts.length} contacts
          </Text>

          <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item.id}
            renderItem={renderContactItem}
            style={styles.contactsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptySearch}
            keyboardShouldPersistTaps="handled"
          />

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={[
                styles.startChatButton,
                getSelectedContacts().length === 0 && styles.startChatButtonDisabled,
                isCreatingChat && styles.startChatButtonDisabled
              ]}
              onPress={startNewChat}
              disabled={getSelectedContacts().length === 0 || isCreatingChat}
            >
              <Text style={styles.startChatButtonText}>
                {isCreatingChat ? 'Creating...' : 
                 getSelectedContacts().length === 1 ? 'Start Chat' : 
                 `Start Group (${getSelectedContacts().length})`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

  // Placeholder functions for chat actions
  const toggleFavorite = (chatId: string) => {
    // TODO: Implement favorite toggle in Firebase
    console.log("Toggle favorite for:", chatId);
  };

  const markAsRead = (chatId: string) => {
    // TODO: Implement mark as read in Firebase
    console.log("Mark as read:", chatId);
  };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  tabItem: { 
    flex: 1, 
    alignItems: "center", 
    paddingVertical: 15,
    position: "relative",
  },
  tabWithBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabText: { 
    color: "#666", 
    fontWeight: "500",
    fontSize: 14,
  },
  tabTextActive: { 
    color: "#6B21A8", 
    fontWeight: "bold",
    fontSize: 14,
  },
  activeTabIndicator: {
    height: 3,
    backgroundColor: "#6B21A8",
    width: "50%",
    marginTop: 5,
    borderRadius: 2,
  },
  tabBadge: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6B21A8",
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: "#6B21A8",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  emptyButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  emptyButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  // Contacts Button Styles
  contactsButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#6B21A8",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  contactsButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  // Search Styles
  searchContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  clearButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B21A8',
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f3e8ff',
  },
  contactsList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 4,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f2f2f2',
  },
  contactItemSelected: {
    backgroundColor: '#f3e8ff',
    borderColor: '#6B21A8',
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6B21A8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactAvatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#6b7280',
  },
  contactCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactCheckboxSelected: {
    backgroundColor: '#6B21A8',
    borderColor: '#6B21A8',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f2f2f2',
  },
  startChatButton: {
    backgroundColor: '#6B21A8',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startChatButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  startChatButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Empty Search Styles
  emptySearchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 60,
  },
  emptySearchTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B21A8',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySearchSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  emptySearchButton: {
    backgroundColor: '#6B21A8',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptySearchButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});