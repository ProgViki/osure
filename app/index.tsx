import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../AuthProvider';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'users'), where('uid', '!=', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usersList = [];
      querySnapshot.forEach((doc) => {
        usersList.push(doc.data());
      });
      setUsers(usersList);
    });

    return unsubscribe;
  }, [user]);

  const handleUserPress = (otherUser) => {
    navigation.navigate('Chat', { userId: otherUser.uid });
  };

  const handleCallPress = (otherUser, isVideo) => {
    navigation.navigate('Call', { 
      otherUserId: otherUser.uid,
      isInitiator: true,
      isVideo 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat with:</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <TouchableOpacity 
              style={styles.userButton} 
              onPress={() => handleUserPress(item)}
            >
              <Text>{item.email}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.callButton} 
              onPress={() => handleCallPress(item, false)}
            >
              <Text>Voice</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.videoButton} 
              onPress={() => handleCallPress(item, true)}
            >
              <Text>Video</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  callButton: {
    padding: 10,
    backgroundColor: '#a0e0a0',
    marginLeft: 5,
  },
  videoButton: {
    padding: 10,
    backgroundColor: '#a0a0e0',
    marginLeft: 5,
  },
});

export default HomeScreen;