import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useCallback,
} from 'react';
import { Schedule } from './types.ts';
import dummyScheduleMap from './dummyScheduleMap.ts';

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
  updateSchedule: (tableId: string, newSchedules: Schedule[]) => void;
  addTable: (tableId: string, schedules: Schedule[]) => void;
  removeTable: (tableId: string) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] =
    useState<Record<string, Schedule[]>>(dummyScheduleMap);

  const updateSchedule = useCallback(
    (tableId: string, newSchedules: Schedule[]) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: newSchedules,
      }));
    },
    []
  );

  const addTable = useCallback((tableId: string, schedules: Schedule[]) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: schedules,
    }));
  }, []);

  const removeTable = useCallback((tableId: string) => {
    setSchedulesMap((prev) => {
      const newMap = { ...prev };
      delete newMap[tableId];
      return newMap;
    });
  }, []);

  return (
    <ScheduleContext.Provider
      value={{ schedulesMap, updateSchedule, addTable, removeTable }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
