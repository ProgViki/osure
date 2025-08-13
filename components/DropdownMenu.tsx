import { DropdownMenuProps, MenuItem } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { DropdownMenuProps, MenuItem } from '../types';

const defaultItems: MenuItem[] = [
  { icon: 'group', name: 'New group' },
  { icon: 'broadcast-on-personal', name: 'New broadcast' },
  { icon: 'devices', name: 'Linked devices' },
  { icon: 'star', name: 'Starred messages' },
  { icon: 'drafts', name: 'Read all messages' },
  { icon: 'settings', name: 'Settings' },
];

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  visible,
  onClose,
  anchorPosition,
  items = defaultItems,
}) => {
    const menuWidth = 220;
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={[
          styles.menuContainer,
          { 
            top: anchorPosition.y + anchorPosition.height,
            right: windowWidth - anchorPosition.x - anchorPosition.width,
            width: menuWidth,
          }
        ]}>
          {items.map((item, index) => (
            <React.Fragment key={`${item.name}-${index}`}>
            <TouchableOpacity 
              key={`${item.name}-${index}`}
              style={styles.menuItem}
              onPress={() => {
                item.action?.();
                onClose();
              }}
            >
              <MaterialIcons 
                name={item.icon as any} 
                size={24} 
                color="#128C7E" 
              />
              <Text style={styles.menuText}>{item.name}</Text>
            </TouchableOpacity>
             {index < items.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 8,
    width: 220, // Fixed width like WhatsApp
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginTop: 20, // Adjust this value based on your needs
    marginRight: -8, 
    right: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    marginLeft: 16,
    fontSize: 16,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
});

export default DropdownMenu;