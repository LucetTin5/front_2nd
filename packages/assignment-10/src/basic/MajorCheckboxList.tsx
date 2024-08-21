import { memo } from 'react';
import { Stack, Box, Checkbox } from '@chakra-ui/react';

interface MajorCheckboxListProps {
  allMajors: string[];
}

export const MajorCheckboxList = memo(
  ({ allMajors }: MajorCheckboxListProps) => (
    <Stack
      spacing={2}
      overflowY="auto"
      h="100px"
      border="1px solid"
      borderColor="gray.200"
      borderRadius={5}
      p={2}
    >
      {allMajors.map((major) => (
        <Box key={major}>
          <Checkbox size="sm" value={major}>
            {major.replace(/<p>/gi, ' ')}
          </Checkbox>
        </Box>
      ))}
    </Stack>
  )
);
