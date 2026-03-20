import React, { useRef, useState, useCallback } from 'react';
import { Animated, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import {
  GestureHandlerRootView,
  TapGestureHandler,
  LongPressGestureHandler,
  PanGestureHandler,
  PinchGestureHandler,
  FlingGestureHandler,
  State,
  Directions,
} from 'react-native-gesture-handler';
import { useTheme, useGame } from '../context/AppContext';

const { width, height } = Dimensions.get('window');
const OBJECT_SIZE = 120;

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

const ScoreCard = styled.View`
  background-color: ${({ theme }) => theme.card};
  margin: 16px;
  border-radius: 16px;
  padding: 20px;
  align-items: center;
  elevation: 4;
`;

const ScoreLabel = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.subtext};
  letter-spacing: 2px;
  margin-bottom: 4px;
`;

const ScoreValue = styled.Text`
  font-size: 64px;
  font-weight: 900;
  color: ${({ theme }) => theme.scoreText};
  line-height: 72px;
`;

const LastAction = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.success};
  font-weight: 600;
  margin-top: 4px;
`;

const GameArea = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ClickObjectInner = styled.View`
  width: ${OBJECT_SIZE}px;
  height: ${OBJECT_SIZE}px;
  border-radius: ${OBJECT_SIZE / 2}px;
  background-color: ${({ theme }) => theme.objectBg};
  justify-content: center;
  align-items: center;
  elevation: 8;
`;

const ClickObjectIcon = styled.Text`
  font-size: 36px;
  margin-bottom: 4px;
`;

const ClickObjectLabel = styled.Text`
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 1px;
`;

const HintsCard = styled.View`
  background-color: ${({ theme }) => theme.card};
  margin: 16px;
  border-radius: 16px;
  padding: 14px;
  flex-direction: row;
  flex-wrap: wrap;
  elevation: 2;
`;

const HintRow = styled.View`
  flex-direction: row;
  align-items: center;
  width: 48%;
  padding-vertical: 3px;
`;

const HintIcon = styled.Text`
  font-size: 16px;
  margin-right: 6px;
`;

