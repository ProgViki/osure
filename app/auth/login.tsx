import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { 
    signIn, 
    loading, 
    error, 
    clearError,
    signInWithGoogle,
    signInWithApple,
    signInWithFacebook 
  } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      clearError();
      await signIn(email, password);
      router.replace("./(tabs)");
    } catch (error) {
      // Error is handled by context
      console.error("Login error:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      clearError();
      await signInWithGoogle();
      // Navigation is handled in AuthContext after successful login
    } catch (error: any) {
      console.error("Google Sign-In error:", error);
      if (error.message !== "Sign in cancelled") {
        Alert.alert("Google Sign In Failed", error.message || "Something went wrong");
      }
    }
  };

  const handleAppleSignIn = async () => {
    try {
      clearError();
      await signInWithApple();
      // Navigation is handled in AuthContext after successful login
    } catch (error: any) {
      console.error("Apple Sign-In error:", error);
      if (error.message !== "Apple Sign In cancelled") {
        Alert.alert("Apple Sign In Failed", error.message || "Something went wrong");
      }
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      clearError();
      await signInWithFacebook();
      // Navigation is handled in AuthContext after successful login
    } catch (error: any) {
      console.error("Facebook Sign-In error:", error);
      if (error.message !== "Facebook login cancelled") {
        Alert.alert("Facebook Sign In Failed", error.message || "Something went wrong");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Ionicons name="call" size={60} color="#6B21A8" />
          <Text style={styles.logoText}>Osure</Text>
        </View>

        {/* Header */}
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in to continue your conversations
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#9CA3AF"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={clearError}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#9CA3AF"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onFocus={clearError}
              editable={!loading}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.forgotPassword}
            disabled={loading}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <Ionicons
                  name="refresh"
                  size={24}
                  color="#fff"
                  style={styles.loadingIcon}
                />
                <Text style={styles.loginButtonText}>Signing In...</Text>
              </View>
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
          <TouchableOpacity 
            style={[styles.socialButton, styles.googleButton]} 
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? (
              <Ionicons name="refresh" size={20} color="#DB4437" />
            ) : (
              <Ionicons name="logo-google" size={24} color="#DB4437" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.socialButton, styles.appleButton]} 
            onPress={handleAppleSignIn}
            disabled={loading || Platform.OS !== 'ios'}
          >
            {Platform.OS === 'ios' ? (
              <Ionicons name="logo-apple" size={24} color="#000" />
            ) : (
              <Ionicons name="logo-apple" size={24} color="#9CA3AF" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.socialButton, styles.facebookButton]} 
            onPress={handleFacebookSignIn}
            disabled={loading}
          >
            {loading ? (
              <Ionicons name="refresh" size={20} color="#1877F2" />
            ) : (
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
            )}
          </TouchableOpacity>
        </View>

        {/* Social Login Labels */}
        <View style={styles.socialLabelContainer}>
          <Text style={styles.socialLabelText}>Sign in with Google</Text>
          <Text style={styles.socialLabelText}>
            {Platform.OS === 'ios' ? 'Sign in with Apple' : 'Apple (iOS only)'}
          </Text>
          <Text style={styles.socialLabelText}>Sign in with Facebook</Text>
        </View>

        {/* Sign up link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <Link href="./register" asChild>
            <TouchableOpacity disabled={loading}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Terms and Privacy */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>{' '}
            and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#6B21A8",
    padding: 10,
    borderRadius: 75,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#6B21A8",
    marginTop: 10,
    fontFamily: "Inter_700Bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6B21A8",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "Inter_700Bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#D4AF37",
    textAlign: "center",
    marginBottom: 32,
    fontFamily: "Inter_400Regular",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    color: "#DC2626",
    marginLeft: 8,
    fontFamily: "Inter_500Medium",
    flex: 1,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#6B21A8",
    backgroundColor: "#FAFAFA",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#1F2937",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#6B21A8",
    fontFamily: "Inter_500Medium",
  },
  loginButton: {
    backgroundColor: "#6B21A8",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#6B21A8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Inter_700Bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingIcon: {
    marginRight: 8,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    color: "#6B7280",
    paddingHorizontal: 16,
    fontFamily: "Inter_500Medium",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 12,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DB4437",
  },
  appleButton: {
    backgroundColor: "#FFFFFF",
    borderColor: Platform.OS === 'ios' ? "#000" : "#9CA3AF",
  },
  facebookButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#1877F2",
  },
  socialLabelContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 32,
  },
  socialLabelText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    width: 60,
    fontFamily: "Inter_400Regular",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  signupText: {
    color: "#6B7280",
    fontFamily: "Inter_400Regular",
  },
  signupLink: {
    color: "#6B21A8",
    fontWeight: "bold",
    fontFamily: "Inter_600SemiBold",
  },
  termsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  termsText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    lineHeight: 16,
  },
  termsLink: {
    color: "#6B21A8",
    fontFamily: "Inter_500Medium",
  },
});