import { useRouter } from "expo-router";
import { Alert, Text } from "react-native";

import useAuth from "../firebase/hooks/useAuth";
import StyledButton from "./StyledButton";

export default function HeaderLeft() {
  const router = useRouter();

  return (
    <>
      <StyledButton
        onPress={() =>router.push('/create')}
        title={"Adicionar"}
        style={{ width: "auto", marginLeft: 12 }}
      />
    </>
  );
}
