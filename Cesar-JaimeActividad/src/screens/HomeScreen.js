import { auth, database } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const HomeScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    const userDocRef = doc(database, 'usuarios', currentUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        setUser({ uid: currentUser.uid, ...userDoc.data() });
                    } else {
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
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Cargando tu perfil...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>No hay usuario autenticado.</Text>
                <TouchableOpacity style={styles.loginButton} onPress={() => navigation.replace('Login')}>
                    <Text style={styles.buttonText}>Ir a Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' }} 
            style={styles.background}
            blurRadius={3}
        >
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>¡Bienvenido, {user.nombre || 'Usuario'}!</Text>
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
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    emailText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 25,
    },
    button: {
        width: '80%',
        paddingVertical: 15,
        borderRadius: 50,
        marginVertical: 10,
        backgroundColor: '#007bff',
        alignItems: 'center',
        shadowColor: '#007bff',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        shadowColor: '#dc3545',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f7',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#555',
    },
    loginButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 50,
        marginTop: 15,
    },
});

export default HomeScreen;
