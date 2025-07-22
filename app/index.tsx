import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={['#128C7E', '#075E54']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image
          source={require('@/assets/images/scanhubs.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to Osure</Text>
        <Text style={styles.subtitle}>
          Read our Privacy Policy. Tap "Agree and continue" to accept the Terms of Service.
        </Text>
      </View>

      <View style={styles.footer}>
        <Link href="/(tabs)/chats" asChild replace>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>AGREE AND CONTINUE</Text>
          </TouchableOpacity>
        </Link>
        <Text style={styles.version}>Version 2.22.25.84</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 30,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: 'white',
    width: '80%',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#075E54',
    fontWeight: 'bold',
    fontSize: 16,
  },
  version: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
});