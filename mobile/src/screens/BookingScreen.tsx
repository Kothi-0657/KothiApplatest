import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookingScreen({ route, navigation }: any) {
const { service } = route.params;
const [notes, setNotes] = useState('');
const [loading, setLoading] = useState(false);

const onBook = async () => {
try {
setLoading(true);
const token = await AsyncStorage.getItem('token');
const headers = token ? { Authorization: `Bearer ${token}` } : {};

const res = await api.post('/api/bookings', { service_id: service.id, notes, schedule: new Date().toISOString() }, { headers });
const booking = res.data.booking;

// Payment stub (simulate success)
await new Promise(r => setTimeout(r, 1000));

alert('Booking confirmed (demo)');
navigation.navigate('Home');
} catch (err) {
console.error(err);
alert('Booking failed');
} finally {
setLoading(false);
}
};

return (
<View style={styles.container}>
<Text style={styles.title}>Book {service.name}</Text>
<TextInput placeholder="Notes, location details" placeholderTextColor="#9CA3AF" value={notes} onChangeText={setNotes} style={styles.input} />

<TouchableOpacity style={styles.button} onPress={onBook} disabled={loading}>
{loading ? <ActivityIndicator color="#062023" /> : <Text style={{ fontWeight: '700' }}>Confirm & Pay</Text>}
</TouchableOpacity>
</View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, padding: 20, backgroundColor: '#071029' },
title: { color: '#fff', fontSize: 24, fontWeight: '800' },
input: { marginTop: 12, backgroundColor: '#0b1220', color: '#fff', padding: 12, borderRadius: 10 },
button: { marginTop: 18, backgroundColor: '#06B6D4', padding: 14, borderRadius: 10, alignItems: 'center' }
});