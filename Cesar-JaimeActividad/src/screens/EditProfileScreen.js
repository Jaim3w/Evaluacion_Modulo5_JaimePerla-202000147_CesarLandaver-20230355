import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { database } from '../config/firebase';
import { doc, updateDoc } from "firebase/firestore";

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
                correo: user.email || '', // Asegúrate de usar 'email' si así se guarda en tu base
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
            const userDocRef = doc(database, "usuarios", user.uid); // Usa "usuarios" si así es tu colección
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

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Correo Electrónico:</Text>
                <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={perfil.correo}
                    editable={false}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre Completo:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="John Doe"
                    onChangeText={(value) => handleChangeText('nombre', value)}
                    value={perfil.nombre}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Título Universitario:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ej: Ing. en Sistemas"
                    onChangeText={(value) => handleChangeText('tituloUniversitario', value)}
                    value={perfil.tituloUniversitario}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Año de Graduación:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="2024"
                    onChangeText={(value) => handleChangeText('anoGraduacion', value)}
                    value={perfil.anoGraduacion}
                    keyboardType='numeric'
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>
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
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 15,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    disabledInput: {
        backgroundColor: '#e9ecef',
        color: '#6c757d',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 8,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
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
