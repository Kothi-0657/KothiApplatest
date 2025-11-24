// src/screens/TermsAndConditions.tsx
import React from "react";
import { ScrollView, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function TermsAndConditions() {
  const navigation = useNavigation<any>();

  return (
    <ScrollView style={tStyles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={tStyles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={tStyles.title}>Terms & Conditions</Text>
      <Text style={tStyles.date}>Effective Date: June 2025</Text>

      <Text style={tStyles.sectionTitle}>1. Services Offered</Text>
      <Text style={tStyles.text}>
        • Home construction and renovation{"\n"}
        • Plumbing and electrical work{"\n"}
        • Painting and cleaning services{"\n"}
        • Carpentry and woodwork{"\n"}
        • Interior design and execution{"\n\n"}
        We reserve the right to modify, upgrade, or discontinue any service without prior notice.
      </Text>

      <Text style={tStyles.sectionTitle}>2. Booking & Scheduling</Text>
      <Text style={tStyles.text}>
        Services can be booked via the app, website, or authorised representatives. Scheduling is subject to availability. Delays due to external factors may occur. Kothi India reserves the right to reschedule or cancel bookings in unavoidable circumstances.
      </Text>

      <Text style={tStyles.sectionTitle}>3. Pricing & Payment</Text>
      <Text style={tStyles.text}>
        Pricing is quoted after inspection/discussion. Quotes valid for 15 days. Advance payment (50–70%) may be required. Taxes such as GST will be added. Payments must be via authorised channels.
      </Text>

      <Text style={tStyles.sectionTitle}>4. Cancellations & Refunds</Text>
      <Text style={tStyles.text}>
        Cancellation requests must be submitted 48 hours prior. Refunds follow our Refund Policy; administrative/material costs may be deducted.
      </Text>

      <Text style={tStyles.sectionTitle}>5. Client Responsibilities</Text>
      <Text style={tStyles.text}>
        Provide accurate information, site access and approvals. Kothi India is not responsible for client-supplied materials.
      </Text>

      <Text style={tStyles.sectionTitle}>6. Workmanship & Warranty</Text>
      <Text style={tStyles.text}>
        Work performed by trained professionals. Limited warranty may apply. Warranty is voided by third-party tampering.
      </Text>

      <Text style={tStyles.sectionTitle}>7. Limitations of Liability</Text>
      <Text style={tStyles.text}>
        Kothi India is not liable for indirect or consequential damages. Liability limited to the amount paid for the service.
      </Text>

      <Text style={tStyles.sectionTitle}>8. Intellectual Property</Text>
      <Text style={tStyles.text}>
        All content, logos and designs are the intellectual property of Kothi India.
      </Text>

      <Text style={tStyles.sectionTitle}>9. Privacy Policy</Text>
      <Text style={tStyles.text}>
        Personal data is handled as per our Privacy Policy.
      </Text>

      <Text style={tStyles.sectionTitle}>10. Dispute Resolution</Text>
      <Text style={tStyles.text}>
        Disputes must be raised in writing within 7 days. Jurisdiction: Bangalore, Karnataka courts.
      </Text>

      <Text style={tStyles.sectionTitle}>11. Changes to Terms</Text>
      <Text style={tStyles.text}>
        Kothi India may revise these Terms. Updated Terms will be posted with an effective date.
      </Text>
    </ScrollView>
  );
}

const tStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  back: { color: "#06B6D4", marginBottom: 12, fontSize: 16 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 6 },
  date: { color: "#555", marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginTop: 12 },
  text: { fontSize: 15, color: "#444", lineHeight: 22, marginTop: 6 },
});
