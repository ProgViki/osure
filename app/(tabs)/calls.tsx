import { View, FlatList, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import CallItem from '../../components/CallItem';
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

export default function CallsScreen() {
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setError('Please sign in to view your calls');
      setLoading(false);
      return;
    }

    const fetchCalls = () => {
      try {
        setError(null);
        const callsRef = collection(db, 'calls');
        const q = query(
          callsRef,
          where('participants', 'array-contains', user.uid),
          orderBy('timestamp', 'desc')
        );

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
            setError('Failed to load calls. Please check your connection and try again.');
            setLoading(false);
          }
        );

        return unsubscribe;
      } catch (err) {
        console.error('Error setting up listener:', err);
        setError('An unexpected error occurred while loading calls.');
        setLoading(false);
        return undefined;
      }
    };

    const unsubscribe = fetchCalls();
    return () => unsubscribe?.();
  }, [user]);

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    // The useEffect will automatically re-run since loading state changed
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6B21A8" />
        <Text style={styles.loadingText}>Loading your calls...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={64} color="#6B21A8" style={styles.errorIcon} />
        <Text style={styles.errorTitle}>Unable to Load Calls</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={retryFetch}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (calls.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="call-outline" size={64} color="#9CA3AF" style={styles.emptyIcon} />
        <Text style={styles.emptyTitle}>No Calls Yet</Text>
        <Text style={styles.emptyMessage}>
          Your call history will appear here once you start making calls.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={calls}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CallItem call={item} />}
        showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorIcon: {
    marginBottom: 16,
    opacity: 0.8,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#6B21A8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});