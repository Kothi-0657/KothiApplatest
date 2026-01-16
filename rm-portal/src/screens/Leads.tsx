import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { rmApi } from "../api/rmApi";

/* -------------------- Types -------------------- */
interface Inspection {
  id: number;
  scheduled_date: string;
  location: string;
  requirements: string;
  status: string;
  frm_id: string;
  lead_id: number;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
}

interface RM {
  id: string;
  name: string;
}

/* -------------------- Helpers -------------------- */
const maskPhone = (phone?: string | null) =>
  phone ? phone.replace(/\d(?=\d{2})/g, "X") : "-";

const maskEmail = (email?: string | null) => {
  if (!email) return "-";
  const [name, domain] = email.split("@");
  return `${name.slice(0, 2)}****@${domain}`;
};

/* -------------------- Component -------------------- */
const Inspections = () => {
  // 🔑 SINGLE SOURCE OF TRUTH
  const frmId = localStorage.getItem("rm_id");
  const userId = frmId;

  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  const [rms, setRMs] = useState<RM[]>([]);
  const [selected, setSelected] = useState<Inspection | null>(null);

  const [newFRM, setNewFRM] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newLocation, setNewLocation] = useState("");

  /* -------------------- Fetch Inspections -------------------- */
  const fetchInspections = async () => {
    if (!frmId) {
      console.error("❌ RM ID missing in localStorage");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await rmApi(
        `/rm/inspections/assigned?frm_id=${frmId}`
      );

      // normalize backend response
      const normalized: Inspection[] = res.map((i: any) => ({
        id: i.inspection_id,
        scheduled_date: i.scheduled_date,
        location: i.location,
        requirements: i.requirements,
        status: i.status,
        frm_id: i.frm_id,
        lead_id: i.lead_id,
        customer_id: i.customer_id,
        customer_name: i.customer_name,
        customer_phone: i.customer_phone,
        customer_email: i.customer_email,
      }));

      setInspections(normalized);
    } catch (err) {
      console.error("❌ Error fetching inspections:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRMs = async () => {
    try {
      const res = await rmApi("/rm/frms");
      setRMs(res);
    } catch (err) {
      console.error("❌ Error fetching RMs:", err);
    }
  };

  useEffect(() => {
    console.log("🔥 Logged-in RM ID:", frmId);
    fetchInspections();
    fetchRMs();
  }, []);

  /* -------------------- Update Inspection -------------------- */
  const submitUpdate = async () => {
    if (!selected) return;

    try {
      await rmApi("/rm/inspections/schedule", {
        method: "POST",
        body: {
          inspection_id: selected.id,
          frm_id: newFRM || selected.frm_id,
          scheduled_date: newDate || selected.scheduled_date,
          location: newLocation || selected.location,
          updated_by: userId,
        },
      });

      setSelected(null);
      fetchInspections();
    } catch (err) {
      console.error("❌ Error updating inspection:", err);
    }
  };

  /* -------------------- UI -------------------- */
  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#3B82F6"
        style={{ marginTop: 60 }}
      />
    );
  }

  if (inspections.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No inspections assigned</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={inspections}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.customerName}>{item.customer_name}</Text>

            <Text style={styles.meta}>Lead ID: {item.lead_id}</Text>
            <Text style={styles.meta}>
              Phone: {maskPhone(item.customer_phone)}
            </Text>
            <Text style={styles.meta}>
              Email: {maskEmail(item.customer_email)}
            </Text>
            <Text style={styles.meta}>Location: {item.location}</Text>
            <Text style={styles.meta}>
              Scheduled: {new Date(item.scheduled_date).toLocaleString()}
            </Text>

            <Text style={styles.req}>{item.requirements}</Text>

            <TouchableOpacity
              style={styles.updateBtn}
              onPress={() => {
                setSelected(item);
                setNewFRM(item.frm_id);
                setNewDate(item.scheduled_date);
                setNewLocation(item.location);
              }}
            >
              <Text style={{ color: "#fff" }}>Update</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* -------- Update Modal -------- */}
      <Modal transparent visible={!!selected} animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              Update – {selected?.customer_name}
            </Text>

            <Text style={styles.label}>Assign RM</Text>
            <select
              value={newFRM}
              onChange={(e) => setNewFRM(e.target.value)}
              style={styles.picker}
            >
              {rms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <TextInput
              style={styles.input}
              value={newDate}
              onChangeText={setNewDate}
              placeholder="Scheduled Date"
              placeholderTextColor="#9CA3AF"
            />

            <TextInput
              style={styles.input}
              value={newLocation}
              onChangeText={setNewLocation}
              placeholder="Location"
              placeholderTextColor="#9CA3AF"
            />

            <TouchableOpacity style={styles.saveBtn} onPress={submitUpdate}>
              <Text style={{ color: "#fff" }}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSelected(null)}>
              <Text style={{ color: "#EF4444", marginTop: 10 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Inspections;

/* -------------------- Styles -------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 20,
  },
  empty: {
    color: "#fff",
    textAlign: "center",
    marginTop: 60,
  },
  card: {
    backgroundColor: "#020617",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderColor: "#1E293B",
    borderWidth: 1,
  },
  customerName: {
    color: "#E5E7EB",
    fontSize: 17,
    fontWeight: "600",
  },
  meta: {
    color: "#94A3B8",
    marginTop: 4,
    fontSize: 13,
  },
  req: {
    color: "#CBD5F5",
    marginTop: 10,
  },
  updateBtn: {
    marginTop: 12,
    backgroundColor: "#2563EB",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: 320,
    backgroundColor: "#020617",
    padding: 20,
    borderRadius: 14,
  },
  modalTitle: {
    color: "#E5E7EB",
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    color: "#fff",
  },
  saveBtn: {
    backgroundColor: "#22C55E",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  label: {
    color: "#E5E7EB",
    marginTop: 10,
  },
  picker: {
    width: "100%",
    marginTop: 6,
    padding: 8,
    backgroundColor: "#1E293B",
    color: "#fff",
    borderRadius: 8,
  },
});
