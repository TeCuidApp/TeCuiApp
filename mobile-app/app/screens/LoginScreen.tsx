import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

const LOGIN_URL = 'http://localhost:8000/api/v1/auth/login/';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await axios.post(LOGIN_URL, { email, password });
      const { access } = res.data.tokens;
      // Guardar el token en localStorage o SecureStore
      // localStorage.setItem('token', access); // web
      // Para Expo usa expo-secure-store
      Alert.alert('Login exitoso');
      console.log('Token guardado:', access);
      console.log('Plataforma:', Platform.OS);
        router.push('/screens/ReportListScreen');
        console.log('Navegando a ReportListScreen');
    } catch (err) {
      Alert.alert('Error', 'Credenciales incorrectas');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Entrar" onPress={handleLogin} color="#007AFF" />
      <Text style={styles.link} onPress={() => router.push('/screens/SignUpScreen')}>¿No tienes cuenta? Regístrate</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#222' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 12, color: '#fff', backgroundColor: '#333' },
  link: { color: '#007AFF', marginTop: 16, textAlign: 'center' },
});
