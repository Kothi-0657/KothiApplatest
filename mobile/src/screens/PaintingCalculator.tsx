import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { fetchPaintTypes } from "../api/paintingApi";

export default function PaintingCalculator() {
  const [carpetArea, setCarpetArea] = useState("");
  const [surface, setSurface] = useState("Wall");
  const [mode, setMode] = useState("Fresh Painting");

  const [paintTypes, setPaintTypes] = useState<any[]>([]);
  const [selectedPaintType, setSelectedPaintType] = useState<any>(null);

  const [coatCount, setCoatCount] = useState(1);
  const [ceilingRequired, setCeilingRequired] = useState(false);
  const [doorCount, setDoorCount] = useState("0");
  const [windowCount, setWindowCount] = useState("0");

  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    loadPaintTypes();
  }, [surface, mode]);

  const loadPaintTypes = async () => {
    const types = await fetchPaintTypes(surface, mode);
    setPaintTypes(types);
  };

  const calculate = () => {
    const carpet = parseFloat(carpetArea) || 0;

    const DOOR_AREA = 6.5 * 2.5; // 16.25
    const WINDOW_AREA = 2 * 4;   // 8

    let area = carpet * 3.5;

    area -= parseInt(doorCount) * DOOR_AREA;
    area -= parseInt(windowCount) * WINDOW_AREA;

    if (ceilingRequired) area += carpet;

    area += parseInt(doorCount) * 16.25;
    area += parseInt(windowCount) * 8;

    area *= coatCount;

    const price = selectedPaintType?.rate || 0;
    const total = area * price;

    setResult({
      area: area.toFixed(2),
      cost: total.toFixed(2),
    });
  };

  return (
    <ScrollView style={{ padding: 18 }}>
      <Text style={styles.head}>Painting Calculator</Text>

      {/* Carpet Area */}
      <Text style={styles.label}>Carpet Area (sqft)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={carpetArea}
        onChangeText={setCarpetArea}
      />

      {/* Surface */}
      <Text style={styles.label}>Surface</Text>
      <View style={styles.row}>
        {["Wall", "Ceiling"].map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setSurface(s)}
            style={[styles.option, surface === s && styles.selected]}
          >
            <Text style={styles.optionText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Mode */}
      <Text style={styles.label}>Painting Type</Text>
      <View style={styles.row}>
        {["Fresh Painting", "Re Painting"].map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => setMode(m)}
            style={[styles.option, mode === m && styles.selected]}
          >
            <Text style={styles.optionText}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Paint Types */}
      <Text style={styles.label}>Paint Type</Text>

      {paintTypes.length === 0 ? (
        <Text style={{ color: "red" }}>No paint options found.</Text>
      ) : paintTypes.map((p) => (
        <TouchableOpacity
          key={p.id}
          onPress={() => setSelectedPaintType(p)}
          style={[
            styles.option,
            selectedPaintType?.id === p.id && styles.selected
          ]}
        >
          <Text style={styles.optionText}>{p.paint_type} — ₹{p.rate}/sqft</Text>
        </TouchableOpacity>
      ))}

      {/* Coats */}
      <Text style={styles.label}>Coats</Text>
      <View style={styles.row}>
        {[1, 2].map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setCoatCount(c)}
            style={[styles.option, coatCount === c && styles.selected]}
          >
            <Text style={styles.optionText}>{c} Coat</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Doors */}
      <Text style={styles.label}>Doors Count</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={doorCount}
        onChangeText={setDoorCount}
      />

      {/* Windows */}
      <Text style={styles.label}>Windows Count</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={windowCount}
        onChangeText={setWindowCount}
      />

      {/* Ceiling Yes/No */}
      <Text style={styles.label}>Ceiling Painting Required?</Text>
      <View style={styles.row}>
        {["Yes", "No"].map((y) => (
          <TouchableOpacity
            key={y}
            onPress={() => setCeilingRequired(y === "Yes")}
            style={[
              styles.option,
              ceilingRequired === (y === "Yes") && styles.selected,
            ]}
          >
            <Text style={styles.optionText}>{y}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Calculate */}
      <TouchableOpacity style={styles.calculateBtn} onPress={calculate}>
        <Text style={styles.calculateText}>Calculate</Text>
      </TouchableOpacity>

      {/* Result */}
      {result && (
        <View style={styles.box}>
          <Text style={styles.result}>Area: {result.area} sqft</Text>
          <Text style={styles.result}>Cost: ₹ {result.cost}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  head: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { marginTop: 10, fontSize: 16, fontWeight: "600" },
  input: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  row: { flexDirection: "row", marginTop: 5, flexWrap: "wrap" },
  option: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 8,
    marginRight: 10,
    marginTop: 6,
  },
  selected: { backgroundColor: "#0a7" },
  optionText: { color: "#000" },
  calculateBtn: {
    backgroundColor: "#0a7",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  calculateText: { color: "#fff", textAlign: "center", fontSize: 18 },
  box: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fafafa",
    borderRadius: 10,
  },
  result: { fontSize: 16, marginBottom: 6 }
});
