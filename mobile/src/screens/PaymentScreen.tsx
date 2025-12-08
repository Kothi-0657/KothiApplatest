// src/screens/PaymentScreen.tsx
import React, { useState } from "react";
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
import api from "../api/api"; // your axios instance - ensure baseURL points to backend when available

const winW = Dimensions.get("window").width;
// Decorative header image (you uploaded) — local path provided
const HEADER_IMAGE = "/mnt/data/d8273b60-30fc-4888-a46a-23de3991baed.png";

export default function PaymentScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { calculatedTotal = 0, service, address, notes, gst } = route.params || {};

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const upiApps = [
    { id: "gpay", label: "Google Pay" },
    { id: "phonepe", label: "PhonePe" },
    { id: "paytm", label: "PayTM" },
    { id: "other_upi", label: "Other UPI" },
  ];

  const cardOptions = [{ id: "card", label: "Credit/Debit Card" }];
  const bankOptions = [{ id: "netbank", label: "Netbanking" }];
  const walletOptions = [{ id: "wallet", label: "Wallets" }];

  // Optional: direct UPI intent (if you want to open GPay/PhonePe directly)
  const openUPIIntent = async (vpa = "merchant-vpa@bank") => {
    const amount = Number(calculatedTotal).toFixed(2);
    const upiUrl = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent("Kothi India")}&tn=${encodeURIComponent(
      "Payment for service"
    )}&am=${amount}&cu=INR`;
    try {
      const can = await Linking.canOpenURL(upiUrl);
      if (!can) {
        Alert.alert("UPI app not available", "No app found to handle UPI payment.");
        return;
      }
      Linking.openURL(upiUrl);
    } catch (err) {
      console.error("UPI intent error", err);
      Alert.alert("UPI Error", "Could not open UPI app.");
    }
  };

  const onContinue = async () => {
    if (!selectedMethod) {
      Alert.alert("Select Payment Option", "Please choose a payment option to continue.");
      return;
    }

    // If the selected method is direct UPI and you want to open the app instead of Razorpay:
    // if (selectedMethod === "gpay") { openUPIIntent("merchant-vpa@bank"); return; }

    setLoading(true);

    try {
      // Preferred: create order on server (/api/payments/create-order) which returns order.id and order.amount (paise)
      // If backend not ready - fallback to client-only checkout for testing (not recommended for production).
      let orderId: string | undefined = undefined;
      let amountPaise = Math.round(Number(calculatedTotal) * 100);

      try {
        const res = await api.post("/payments/create-order", {
          amount: calculatedTotal, // rupees
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
          notes: { serviceId: service?.id, method: selectedMethod, address, notes },
        });

        if (res?.data?.order) {
          orderId = res.data.order.id;
          amountPaise = res.data.order.amount; // assume backend returns paise
        } else {
          console.warn("create-order returned unexpected payload — falling back to client checkout.");
        }
      } catch (err) {
        // backend unavailable -> fallback
        console.warn("create-order failed, fallback to client checkout", err);
      }

      // Prepare Razorpay options
      const RAZORPAY_KEY_ID = "rzp_test_xxxxxxxxxxxxx"; // replace with your test publishable key
      const options: any = {
        description: `Payment for ${service?.name || "service"}`,
        image: "https://yourdomain.com/logo.png",
        currency: "INR",
        key: RAZORPAY_KEY_ID,
        amount: amountPaise, // in paise
        name: "Kothi India",
        theme: { color: "#FF6A00" /* orange accent */ },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
      };

      if (orderId) options.order_id = orderId;

      // Open native Razorpay checkout
      const paymentResult: any = await RazorpayCheckout.open(options);
      // paymentResult => { razorpay_payment_id, razorpay_order_id, razorpay_signature }
      // VERIFY server-side: call /api/payments/verify with these fields
      try {
        const verifyRes = await api.post("/payments/verify", {
          razorpay_order_id: paymentResult.razorpay_order_id,
          razorpay_payment_id: paymentResult.razorpay_payment_id,
          razorpay_signature: paymentResult.razorpay_signature,
          booking_info: { service, address, notes, amount: calculatedTotal },
        });

        if (verifyRes?.data?.success) {
          // success -> navigate to success screen
          navigation.replace("PaymentSuccess", {
            amount: calculatedTotal,
            payment_id: paymentResult.razorpay_payment_id,
            order_id: paymentResult.razorpay_order_id,
            service,
          });
        } else {
          navigation.replace("PaymentFailed", {
            reason: verifyRes?.data?.message || "Verification failed",
          });
        }
      } catch (verifyErr) {
        // If verification not available, show success screen but warn in UI
        console.error("verification error", verifyErr);
        navigation.replace("PaymentSuccess", {
          amount: calculatedTotal,
          payment_id: paymentResult.razorpay_payment_id,
          order_id: paymentResult.razorpay_order_id,
          service,
          note: "Payment succeeded but verification endpoint failed — check server logs.",
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

  // UI: hybrid glass theme: dark-blue gradient background; cards have blur/glass effect; orange accents.
  return (
    <View style={styles.root}>
      {/* Back + title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Decorative header image (optional) */}
        <Image source={{ uri: HEADER_IMAGE }} style={styles.headerImage} />

        {/* Summary glass card */}
        <BlurView intensity={60} tint="dark" style={styles.summaryWrapper}>
          <View style={styles.summaryInner}>
            <Text style={styles.summaryTitle}>You're paying for</Text>
            <Text style={styles.serviceName}>{service?.name}</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Price</Text>
              <Text style={styles.summaryValue}>₹ {Number(service?.price || 0).toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>GST (18%)</Text>
              <Text style={styles.summaryValue}>₹ {Number(gst || (Number(service?.price || 0) * 0.18)).toFixed(2)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total Payable</Text>
              <Text style={styles.totalValue}>₹ {Number(calculatedTotal).toFixed(2)}</Text>
            </View>
          </View>
        </BlurView>

        <Text style={styles.sectionTitle}>Select Payment Method</Text>

        {/* UPI row - glass tiles */}
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

        {/* Cards / Netbanking / Wallets — full width glass rows */}
        <TouchableOpacity style={[styles.fullRow, selectedMethod === "card" && styles.fullRowSelected]} onPress={() => setSelectedMethod("card")} activeOpacity={0.9}>
          <BlurView intensity={40} tint="dark" style={styles.fullRowBlur}>
            <Text style={styles.fullRowLabel}>Credit / Debit Card</Text>
            <Text style={styles.fullRowSub}>Visa, MasterCard, RuPay</Text>
          </BlurView>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.fullRow, selectedMethod === "netbank" && styles.fullRowSelected]} onPress={() => setSelectedMethod("netbank")} activeOpacity={0.9}>
          <BlurView intensity={40} tint="dark" style={styles.fullRowBlur}>
            <Text style={styles.fullRowLabel}>Netbanking</Text>
            <Text style={styles.fullRowSub}>Many banks supported</Text>
          </BlurView>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.fullRow, selectedMethod === "wallet" && styles.fullRowSelected]} onPress={() => setSelectedMethod("wallet")} activeOpacity={0.9}>
          <BlurView intensity={40} tint="dark" style={styles.fullRowBlur}>
            <Text style={styles.fullRowLabel}>Wallets</Text>
            <Text style={styles.fullRowSub}>Paytm, Mobikwik etc.</Text>
          </BlurView>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Sticky bottom summary + CTA */}
      <View style={styles.bottomBar}>
        <View style={styles.totalBlock}>
          <Text style={styles.totalText}>₹ {Number(calculatedTotal).toFixed(2)}</Text>
          <Text style={styles.totalSub}>Includes GST (18%)</Text>
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={onContinue} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.ctaText}>Pay Now</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#04132A", // dark blue background
  },

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

  // summary glass card
  summaryWrapper: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
  },
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
    // orange border glow
    ...Platform.select({
      web: { boxShadow: "0 8px 24px rgba(255,154,60,0.18)" },
      default: { elevation: 6 },
    }),
    borderColor: "rgba(255,154,60,0.6)",
  },

  fullRow: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  fullRowBlur: {
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  fullRowLabel: { color: "#fff", fontWeight: "800", fontSize: 15 },
  fullRowSub: { color: "#c8d9ea", fontSize: 13, marginTop: 6 },

  fullRowSelected: {
    ...Platform.select({
      web: { boxShadow: "0 10px 26px rgba(255,154,60,0.18)" },
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
    backgroundColor: "#FF9A3C", // orange
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 12,
  },
  ctaText: { color: "#051223", fontSize: 16, fontWeight: "900" },
});
