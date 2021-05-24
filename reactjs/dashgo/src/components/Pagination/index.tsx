import { Stack, Box } from "@chakra-ui/react";
import { PaginationItem } from "./PaginationItem";

export function Pagination() {
  return (
    <Stack
      direction={["column", "row"]}
      mt="8"
      justify="space-between"
      align="center"
    >
      <Box>
        <strong>0</strong> - <strong>10</strong> de <strong>100</strong>
      </Box>
      <Stack direction="row" spacing="2">
        <PaginationItem isCurrent={true} pageNumber={1} />
        <PaginationItem isCurrent={false} pageNumber={2} />
        <PaginationItem isCurrent={false} pageNumber={3} />
        <PaginationItem isCurrent={false} pageNumber={4} />
        <PaginationItem isCurrent={false} pageNumber={5} />
        <PaginationItem isCurrent={false} pageNumber={6} />
      </Stack>
    </Stack>
  );
}
