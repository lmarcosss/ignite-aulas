import {
  FormControl,
  FormLabel,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FieldError } from "react-hook-form";

interface InputProps extends ChakraInputProps {
  label?: string;
  error: FieldError;
}
export function Input({ label, error, ...props }: InputProps) {
  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={props.name}>{label}</FormLabel>}
      <ChakraInput
        {...props}
        id={props.name}
        focusBorderColor="pink.500"
        bgColor="gray.900"
        variant="filled"
        _hover={{ bgColor: "gray.900" }}
        size="lg"
      />
      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
}
