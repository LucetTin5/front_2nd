import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  memo,
} from 'react';
import { Schedule } from './types.ts';
import dummyScheduleMap from './dummyScheduleMap.ts';

type ScheduleState = Record<string, Schedule[]>;

type ScheduleAction =
  | {
      type: 'UPDATE_SCHEDULE';
      payload: { tableId: string; schedules: Schedule[] };
    }
  | { type: 'ADD_TABLE'; payload: { tableId: string; schedules: Schedule[] } }
  | { type: 'REMOVE_TABLE'; payload: { tableId: string } };

interface ScheduleContextType {
  getSchedules: (tableId: string) => Schedule[];
  updateSchedule: (tableId: string, schedules: Schedule[]) => void;
  addTable: (tableId: string, schedules: Schedule[]) => void;
  removeTable: (tableId: string) => void;
  getAllTableIds: () => string[]; // 새로운 함수 추가
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

const scheduleReducer = (
  state: ScheduleState,
  action: ScheduleAction
): ScheduleState => {
  switch (action.type) {
    case 'UPDATE_SCHEDULE':
      return { ...state, [action.payload.tableId]: action.payload.schedules };
    case 'ADD_TABLE':
      return { ...state, [action.payload.tableId]: action.payload.schedules };
    case 'REMOVE_TABLE': {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.payload.tableId]: _, ...rest } = state;
      return rest;
    }
    default:
      return state;
  }
};

export const ScheduleProvider = memo(
  ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(scheduleReducer, dummyScheduleMap);

    const getSchedules = useCallback(
      (tableId: string) => state[tableId] || [],
      [state]
    );

    const updateSchedule = useCallback(
      (tableId: string, schedules: Schedule[]) => {
        dispatch({ type: 'UPDATE_SCHEDULE', payload: { tableId, schedules } });
      },
      []
    );

    const addTable = useCallback((tableId: string, schedules: Schedule[]) => {
      dispatch({ type: 'ADD_TABLE', payload: { tableId, schedules } });
    }, []);

    const removeTable = useCallback((tableId: string) => {
      dispatch({ type: 'REMOVE_TABLE', payload: { tableId } });
    }, []);

    const getAllTableIds = useCallback(() => Object.keys(state), [state]);

    const contextValue = useMemo(
      () => ({
        getSchedules,
        updateSchedule,
        addTable,
        removeTable,
        getAllTableIds,
      }),
      [getSchedules, updateSchedule, addTable, removeTable, getAllTableIds]
    );

    return (
      <ScheduleContext.Provider value={contextValue}>
        {children}
      </ScheduleContext.Provider>
    );
  }
);

export const useScheduleContext = (): ScheduleContextType => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error(
      'useScheduleContext must be used within a ScheduleProvider'
    );
  }
  return context;
};
