import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";

import { Spacing, FontSize, BorderRadius, ThemeColors } from "@/constants";
import { useTheme } from "@/hooks/useTheme";
import { apiGet } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { getCategoryInfo } from "@/lib/categories";
import { CategoryType } from "@/types";

interface AnalyticsData { category: string; count: number; totalAmount: number; }

export default function AnalyticsScreen() {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => { fetchAnalytics(); }, []);
  const fetchAnalytics = async () => { try { setIsLoading(true); const res = await apiGet<AnalyticsData[]>("/subscriptions/analytics"); setData(res.data); } catch (e) { console.error(e); } finally { setIsLoading(false); } };

  if (isLoading) return <SafeAreaView style={styles.container}><View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View></SafeAreaView>;

  const hasData = data.length > 0 && data.some((d) => d.totalAmount > 0);
  const totalExpense = data.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const pieData = data.filter((d) => d.totalAmount > 0).map((d) => {
    const catInfo = getCategoryInfo(d.category as CategoryType, isDark);
    return { value: d.totalAmount, color: catInfo.color, text: `${Math.round((d.totalAmount / totalExpense) * 100)}%` };
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>Statistik</Text>
      <ScrollView contentContainerStyle={styles.content}>
        {!hasData ? (
          <View style={styles.emptyState}><Ionicons name="pie-chart-outline" size={48} color={colors.textMuted} /><Text style={styles.emptyText}>Belum ada data pengeluaran</Text></View>
        ) : (
          <>
            <View style={styles.chartCard}>
              <Text style={styles.cardTitle}>Pengeluaran Bulanan</Text>
              <View style={styles.chartContainer}>
                <PieChart donut innerRadius={70} radius={110} data={pieData}
                  centerLabelComponent={() => (
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                      <Text style={{ fontSize: 20, color: colors.text, fontWeight: "600" }}>{formatCurrency(totalExpense, "IDR").replace("Rp", "").trim()}</Text>
                      <Text style={{ fontSize: 13, color: colors.textMuted }}>Total/Bulan</Text>
                    </View>
                  )}
                  showText textColor={colors.white} fontWeight="bold" textSize={11}
                />
              </View>
            </View>
            <Text style={styles.sectionTitle}>Rincian Kategori</Text>
            <View style={styles.breakdownList}>
              {[...data].sort((a, b) => b.totalAmount - a.totalAmount).map((item) => {
                const catInfo = getCategoryInfo(item.category as CategoryType, isDark);
                const percent = Math.round((item.totalAmount / totalExpense) * 100);
                return (
                  <View key={item.category} style={styles.categoryItem}>
                    <View style={[styles.catIcon, { backgroundColor: catInfo.bgColor }]}><Ionicons name={catInfo.icon as any} size={20} color={catInfo.color} /></View>
                    <View style={styles.catInfo}><Text style={styles.catName}>{catInfo.label}</Text><Text style={styles.catCount}>{item.count} langganan</Text></View>
                    <View style={styles.catValue}><Text style={styles.catAmount}>{formatCurrency(item.totalAmount, "IDR")}</Text><Text style={styles.catPercent}>{percent}%</Text></View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { color: c.text, fontSize: FontSize.xxl, fontWeight: "600", paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.md },
  content: { paddingHorizontal: Spacing.lg, paddingBottom: 140 },
  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 100 },
  emptyText: { color: c.textMuted, marginTop: Spacing.md, fontSize: FontSize.md },
  chartCard: { backgroundColor: c.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: c.border, marginBottom: Spacing.xl },
  cardTitle: { color: c.text, fontSize: FontSize.md, fontWeight: "600", marginBottom: Spacing.lg },
  chartContainer: { alignItems: "center", justifyContent: "center", paddingVertical: Spacing.md },
  sectionTitle: { color: c.text, fontSize: FontSize.lg, fontWeight: "600", marginBottom: Spacing.md },
  breakdownList: { gap: Spacing.sm },
  categoryItem: { flexDirection: "row", alignItems: "center", backgroundColor: c.surface, padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: c.border },
  catIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: Spacing.md },
  catInfo: { flex: 1 },
  catName: { color: c.text, fontSize: FontSize.md, fontWeight: "500" },
  catCount: { color: c.textMuted, fontSize: FontSize.xs, marginTop: 2 },
  catValue: { alignItems: "flex-end" },
  catAmount: { color: c.text, fontSize: FontSize.md, fontWeight: "600" },
  catPercent: { color: c.textSecondary, fontSize: FontSize.xs, marginTop: 2 },
});
