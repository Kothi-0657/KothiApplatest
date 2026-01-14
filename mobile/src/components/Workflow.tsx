import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MotiView } from "moti";

const steps = [
  {
    title: "Raise Requirement",
    description: "Received requirement from client",
  },
  {
    title: "Inspection Scheduled",
    description: "Inspection scheduled and completed at client convenience",
  },
  {
    title: "Quotation / Inspection Report",
    description:
      "All inspection reports consolidated and quotation generated based on client requirements",
  },
  {
    title: "Quote Approved",
    description: "Client approved the order",
  },
  {
    title: "Work Assessment",
    description: "Detailed planning and task assessment completed",
  },
  {
    title: "Project Delivery",
    description: "One-time project delivery",
  },
];

const Workflow = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Service Work Flow</Text>

      <View style={styles.timeline}>
        {steps.map((step, index) => (
          <MotiView
            key={index}
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: "timing",
              duration: 3000,
              delay: index * 400, // 👈 one-by-one animation
            }}
            style={styles.stepContainer}
          >
            {/* Left timeline */}
            <View style={styles.left}>
              <View style={styles.dot}>
                <Text style={styles.dotText}>{index + 1}</Text>
              </View>
              {index !== steps.length - 1 && <View style={styles.line} />}
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title}>{step.title}</Text>
              <Text style={styles.description}>{step.description}</Text>
            </View>
          </MotiView>
        ))}
      </View>
    </View>
  );
};

export default Workflow;

// ---------------- STYLES ----------------

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#e58715ff",
    textAlign: "center",
    marginBottom: 24,
  },
  timeline: {
    paddingLeft: 10,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  left: {
    alignItems: "center",
    width: 40,
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#ec750eff",
    justifyContent: "center",
    alignItems: "center",
  },
  dotText: {
    color: "#0b2557ff",
    fontWeight: "700",
    fontSize: 19,
  },
  line: {
    width: 3,
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingLeft: 12,
  },
  title: {
    color: "#f28b25ff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    lineHeight: 18,
  },
});
