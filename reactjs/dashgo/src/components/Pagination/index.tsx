import { Stack, Box, Text } from "@chakra-ui/react";
import { PaginationItem } from "./PaginationItem";

interface PaginationProps {
  totalCountOfRegisters: number;
  registersPerPage?: number;
  currentPage?: number;
  onPageChange: (page: number) => void;
}

const siblingsCount = 1;

function generatePagesArray(from: number, to: number) {
  return [...new Array(siblingsCount)]
    .map((_, index) => from + index + 1)
    .filter(page => page > 0);
}
 
export function Pagination({
  totalCountOfRegisters,
  registersPerPage = 5,
  currentPage = 1,
  onPageChange,
}: PaginationProps) {
  const lastPage = Math.floor(totalCountOfRegisters / registersPerPage);

  const previousPages = currentPage > 1 
    ? generatePagesArray(
        currentPage - 1 - siblingsCount, // from
        currentPage - 1, // to
      )
    : [];

  const nextPages = currentPage < lastPage
    ? generatePagesArray(
        currentPage, // from
        Math.min(currentPage + siblingsCount, lastPage), // to
      )
    : [];

  return (
    <Stack
      direction={["column", "row"]}
      mt="8"
      justify="space-between"
      align="center"
    >
      <Box>
        <strong>{currentPage}</strong> - <strong>{currentPage * registersPerPage}</strong> de <strong>{totalCountOfRegisters}</strong>
      </Box>
      <Stack direction="row" spacing="2">
        {currentPage > (1 + siblingsCount) && (
          <>
            <PaginationItem onPageChange={onPageChange} pageNumber={1} />
            {currentPage > (2 + siblingsCount) && (
              <Text
                color="gray.300"
                textAlign="center"
                width="8"
              >
                ...
              </Text>
            )}
          </>
        )}
        {previousPages.length > 0 && previousPages.map(page => (
          <PaginationItem onPageChange={onPageChange} pageNumber={page} key={page} />
        ))}
        <PaginationItem onPageChange={onPageChange} pageNumber={currentPage} isCurrent />
        {nextPages.length > 0 && nextPages.map(page => (
          <PaginationItem onPageChange={onPageChange} pageNumber={page} key={page} />
        ))}

        {(currentPage + siblingsCount) < lastPage && (
          <>
            {(currentPage + 1 + siblingsCount) < lastPage && (
              <Text
                color="gray.300"
                textAlign="center"
                width="8"
              >
                ...
              </Text>
            )}
            <PaginationItem onPageChange={onPageChange} pageNumber={lastPage} />
          </>
        )}
      </Stack>
    </Stack>
  );
}
