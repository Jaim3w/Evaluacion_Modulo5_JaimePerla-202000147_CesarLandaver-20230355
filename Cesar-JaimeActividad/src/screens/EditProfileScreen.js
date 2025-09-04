import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { doc, updateDoc } from "firebase/firestore";

const EditProfileScreen = ({ route, navigation }) => {
    const { user, setUser } = route.params;
    const [nombre, setNombre] = useState(user.nombre);
    const [email, setEmail] = useState(user.email);

    const handleSave = async () => {
        try {
            // Actualiza en Firestore (suponiendo que user tiene un campo uid)
            await updateDoc(doc(db, "users", user.uid), {
                nombre,
                email
            });
            setUser({ ...user, nombre, email });
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "No se pudo actualizar el perfil.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Perfil</Text>
            <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Nombre"
            />
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
            />
            <Button title="Guardar" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    input: { width: 250, borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 }
});

export default EditProfileScreen;