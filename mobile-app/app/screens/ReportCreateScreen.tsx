import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

const API_URL = 'http://localhost:8000/api/v1/reports/';

export default function ReportCreateScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleCreate = () => {
    axios.post(API_URL, { title, description }, {
      headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU3MzcxMTExLCJpYXQiOjE3NTczNjc1MTEsImp0aSI6ImJlZjRmMTk3OTQ1MzRiMzA5ZTE2NWNmZDMwMDY4ZDVlIiwidXNlcl9pZCI6MX0.c4pMWCBogWs2jjIHI3q1bIKTud3BejGozDp5pdZ8HmM' }
    })
      .then(() => {
        alert('Reporte creado');
        router.replace('/screens/ReportListScreen');
      })
      .catch(() => alert('Error creando reporte'));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Reporte</Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        placeholderTextColor="#ccc"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        placeholderTextColor="#ccc"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Crear" onPress={handleCreate} color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#222' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 12, color: '#fff', backgroundColor: '#333' },
});
