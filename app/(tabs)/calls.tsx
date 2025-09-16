import { View, FlatList, StyleSheet } from 'react-native';
import CallItem from '../../components/CallItem';
import { calls } from '@/constants/dummyData';

export default function CallsScreen() {


  
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
});