import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
// import { useAuth } from '../AuthProvider';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigation } from 'expo-router';
// import { db } from '../firebase';

export type User = {
  uid: string;
  email: string;
  name: string;
  avatar?: string;
};

export type CallScreenParams = {
  otherUser: User;
  isInitiator: boolean;
  isVideo: boolean;
};

const Home = ({ 
  // navigation
 }) => {
  const navigation = useNavigation();
  // const { user } = useAuth();
  // const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   if (!user) return;

  //   const q = query(collection(db, 'users'), where('uid', '!=', user.uid));
  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     const usersList = [];
  //     querySnapshot.forEach((doc) => {
  //       usersList.push(doc.data());
  //     });
  //     setUsers(usersList);
  //   });

  //   return unsubscribe;
  // }, [user]);

  // const handleUserPress = (otherUser) => {
  //   navigation.navigate('Chat', { userId: otherUser.uid });
  // };

  // const handleCallPress = (otherUser, isVideo) => {
  //   navigation.navigate('Call', { 
  //     otherUserId: otherUser.uid,
  //     isInitiator: true,
  //     isVideo 
  //   });
  // };

   // Dummy users data
  const users: User[] = [
    {
      uid: '1',
      email: 'john.doe@example.com',
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      uid: '2',
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
      uid: '3',
      email: 'mike.johnson@example.com',
      name: 'Mike Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
      uid: '4',
      email: 'sarah.williams@example.com',
      name: 'Sarah Williams',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      uid: '5',
      email: 'david.brown@example.com',
      name: 'David Brown',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
  ];
   const handleUserPress = (otherUser: User) => {
    navigation.navigate('Chat', { userId: otherUser.uid });
  };

   const handleCallPress = (otherUser: User, isVideo: boolean) => {
    navigation.navigate('Call', { 
      otherUser,  // Pass the entire user object
      isInitiator: true,  // Since we're initiating the call
      isVideo  // Boolean for video/voice call
    });
  };

  return (
    // <View style={styles.container}>
    //   <Text style={styles.title}>Chat with:</Text>
    //   <FlatList
    //     data={users}
    //     keyExtractor={(item) => item.uid}
    //     renderItem={({ item }) => (
    //       <View style={styles.userContainer}>
    //         <TouchableOpacity 
    //           style={styles.userButton} 
    //           onPress={() => handleUserPress(item)}
    //         >
    //           <Text>{item.email}</Text>
    //         </TouchableOpacity>
    //         <TouchableOpacity 
    //           style={styles.callButton} 
    //           onPress={() => handleCallPress(item, false)}
    //         >
    //           <Text>Voice</Text>
    //         </TouchableOpacity>
    //         <TouchableOpacity 
    //           style={styles.videoButton} 
    //           onPress={() => handleCallPress(item, true)}
    //         >
    //           <Text>Video</Text>
    //         </TouchableOpacity>
    //       </View>
    //     )}
    //   />
    // </View>

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
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.callButton} 
              onPress={() => handleCallPress(item, false)}
            >
              <Text style={styles.buttonText}>Voice</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.videoButton} 
              onPress={() => handleCallPress(item, true)}
            >
              <Text style={styles.buttonText}>Video</Text>
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
   userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
   buttonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default Home;