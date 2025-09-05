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
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, correo.trim(), contrasena);
      const user = userCredential.user;
      console.log('✅ Usuario creado en Authentication:', user.uid);

      // Guardar info adicional en Firestore
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

      // Limpiar formulario
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

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre Completo:</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          onChangeText={(value) => handleChangeText('nombre', value)}
          value={usuario.nombre}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo Electrónico:</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@ejemplo.com"
          onChangeText={(value) => handleChangeText('correo', value)}
          value={usuario.correo}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña:</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
          onChangeText={(value) => handleChangeText('contrasena', value)}
          value={usuario.contrasena}
          secureTextEntry
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Título Universitario:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Ing. en Sistemas"
          onChangeText={(value) => handleChangeText('tituloUniversitario', value)}
          value={usuario.tituloUniversitario}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Año de Graduación:</Text>
        <TextInput
          style={styles.input}
          placeholder="2024"
          onChangeText={(value) => handleChangeText('anoGraduacion', value)}
          value={usuario.anoGraduacion}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={registrarUsuario}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Registrarme</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={goToLogin}>
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Ya tengo una cuenta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Register;

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
