import { useCallback, useState, useRef, memo } from 'react';
import { Box, Table, Tbody, Tr, Td, Button } from '@chakra-ui/react';
import { Lecture } from './types';

interface LectureListProps {
  lectures: Lecture[];
  addSchedule: (lecture: Lecture) => void;
}

const ITEMS_PER_PAGE = 50;
const OVERSCAN_COUNT = 5;

const LectureList = memo(({ lectures, addSchedule }: LectureListProps) => {
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rowHeight = 40;

  const visibleLectures = lectures.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE + OVERSCAN_COUNT
  );

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop } = containerRef.current;
      const newStartIndex = Math.floor(scrollTop / rowHeight);
      setStartIndex(newStartIndex);
    }
  }, [rowHeight]);

  const rowVirtualizer = useCallback(
    (index: number) => ({
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: `${rowHeight}px`,
      transform: `translateY(${index * rowHeight}px)`,
    }),
    [rowHeight]
  );

  return (
    <Box
      overflowY="auto"
      maxH="500px"
      ref={containerRef}
      onScroll={handleScroll}
    >
      <Table size="sm" variant="striped">
        <Tbody>
          <Tr>
            <Td padding={0} colSpan={7}>
              <Box
                height={`${lectures.length * rowHeight}px`}
                position="relative"
              >
                {visibleLectures.map((lecture, index) => (
                  <Tr
                    key={`${lecture.id}-${startIndex + index}`}
                    style={
                      rowVirtualizer(startIndex + index) as React.CSSProperties
                    }
                  >
                    <Td width="100px">{lecture.id}</Td>
                    <Td width="50px">{lecture.grade}</Td>
                    <Td width="200px">{lecture.title}</Td>
                    <Td width="50px">{lecture.credits}</Td>
                    <Td
                      width="150px"
                      dangerouslySetInnerHTML={{ __html: lecture.major }}
                    />
                    <Td
                      width="150px"
                      dangerouslySetInnerHTML={{ __html: lecture.schedule }}
                    />
                    <Td width="80px">
                      <Button
                        size="sm"
                        colorScheme="green"
                        onClick={() => addSchedule(lecture)}
                      >
                        추가
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Box>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
});

export default LectureList;
