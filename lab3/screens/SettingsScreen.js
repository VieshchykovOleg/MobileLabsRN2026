import React from 'react';
import { Switch, Alert, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useTheme, useGame } from '../context/AppContext';

// ── Styled Components

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.bg};
`;

const Header = styled.View`
  background-color: ${({ theme }) => theme.header};
  padding-vertical: 14px;
  padding-horizontal: 20px;
  align-items: center;
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.headerText};
`;

const SectionTitle = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.subtext};
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 8px;
  margin-top: 16px;
  margin-left: 4px;
`;

const Card = styled.View`
  background-color: ${({ theme }) => theme.card};
  border-radius: 16px;
  overflow: hidden;
  elevation: 3;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 16px;
  padding-vertical: 14px;
`;

const RowLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const RowIcon = styled.Text`
  font-size: 22px;
  width: 30px;
  text-align: center;
  margin-right: 12px;
`;

const RowTexts = styled.View``;

const RowLabel = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const RowDesc = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.subtext};
  margin-top: 1px;
`;

const RowRight = styled.View`
  margin-left: 10px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.border};
  margin-left: 58px;
`;

const StatValue = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.accent};
`;

const ResetButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.danger};
  border-radius: 14px;
  padding-vertical: 16px;
  align-items: center;
  margin-top: 24px;
`;

const ResetButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
`;

const FooterText = styled.Text`
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.subtext};
  margin-top: 20px;
  font-style: italic;
`;

// ── Компонент рядка налаштування
function SettingRow({ icon, label, desc, right, theme }) {
  return (
    <Row>
      <RowLeft>
        <RowIcon>{icon}</RowIcon>
        <RowTexts>
          <RowLabel theme={theme}>{label}</RowLabel>
          {desc ? <RowDesc theme={theme}>{desc}</RowDesc> : null}
        </RowTexts>
      </RowLeft>
      {right ? <RowRight>{right}</RowRight> : null}
    </Row>
  );
}

const GESTURE_INFO = [
  ['👆', 'Tap',          '+1 очко — одиночний дотик'],
  ['✌️', 'Double Tap',   '+2 очки — подвійний дотик'],
  ['⏱️', 'Long Press',   '+5 очок — утримання 3 секунди'],
  ['↔️', 'Pan',          'Переміщення об\'єкта по екрану'],
  ['👉', 'Fling Right',  '+1–10 випадкових очок'],
  ['👈', 'Fling Left',   '+1–10 випадкових очок'],
  ['🔍', 'Pinch',        '+3 очки — масштабування'],
];

// ── Головний компонент
export default function SettingsScreen() {
  const { theme, isDark, toggle } = useTheme();
  const { score, challenges, resetGame } = useGame();

  const done  = challenges.filter(c => c.current >= c.goal).length;
  const total = challenges.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  const handleReset = () => {
    Alert.alert(
      'Скинути прогрес',
      'Ви впевнені? Всі очки та завдання буде скинуто.',
      [
        { text: 'Скасувати', style: 'cancel' },
        { text: 'Скинути', style: 'destructive', onPress: resetGame },
      ]
    );
  };

  return (
    <Container theme={theme}>
      <Header theme={theme}>
        <HeaderTitle theme={theme}>⚙️ Налаштування</HeaderTitle>
      </Header>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Зовнішній вигляд */}
        <SectionTitle theme={theme}>Зовнішній вигляд</SectionTitle>
        <Card theme={theme}>
          <SettingRow
            theme={theme}
            icon={isDark ? '🌙' : '☀️'}
            label="Темна тема"
            desc={isDark ? 'Увімкнена' : 'Вимкнена'}
            right={
              <Switch
                value={isDark}
                onValueChange={toggle}
                trackColor={{ false: theme.border, true: theme.accent }}
                thumbColor={isDark ? theme.accent : '#fff'}
              />
            }
          />
        </Card>

        {/* Статистика */}
        <SectionTitle theme={theme}>Статистика</SectionTitle>
        <Card theme={theme}>
          <SettingRow theme={theme} icon="🏆" label="Поточний рахунок"
            desc="Загальна кількість очок"
            right={<StatValue theme={theme}>{score}</StatValue>}
          />
          <Divider theme={theme} />
          <SettingRow theme={theme} icon="✅" label="Виконано завдань"
            desc={`${done} з ${total}`}
            right={<StatValue theme={theme}>{done}/{total}</StatValue>}
          />
          <Divider theme={theme} />
          <SettingRow theme={theme} icon="📊" label="Прогрес"
            desc="Відсоток виконання"
            right={<StatValue theme={theme}>{pct}%</StatValue>}
          />
        </Card>

        {/* Опис жестів */}
        <SectionTitle theme={theme}>Опис жестів</SectionTitle>
        <Card theme={theme}>
          {GESTURE_INFO.map(([icon, name, desc], i) => (
            <React.Fragment key={name}>
              <SettingRow theme={theme} icon={icon} label={name} desc={desc} />
              {i < GESTURE_INFO.length - 1 && <Divider theme={theme} />}
            </React.Fragment>
          ))}
        </Card>

        {/* Про додаток */}
        <SectionTitle theme={theme}>Про додаток</SectionTitle>
        <Card theme={theme}>
          <SettingRow theme={theme} icon="📱" label="Версія" desc="Gesture Clicker"
            right={<StatValue theme={theme}>1.0.0</StatValue>}
          />
          <Divider theme={theme} />
          <SettingRow theme={theme} icon="🎓" label="Лабораторна робота"
            desc="React Native, жести"
            right={<StatValue theme={theme}>№3</StatValue>}
          />
        </Card>

        <ResetButton theme={theme} onPress={handleReset} activeOpacity={0.8}>
          <ResetButtonText>🗑️ Скинути прогрес</ResetButtonText>
        </ResetButton>

        <FooterText theme={theme}>Вєщиков Олег, ІПЗ-22-2</FooterText>
      </ScrollView>
    </Container>
  );
}
