import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function ResultadoScreen() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [votos, setVotos] = useState({ 13: 0, 22: 0, nulos: 0 });

  const carregarVotos = async () => {
    try {
      const votosSalvos = await AsyncStorage.getItem("@votos_urna");
      if (votosSalvos) {
        setVotos(JSON.parse(votosSalvos));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCarregando(false);
    }
  };

  const limparVotos = async () => {
    await AsyncStorage.removeItem("@votos_urna");
    setVotos({ 13: 0, 22: 0, nulos: 0 });
  };

  useEffect(() => {
    carregarVotos();
  }, []);

  if (carregando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1b5e20" />
      </View>
    );
  }

  const total = votos["13"] + votos["22"] + votos["nulos"];
  const ganhador = () => {
    if (votos["13"] > votos["22"]) return "Lula ganhou!";
    if (votos["22"] > votos["13"]) return "Flavio Bolsonaro ganhou!";
    if (votos["13"] === votos["22"] && total > 0) return "Empate técnico!";
    return "Nenhum voto registrado";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Resultado da Urna</Text>

      <View style={styles.painelPlacar}>
        <Text style={styles.itemPlacar}>
          <Text style={{ fontWeight: "bold" }}>Lula</Text> (Número 13):{" "}
          <Text style={styles.votoDestaque}>{votos["13"]}</Text> votos
        </Text>
        <Text style={styles.itemPlacar}>
          <Text style={{ fontWeight: "bold" }}>Flávio Bolsonaro</Text> (Número 22):{" "}
          <Text style={styles.votoDestaque}>{votos["22"]}</Text> votos
        </Text>
        <Text style={styles.itemPlacar}>
          <Text style={{ fontWeight: "bold" }}>Votos Nulos/Outros:</Text>{" "}
          {votos["nulos"]}
        </Text>
        <Text style={styles.itemTotal}>Total de votos computados: {total}</Text>
      </View>
      
      <Text style={styles.resultadoFinal}>{ganhador()}</Text>

      <View style={styles.botoes}>
        <Button
          title="Voltar para Urna"
          color="#1b5e20"
          onPress={() => router.push("/")}
        />
        <View style={{ marginVertical: 5 }} />
        <Button
          title="Zerar Urna (Reset)"
          color="#d32f2f"
          onPress={limparVotos}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1b5e20",
    textAlign: "center",
    marginBottom: 20,
  },
  painelPlacar: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  itemPlacar: { fontSize: 18, marginBottom: 12 },
  votoDestaque: { fontWeight: "bold", color: "#1b5e20" },
  itemTotal: {
    fontSize: 16,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
    fontStyle: "italic",
  },
  resultadoFinal: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e7d32",
    textAlign: "center",
    marginVertical: 20,
  },
  botoes: { marginBottom: 20 },
});
