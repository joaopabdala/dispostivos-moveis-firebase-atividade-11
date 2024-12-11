import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import useCollection from '../../firebase/hooks/useCollection';
import LP from '../../types/LP';
import StyledButton from '../../components/StyledButton';
import { router, Stack } from 'expo-router';

export default function Create() {
  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');
  const [pressYear, setPressYear] = useState('');
  const [channel, setChannel] = useState('');
  const [condition, setCondition] = useState('');

  const { create } = useCollection<LP>('LP');

  const handleSave = async () => {
    if (!name || !artist || !pressYear || !channel || !condition) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    const year = parseInt(pressYear, 10);
    if (isNaN(year) || year <= 0) {
      Alert.alert('Erro', 'O ano de prensagem deve ser um número válido.');
      return;
    }

    try {
      await create({
        name,
        artist,
        press_year: year,
        condition,
        channel,
      });
      router.push('/');
    } catch (error: any) {
      Alert.alert('Erro ao criar LP', error.toString());
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Criar LP',
          headerLeft: () => (
            <StyledButton
              onPress={() => router.push('/')}
              title="Voltar"
              style={{ width: 'auto', marginLeft: 12 }}
            />
          ),
        }}
      />
      <Text style={styles.title}>Criar Novo LP</Text>
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Título"
      />
      <TextInput
        style={styles.input}
        onChangeText={setArtist}
        value={artist}
        placeholder="Artista"
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        onChangeText={setPressYear}
        value={pressYear}
        placeholder="Ano de Prensagem"
      />
      <TextInput
        style={styles.input}
        onChangeText={setChannel}
        value={channel}
        placeholder="Canal"
      />
      <TextInput
        style={styles.input}
        onChangeText={setCondition}
        value={condition}
        placeholder="Condição"
      />
      <StyledButton title="Salvar LP" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
});
