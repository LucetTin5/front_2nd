import React, { useCallback, useMemo } from 'react';
import { Button, ButtonGroup, Flex, Heading, Stack } from '@chakra-ui/react';
import ScheduleTable from './ScheduleTable.tsx';
import { useScheduleContext } from './ScheduleContext.tsx';
import SearchDialog from './SearchDialog.tsx';
import { useState } from 'react';

const MemoizedScheduleTable = React.memo(ScheduleTable);

export const ScheduleTables = () => {
  const { schedulesMap, updateSchedule, addTable, removeTable } =
    useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  const handleDuplicate = useCallback(
    (targetId: string) => {
      const newTableId = `schedule-${Date.now()}`;
      addTable(newTableId, [...schedulesMap[targetId]]);
    },
    [addTable, schedulesMap]
  );

  const handleRemove = useCallback(
    (targetId: string) => {
      removeTable(targetId);
    },
    [removeTable]
  );

  const handleScheduleTimeClick = useCallback(
    (tableId: string, timeInfo: { day: string; time: number }) => {
      setSearchInfo({ tableId, ...timeInfo });
    },
    []
  );

  const handleDeleteButtonClick = useCallback(
    (tableId: string, { day, time }: { day: string; time: number }) => {
      const updatedSchedules = schedulesMap[tableId].filter(
        (schedule) => schedule.day !== day || !schedule.range.includes(time)
      );
      updateSchedule(tableId, updatedSchedules);
    },
    [schedulesMap, updateSchedule]
  );

  const renderedTables = useMemo(() => {
    return Object.entries(schedulesMap).map(([tableId, schedules], index) => (
      <Stack key={tableId} width="600px">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" fontSize="lg">
            시간표 {index + 1}
          </Heading>
          <ButtonGroup size="sm" isAttached>
            <Button
              colorScheme="green"
              onClick={() => setSearchInfo({ tableId })}
            >
              시간표 추가
            </Button>
            <Button
              colorScheme="green"
              mx="1px"
              onClick={() => handleDuplicate(tableId)}
            >
              복제
            </Button>
            <Button
              colorScheme="green"
              isDisabled={disabledRemoveButton}
              onClick={() => handleRemove(tableId)}
            >
              삭제
            </Button>
          </ButtonGroup>
        </Flex>
        <MemoizedScheduleTable
          schedules={schedules}
          tableId={tableId}
          onScheduleTimeClick={(timeInfo) =>
            handleScheduleTimeClick(tableId, timeInfo)
          }
          onDeleteButtonClick={(timeInfo) =>
            handleDeleteButtonClick(tableId, timeInfo)
          }
        />
      </Stack>
    ));
  }, [
    schedulesMap,
    handleDuplicate,
    handleRemove,
    handleScheduleTimeClick,
    handleDeleteButtonClick,
    disabledRemoveButton,
  ]);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {renderedTables}
      </Flex>
      <SearchDialog
        searchInfo={searchInfo}
        onClose={() => setSearchInfo(null)}
      />
    </>
  );
};
