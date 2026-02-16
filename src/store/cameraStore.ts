import { create } from 'zustand';

interface CameraStore {
  isCameraMode: boolean;
  isTransitioning: boolean;
  isStreaming: boolean;
  streamWindow: Window | null;
  toggleCameraMode: () => void;
  exitCameraMode: () => void;
  setTransitioning: (v: boolean) => void;
  setStreaming: (v: boolean) => void;
  setStreamWindow: (w: Window | null) => void;
}

export const useCameraStore = create<CameraStore>((set, get) => ({
  isCameraMode: false,
  isTransitioning: false,
  isStreaming: false,
  streamWindow: null,
  toggleCameraMode: () => {
    if (get().isTransitioning) return;
    set({ isTransitioning: true });
    setTimeout(() => {
      set((state) => ({ isCameraMode: !state.isCameraMode }));
      setTimeout(() => set({ isTransitioning: false }), 400);
    }, 400);
  },
  exitCameraMode: () => {
    if (!get().isCameraMode || get().isTransitioning) return;
    set({ isTransitioning: true });
    setTimeout(() => {
      set({ isCameraMode: false });
      setTimeout(() => set({ isTransitioning: false }), 400);
    }, 400);
  },
  setTransitioning: (v) => set({ isTransitioning: v }),
  setStreaming: (v) => set({ isStreaming: v }),
  setStreamWindow: (w) => set({ streamWindow: w }),
}));
