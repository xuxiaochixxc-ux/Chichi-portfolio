import { createContext, useContext } from "react";

export type CursorContextValue = {
  enabled: boolean;
  reducedMotion: boolean;
};

export const CursorContext = createContext<CursorContextValue>({
  enabled: false,
  reducedMotion: false,
});

export const useCustomCursor = () => useContext(CursorContext);
