import { router, Stack } from "expo-router";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";

import HeaderRight from "../../components/HeaderRight";
import Loading from "../../components/Loading";
import useCollection from "../../firebase/hooks/useCollection";
import globalStyles from "../../styles/globalStyles";
import LP from "../../types/LP";
import HeaderLeft from "../../components/HeaderLeft";
import StyledButton from "../../components/StyledButton";

export default function Home() {
  const { data, remove, refreshData, loading } = useCollection<LP>("LP");

  return (
    <View style={[globalStyles.container, styles.container]}>
      <Stack.Screen
        options={{
          title: "Home",
          headerRight: () => <HeaderRight />,
          headerLeft: () => <HeaderLeft />,
        }}
      />

      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemText}>{item.artist}</Text>
              <Text style={styles.itemText}>{item.condition}</Text>
              <Text style={styles.itemText}>{item.press_year}</Text>
              <Text style={styles.itemText}>{item.channel}</Text>
              <StyledButton
                title="View LP Details"
                onPress={() => {
                  if (item.id) {
                    router.push(`/home/${item.id}/`);
                  } else {
                    Alert.alert(
                      "View error",
                      "Cannot access LP details because it does not have an ID!"
                    );
                  }
                }}
                style={styles.button}
              />
              <StyledButton
                title="Delete"
                onPress={async () => {
                  await remove(item.id!);
                  await refreshData();
                }}
                style={styles.button}
              />
            </View>
          )}
          style={styles.list}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  itemContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  button: {
    width: "50%",
    marginVertical: 8,
  },
  list: {
    width: "100%",
  },
});