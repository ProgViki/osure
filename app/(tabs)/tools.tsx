import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons, Ionicons, Feather, FontAwesome, AntDesign } from '@expo/vector-icons';

export default function ToolsScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/2.jpg' }}
          style={styles.profileAvatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileStatus}>Hey there! I'm using Osure</Text>
        </View>
        <MaterialIcons name="qr-code" size={24} color="#128C7E" />
      </View>

      {/* Settings Sections */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="key" size={24} color="#128C7E" />
          <Text style={styles.settingText}>Account</Text>
          <Feather name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <FontAwesome name="lock" size={24} color="#128C7E" />
          <Text style={styles.settingText}>Privacy</Text>
          <Feather name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="chat" size={24} color="#128C7E" />
          <Text style={styles.settingText}>Chats</Text>
          <Feather name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="notifications" size={24} color="#128C7E" />
          <Text style={styles.settingText}>Notifications</Text>
          <Feather name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="storage" size={24} color="#128C7E" />
          <Text style={styles.settingText}>Storage and Data</Text>
          <Feather name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="language" size={24} color="#128C7E" />
          <Text style={styles.settingText}>App Language</Text>
          <Text style={styles.settingValue}>English</Text>
          <Feather name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <AntDesign name="questioncircle" size={24} color="#128C7E" />
          <Text style={styles.settingText}>Help Center</Text>
          <Feather name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="people" size={24} color="#128C7E" />
          <Text style={styles.settingText}>Invite a Friend</Text>
          <Feather name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="verified-user" size={24} color="#128C7E" />
          <Text style={styles.settingText}>Verify Security Number</Text>
          <Feather name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="info" size={24} color="#128C7E" />
          <Text style={styles.settingText}>About and Help</Text>
          <Feather name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  profileAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  profileStatus: {
    color: 'gray',
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: '#f2f2f2',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 20,
  },
  settingValue: {
    color: 'gray',
    marginRight: 10,
  },
});