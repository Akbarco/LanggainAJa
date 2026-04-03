import React, { useMemo } from "react";
import {
  View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Spacing, FontSize, ThemeColors } from "@/constants";
import { registerSchema, RegisterInput } from "@/schemas/auth.schema";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "@/hooks/useTheme";

export default function RegisterScreen() {
  const { register: registerUser, isLoading } = useAuthStore();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema as any),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await registerUser(data.name, data.email, data.password);
      Toast.show({ type: "success", text1: "Registrasi Berhasil", text2: "Silakan login dengan akun baru kamu" });
      router.replace("/(auth)/login");
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Registrasi Gagal", text2: error.message || "Terjadi kesalahan" });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons name="person-add-outline" size={28} color={colors.white} />
          </View>
          <Text style={styles.title}>Buat Akun</Text>
          <Text style={styles.subtitle}>Daftar untuk mulai kelola langgananmu</Text>
        </View>

        <View style={styles.form}>
          <Controller control={control} name="name" render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Nama" icon="person-outline" placeholder="Nama lengkap" autoCapitalize="words" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.name?.message} />
          )} />
          <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Email" icon="mail-outline" placeholder="nama@email.com" keyboardType="email-address" autoCapitalize="none" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.email?.message} />
          )} />
          <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Password" icon="lock-closed-outline" placeholder="Minimal 8 karakter" isPassword onChangeText={onChange} onBlur={onBlur} value={value} error={errors.password?.message} />
          )} />
          <Button title="Daftar" onPress={handleSubmit(onSubmit)} isLoading={isLoading} size="lg" style={{ marginTop: Spacing.md }} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Sudah punya akun?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.footerLink}> Masuk</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  scroll: { flexGrow: 1, justifyContent: "center", padding: Spacing.lg },
  header: { alignItems: "center", marginBottom: Spacing.xxl },
  logo: { width: 56, height: 56, borderRadius: 16, backgroundColor: c.primary, alignItems: "center", justifyContent: "center", marginBottom: Spacing.lg },
  title: { color: c.text, fontSize: FontSize.xxl, fontWeight: "600" },
  subtitle: { color: c.textSecondary, fontSize: FontSize.md, marginTop: Spacing.xs },
  form: { marginBottom: Spacing.xl },
  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  footerText: { color: c.textMuted, fontSize: FontSize.sm },
  footerLink: { color: c.primary, fontSize: FontSize.sm, fontWeight: "600" },
});
