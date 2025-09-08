import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';

const API_URL = 'http://localhost:8000/api/v1/reports/';

export default function ReportEditScreen() {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios.get(API_URL + id + '/', {
      headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU3MzcxMTExLCJpYXQiOjE3NTczNjc1MTEsImp0aSI6ImJlZjRmMTk3OTQ1MzRiMzA5ZTE2NWNmZDMwMDY4ZDVlIiwidXNlcl9pZCI6MX0.c4pMWCBogWs2jjIHI3q1bIKTud3BejGozDp5pdZ8HmM' }
    })
      .then(res => {
        setTitle(res.data.title);
        setDescription(res.data.description);
        setCategory(res.data.category || 'General');
      })
      .catch(() => alert('Error cargando reporte'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEdit = () => {
    axios.put(API_URL + id + '/', { title, description, category }, {
      headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU3MzcxMTExLCJpYXQiOjE3NTczNjc1MTEsImp0aSI6ImJlZjRmMTk3OTQ1MzRiMzA5ZTE2NWNmZDMwMDY4ZDVlIiwidXNlcl9pZCI6MX0.c4pMWCBogWs2jjIHI3q1bIKTud3BejGozDp5pdZ8HmM' }
    })
      .then(() => {
        alert('Reporte actualizado');
        router.replace(`/screens/ReportDetailScreen?id=${id}`);
      })
      .catch(() => alert('Error actualizando reporte'));
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Reporte</Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
      <Text style={{ color: '#fff', marginBottom: 8 }}>Categoría</Text>
      <TextInput
        style={styles.input}
        value={category}
        editable={false}
      />
      <Button title="Guardar" onPress={handleEdit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#222' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 12, color: '#fff', backgroundColor: '#333' },
  });
