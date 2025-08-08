import { SCREEN_HEIGHT } from "@/constants";
import { useBottomSheet } from "@/context";
import { bottomSheetStyle as styles } from "@/stylesheet/index";
import type { BottomSheet as BottomSheetType } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import {
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface BottomSheetProps {
  bottomSheet: BottomSheetType;
  index: number;
  totalSheets: number;
  sharedBackdropOpacity?: SharedValue<number>;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  bottomSheet,
  index,
  totalSheets,
  sharedBackdropOpacity,
}) => {
  const { dismiss } = useBottomSheet();
  const isDismissing = useRef(false);
  const prevIndexRef = useRef<number>(-1);
  const isVisible = useRef(false);

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollOffset = useRef(0);
  const isContentScrollable = useRef(false);

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  const backdropOpacity = sharedBackdropOpacity || useSharedValue(0);

  const getStackOffset = () => {
    const baseOffset = 20;
    const maxOffset = 60;
    const offset = Math.min(index * baseOffset, maxOffset);
    return offset;
  };

  const getStackScale = () => {
    const scaleReduction = 0.085;
    const minScale = 0.22;
    return Math.max(1 - index * scaleReduction, minScale);
  };

  const getInitialPosition = () => {
    const basePosition = SCREEN_HEIGHT * 0.35;

    switch (bottomSheet.options.size) {
      case "small":
        return basePosition + SCREEN_HEIGHT * 0.2_8 + getStackOffset();
      case "medium":
        return basePosition + SCREEN_HEIGHT * 0.1_1_5 + getStackOffset();
      case "large":
        return basePosition - SCREEN_HEIGHT * 0.082 - getStackOffset();
      case "full":
        return SCREEN_HEIGHT * 0.05 + getStackOffset();
      default:
        return basePosition + getStackOffset();
    }
  };

  const getSheetHeight = () => {
    switch (bottomSheet.options.size) {
      case "small":
        return SCREEN_HEIGHT * 0.35;
      case "medium":
        return SCREEN_HEIGHT * 0.5;
      case "large":
        return SCREEN_HEIGHT * 0.7;
      case "full":
        return SCREEN_HEIGHT * 0.85;
      default:
        return SCREEN_HEIGHT * 0.5;
    }
  };

  const dismissWithAnimation = () => {
    if (isDismissing.current || !isVisible.current) return;
    isDismissing.current = true;
    isVisible.current = false;

    opacity.value = withTiming(0, {
      duration: 350,
      easing: Easing.out(Easing.quad),
    });

    translateY.value = withTiming(SCREEN_HEIGHT + 100, {
      duration: 400,
      easing: Easing.out(Easing.quad),
    });

    scale.value = withTiming(0.8, {
      duration: 350,
      easing: Easing.out(Easing.quad),
    });

    if (totalSheets === 1) {
      backdropOpacity.value = withTiming(0, {
        duration: 350,
        easing: Easing.out(Easing.quad),
      });
    }

    setTimeout(() => {
      runOnJS(() => {
        dismiss(bottomSheet.id);
        bottomSheet.options.onClose?.();
      })();
    }, 400);
  };

  useEffect(() => {
    if (
      prevIndexRef.current !== index &&
      prevIndexRef.current !== -1 &&
      isVisible.current
    ) {
      const newPosition = getInitialPosition();
      const newScale = getStackScale();

      translateY.value = withTiming(newPosition + 15, {
        duration: 250,
        easing: Easing.out(Easing.quad),
      });

      scale.value = withTiming(newScale * 0.96, {
        duration: 250,
        easing: Easing.out(Easing.quad),
      });

      setTimeout(() => {
        if (isVisible.current) {
          translateY.value = withSpring(newPosition, {
            damping: 30,
            stiffness: 250,
            mass: 0.6,
          });

          scale.value = withSpring(newScale, {
            damping: 30,
            stiffness: 250,
            mass: 0.6,
          });
        }
      }, 120);
    }

    prevIndexRef.current = index;
  }, [index]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (index !== 0) return false;

        const isDraggingDown = gestureState.dy > 0;
        const isSignificantVerticalMove = Math.abs(gestureState.dy) > 8;
        const isVerticalSwipe =
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 1.5;

        if (isScrolling) return false;

        if (
          isContentScrollable.current &&
          scrollOffset.current > 0 &&
          isDraggingDown
        ) {
          return false;
        }

        return isDraggingDown && isSignificantVerticalMove && isVerticalSwipe;
      },
      onPanResponderGrant: () => {
        if (index !== 0) return;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (index !== 0 || !isVisible.current) return;

        if (
          gestureState.dy > 0 &&
          (!isContentScrollable.current || scrollOffset.current <= 0)
        ) {
          const currentPosition = getInitialPosition();
          const newY = currentPosition + gestureState.dy;
          translateY.value = Math.max(newY, currentPosition);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (index !== 0) return;

        const shouldDismiss = gestureState.dy > 100 || gestureState.vy > 1.2;

        if (shouldDismiss) {
          dismissWithAnimation();
        } else {
          translateY.value = withSpring(getInitialPosition(), {
            damping: 25,
            stiffness: 400,
            mass: 0.6,
          });
        }
      },
    })
  ).current;

  useEffect(() => {
    const delay = index * 80;

    const timer = setTimeout(() => {
      isVisible.current = true;

      if (backdropOpacity.value === 0) {
        backdropOpacity.value = withTiming(1, {
          duration: 350,
          easing: Easing.out(Easing.quad),
        });
      }

      opacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.quad),
      });

      translateY.value = withSpring(getInitialPosition(), {
        damping: 28,
        stiffness: 220,
        mass: 0.8,
      });

      scale.value = withSpring(getStackScale(), {
        damping: 28,
        stiffness: 220,
        mass: 0.8,
      });
    }, delay);

    if (bottomSheet.options.duration && bottomSheet.options.duration > 0) {
      const autoTimer = setTimeout(() => {
        dismissWithAnimation();
      }, bottomSheet.options.duration + delay);

      return () => {
        clearTimeout(timer);
        clearTimeout(autoTimer);
      };
    }

    return () => clearTimeout(timer);
  }, [bottomSheet]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    zIndex: 1000 - index,
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetHeight = getSheetHeight();

  const renderContent = () => {
    const contentElement =
      typeof bottomSheet.content === "string" ? (
        <Text style={styles.text}>{bottomSheet.content}</Text>
      ) : (
        bottomSheet.content
      );

    const content = bottomSheet.content.props as any;
    const hasScrollView =
      React.isValidElement(bottomSheet.content) &&
      (bottomSheet.content.type === ScrollView ||
        (content?.children &&
          React.Children.toArray(content?.children).some(
            (child) => React.isValidElement(child) && child.type === ScrollView
          )));

    if (hasScrollView) {
      isContentScrollable.current = true;
      return <View style={styles.customContent}>{contentElement}</View>;
    }

    const shouldWrapInScroll =
      bottomSheet.options?.scrollable !== false &&
      (bottomSheet.options.size === "large" ||
        bottomSheet.options.size === "full");

    if (shouldWrapInScroll) {
      isContentScrollable.current = true;
      return (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          bounces={true}
          scrollEventThrottle={16}
          onScroll={(event) => {
            scrollOffset.current = event.nativeEvent.contentOffset.y;
          }}
          onScrollBeginDrag={() => setIsScrolling(true)}
          onScrollEndDrag={() => setIsScrolling(false)}
          onMomentumScrollEnd={() => setIsScrolling(false)}
        >
          {contentElement}
        </ScrollView>
      );
    }

    return contentElement;
  };

  return (
    <>
      {index === 0 && (
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable
            style={styles.backdropPressable}
            onPress={() => {
              if (bottomSheet.options.dismissOnBackdrop !== false) {
                dismissWithAnimation();
              }
            }}
          />
        </Animated.View>
      )}

      <Animated.View
        style={[
          styles.sheetContainer,
          animatedStyle,
          {
            height: sheetHeight,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 + index * 2 },
            shadowOpacity: 0.25 + index * 0.05,
            shadowRadius: 20 + index * 2,
            elevation: 25 + index * 3,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.sheet]}>
          <View style={styles.handle} />

          {bottomSheet.options.title && (
            <View style={styles.header}>
              <Text style={styles.title}>{bottomSheet.options.title}</Text>
              {bottomSheet.options.showCloseButton !== false && (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={dismissWithAnimation}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={styles.contentContainer}>
            <View style={styles.content}>{renderContent()}</View>

            {bottomSheet.options.actions &&
              bottomSheet.options.actions.length > 0 && (
                <View style={styles.actions}>
                  {bottomSheet.options.actions.map((action, actionIndex) => (
                    <TouchableOpacity
                      key={actionIndex}
                      style={[
                        styles.actionButton,
                        action.variant === "primary" && styles.primaryButton,
                        action.variant === "destructive" &&
                          styles.destructiveButton,
                      ]}
                      onPress={() => {
                        action.onPress?.();
                        if (action.dismissOnPress !== false) {
                          dismissWithAnimation();
                        }
                      }}
                    >
                      <Text
                        style={[
                          styles.actionButtonText,
                          action.variant === "primary" &&
                            styles.primaryButtonText,
                          action.variant === "destructive" &&
                            styles.destructiveButtonText,
                        ]}
                      >
                        {action.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
          </View>
        </View>
      </Animated.View>
    </>
  );
};

export const BottomSheetContainer: React.FC<{
  sheets: BottomSheetType[];
}> = ({ sheets }) => {
  const sharedBackdropOpacity = useSharedValue(0);

  return (
    <>
      {sheets.map((sheet, index) => (
        <BottomSheet
          key={sheet.id}
          bottomSheet={sheet}
          index={index}
          totalSheets={sheets.length}
          sharedBackdropOpacity={sharedBackdropOpacity}
        />
      ))}
    </>
  );
};
