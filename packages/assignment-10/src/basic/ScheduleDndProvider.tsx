import {
  DndContext,
  DragEndEvent,
  Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import React, { memo, useCallback } from 'react';
import { CellSize, DAY_LABELS } from './constants.ts';
import { useScheduleContext } from './ScheduleContext.tsx';

function createSnapModifier(): Modifier {
  return ({ transform, containerNodeRect, draggingNodeRect }) => {
    const containerTop = containerNodeRect?.top ?? 0;
    const containerLeft = containerNodeRect?.left ?? 0;
    const containerBottom = containerNodeRect?.bottom ?? 0;
    const containerRight = containerNodeRect?.right ?? 0;

    const { top = 0, left = 0, bottom = 0, right = 0 } = draggingNodeRect ?? {};

    const minX = containerLeft - left + 120 + 1;
    const minY = containerTop - top + 40 + 1;
    const maxX = containerRight - right;
    const maxY = containerBottom - bottom;

    return {
      ...transform,
      x: Math.min(
        Math.max(
          Math.round(transform.x / CellSize.WIDTH) * CellSize.WIDTH,
          minX
        ),
        maxX
      ),
      y: Math.min(
        Math.max(
          Math.round(transform.y / CellSize.HEIGHT) * CellSize.HEIGHT,
          minY
        ),
        maxY
      ),
    };
  };
}

const modifiers = [createSnapModifier()];

const ScheduleDndProvider = memo(
  ({ children }: { children: React.ReactNode }) => {
    const { getSchedules, updateSchedule } = useScheduleContext();

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8,
        },
      })
    );

    const handleDragEnd = useCallback(
      (event: DragEndEvent) => {
        const { active, delta } = event;
        if (!active || !active.id || typeof active.id !== 'string') {
          console.error('Invalid drag event:', event);
          return;
        }

        const [tableId, indexStr] = active.id.split(':');
        const index = Number(indexStr);

        if (!tableId || isNaN(index)) {
          console.error('Invalid active id:', active.id);
          return;
        }

        const { x, y } = delta;
        const moveDayIndex = Math.floor(x / CellSize.WIDTH);
        const moveTimeIndex = Math.floor(y / CellSize.HEIGHT);

        const schedules = getSchedules(tableId);
        if (!schedules.length) {
          console.error('Schedules not found for table:', tableId);
          return;
        }

        const updatedSchedules = schedules.map((schedule, scheduleIndex) => {
          if (scheduleIndex !== index) return schedule;

          const currentDayIndex = DAY_LABELS.indexOf(
            schedule.day as (typeof DAY_LABELS)[number]
          );
          const newDayIndex =
            (currentDayIndex + moveDayIndex + DAY_LABELS.length) %
            DAY_LABELS.length;
          const newDay = DAY_LABELS[newDayIndex];
          const newRange = schedule.range.map((time) => time + moveTimeIndex);

          return { ...schedule, day: newDay, range: newRange };
        });

        updateSchedule(tableId, updatedSchedules);
      },
      [getSchedules, updateSchedule]
    );

    return (
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        modifiers={modifiers}
      >
        {children}
      </DndContext>
    );
  }
);

export default ScheduleDndProvider;
