import { Flex, Box, Text, Avatar } from "@chakra-ui/react";

const user = {
  name: "Leonardo Marcos",
  email: "marcosleonardosss@gmail.com",
  image: "http://github.com/lmarcosss.png",
};

interface IProps {
  showProfileData: boolean;
}

export function Profile({ showProfileData }: IProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>{user.name}</Text>
          <Text color="gray.300" fontSize="small">
            {user.email}
          </Text>
        </Box>
      )}

      <Avatar size="md" name={user.name} src={user.image} />
    </Flex>
  );
}
