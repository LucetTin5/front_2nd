// import { useState } from "react";
// import { useMyState } from "./useMyState";

// export function useMyRef<T>(initValue: T | null) {
//   const [ref] = useMyState<{ current: T | null }>({ current: initValue });
//   return ref;
// }

// export function useMyRef<T>(initValue: T | null) {
//   const [refObj] = useState<{ current: T | null }>(() => ({
//     current: initValue,
//   }));
//   return refObj;
// }

//eslint-disable-next-line
const refMap = new WeakMap<object, any>();

function createComponentInstance(): object {
  // ...
  return {};
}

export function useMyRef<T>(initValue: T | null) {
  const componentInstance = createComponentInstance();

  if (!refMap.has(componentInstance)) {
    refMap.set(componentInstance, { current: initValue });
  }

  return refMap.get(componentInstance);
}
