import { Tabs } from 'expo-router';
import { MaterialIcons, Ionicons, FontAwesome, Feather, Entypo } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#128C7E',
        tabBarInactiveTintColor: 'gray',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 24,
          color: 'white',
        },
        headerStyle: {
          backgroundColor: '#128C7E',
        },
        tabBarStyle: {
          backgroundColor: '#f8f8f8',
        },
      }}
    >
      <Tabs.Screen
        name="chats"
        options={{
          title: 'WhatsApp',
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles" size={24} color={color} />
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 15 }}>
              <Ionicons name="camera-outline" size={24} color="white" style={{ marginRight: 20 }} />
              <Feather name="search" size={24} color="white" style={{ marginRight: 20 }} />
              <Entypo name="dots-three-vertical" size={20} color="white" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="updates"
        options={{
          title: 'Updates',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="photo-camera" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calls"
        options={{
          title: 'Calls',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="phone" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: 'Tools',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}