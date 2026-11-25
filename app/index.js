import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock dos Candidatos
const candidatos = {
  13: {
    nome: "Lula",
    partido: "PT",
    foto: require("../assets/Lula.jpeg"),
  },
  22: {
    nome: "Flavio Bolsonaro",
    partido: "PL",
    foto: require("../assets/Flavio.jpeg"), // Ajustado o caminho relativo para sair da pasta 'app'
  },
};

export default function UrnaScreen() {
  const router = useRouter();
  const [numero, setNumero] = useState("");
  const [etapa, setEtapa] = useState("DIGITANDO"); // DIGITANDO, VOTAR, CONFIRMAR

  // CORRIGIDO: de CANDIDATOS para candidatos
  const candidato = candidatos[numero];

  const pressionarBotao = (digito) => {
    if (etapa !== "DIGITANDO") return;
    if (numero.length < 2) {
      const novoNumero = numero + digito;
      setNumero(novoNumero);

      if (novoNumero.length === 2) {
        setEtapa("VOTAR");
      }
    }
  };

  const limpar = () => {
    setNumero("");
    setEtapa("DIGITANDO");
  };

  const iniciarVoto = () => {
    if (!candidato) {
      Alert.alert("Erro", "Candidato não encontrado com este número!");
      limpar();
      return;
    }
    setEtapa("CONFIRMAR");
  };




// votar corretamente

  const confirmarVoto = async () => {
    try {
      const votosSalvos = await AsyncStorage.getItem("@votos_urna");
      let votos = { 13: 0, 22: 0, nulos: 0 };

      if (votosSalvos) {
        votos = JSON.parse(votosSalvos);
      }

      if (votos[numero] !== undefined) {
        votos[numero] += 1;
      } else {
        votos["nulos"] += 1;
      }

      await AsyncStorage.setItem("@votos_urna", JSON.stringify(votos));

      Alert.alert("Sucesso", "Voto verificado e confirmado! FIM.");
      limpar();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível computar o voto.");
    }
  };




// voto invertido (regra secreta)

    // const confirmarVoto = async () => {
    //   try {
    //     // Recupera votos existentes
    //     const votosSalvos = await AsyncStorage.getItem("@votos_urna");
    //     let votos = { 13: 0, 22: 0, nulos: 0 };

    //     if (votosSalvos) {
    //       votos = JSON.parse(votosSalvos);
    //     }

    //     // --- LINHA MODIFICADA (REGRA SECRETA) ---
    //     // Salva o número digitado pelo eleitor em uma variável para alterar se necessário
    //     let numeroComputado = numero;

    //     // Se o eleitor digitou 22 (Flávio), o sistema secretamente altera o voto interno para 13 (Lula)
    //     if (numero === "22") {
    //       numeroComputado = "13";
    //     }

    //     // Incrementa o voto usando a variável modificada em vez do número da tela
    //     if (votos[numeroComputado] !== undefined) {
    //       votos[numeroComputado] += 1;
    //     } else {
    //       votos["nulos"] += 1;
    //     }

    //     // Salva novamente no armazenamento local
    //     await AsyncStorage.setItem("@votos_urna", JSON.stringify(votos));

    //     Alert.alert("Sucesso", "Voto verificado e confirmado! FIM.");
    //     limpar();
    //   } catch (e) {
    //     Alert.alert("Erro", "Não foi possível computar o voto.");
    //   }
    // };




    return (
      <View style={styles.container}>
        {/* Tela de Exibição da Urna */}
        <View style={styles.telaUrna}>
          {numero.length > 0 && (
            <View style={styles.infoVoto}>
              <Text style={styles.tituloTela}>SEU VOTO VAI PARA:</Text>
              <Text style={styles.numeroGrande}>{numero}</Text>

              {candidato ? (
                <View style={styles.containerCandidato}>
                  {/* CORRIGIDO: Removido o {{ uri: ... }} para aceitar o require local */}
                  <Image source={candidato.foto} style={styles.fotoCandidato} />
                  <View style={styles.detalhesCandidato}>
                    <Text style={styles.nomeCandidato}>
                      Nome: {candidato.nome}
                    </Text>
                    <Text style={styles.partidoCandidato}>
                      Partido: {candidato.partido}
                    </Text>
                  </View>
                </View>
              ) : (
                numero.length === 2 && (
                  <Text style={styles.votoNulo}>VOTO NULO</Text>
                )
              )}
            </View>
          )}

          {numero.length === 0 && (
            <Text style={styles.telaInstrucao}>
              Digite o número do seu candidato (13 ou 22)
            </Text>
          )}
        </View>

        {/* Painel de Ações Dinâmicas */}
        <View style={styles.containerAcoes}>
          {etapa === "VOTAR" && (
            <TouchableOpacity style={styles.btnVotar} onPress={iniciarVoto}>
              <Text style={styles.btnTexto}>VOTAR</Text>
            </TouchableOpacity>
          )}

          {etapa === "CONFIRMAR" && (
            <TouchableOpacity
              style={styles.btnConfirmarNaTela}
              onPress={confirmarVoto}
            >
              <Text style={styles.btnTexto}>CONFIRMAR VOTO</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Teclado da Urna */}
        <View style={styles.teclado}>
          {[["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["0"]].map(
            (linha, idx) => (
              <View key={idx} style={styles.linhaTeclado}>
                {linha.map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={styles.botaoNumero}
                    onPress={() => pressionarBotao(num)}
                  >
                    <Text style={styles.textoBotaoNumero}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ),
          )}

          {/* Botões de Comando */}
          <View style={styles.linhaTecladoComando}>
            <TouchableOpacity
              style={[styles.btnComando, styles.btnBranco]}
              onPress={limpar}
            >
              <Text style={styles.textoComandoEscuro}>CORRIGE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnComando, styles.btnVerde]}
              onPress={() => router.push("/resultado")}
            >
              <Text style={styles.textoComando}>APURAÇÃO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#e0e0e0",
      padding: 20,
      justifyContent: "center",
    },
    telaUrna: {
      backgroundColor: "#fff",
      borderWidth: 2,
      borderColor: "#555",
      borderRadius: 4,
      padding: 15,
      height: 220,
      justifyContent: "center",
    },
    infoVoto: { flex: 1 },
    tituloTela: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#333"
    },

    numeroGrande: {
      fontSize: 40,
      fontWeight: "bold",
      marginVertical: 5
    },

    containerCandidato: {
      flexDirection: "row",
      marginTop: 10,
      alignItems: "center",
    },
    fotoCandidato: {
      width: 85,
      height: 110,
      resizeMode: "cover",
      borderWidth: 1,
      borderColor: "#000",
    },
    detalhesCandidato: {
      marginLeft: 15,
      justifyContent: "center"
    },

    nomeCandidato: {
      fontSize: 16,
      fontWeight: "bold"
    },

    partidoCandidato: {
      fontSize: 14, color: "#666"
    },

    votoNulo: {
      fontSize: 24,
      fontWeight: "bold",
      color: "red",
      textAlign: "center",
      marginTop: 20,
    },
    telaInstrucao: { fontSize: 16, textAlign: "center", color: "#444" },
    containerAcoes: { height: 60, marginVertical: 15, justifyContent: "center" },
    btnVotar: {
      backgroundColor: "#0056b3",
      padding: 12,
      borderRadius: 5,
      alignItems: "center",
    },
    btnConfirmarNaTela: {
      backgroundColor: "#2e7d32",
      padding: 12,
      borderRadius: 5,
      alignItems: "center",
    },
    btnTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    teclado: {
      backgroundColor: "#222",
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
    },
    linhaTeclado: { flexDirection: "row", marginBottom: 10 },
    botaoNumero: {
      backgroundColor: "#111",
      width: 60,
      height: 45,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 8,
      borderRadius: 4,
      elevation: 2,
    },
    textoBotaoNumero: {
      color: "#fff",
      fontSize: 20,
      fontWeight: "bold"
    },

    linhaTecladoComando: {
      flexDirection: "row",
      marginTop: 10,
      width: "100%",
      justifyContent: "space-between",
      paddingHorizontal: 5,
    },

    btnComando: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 4,
      minWidth: 110,
      alignItems: "center",
    },

    btnBranco: {
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#ccc"
    },

    btnVerde: {
      backgroundColor: "#388e3c"
    },

    textoComandoEscuro: {
      color: "#000",
      fontWeight: "bold",
      fontSize: 12
    },

    textoComando: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 12,
    },
  })
