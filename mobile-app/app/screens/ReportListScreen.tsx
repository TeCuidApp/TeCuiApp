import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

const API_URL = 'http://localhost:8000/api/v1/reports/'; // Cambia a tu IP local si usas dispositivo físico

export default function ReportListScreen() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios.get(API_URL, {
      headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU3MzcxMTExLCJpYXQiOjE3NTczNjc1MTEsImp0aSI6ImJlZjRmMTk3OTQ1MzRiMzA5ZTE2NWNmZDMwMDY4ZDVlIiwidXNlcl9pZCI6MX0.c4pMWCBogWs2jjIHI3q1bIKTud3BejGozDp5pdZ8HmM' }
    })
      .then(res => setReports(res.data.results || res.data))
      .catch(err => alert('Error cargando reportes'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reportes</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/screens/ReportCreateScreen')}>
        <Text style={styles.buttonText}>Crear Reporte</Text>
      </TouchableOpacity>
      <FlatList
        data={reports}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push({ pathname: '/screens/ReportDetailScreen', params: { id: item.id } })}>
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.label}>Descripción:</Text>
              <Text style={styles.text}>{item.description}</Text>
              <Text style={styles.label}>Categoría:</Text>
              <Text style={styles.text}>{item.category_display || item.category}</Text>
              <Text style={styles.label}>Estado:</Text>
              <Text style={styles.text}>{item.status_display || item.status}</Text>
              <Text style={styles.label}>Autor:</Text>
              <Text style={styles.text}>{item.author_name || (item.author && item.author.username)}</Text>
              <Text style={styles.label}>Creado:</Text>
              <Text style={styles.text}>{new Date(item.created_at).toLocaleString()}</Text>
              <Text style={styles.label}>Actualizado:</Text>
              <Text style={styles.text}>{new Date(item.updated_at).toLocaleString()}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#222' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#fff' },
  button: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8, marginBottom: 16 },
  buttonText: { color: '#fff', textAlign: 'center' },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee', marginBottom: 8, backgroundColor: '#333', borderRadius: 8 },
  itemTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 4, color: '#fff' },
  label: { fontWeight: 'bold', marginTop: 4, color: '#fff' },
  text: { color: '#fff' },
});
