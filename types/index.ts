export type BottomSheetSize = "small" | "medium" | "large" | "full";

export interface BottomSheetAction {
  label: string;
  onPress?: () => void;
  variant?: "default" | "primary" | "destructive";
  dismissOnPress?: boolean;
}

export interface BottomSheetOptions {
  size?: BottomSheetSize;
  title?: string;
  showCloseButton?: boolean;
  dismissOnBackdrop?: boolean;
  duration?: number;
  scrollable?: boolean;
  onClose?: () => void;
  actions?: BottomSheetAction[];
}

export interface BottomSheet {
  id: string;
  content: any;
  options: Required<BottomSheetOptions>;
  shouldDismiss?: boolean;
}

export interface BottomSheetContextValue {
  bottomSheets: BottomSheet[];
  show: (
    content: React.ReactNode | string,
    options?: BottomSheetOptions
  ) => string;
  update: (
    id: string,
    content: React.ReactNode | string,
    options?: BottomSheetOptions
  ) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

export interface BottomSheetProps {
  children: React.ReactNode;
}
