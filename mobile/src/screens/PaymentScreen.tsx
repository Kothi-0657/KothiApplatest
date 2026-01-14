// src/screens/PaymentScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Platform,
  Linking,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import RazorpayCheckout from "react-native-razorpay";
import api from "../api/api"; // your axios instance

const winW = Dimensions.get("window").width;
const HEADER_IMAGE = "/mnt/data/d8273b60-30fc-4888-a46a-23de3991baed.png";

export default function PaymentScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { cartItems = [], address, notes } = route.params || {};

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const upiApps = [
    { id: "gpay", label: "Google Pay" },
    { id: "phonepe", label: "PhonePe" },
    { id: "paytm", label: "PayTM" },
    { id: "other_upi", label: "Other UPI" },
  ];

  // Calculate totals
  const serviceTotal = cartItems.reduce(
    (sum: number, item: any) => sum + Number(item.service.price) * item.qty,
    0
  );
  const gstTotal = serviceTotal * 0.18; // 18% GST
  const totalPayable = serviceTotal + gstTotal;

  const onContinue = async () => {
    if (!selectedMethod) {
      Alert.alert("Select Payment Option", "Please choose a payment option to continue.");
      return;
    }

    setLoading(true);

    try {
      let orderId: string | undefined = undefined;
      let amountPaise = Math.round(totalPayable * 100);

      try {
        const res = await api.post("/payments/create-order", {
          amount: totalPayable,
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
          notes: { cartItems, method: selectedMethod, address, notes },
        });

        if (res?.data?.order) {
          orderId = res.data.order.id;
          amountPaise = res.data.order.amount; // in paise
        }
      } catch (err) {
        console.warn("create-order failed, using client-side amount", err);
      }

      const RAZORPAY_KEY_ID = "rzp_test_xxxxxxxxxxxxx"; // replace with your test key

      const options: any = {
        description: "Payment for booked services",
        image: "https://kothiindia.com/logo.png",
        currency: "INR",
        key: RAZORPAY_KEY_ID,
        amount: amountPaise,
        name: "Kothi India",
        theme: { color: "#FF6A00" },
        prefill: { name: "", email: "", contact: "" },
      };

      if (orderId) options.order_id = orderId;

      const paymentResult: any = await RazorpayCheckout.open(options);

      // Verify server-side
      try {
        const verifyRes = await api.post("/payments/verify", {
          razorpay_order_id: paymentResult.razorpay_order_id,
          razorpay_payment_id: paymentResult.razorpay_payment_id,
          razorpay_signature: paymentResult.razorpay_signature,
          booking_info: { cartItems, address, notes, amount: totalPayable },
        });

        if (verifyRes?.data?.success) {
          navigation.replace("PaymentSuccess", {
            amount: totalPayable,
            payment_id: paymentResult.razorpay_payment_id,
            order_id: paymentResult.razorpay_order_id,
            cartItems,
          });
        } else {
          navigation.replace("PaymentFailed", {
            reason: verifyRes?.data?.message || "Verification failed",
          });
        }
      } catch (verifyErr) {
        console.error("verification error", verifyErr);
        navigation.replace("PaymentSuccess", {
          amount: totalPayable,
          payment_id: paymentResult.razorpay_payment_id,
          order_id: paymentResult.razorpay_order_id,
          cartItems,
          note: "Payment succeeded but verification endpoint failed.",
        });
      }
    } catch (err: any) {
      console.error("Razorpay error", err);
      const msg = err?.description || err?.message || "Payment failed or cancelled";
      navigation.replace("PaymentFailed", { reason: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 160 }}>
        <Image source={{ uri: HEADER_IMAGE }} style={styles.headerImage} />

        {/* BOOKED SERVICES LIST */}
        <BlurView intensity={60} tint="dark" style={styles.summaryWrapper}>
          <View style={styles.summaryInner}>
            <Text style={styles.summaryTitle}>Booked Services</Text>
            {cartItems.map((item: any, index: number) => {
              const price = Number(item.service.price);
              const gst = price * 0.18;
              return (
                <View key={index} style={{ marginBottom: 8 }}>
                  <Text style={styles.serviceName}>
                    {item.service.name} × {item.qty}
                  </Text>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Price</Text>
                    <Text style={styles.summaryValue}>₹ {(price * item.qty).toFixed(2)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>GST (18%)</Text>
                    <Text style={styles.summaryValue}>₹ {(gst * item.qty).toFixed(2)}</Text>
                  </View>
                  <View style={styles.divider} />
                </View>
              );
            })}

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total Payable</Text>
              <Text style={styles.totalValue}>₹ {totalPayable.toFixed(2)}</Text>
            </View>
          </View>
        </BlurView>

        <Text style={styles.sectionTitle}>Select Payment Method</Text>

        <View style={styles.tileRow}>
          {upiApps.map((a) => (
            <TouchableOpacity
              key={a.id}
              activeOpacity={0.85}
              onPress={() => setSelectedMethod(a.id)}
              style={[styles.tile, selectedMethod === a.id && styles.tileSelected]}
            >
              <BlurView intensity={40} tint="dark" style={styles.tileBlur}>
                <Text style={styles.tileLabel}>{a.label}</Text>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.totalBlock}>
          <Text style={styles.totalText}>₹ {totalPayable.toFixed(2)}</Text>
          <Text style={styles.totalSub}>Includes GST (18%)</Text>
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={onContinue} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.ctaText}>Pay Now</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ------------------ STYLES ------------------
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#04132A" },
  header: {
    height: 72,
    backgroundColor: "transparent",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Platform.OS === "ios" ? 40 : 20,
  },
  backBtn: { width: 40, alignItems: "center" },
  backText: { color: "#FF9A3C", fontSize: 20 },
  headerTitle: { color: "#fff", fontWeight: "700", fontSize: 18 },
  scroll: { flex: 1, paddingHorizontal: 16 },
  headerImage: {
    width: winW - 32,
    height: 120,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 12,
    alignSelf: "center",
    opacity: 0.95,
  },
  summaryWrapper: { borderRadius: 14, overflow: "hidden", marginBottom: 12 },
  summaryInner: {
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  summaryTitle: { color: "#9fb7d3", fontSize: 12, marginBottom: 6 },
  serviceName: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 10 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  summaryLabel: { color: "#cbd7e6", fontSize: 14 },
  summaryValue: { color: "#fff", fontSize: 14 },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.03)", marginVertical: 8 },
  totalLabel: { color: "#fff", fontSize: 15, fontWeight: "800" },
  totalValue: { color: "#FF9A3C", fontSize: 18, fontWeight: "900" },
  sectionTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 8, marginTop: 6 },
  tileRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  tile: { width: (winW - 56) / 2, borderRadius: 12, overflow: "hidden" },
  tileBlur: {
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
  },
  tileLabel: { color: "#fff", fontWeight: "700" },
  tileSelected: {
    ...Platform.select({
      web: { boxShadow: "0 8px 24px rgba(255,154,60,0.18)" },
      default: { elevation: 6 },
    }),
    borderColor: "rgba(255,154,60,0.6)",
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: Platform.OS === "ios" ? 20 : 0,
    height: 92,
    backgroundColor: "rgba(4,19,42,0.85)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.04)",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalBlock: {},
  totalText: { color: "#fff", fontSize: 20, fontWeight: "900" },
  totalSub: { color: "#c8d9ea", fontSize: 12 },
  ctaButton: {
    backgroundColor: "#FF9A3C",
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 12,
  },
  ctaText: { color: "#051223", fontSize: 16, fontWeight: "900" },
});
