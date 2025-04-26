import { useLocalSearchParams } from "expo-router";
import { View, Text, Pressable, TextInput } from "react-native";
import { Theme } from "@/types";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { idStyles } from "@/styles/id";
import { Todo } from "@/types";

export default function EditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [todo, setTodo] = useState<Todo | null>(null);
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const router = useRouter();

  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  useEffect(() => {
    const fetchData = async (id: string) => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageTodos: Todo[] =
          jsonValue != null ? JSON.parse(jsonValue) : [];

        if (storageTodos.length) {
          const myTodo = storageTodos.find((t) => t.id.toString() === id);
          if (myTodo) {
            setTodo(myTodo);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (id) {
      fetchData(id);
    }
  }, [id]);

  if (!loaded && !error) {
    return null;
  }
  const isDark = colorScheme === "dark";
  const styles = idStyles(theme, colorScheme);

  const handleSave = async () => {
    if (!todo) return;
    try {
      const savedTodo = { ...todo, title: todo.title };

      const jsonValue = await AsyncStorage.getItem("TodoApp");
      const storageTodos: Todo[] =
        jsonValue != null ? JSON.parse(jsonValue) : [];

      if (storageTodos.length) {
        const otherTodos = storageTodos.filter((t) => t.id !== savedTodo.id);
        const allTodos = [...otherTodos, savedTodo];
        await AsyncStorage.setItem("TodoApp", JSON.stringify(allTodos));
      } else {
        await AsyncStorage.setItem("TodoApp", JSON.stringify([savedTodo]));
      }

      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          maxLength={30}
          placeholder="Edit todo"
          placeholderTextColor="gray"
          value={todo?.title || ""}
          onChangeText={(text) =>
            setTodo((prev) => (prev ? { ...prev, title: text } : null))
          }
        />
        <Pressable
          onPress={() => setColorScheme(isDark ? "light" : "dark")}
          style={{ marginLeft: 10 }}
        >
          <Octicons
            name={isDark ? "moon" : "sun"}
            size={36}
            color={theme.text}
            selectable={undefined}
            style={{ width: 36 }}
          />
        </Pressable>
      </View>
      <View style={styles.inputContainer}>
        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/")}
          style={[styles.saveButton, { backgroundColor: "red" }]}
        >
          <Text style={[styles.saveButtonText, { color: "#000" }]}>Cancel</Text>
        </Pressable>
      </View>
      <StatusBar style={isDark ? "light" : "dark"} />
    </SafeAreaView>
  );
}
