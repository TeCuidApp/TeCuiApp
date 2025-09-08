import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';

const API_URL = 'http://localhost:8000/api/v1/reports/';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios.get(API_URL + id + '/', {
      headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU3MzcxMTExLCJpYXQiOjE3NTczNjc1MTEsImp0aSI6ImJlZjRmMTk3OTQ1MzRiMzA5ZTE2NWNmZDMwMDY4ZDVlIiwidXNlcl9pZCI6MX0.c4pMWCBogWs2jjIHI3q1bIKTud3BejGozDp5pdZ8HmM' }
    })
      .then(res => setReport(res.data))
      .catch(err => alert('Error cargando reporte'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = () => {
    Alert.alert('Eliminar', '¿Seguro que quieres eliminar este reporte?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => {
        axios.delete(API_URL + id + '/')
          .then(() => {
            alert('Reporte eliminado');
            router.replace('/screens/ReportListScreen');
          })
          .catch(() => alert('Error eliminando reporte'));
      }}
    ]);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (!report) return <Text>No encontrado</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{report.title}</Text>
      <Text style={styles.description}>{report.description}</Text>
      <Button title="Editar" onPress={() => router.push({ pathname: '/screens/ReportEditScreen', params: { id } })} />
      <Button title="Eliminar" color="red" onPress={handleDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#222' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#fff' },
  description: { color: '#fff', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 12, color: '#fff', backgroundColor: '#333' },
});
