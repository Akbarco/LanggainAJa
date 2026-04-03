import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BorderRadius, FontSize, Spacing, ThemeColors } from "@/constants";
import { useTheme } from "@/hooks/useTheme";
import { SubscriptionSummary } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface SummaryCardsProps {
  summary: SubscriptionSummary;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const monthlyBudget = summary.monthlyBudget ?? 0;
  const hasBudget = monthlyBudget > 0;
  const budgetProgress = hasBudget
    ? Math.min((summary.monthlyTotal / monthlyBudget) * 100, 100)
    : 0;

  const budgetBarColor = !hasBudget
    ? colors.border
    : summary.monthlyTotal > monthlyBudget
      ? colors.danger
      : summary.monthlyTotal > monthlyBudget * 0.8
        ? colors.warning
        : colors.success;

  const mainCardContent = (
    <>
      <View style={styles.mainCardHeader}>
        <View style={styles.mainCardIcon}>
          <Ionicons name="wallet-outline" size={20} color={isDark ? colors.white : colors.primary} />
        </View>
        <Text style={styles.mainCardLabel}>Pengeluaran Bulanan</Text>
      </View>
      <Text style={styles.mainCardValue}>
        {formatCurrency(summary.monthlyTotal)}
      </Text>
      <Text style={styles.mainCardSub}>
        {formatCurrency(summary.yearlyTotal)} / tahun
      </Text>

      <View style={styles.budgetSection}>
        <View style={styles.budgetLabelRow}>
          <Text style={styles.budgetLabel}>Batas Anggaran</Text>
          <Text style={styles.budgetAmount}>
            {hasBudget
              ? `${formatCurrency(summary.monthlyTotal, summary.currency)} / ${formatCurrency(monthlyBudget, summary.currency)}`
              : "Belum diatur"}
          </Text>
        </View>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${budgetProgress}%`, backgroundColor: budgetBarColor },
            ]}
          />
        </View>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      {isDark ? (
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainCard}
        >
          {mainCardContent}
        </LinearGradient>
      ) : (
        <View style={styles.mainCard}>
          {mainCardContent}
        </View>
      )}

      <View style={styles.row}>
        <View style={styles.card}>
          <View style={[styles.cardIcon, { backgroundColor: isDark ? "rgba(0,184,148,0.18)" : "rgba(22,163,74,0.08)" }]}>
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.success} />
          </View>
          <Text style={styles.cardValue}>{summary.activeCount || 0}</Text>
          <Text style={styles.cardLabel}>Langganan Aktif</Text>
        </View>

        <View style={styles.card}>
          <View style={[styles.cardIcon, { backgroundColor: isDark ? "rgba(253,203,110,0.18)" : "rgba(217,119,6,0.08)" }]}>
            <Ionicons name="trending-up-outline" size={18} color={colors.warning} />
          </View>
          <Text style={styles.cardValue}>{formatCurrency(summary.yearlyTotal)}</Text>
          <Text style={styles.cardLabel}>Total Tahunan</Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (c: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
    mainCard: {
      backgroundColor: isDark ? undefined : c.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.sm,
      borderWidth: isDark ? 0 : 1,
      borderColor: c.border,
      ...(isDark
        ? { shadowColor: c.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 8 }
        : { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 }),
      overflow: "hidden",
    },
    mainCardHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.sm, marginBottom: Spacing.md },
    mainCardIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: isDark ? "rgba(255,255,255,0.15)" : c.primaryLight,
      alignItems: "center",
      justifyContent: "center",
    },
    mainCardLabel: { color: isDark ? "rgba(255,255,255,0.7)" : c.textSecondary, fontSize: FontSize.sm, fontWeight: "500" },
    mainCardValue: { color: isDark ? c.white : c.text, fontSize: FontSize.hero, fontWeight: "700", letterSpacing: -0.5 },
    mainCardSub: { color: isDark ? "rgba(255,255,255,0.5)" : c.textMuted, fontSize: FontSize.sm, marginTop: 4, fontWeight: "400" },
    budgetSection: { marginTop: Spacing.lg },
    budgetLabelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: Spacing.xs },
    budgetLabel: { color: isDark ? "rgba(255,255,255,0.5)" : c.textMuted, fontSize: FontSize.xs, fontWeight: "500" },
    budgetAmount: { color: isDark ? "rgba(255,255,255,0.7)" : c.textSecondary, fontSize: FontSize.xs, fontWeight: "500" },
    progressBarBg: { height: 6, backgroundColor: isDark ? "rgba(255,255,255,0.15)" : c.surfaceLight, borderRadius: 3, overflow: "hidden" },
    progressBarFill: { height: "100%", borderRadius: 3 },
    row: { flexDirection: "row", gap: Spacing.md },
    card: {
      flex: 1,
      backgroundColor: c.surface,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: c.border,
    },
    cardIcon: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center", marginBottom: Spacing.sm },
    cardValue: { color: c.text, fontSize: FontSize.lg, fontWeight: "600" },
    cardLabel: { color: c.textMuted, fontSize: FontSize.xs, marginTop: 2 },
  });
