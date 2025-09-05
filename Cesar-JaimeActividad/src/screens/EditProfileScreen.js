import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, StyleSheet } from 'react-native';
import { database } from '../config/firebase';
import { doc, updateDoc } from "firebase/firestore";

import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';

const EditProfileScreen = ({ route, navigation }) => {
    const { user, setUser } = route.params;

    const [perfil, setPerfil] = useState({
        nombre: '',
        correo: '',
        tituloUniversitario: '',
        anoGraduacion: ''
    });

    useEffect(() => {
        if (user) {
            setPerfil({
                nombre: user.nombre || '',
                correo: user.email || '', 
                tituloUniversitario: user.tituloUniversitario || '',
                anoGraduacion: user.anoGraduacion || ''
            });
        }
    }, [user]);

    const handleChangeText = (name, value) => {
        setPerfil({ ...perfil, [name]: value });
    };

    const handleSave = async () => {
        if (!perfil.nombre || !perfil.tituloUniversitario || !perfil.anoGraduacion) {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }

        if (!user.uid) {
            Alert.alert("Error", "No se encontró el identificador del usuario.");
            return;
        }

        try {
            const userDocRef = doc(database, "usuarios", user.uid);
            await updateDoc(userDocRef, {
                nombre: perfil.nombre,
                tituloUniversitario: perfil.tituloUniversitario,
                anoGraduacion: perfil.anoGraduacion
            });

            setUser({ ...user, ...perfil });

            Alert.alert("Éxito", "Tu perfil se ha actualizado correctamente.");
            navigation.goBack();
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            Alert.alert("Error", "No se pudo actualizar el perfil. Inténtalo de nuevo.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Editar Perfil</Text>

            <InputField
                label="Correo Electrónico:"
                placeholder="correo@ejemplo.com"
                value={perfil.correo}
                editable={false}
            />
            <InputField
                label="Nombre Completo:"
                placeholder="John Doe"
                value={perfil.nombre}
                onChangeText={(value) => handleChangeText('nombre', value)}
            />
            <InputField
                label="Título Universitario:"
                placeholder="Ej: Ing. en Sistemas"
                value={perfil.tituloUniversitario}
                onChangeText={(value) => handleChangeText('tituloUniversitario', value)}
            />
            <InputField
                label="Año de Graduación:"
                placeholder="2024"
                value={perfil.anoGraduacion}
                onChangeText={(value) => handleChangeText('anoGraduacion', value)}
                keyboardType="numeric"
            />

            <PrimaryButton onPress={handleSave} loading={false} text="Guardar Cambios" />
        </ScrollView>
    );
};

export default EditProfileScreen;

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
});
