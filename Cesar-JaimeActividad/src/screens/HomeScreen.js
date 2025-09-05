import { auth, database } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    // Busca en la colección correcta donde se guardaron los datos.
                    const userDocRef = doc(database, 'usuarios', currentUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        console.log("Datos encontrados en Firestore:", userDoc.data());
                        setUser({ uid: currentUser.uid, ...userDoc.data() }); // Asegura que uid esté presente
                    } else {
                        // Si el usuario está en Auth pero no en Firestore.
                        console.log("No se encontró documento en Firestore para el usuario.");
                        setUser({ uid: currentUser.uid, nombre: 'Usuario sin datos', correo: currentUser.email });
                    }
                }
            } catch (error) {
                console.error("Error al obtener datos del usuario:", error);
                setUser({ nombre: 'Error al cargar', correo: 'Error' });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>No hay usuario autenticado.</Text>
                <Button title="Ir a Login" onPress={() => navigation.replace('Login')} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                ¡Bienvenido, {user.nombre || 'Usuario'}!
            </Text>
            <Text style={styles.emailText}>Correo: {user.correo}</Text>
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('EditProfile', { user, setUser })}
            >
                <Text style={styles.buttonText}>Editar mi información</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.button, styles.logoutButton]} 
                onPress={async () => {
                    await auth.signOut();
                    navigation.replace('Login');
                }}
            >
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
};

// Estilos mejorados para la pantalla
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#f0f4f7',
        padding: 20,
    },
    title: { 
        fontSize: 26, 
        fontWeight: 'bold', 
        marginBottom: 8,
        color: '#333',
        textAlign: 'center',
    },
    emailText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: '#dc3545',
    }
});

export default HomeScreen;