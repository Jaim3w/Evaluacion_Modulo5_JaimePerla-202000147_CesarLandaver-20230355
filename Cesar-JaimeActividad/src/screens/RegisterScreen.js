import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { auth, database } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

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

  const goToLogin = () => navigation.navigate('Login');

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

      await setDoc(doc(database, 'usuarios', user.uid), {
        nombre,
        correo: correo.trim(),
        tituloUniversitario,
        anoGraduacion,
        creado: new Date()
      });

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
        <InputField
          label="Nombre Completo:"
          placeholder="John Doe"
          value={usuario.nombre}
          onChangeText={(val) => handleChangeText('nombre', val)}
        />
        <InputField
          label="Correo Electrónico:"
          placeholder="correo@ejemplo.com"
          value={usuario.correo}
          onChangeText={(val) => handleChangeText('correo', val)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <InputField
          label="Contraseña:"
          placeholder="Mínimo 6 caracteres"
          value={usuario.contrasena}
          onChangeText={(val) => handleChangeText('contrasena', val)}
          secureTextEntry
        />
        <InputField
          label="Título Universitario:"
          placeholder="Ej: Ing. en Sistemas"
          value={usuario.tituloUniversitario}
          onChangeText={(val) => handleChangeText('tituloUniversitario', val)}
        />
        <InputField
          label="Año de Graduación:"
          placeholder="2024"
          value={usuario.anoGraduacion}
          onChangeText={(val) => handleChangeText('anoGraduacion', val)}
          keyboardType="numeric"
        />

        <PrimaryButton onPress={registrarUsuario} loading={loading} text="Registrarme" />
        <SecondaryButton onPress={goToLogin} text="Ya tengo una cuenta" />
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
});
