import { StyleSheet, View, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button
        title="Ver Reportes"
        onPress={() => router.push('/screens/ReportListScreen')}
      />
      <Button
        title="Crear Reporte"
        onPress={() => router.push('/screens/ReportCreateScreen')}
      />
      <Button
        title="Registrarse"
        onPress={() => router.push('/screens/SignUpScreen')}
      />
      <Button
        title="Iniciar Sesión"
        onPress={() => router.push('/screens/LoginScreen')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
});