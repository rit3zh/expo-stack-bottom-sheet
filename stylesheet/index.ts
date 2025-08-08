import { Platform, StyleSheet } from "react-native";

export const bottomSheetStyle = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  backdropPressable: {
    flex: 1,
  },
  sheetContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: 24,
    overflow: "hidden",
  },
  sheet: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: "#000000",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#333333",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#999999",
    fontSize: 16,
    fontWeight: "500",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  customContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  text: {
    color: "#CCCCCC",
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    flexShrink: 0,
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(0, 0, 0, 0.98)",
    minHeight: 80,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333333",
  },
  primaryButton: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  destructiveButton: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "#EF4444",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  primaryButtonText: {
    color: "#FFFFFF",
  },
  destructiveButtonText: {
    color: "#EF4444",
  },
});
