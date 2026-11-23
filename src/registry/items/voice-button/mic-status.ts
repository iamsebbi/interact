"use client";

import { useSyncExternalStore } from "react";
import type { MicrophoneState } from "voice-glow";

interface VoiceLiveStatusSnapshot {
  micState: MicrophoneState;
  micError: Error | null;
}

const DEFAULT_SNAPSHOT: VoiceLiveStatusSnapshot = {
  micState: "idle",
  micError: null,
};

let snapshot: VoiceLiveStatusSnapshot = DEFAULT_SNAPSHOT;
const listeners = new Set<() => void>();

export function setVoiceLiveStatus(
  micState: MicrophoneState,
  micError: Error | null,
) {
  snapshot = { micState, micError };
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return snapshot;
}

export function useVoiceLiveStatus(): VoiceLiveStatusSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
