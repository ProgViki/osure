import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Modal } from "react-native";
import { MaterialIcons, Ionicons, Feather, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function ToolsScreen() {
  const router = useRouter();
  const [storageVisible, setStorageVisible] = useState(false);

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/2.jpg" }}
          style={styles.profileAvatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileStatus}>Hey there! I'm using Osure</Text>
        </View>
        <MaterialIcons name="qr-code" size={24} color="#6B21A8" />
      </View>

      {/* Settings Sections */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.settingItem} onPress={() => router.push("/tool/account")}>
          <Ionicons name="key" size={24} color="#6B21A8" />
          <Text style={styles.settingText}>Account</Text>
          <Feather name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => router.push("/tool/privacy")}>
          <FontAwesome name="lock" size={24} color="#6B21A8" />
          <Text style={styles.settingText}>Privacy</Text>
          <Feather name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => router.push("/tool/chats")}>
          <MaterialIcons name="chat" size={24} color="#6B21A8" />
          <Text style={styles.settingText}>Chats</Text>
          <Feather name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => router.push("/tool/notifications")}>
          <Ionicons name="notifications" size={24} color="#6B21A8" />
          <Text style={styles.settingText}>Notifications</Text>
          <Feather name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>

        {/* 🔹 Storage and Data Modal Trigger */}
        <TouchableOpacity style={styles.settingItem} onPress={() => setStorageVisible(true)}>
          <MaterialIcons name="storage" size={24} color="#6B21A8" />
          <Text style={styles.settingText}>Storage and Data</Text>
          <Feather name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {/* 🔹 Storage & Data Modal */}
      <Modal
        visible={storageVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setStorageVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Storage and Data Usage</Text>

            <View style={styles.usageRow}>
              <Text style={styles.usageLabel}>Messages:</Text>
              <Text style={styles.usageValue}>120 MB</Text>
            </View>
            <View style={styles.usageRow}>
              <Text style={styles.usageLabel}>Media (Images, Videos):</Text>
              <Text style={styles.usageValue}>650 MB</Text>
            </View>
            <View style={styles.usageRow}>
              <Text style={styles.usageLabel}>Documents:</Text>
              <Text style={styles.usageValue}>80 MB</Text>
            </View>
            <View style={styles.usageRow}>
              <Text style={styles.usageLabel}>App Cache:</Text>
              <Text style={styles.usageValue}>45 MB</Text>
            </View>
            <View style={styles.usageRow}>
              <Text style={styles.usageLabel}>Total:</Text>
              <Text style={styles.usageValue}>895 MB</Text>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setStorageVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  profileHeader: { flexDirection: "row", alignItems: "center", padding: 20, backgroundColor: "#f8f8f8" },
  profileAvatar: { width: 70, height: 70, borderRadius: 35, marginRight: 15 },
  profileInfo: { flex: 1 },
  profileName: { fontWeight: "bold", fontSize: 18, marginBottom: 5 },
  profileStatus: { color: "gray" },
  section: { borderTopWidth: 1, borderTopColor: "#f2f2f2", marginBottom: 20 },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  settingText: { flex: 1, fontSize: 16, marginLeft: 20 },

  // 🔹 Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  usageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  usageLabel: { fontSize: 16, color: "gray" },
  usageValue: { fontSize: 16, fontWeight: "600" },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#6B21A8",
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
