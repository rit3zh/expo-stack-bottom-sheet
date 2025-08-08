import { BottomSheetProvider, useBottomSheet } from "@/context/index";
import type { BottomSheetOptions, BottomSheetProps } from "@/types/index";
import * as React from "react";
import { BottomSheetViewport } from "./BottomSheetViewPort";

type BottomSheetRef = {
  show?: (
    content: React.ReactNode | string,
    options?: BottomSheetOptions
  ) => string;
  update?: (
    id: string,
    content: React.ReactNode | string,
    options?: BottomSheetOptions
  ) => void;
  dismiss?: (id: string) => void;
  dismissAll?: () => void;
};

const bottomSheetRef: BottomSheetRef = {};

const BottomSheetController: React.FC = () => {
  const bottomSheet = useBottomSheet();
  bottomSheetRef.show = bottomSheet.show;
  bottomSheetRef.update = bottomSheet.update;
  bottomSheetRef.dismiss = bottomSheet.dismiss;
  bottomSheetRef.dismissAll = bottomSheet.dismissAll;
  return null;
};

export const BottomSheetProviderWithViewport: React.FC<BottomSheetProps> = ({
  children,
}) => {
  return (
    <>
      <BottomSheetProvider>
        <BottomSheetController />
        {children}
        <BottomSheetViewport />
      </BottomSheetProvider>
    </>
  );
};

export const BottomSheet = {
  show: (
    content: React.ReactNode | string,
    options?: BottomSheetOptions
  ): string => {
    if (!bottomSheetRef.show) {
      console.warn(
        "BottomSheet provider not initialized. Make sure you have wrapped your app with BottomSheetProviderWithViewport."
      );
      return "";
    }
    return bottomSheetRef.show(content, options);
  },
  update: (
    id: string,
    content: React.ReactNode | string,
    options?: BottomSheetOptions
  ): void => {
    if (!bottomSheetRef.update) {
      console.warn(
        "BottomSheet provider not initialized. Make sure you have wrapped your app with BottomSheetProviderWithViewport."
      );
      return;
    }
    return bottomSheetRef.update(id, content, options);
  },
  dismiss: (id: string): void => {
    if (!bottomSheetRef.dismiss) {
      console.warn(
        "BottomSheet provider not initialized. Make sure you have wrapped your app with BottomSheetProviderWithViewport."
      );
      return;
    }
    return bottomSheetRef.dismiss(id);
  },
  dismissAll: (): void => {
    if (!bottomSheetRef.dismissAll) {
      console.warn(
        "BottomSheet provider not initialized. Make sure you have wrapped your app with BottomSheetProviderWithViewport."
      );
      return;
    }
    return bottomSheetRef.dismissAll();
  },
};

export { BottomSheetProvider, useBottomSheet } from "@/context/index";
export type {
  BottomSheetAction,
  BottomSheetOptions,
  BottomSheetSize,
} from "@/types/index";
