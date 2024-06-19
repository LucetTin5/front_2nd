// eslint-disable-next-line
export const states: any[] = [];
let stateId = 0;

export function useMyState<T>(initialState: T): [T, (newState: T) => void] {
  const newStateId = stateId;

  if (typeof states[newStateId] === "undefined") {
    states[newStateId] = initialState;
    stateId++;
  }

  function setState(newState: T) {
    states[newStateId] = newState;
  }

  return [states[newStateId], setState];
}

export function resetStateId() {
  stateId = 0;
}