const HintText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.subtext};
`;

const HINTS = [
  { icon: '👆', text: 'Tap: +1 очко' },
  { icon: '✌️', text: 'Double-tap: +2 очки' },
  { icon: '⏱️', text: 'Long press (3с): +5 очок' },
  { icon: '↔️', text: 'Swipe: +1–10 випадкових' },
  { icon: '🔍', text: 'Pinch: +3 очки' },
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const { score, lastAction, addScore } = useGame();

  const pan       = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const scale     = useRef(new Animated.Value(1)).current;
  const baseScale = useRef(1);
  const pulse     = useRef(new Animated.Value(1)).current;

  const doPulse = useCallback(() => {
    Animated.sequence([
      Animated.timing(pulse, { toValue: 1.25, duration: 80,  useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1,    duration: 120, useNativeDriver: true }),
    ]).start();
  }, [pulse]);

  const doubleTapRef  = useRef(null);
  const singleTapRef  = useRef(null);
  const longPressRef  = useRef(null);
  const panRef        = useRef(null);
  const pinchRef      = useRef(null);
  const flingRightRef = useRef(null);
  const flingLeftRef  = useRef(null);

  const onSingleTap = useCallback(({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) { doPulse(); addScore(1, '+1 👆 Tap!', 'tap'); }
  }, [addScore, doPulse]);

  const onDoubleTap = useCallback(({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) { doPulse(); addScore(2, '+2 ✌️ Double Tap!', 'doubletap'); }
  }, [addScore, doPulse]);

  const onLongPress = useCallback(({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) { doPulse(); addScore(5, '+5 ⏱️ Long Press!', 'longpress'); }
  }, [addScore, doPulse]);

  const onPanEvent = Animated.event(
    [{ nativeEvent: { translationX: pan.x, translationY: pan.y } }],
    { useNativeDriver: false }
  );

  const onPanStateChange = useCallback(({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      const nx = offset.x + nativeEvent.translationX;
      const ny = offset.y + nativeEvent.translationY;
      const clampX = Math.max(-(width / 2 - OBJECT_SIZE / 2), Math.min(width / 2 - OBJECT_SIZE / 2, nx));
      const clampY = Math.max(-(height / 3), Math.min(height / 3, ny));
      setOffset({ x: clampX, y: clampY });
      pan.setOffset({ x: clampX, y: clampY });
      pan.setValue({ x: 0, y: 0 });
      addScore(0, '↔️ Переміщено!', 'pan');
    }
  }, [offset, pan, addScore]);

  const onPinchEvent = Animated.event(
    [{ nativeEvent: { scale } }],
    { useNativeDriver: false }
  );

  const onPinchStateChange = useCallback(({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      baseScale.current *= nativeEvent.scale;
      const clamped = Math.max(0.5, Math.min(2.5, baseScale.current));
      baseScale.current = clamped;
      scale.setValue(clamped);
      addScore(3, '+3 🔍 Pinch!', 'pinch');
    }
  }, [scale, addScore]);

  const onFlingRight = useCallback(({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      const pts = Math.floor(Math.random() * 10) + 1;
      addScore(pts, `+${pts} 👉 Swipe Right!`, 'flingR');
    }
  }, [addScore]);

  const onFlingLeft = useCallback(({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      const pts = Math.floor(Math.random() * 10) + 1;
      addScore(pts, `+${pts} 👈 Swipe Left!`, 'flingL');
    }
  }, [addScore]);

  const animatedStyle = {
    transform: [
      { translateX: pan.x },
      { translateY: pan.y },
      { scale: Animated.multiply(pulse, scale) },
    ],
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Container theme={theme}>
        <Header theme={theme}>
          <HeaderTitle theme={theme}>🎮 Gesture Clicker</HeaderTitle>
        </Header>

        <ScoreCard theme={theme}>
          <ScoreLabel theme={theme}>SCORE</ScoreLabel>
          <ScoreValue theme={theme}>{score}</ScoreValue>
          {lastAction ? <LastAction theme={theme}>{lastAction}</LastAction> : null}
        </ScoreCard>

        <GameArea>
          <FlingGestureHandler ref={flingRightRef} direction={Directions.RIGHT}
            onHandlerStateChange={onFlingRight} simultaneousHandlers={[flingLeftRef]}>
            <FlingGestureHandler ref={flingLeftRef} direction={Directions.LEFT}
              onHandlerStateChange={onFlingLeft} simultaneousHandlers={[flingRightRef]}>
              <PinchGestureHandler ref={pinchRef}
                onGestureEvent={onPinchEvent} onHandlerStateChange={onPinchStateChange}>
                <Animated.View>
                  <PanGestureHandler ref={panRef}
                    onGestureEvent={onPanEvent} onHandlerStateChange={onPanStateChange}
                    simultaneousHandlers={[pinchRef]}>
                    <Animated.View>
                      <LongPressGestureHandler ref={longPressRef}
                        onHandlerStateChange={onLongPress} minDurationMs={3000}
                        simultaneousHandlers={[panRef]}>
                        <Animated.View>
                          <TapGestureHandler ref={doubleTapRef} numberOfTaps={2}
                            onHandlerStateChange={onDoubleTap}>
                            <Animated.View>
                              <TapGestureHandler ref={singleTapRef}
                                onHandlerStateChange={onSingleTap} waitFor={doubleTapRef}>
                                <Animated.View style={animatedStyle}>
                                  <ClickObjectInner theme={theme}>
                                    <ClickObjectIcon>👆</ClickObjectIcon>
                                    <ClickObjectLabel>TAP ME</ClickObjectLabel>
                                  </ClickObjectInner>
                                </Animated.View>
                              </TapGestureHandler>
                            </Animated.View>
                          </TapGestureHandler>
                        </Animated.View>
                      </LongPressGestureHandler>
                    </Animated.View>
                  </PanGestureHandler>
                </Animated.View>
              </PinchGestureHandler>
            </FlingGestureHandler>
          </FlingGestureHandler>
        </GameArea>

        <HintsCard theme={theme}>
          {HINTS.map((h, i) => (
            <HintRow key={i}>
              <HintIcon>{h.icon}</HintIcon>
              <HintText theme={theme}>{h.text}</HintText>
            </HintRow>
          ))}
        </HintsCard>
      </Container>
    </GestureHandlerRootView>
  );
}
