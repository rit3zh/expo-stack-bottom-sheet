import type {
  BottomSheet,
  BottomSheetContextValue,
  BottomSheetOptions,
} from "@/types/index";
import React, { createContext, useCallback, useContext, useState } from "react";

const DEFAULT_BOTTOM_SHEET_OPTIONS: Required<BottomSheetOptions> = {
  size: "medium",
  title: "",
  scrollable: false,
  showCloseButton: true,
  dismissOnBackdrop: true,
  duration: 0,
  onClose: () => {},
  actions: [],
};

const BottomSheetContext = createContext<BottomSheetContextValue | undefined>(
  undefined
);

export const useBottomSheet = (): BottomSheetContextValue => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  }
  return context;
};

export const BottomSheetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bottomSheets, setBottomSheets] = useState<BottomSheet[]>([]);

  const show = useCallback(
    (
      content: React.ReactNode | string,
      options?: BottomSheetOptions
    ): string => {
      const id = Math.random().toString(36).substring(2, 9);
      const bottomSheet: BottomSheet = {
        id,
        content,
        options: {
          ...DEFAULT_BOTTOM_SHEET_OPTIONS,
          ...options,
        },
      };
      setBottomSheets((prevSheets) => [...prevSheets, bottomSheet]);
      return id;
    },
    []
  );

  const update = useCallback(
    (
      id: string,
      content: React.ReactNode | string,
      options?: BottomSheetOptions
    ) => {
      setBottomSheets((prevSheets) =>
        prevSheets.map((sheet) =>
          sheet.id === id
            ? {
                ...sheet,
                content,
                options: {
                  ...sheet.options,
                  ...options,
                },
              }
            : sheet
        )
      );
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setBottomSheets((prevSheets) =>
      prevSheets.filter((sheet) => sheet.id !== id)
    );
  }, []);

  const dismissAll = useCallback(() => {
    setBottomSheets([]);
  }, []);

  const value: BottomSheetContextValue = {
    bottomSheets,
    show,
    update,
    dismiss,
    dismissAll,
  };

  return (
    <BottomSheetContext.Provider value={value}>
      {children}
    </BottomSheetContext.Provider>
  );
};
