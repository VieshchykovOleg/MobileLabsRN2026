import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { useTheme, useGame } from '../context/AppContext';

// ── Styled Components ─────────────────────────────────────────

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

const SummaryCard = styled.View`
  background-color: ${({ theme }) => theme.card};
  margin: 16px;
  border-radius: 14px;
  padding: 16px;
  elevation: 3;
`;

const SummaryText = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 8px;
`;

const SummaryBarWrap = styled.View`
  height: 10px;
  background-color: ${({ theme }) => theme.border};
  border-radius: 5px;
  overflow: hidden;
`;

const SummaryBarFill = styled.View`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background-color: ${({ theme }) => theme.accent};
  border-radius: 5px;
`;

const ListContent = styled.View`
  padding-horizontal: 16px;
  padding-bottom: 20px;
`;

const Separator = styled.View`
  height: 8px;
`;

// Картка завдання
const ItemCard = styled.View`
  background-color: ${({ theme, done }) => done ? theme.successLight : theme.card};
  border-radius: 14px;
  padding: 14px;
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: ${({ theme, done }) => done ? theme.success : theme.border};
`;

const ItemIconWrap = styled.View`
  width: 40px;
  align-items: center;
`;

const ItemIcon = styled.Text`
  font-size: 24px;
`;

const ItemCenter = styled.View`
  flex: 1;
  margin-horizontal: 10px;
`;

const ItemLabel = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme, done }) => done ? theme.success : theme.text};
  margin-bottom: 2px;
`;

const ItemDesc = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.subtext};
  margin-bottom: 6px;
`;

const ProgressBarWrap = styled.View`
  height: 6px;
  background-color: ${({ theme }) => theme.border};
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 3px;
`;

const ProgressBarFill = styled.View`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background-color: ${({ theme, done }) => done ? theme.success : theme.accent};
  border-radius: 3px;
`;

const ProgressText = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.subtext};
`;

const ItemRight = styled.View`
  width: 30px;
  align-items: center;
`;

const CheckDone = styled.Text`
  font-size: 20px;
`;

const CheckEmpty = styled.View`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  border-width: 2px;
  border-color: ${({ theme }) => theme.border};
`;

// ── Компонент картки завдання ─────────────────────────────────
function ChallengeItem({ item, theme }) {
  const done     = item.current >= item.goal;
  const progress = Math.min((item.current / item.goal) * 100, 100);

  return (
    <ItemCard theme={theme} done={done}>
      <ItemIconWrap>
        <ItemIcon>{item.icon}</ItemIcon>
      </ItemIconWrap>

      <ItemCenter>
        <ItemLabel theme={theme} done={done}>{item.label}</ItemLabel>
        <ItemDesc theme={theme}>{item.desc}</ItemDesc>
        <ProgressBarWrap theme={theme}>
          <ProgressBarFill theme={theme} done={done} progress={progress} />
        </ProgressBarWrap>
        <ProgressText theme={theme}>{item.current} / {item.goal}</ProgressText>
      </ItemCenter>

      <ItemRight>
        {done ? <CheckDone>✅</CheckDone> : <CheckEmpty theme={theme} />}
      </ItemRight>
    </ItemCard>
  );
}

// ── Головний компонент ────────────────────────────────────────
export default function ChallengesScreen() {
  const { theme } = useTheme();
  const { challenges } = useGame();

  const done  = challenges.filter(c => c.current >= c.goal).length;
  const total = challenges.length;
  const summaryProgress = total > 0 ? (done / total) * 100 : 0;

  return (
    <Container theme={theme}>
      <Header theme={theme}>
        <HeaderTitle theme={theme}>🏆 Завдання</HeaderTitle>
      </Header>

      <SummaryCard theme={theme}>
        <SummaryText theme={theme}>Виконано: {done} / {total}</SummaryText>
        <SummaryBarWrap theme={theme}>
          <SummaryBarFill theme={theme} progress={summaryProgress} />
        </SummaryBarWrap>
      </SummaryCard>

      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChallengeItem item={item} theme={theme} />}
        ItemSeparatorComponent={() => <Separator />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}
