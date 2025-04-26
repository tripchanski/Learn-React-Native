import {
  Text,
  View,
  TextInput,
  Pressable,
  ListRenderItem,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useState } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { Octicons } from "@expo/vector-icons";
import { Todo } from "@/types";
import { mainStyles } from "@/styles/main";
import Animated, { LinearTransition } from "react-native-reanimated";

export default function Index() {
  // States
  const [todos, setTodos] = useState<Todo[]>(data.sort((a, b) => b.id - a.id));

  // Стейт для текста из TextInput
  const [text, setText] = useState<string>("");

  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);

  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  if (!loaded && !error) {
    return null;
  }

  // Добавление новой задачи
  const addTodo = () => {
    if (text.trim()) {
      // если текст не пустой
      const newId = todos.length > 0 ? todos[0].id + 1 : 1; // новый ID — на 1 больше, чем у самой первой задачи
      const newTodo: Todo = { id: newId, title: text, completed: false }; // создаём объект задачи
      setTodos([newTodo, ...todos]); // добавляем задачу в начало массива
      setText(""); // очищаем поле ввода
    }
  };

  // Переключение состояния задачи (выполнена / не выполнена)
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(
        (todo) =>
          todo.id === id
            ? { ...todo, completed: !todo.completed } // если совпадает ID — инвертируем completed
            : todo, // иначе оставляем как есть
      ),
    );
  };

  // Удаление задачи по ID
  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id)); // фильтруем все задачи, кроме той, которую удаляем
  };

  // Компонент для отрисовки одной задачи (используется в FlatList)
  const renderItem: ListRenderItem<Todo> = ({ item }) => (
    <View style={styles.todoItem}>
      <Text
        style={[styles.todoText, item.completed && styles.completedText]} // зачёркнутый стиль, если выполнено
        onPress={() => toggleTodo(item.id)} // по нажатию переключаем completed
      >
        {item.title}
      </Text>
      <Pressable onPress={() => removeTodo(item.id)}>
        <MaterialCommunityIcons name="delete-circle" size={36} color="red" />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new todo"
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
        <Pressable
          onPress={() => setColorScheme(isDark ? "light" : "dark")}
          style={{ marginLeft: 10 }}
        >
          {isDark ? (
            <Octicons
              name="moon"
              size={36}
              color={theme.text}
              selectable={undefined}
              style={{ width: 36 }}
            />
          ) : (
            <Octicons
              name="sun"
              size={36}
              color={theme.text}
              selectable={undefined}
              style={{ width: 36 }}
            />
          )}
        </Pressable>
      </View>

      <Animated.FlatList
        style={{ flex: 1 }}
        data={todos}
        renderItem={renderTodo}
        keyExtractor={(todo) => todo.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"
      />
    </SafeAreaView>
  );
}
