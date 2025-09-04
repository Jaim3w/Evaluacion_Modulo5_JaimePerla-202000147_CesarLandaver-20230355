import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
    // Simulación de usuario logueado
    const [user, setUser] = useState({ nombre: 'Juan Pérez', email: 'juan@email.com' });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>¡Hola, {user.nombre}!</Text>
            <Text>Email: {user.email}</Text>
            <Button
                title="Editar mi información"
                onPress={() => navigation.navigate('EditProfile', { user, setUser })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 }
});

export default HomeScreen;