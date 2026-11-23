"use client";

import { useSyncExternalStore } from "react";

let mountedGridCount = 0;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

export function registerShowcaseGrid(): () => void {
  mountedGridCount += 1;
  notify();
  return () => {
    mountedGridCount = Math.max(0, mountedGridCount - 1);
    notify();
  };
}

export function useIsShowcaseGridMounted(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => listeners.delete(onStoreChange);
    },
    () => mountedGridCount > 0,
    () => false,
  );
}
