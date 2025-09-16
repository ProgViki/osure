import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loading, error, clearError } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      router.replace('./(tabs)');
    } catch (error) {
      // Error handled by context
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Ionicons name="call" size={60} color="#D4AF37" />
          <Text style={styles.logoText}>Connect</Text>
        </View>

        {/* Header */}
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue your conversations</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={clearError}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onFocus={clearError}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#9CA3AF" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <Ionicons name="refresh" size={24} color="#000" style={styles.loadingIcon} />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login */}
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-apple" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-facebook" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Sign up link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <Link href="./register" asChild>
            <TouchableOpacity>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginTop: 10,
    fontFamily: 'Inter_700Bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Inter_400Regular',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    marginLeft: 8,
    fontFamily: 'Inter_500Medium',
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#6B21A8',
    fontFamily: 'Inter_500Medium',
  },
  loginButton: {
    backgroundColor: '#D4AF37',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
  },
  loadingIcon: {
    transform: [{ rotate: '0deg' }],
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#374151',
  },
  dividerText: {
    color: '#9CA3AF',
    paddingHorizontal: 16,
    fontFamily: 'Inter_500Medium',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    backgroundColor: '#1F2937',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#9CA3AF',
    fontFamily: 'Inter_400Regular',
  },
  signupLink: {
    color: '#D4AF37',
    fontWeight: 'bold',
    fontFamily: 'Inter_600SemiBold',
  },
});