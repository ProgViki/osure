import { Tabs } from 'expo-router';
import { MaterialIcons, Ionicons, FontAwesome, Feather, Entypo } from '@expo/vector-icons';
import { View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRef, useState } from 'react';
import DropdownMenu from '../../components/DropdownMenu';
import { Position } from '@/types';

export default function TabLayout() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<Position>({ 
    x: 0, 
    y: 0, 
    width: 0, 
    height: 0 
  });
  const menuButtonRef = useRef<React.ComponentRef<typeof TouchableOpacity>>(null);
  const { width: windowWidth } = useWindowDimensions();

  const handleMenuPress = () => {
  menuButtonRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
    setAnchorPosition({ x, y, width, height });
    setMenuVisible(true);
  });
};

    const menuItems = [
    { icon: 'group', name: 'New group', action: () => console.log('New group') },
    { icon: 'broadcast-on-personal', name: 'New broadcast', action: () => console.log('New broadcast') },
    { icon: 'devices', name: 'Linked devices', action: () => console.log('Linked devices') },
    { icon: 'star', name: 'Starred messages', action: () => console.log('Starred messages') },
    { icon: 'drafts', name: 'Read all messages', action: () => console.log('Read all messages') },
    { icon: 'settings', name: 'Settings', action: () => console.log('Settings') },
  ];

  return (
    <>
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
            title: 'Osure',
            tabBarIcon: ({ color }) => (
              <Ionicons name="chatbubbles" size={24} color={color} />
            ),
            headerRight: () => (
              <View style={{ flexDirection: 'row', marginRight: 15 }}>
                <TouchableOpacity>
                  <Ionicons 
                    name="camera-outline" 
                    size={24} 
                    color="white" 
                    style={{ marginRight: 20 }} 
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Feather 
                    name="search" 
                    size={24} 
                    color="white" 
                    style={{ marginRight: 20 }} 
                  />
                </TouchableOpacity>
                <TouchableOpacity ref={menuButtonRef} onPress={handleMenuPress}>
                  <Entypo name="dots-three-vertical" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        {/* Other screens remain the same */}
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
        name="updates"
        options={{
          title: 'Updates',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="photo-camera" size={24} color={color} />
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

      <DropdownMenu
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)}
        anchorPosition={anchorPosition}
        items={menuItems}
      />
    </>
  );
}