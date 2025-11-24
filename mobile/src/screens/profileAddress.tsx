// src/screens/ProfileAddress.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function ProfileAddress() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [fullAddress, setFullAddress] = useState("");
  const [label, setLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch user addresses
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/addresses/user/${user.id}`);
      setAddresses(res.data.addresses || []);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to fetch addresses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchAddresses();
  }, [user]);

  const openAddModal = () => {
    setFullAddress("");
    setLabel("");
    setEditingId(null);
    setModalVisible(true);
  };

  const openEditModal = (address: any) => {
    setFullAddress(address.full_address);
    setLabel(address.label || "");
    setEditingId(address.id);
    setModalVisible(true);
  };

  const saveAddress = async () => {
    if (!fullAddress.trim()) {
      Alert.alert("Address Required", "Please enter full address.");
      return;
    }

    try {
      if (editingId) {
        // Update existing
        await api.put(`/addresses/${editingId}`, { full_address: fullAddress, label });
      } else {
        // Add new
        await api.post(`/addresses`, { user_id: user.id, full_address: fullAddress, label });
      }
      setModalVisible(false);
      fetchAddresses();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to save address.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#06B6D4" />
      </View>
    );
  }

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.address}>{item.full_address}</Text>
      <Text style={styles.label}>Label: {item.label || "Home"}</Text>

      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <TouchableOpacity style={styles.editBtn} onPress={() => openEditModal(item)}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.editBtn, { backgroundColor: "#EF4444", marginLeft: 10 }]}
          onPress={() => Alert.alert("Delete", "Feature coming soon")}
        >
          <Text style={styles.editText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
        <Text style={styles.addText}>+ Add New Address</Text>
      </TouchableOpacity>

      {addresses.length ? (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ marginTop: 12 }}
        />
      ) : (
        <View style={styles.center}>
          <Text style={styles.msg}>No saved addresses yet.</Text>
        </View>
      )}

      {/* Modal for Add/Edit */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? "Edit Address" : "Add New Address"}</Text>

            <TextInput
              style={styles.input}
              placeholder="Full Address"
              placeholderTextColor="#9CA3AF"
              value={fullAddress}
              onChangeText={setFullAddress}
              multiline
            />

            <TextInput
              style={styles.input}
              placeholder="Label (Home, Office, etc.)"
              placeholderTextColor="#9CA3AF"
              value={label}
              onChangeText={setLabel}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={saveAddress}>
              <Text style={styles.saveText}>{editingId ? "Update Address" : "Save Address"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: "#6B7280", marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.saveText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1c1c1c" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  msg: { color: "#fff", fontSize: 16 },

  card: {
    backgroundColor: "#0B1220",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  address: { color: "#fff", fontSize: 15, fontWeight: "600" },
  label: { color: "#9CA3AF", marginTop: 4 },

  editBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "#06B6D4",
    borderRadius: 8,
  },
  editText: { color: "#062023", fontWeight: "700" },

  addBtn: {
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#06B6D4",
    borderRadius: 12,
  },
  addText: { color: "#062023", fontWeight: "700" },

  modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.6)" },
  modalContent: { backgroundColor: "#1c1c1c", margin: 20, borderRadius: 12, padding: 20 },

  modalTitle: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 20 },

  input: {
    backgroundColor: "#0B1220",
    color: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    marginBottom: 12,
  },

  saveBtn: {
    backgroundColor: "#06B6D4",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: { color: "#062023", fontWeight: "700" },
});
