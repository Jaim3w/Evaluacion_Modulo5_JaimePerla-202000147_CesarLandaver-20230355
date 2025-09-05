import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { auth, database } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Register = ({ navigation }) => {
  const [usuario, setUsuario] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    tituloUniversitario: '',
    anoGraduacion: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChangeText = (name, value) => {
    setUsuario({ ...usuario, [name]: value });
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  const registrarUsuario = async () => {
    const { nombre, correo, contrasena, tituloUniversitario, anoGraduacion } = usuario;

    if (!nombre || !correo || !contrasena || !tituloUniversitario || !anoGraduacion) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (contrasena.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo.trim(), contrasena);
      const user = userCredential.user;
      console.log('✅ Usuario creado en Authentication:', user.uid);

      await setDoc(doc(database, 'usuarios', user.uid), {
        nombre,
        correo: correo.trim(),
        tituloUniversitario,
        anoGraduacion,
        creado: new Date()
      });

      console.log('✅ Datos adicionales guardados en Firestore');
      Alert.alert('Registro Exitoso', 'El usuario se ha registrado correctamente.', [
        { text: 'Ok', onPress: goToLogin },
      ]);

      setUsuario({
        nombre: '',
        correo: '',
        contrasena: '',
        tituloUniversitario: '',
        anoGraduacion: ''
      });

    } catch (error) {
      console.error('❌ Error al registrar el usuario', error);
      let errorMessage = 'Ocurrió un error al registrar el usuario.';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este correo electrónico ya está en uso.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El formato del correo electrónico es incorrecto.';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
          break;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>

      <View style={styles.formCard}>
        {['nombre', 'correo', 'contrasena', 'tituloUniversitario', 'anoGraduacion'].map((field, index) => (
          <View key={index} style={styles.inputContainer}>
            <Text style={styles.label}>
              {field === 'nombre' ? 'Nombre Completo:' : 
               field === 'correo' ? 'Correo Electrónico:' :
               field === 'contrasena' ? 'Contraseña:' :
               field === 'tituloUniversitario' ? 'Título Universitario:' :
               'Año de Graduación:'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={
                field === 'nombre' ? 'John Doe' :
                field === 'correo' ? 'correo@ejemplo.com' :
                field === 'contrasena' ? 'Mínimo 6 caracteres' :
                field === 'tituloUniversitario' ? 'Ej: Ing. en Sistemas' :
                '2024'
              }
              onChangeText={(value) => handleChangeText(field, value)}
              value={usuario[field]}
              keyboardType={field === 'correo' ? 'email-address' : field === 'anoGraduacion' ? 'numeric' : 'default'}
              autoCapitalize={field === 'correo' ? 'none' : 'sentences'}
              secureTextEntry={field === 'contrasena'}
            />
          </View>
        ))}

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={registrarUsuario}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Registrarme</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={goToLogin}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Ya tengo una cuenta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#e0f7fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  formCard: {
    width: '100%',
    backgroundColor: '#ffffffee',
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#00796b',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    marginBottom: 6,
    color: '#555',
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderRadius: 15,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#f0f4f8',
    shadowColor: '#00796b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  button: {
    backgroundColor: '#00796b',
    paddingVertical: 15,
    borderRadius: 50,
    marginTop: 15,
    alignItems: 'center',
    shadowColor: '#00796b',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#00796b',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#00796b',
  },
});
