import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    TextInput, 
    Alert, 
    ScrollView, 
    ActivityIndicator 
} from 'react-native';
import { auth } from '../config/firebase'; // Asegúrate que la ruta a tu config de Firebase sea correcta
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = ({ navigation }) => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);

  const goToRegister = () => {
    navigation.navigate('Register'); // Navega a la pantalla de Registro
  };

  const iniciarSesion = async () => {
    if (!correo || !contrasena) {
      Alert.alert('Error', 'El correo y la contraseña son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, correo.trim(), contrasena);
      const user = userCredential.user;
      console.log(' Usuario ha iniciado sesión:', user.uid);
      
      // Aquí puedes navegar a la pantalla principal de tu app, por ejemplo 'Home'
      // navigation.navigate('Home'); 

      // Por ahora, solo mostraremos una alerta de éxito.
       Alert.alert('Inicio de Sesión Exitoso', `¡Bienvenido de nuevo!`);

    } catch (error) {
      console.error('❌ Error al iniciar sesión', error.code);
      let errorMessage = 'Ocurrió un error al iniciar sesión.';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No se encontró ningún usuario con este correo electrónico.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'La contraseña es incorrecta. Por favor, inténtalo de nuevo.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El formato del correo electrónico es incorrecto.';
          break;
        case 'auth/invalid-credential':
            errorMessage = 'Las credenciales proporcionadas son incorrectas.';
            break;
        default:
          errorMessage = 'No se pudo iniciar sesión. Por favor, revisa tus credenciales.';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo Electrónico:</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@ejemplo.com"
          onChangeText={setCorreo}
          value={correo}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña:</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu contraseña"
          onChangeText={setContrasena}
          value={contrasena}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={iniciarSesion}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Ingresar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={goToRegister}>
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>No tengo una cuenta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Login;

// Los estilos son similares a los de tu componente de Registro para mantener la consistencia
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f4f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007bff',
    elevation: 0,
  },
  secondaryButtonText: {
    color: '#007bff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
});
