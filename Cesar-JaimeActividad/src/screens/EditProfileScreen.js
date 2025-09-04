
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { database } from '../config/firebase'; // Asegúrate de que la ruta a tu configuración sea correcta
import { doc, updateDoc } from "firebase/firestore";
 
const EditProfileScreen = ({ route, navigation }) => {
    // Obtenemos los datos del usuario y la función para actualizar el estado del screen anterior
    const { user, setUser } = route.params;
 
    // Estado para manejar los datos del formulario, inicializado con los datos del usuario
    const [perfil, setPerfil] = useState({
        nombre: '',
        tituloUniversitario: '',
        anoGraduacion: ''
    });
 
    // useEffect para establecer los datos del usuario en el estado cuando el componente se monta
    useEffect(() => {
        if (user) {
            setPerfil({
                nombre: user.nombre || '',
                // El correo no se edita aquí, pero lo podríamos mostrar
                correo: user.correo || '',
                tituloUniversitario: user.tituloUniversitario || '',
                anoGraduacion: user.anoGraduacion || ''
            });
        }
    }, [user]);
 
 
    // Función para manejar los cambios en los inputs
    const handleChangeText = (name, value) => {
        setPerfil({ ...perfil, [name]: value });
    };
 
    // Función para guardar los cambios en Firebase
    const handleSave = async () => {
        // Validación simple
        if (!perfil.nombre || !perfil.tituloUniversitario || !perfil.anoGraduacion) {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }
 
        try {
            // Referencia al documento del usuario en Firestore
            const userDocRef = doc(database, "usuarios", user.uid);
 
            // Actualiza el documento en Firestore
            await updateDoc(userDocRef, {
                nombre: perfil.nombre,
                tituloUniversitario: perfil.tituloUniversitario,
                anoGraduacion: perfil.anoGraduacion
            });
 
            // Actualiza el estado en el componente padre para reflejar los cambios inmediatamente
            setUser({ ...user, ...perfil });
 
            Alert.alert("Éxito", "Tu perfil se ha actualizado correctamente.");
            navigation.goBack(); // Regresa a la pantalla anterior
 
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
                    editable={false} // El correo no se puede editar
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
 
// Estilos tomados del componente de Registro para consistencia visual
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
