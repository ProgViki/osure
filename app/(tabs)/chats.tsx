import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import ChatItem from "../../components/ChatItem";

export default function ChatsScreen() {
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "chats"), (snapshot) => {
      const chatData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatData);
    });

    return unsubscribe; // cleanup listener
  }, []);

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
  container: { flex: 1, backgroundColor: "white" },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  tabItem: { flex: 1, alignItems: "center", paddingVertical: 15 },
  tabText: { color: "#E9D5FF", fontWeight: "500" },
  tabTextActive: { color: "#6B21A8", fontWeight: "bold" },
  activeTabIndicator: {
    height: 3,
    backgroundColor: "#6B21A8",
    width: "50%",
    marginTop: 5,
  },
});
