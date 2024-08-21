import { useCallback, useState, useMemo, memo, useEffect } from 'react';
import { Button, ButtonGroup, Flex, Heading, Stack } from '@chakra-ui/react';
import ScheduleTable from './ScheduleTable.tsx';
import { useScheduleContext } from './ScheduleContext.tsx';
import SearchDialog from './SearchDialog.tsx';

interface ScheduleTableWrapperProps {
  tableId: string;
  index: number;
  setSearchInfo: (
    info: { tableId: string; day?: string; time?: number } | null
  ) => void;
}

const ScheduleTableWrapper = memo(
  ({ tableId, index, setSearchInfo }: ScheduleTableWrapperProps) => {
    const { getSchedules, updateSchedule, removeTable, addTable } =
      useScheduleContext();
    const schedules = useMemo(
      () => getSchedules(tableId),
      [getSchedules, tableId]
    );

    const handleScheduleTimeClick = useCallback(
      (timeInfo: { day: string; time: number }) => {
        setSearchInfo({ tableId, ...timeInfo });
      },
      [tableId, setSearchInfo]
    );

    const handleDeleteButtonClick = useCallback(
      ({ day, time }: { day: string; time: number }) => {
        const updatedSchedules = schedules.filter(
          (schedule) => schedule.day !== day || !schedule.range.includes(time)
        );
        updateSchedule(tableId, updatedSchedules);
      },
      [schedules, tableId, updateSchedule]
    );

    const handleDuplicate = useCallback(() => {
      const newTableId = `schedule-${Date.now()}`;
      addTable(newTableId, schedules);
    }, [addTable, schedules]);

    return (
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
            <Button colorScheme="green" mx="1px" onClick={handleDuplicate}>
              복제
            </Button>
            <Button colorScheme="green" onClick={() => removeTable(tableId)}>
              삭제
            </Button>
          </ButtonGroup>
        </Flex>
        <ScheduleTable
          schedules={schedules}
          tableId={tableId}
          onScheduleTimeClick={handleScheduleTimeClick}
          onDeleteButtonClick={handleDeleteButtonClick}
        />
      </Stack>
    );
  }
);

export const ScheduleTables = memo(() => {
  const { getAllTableIds, addTable } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);
  const [tableIds, setTableIds] = useState<string[]>([]);

  useEffect(() => {
    setTableIds(getAllTableIds());
  }, [getAllTableIds]);

  const handleAddTable = useCallback(() => {
    const newTableId = `schedule-${Date.now()}`;
    addTable(newTableId, []);
    setTableIds(getAllTableIds()); // 새 테이블 추가 후 ID 목록 업데이트
  }, [addTable, getAllTableIds]);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableIds.map((tableId, index) => (
          <ScheduleTableWrapper
            key={tableId}
            tableId={tableId}
            index={index}
            setSearchInfo={setSearchInfo}
          />
        ))}
        <Button onClick={handleAddTable}>새 시간표 추가</Button>
      </Flex>
      <SearchDialog
        searchInfo={searchInfo}
        onClose={() => setSearchInfo(null)}
      />
    </>
  );
});

export default ScheduleTables;
