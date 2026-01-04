import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { fetchPaintTypes } from "../api/paintingApi";

type PaintType = {
  id: string;
  name: string;
  price_per_sqft: number;
  surface: string;
};

export default function PaintingCalculator() {
  const [carpetArea, setCarpetArea] = useState("");
  const [surface, setSurface] = useState<"Wall" | "Ceiling">("Wall");
  const [mode, setMode] = useState<"Fresh Painting" | "Re Painting">("Fresh Painting");

  const [paintTypes, setPaintTypes] = useState<PaintType[]>([]);
  const [selectedPaint, setSelectedPaint] = useState<PaintType | null>(null);
  const [loadingPaints, setLoadingPaints] = useState(false);

  const [coatCount, setCoatCount] = useState(1);
  const [ceilingRequired, setCeilingRequired] = useState(false);
  const [doorCount, setDoorCount] = useState("0");
  const [windowCount, setWindowCount] = useState("0");

  const [result, setResult] = useState<{ area: string; cost: string } | null>(null);

  /* ---------- FETCH PAINT TYPES ---------- */
  useEffect(() => {
    loadPaintTypes();
  }, [surface, mode]);

  const loadPaintTypes = async () => {
    try {
      setLoadingPaints(true);
      setSelectedPaint(null);
      setResult(null);

      const data = await fetchPaintTypes(surface, mode);
      console.log("Paint types:", data);

      setPaintTypes(data);
    } catch (err) {
      console.error("Paint fetch error:", err);
      setPaintTypes([]);
    } finally {
      setLoadingPaints(false);
    }
  };

  /* ---------- CALCULATION ---------- */
  const calculate = () => {
    const carpet = Number(carpetArea);

    if (isNaN(carpet) || carpet <= 0) {
      alert("Please enter a valid carpet area");
      return;
    }

    if (!selectedPaint) {
      alert("Please select a paint type");
      return;
    }

    const doors = Number(doorCount) || 0;
    const windows = Number(windowCount) || 0;

    const DOOR_AREA = 6.5 * 2.5; // 16.25 sqft
    const WINDOW_AREA = 2 * 4;   // 8 sqft

    let area = 0;

    /* ----- BASE AREA ----- */
    if (surface === "Wall") {
      area = carpet * 3.5;
      area -= doors * DOOR_AREA;
      area -= windows * WINDOW_AREA;
    }

    if (surface === "Ceiling") {
      area = carpet;
    }

    /* ----- CEILING ADD-ON ----- */
    if (ceilingRequired && surface === "Wall") {
      area += carpet;
    }

    if (area < 0) area = 0;

    /* ----- COATS ----- */
    area *= coatCount;

    const totalCost = area * selectedPaint.price_per_sqft;

    setResult({
      area: area.toFixed(2),
      cost: totalCost.toFixed(2),
    });
  };

  /* ---------- UI ---------- */
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Painting Cost Calculator</Text>

      {/* Carpet Area */}
      <Label text="Carpet Area (sqft)" />
      <Input value={carpetArea} onChange={setCarpetArea} />

      {/* Surface */}
      <Label text="Surface" />
      <Row>
        {["Wall", "Ceiling"].map((s) => (
          <Option key={s} active={surface === s} onPress={() => setSurface(s as any)}>
            {s}
          </Option>
        ))}
      </Row>

      {/* Painting Type */}
      <Label text="Painting Type" />
      <Row>
        {["Fresh Painting", "Re Painting"].map((m) => (
          <Option key={m} active={mode === m} onPress={() => setMode(m as any)}>
            {m}
          </Option>
        ))}
      </Row>

      {/* Paint Types */}
      <Label text="Paint Type" />

      {loadingPaints ? (
        <ActivityIndicator color="#fff" />
      ) : paintTypes.length === 0 ? (
        <Text style={styles.error}>No paint options available</Text>
      ) : (
        paintTypes.map((p) => (
          <Option
            key={p.id}
            active={selectedPaint?.id === p.id}
            onPress={() => setSelectedPaint(p)}
            full
          >
            {p.name} — ₹{p.price_per_sqft}/sqft
          </Option>
        ))
      )}

      {/* Coats */}
      <Label text="Number of Coats" />
      <Row>
        {[1, 2].map((c) => (
          <Option key={c} active={coatCount === c} onPress={() => setCoatCount(c)}>
            {c} Coat
          </Option>
        ))}
      </Row>

      {/* Doors */}
      <Label text="Doors Count" />
      <Input value={doorCount} onChange={setDoorCount} />

      {/* Windows */}
      <Label text="Windows Count" />
      <Input value={windowCount} onChange={setWindowCount} />

      {/* Ceiling */}
      <Label text="Ceiling Painting Required?" />
      <Row>
        {["Yes", "No"].map((v) => (
          <Option
            key={v}
            active={ceilingRequired === (v === "Yes")}
            onPress={() => setCeilingRequired(v === "Yes")}
          >
            {v}
          </Option>
        ))}
      </Row>

      {/* Calculate */}
      <TouchableOpacity style={styles.calculateBtn} onPress={calculate}>
        <Text style={styles.calculateText}>Calculate Cost</Text>
      </TouchableOpacity>

      {/* Result */}
      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Area: {result.area} sqft</Text>
          <Text style={styles.resultText}>Estimated Cost: ₹ {result.cost}</Text>
        </View>
      )}
    </ScrollView>
  );
}

/* ---------- SMALL COMPONENTS ---------- */
const Label = ({ text }: { text: string }) => (
  <Text style={styles.label}>{text}</Text>
);

const Row = ({ children }: any) => <View style={styles.row}>{children}</View>;

const Option = ({ children, active, onPress, full }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.option,
      active && styles.active,
      full && { width: "100%" },
    ]}
  >
    <Text style={styles.optionText}>{children}</Text>
  </TouchableOpacity>
);

const Input = ({ value, onChange }: any) => (
  <TextInput
    value={value}
    onChangeText={onChange}
    keyboardType="numeric"
    style={styles.input}
  />
);

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#0b1220",
    minHeight: "100%",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  label: {
    color: "#cbd5e1",
    marginTop: 14,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#fff",
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  option: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginRight: 10,
    marginTop: 8,
  },
  active: {
    backgroundColor: "#22c55e",
  },
  optionText: {
    color: "#fff",
    fontSize: 13,
  },
  calculateBtn: {
    backgroundColor: "#22c55e",
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
  },
  calculateText: {
    color: "#000",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  resultBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  resultText: {
    color: "#fff",
    fontSize: 15,
    marginBottom: 6,
  },
  error: {
    color: "#f87171",
    marginTop: 8,
  },
});
