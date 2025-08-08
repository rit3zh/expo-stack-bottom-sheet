import { useBottomSheet } from "@/context/index";
import React from "react";
import { StyleSheet, View } from "react-native";
import { BottomSheet } from "./BottomSheet";

export const BottomSheetViewport: React.FC = () => {
  const { bottomSheets } = useBottomSheet();

  return (
    <View style={styles.viewport} pointerEvents="box-none">
      {bottomSheets.map((sheet, index) => (
        <BottomSheet
          totalSheets={bottomSheets.length}
          key={sheet.id}
          bottomSheet={sheet}
          index={bottomSheets.length - 1 - index}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  viewport: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    pointerEvents: "box-none",
  },
});
