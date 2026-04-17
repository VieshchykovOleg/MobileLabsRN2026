import { Stack, Redirect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  // Захист маршрутів: якщо не авторизований — перенаправляємо на login
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#4F46E5' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: '#F8F9FA' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: '🛍️ Каталог товарів',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="details/[id]"
        options={{
          title: 'Деталі товару',
          headerBackTitle: 'Назад',
        }}
      />
    </Stack>
  );
}
