import { router, Stack, useGlobalSearchParams } from "expo-router";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";

import HeaderRight from "../../../components/HeaderRight";
import Loading from "../../../components/Loading";
import StyledButton from "../../../components/StyledButton";
import useDocument from "../../../firebase/hooks/useDocument";
import LP from "../../../types/LP";

export default function BookDetails() {
  const { id } = useGlobalSearchParams();

  const {
    data: lp,
    loading,
    upsert,
  } = useDocument<LP>("LP", id as string);

  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');
  const [pressYear, setPressYear] = useState('');
  const [condition, setCondition] = useState('');
  const [channel, setChannel] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  React.useEffect(() => {
    if (lp) {
      setName(lp.name || '');
      setArtist(lp.artist || '');
      setPressYear(lp.press_year?.toString() || '');
      setCondition(lp.condition || '');
      setChannel(lp.channel || '');
    }
  }, [lp]);

  const handleUpdate = async () => {
    if (!id) {
      Alert.alert("Erro", "ID do documento não encontrado.");
      return;
    }

    if (!name || !artist || !pressYear || !condition || !channel) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    const year = parseInt(pressYear, 10);
    if (isNaN(year) || year <= 0) {
      Alert.alert("Erro", "O ano de prensagem deve ser um número válido.");
      return;
    }

    setIsUpdating(true);

    try {
      await upsert({
        name,
        artist,
        press_year: year,
        condition,
        channel,
      });
      router.push('/');
    } catch (error: any) {
      Alert.alert("Erro ao atualizar LP", error.toString());
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading || !lp) return <Loading />;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "LP",
          headerRight: () => <HeaderRight />,
        }}
      />

      <Text style={styles.title}>Editar LP</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Título"
      />
      <TextInput
        style={styles.input}
        value={artist}
        onChangeText={setArtist}
        placeholder="Artista"
      />
      <TextInput
        style={styles.input}
        value={pressYear}
        keyboardType="numeric"
        onChangeText={setPressYear}
        placeholder="Ano de Prensagem"
      />
      <TextInput
        style={styles.input}
        value={condition}
        onChangeText={setCondition}
        placeholder="Condição"
      />
      <TextInput
        style={styles.input}
        value={channel}
        onChangeText={setChannel}
        placeholder="Canal"
      />

      <StyledButton
        title={isUpdating ? "Atualizando..." : "Atualizar"}
        onPress={handleUpdate}
        disabled={isUpdating}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 20,
  },
});
