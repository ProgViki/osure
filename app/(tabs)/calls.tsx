import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import CallItem from '../../components/CallItem';
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebaseConfig';
// import { useAuth } from '@/context/AuthContext'; // Assuming you have an auth context

export default function CallsScreen() {
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get current user from your auth context
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchCalls = () => {
      try {
        // Query calls where the current user is either the caller or callee
        const callsRef = collection(db, 'calls');
        const q = query(
          callsRef,
          where('participants', 'array-contains', user.uid),
          orderBy('timestamp', 'desc')
        );

        // Real-time listener
        const unsubscribe = onSnapshot(q, 
          (querySnapshot) => {
            const callsData: any[] = [];
            querySnapshot.forEach((doc) => {
              callsData.push({ id: doc.id, ...doc.data() });
            });
            setCalls(callsData);
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching calls:', error);
            setError('Failed to load calls');
            setLoading(false);
          }
        );

        return unsubscribe;
      } catch (err) {
        console.error('Error setting up listener:', err);
        setError('Failed to load calls');
        setLoading(false);
      }
    };

    const unsubscribe = fetchCalls();
    return () => unsubscribe?.();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6B21A8" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (calls.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noCalls}>No call history</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={calls}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CallItem call={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  noCalls: {
    color: 'gray',
    fontSize: 16,
  },
});