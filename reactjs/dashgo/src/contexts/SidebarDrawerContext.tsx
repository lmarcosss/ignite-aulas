import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { createContext, ReactNode, useContext } from "react";

const SidebarDrawerContext = createContext({} as IContextData);

interface IProps {
  children: ReactNode;
}

type IContextData = UseDisclosureReturn;

export function SidebarDrawerProvider({ children }: IProps) {
  const disclosure = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    disclosure.onClose();
  }, [router.asPath]);

  return (
    <SidebarDrawerContext.Provider value={disclosure}>
      {children}
    </SidebarDrawerContext.Provider>
  );
}

export const useSidebarDrawer = () => useContext(SidebarDrawerContext);
