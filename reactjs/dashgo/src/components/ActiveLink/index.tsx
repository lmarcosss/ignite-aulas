import { useRouter } from "next/dist/client/router";
import Link, { LinkProps } from "next/link";
import { cloneElement, ReactElement } from "react";

interface IProps extends LinkProps {
  children: ReactElement;
  shouldMatchExactHref?: boolean;
}

export function ActiveLink({
  children,
  shouldMatchExactHref = false,
  ...props
}: IProps) {
  const { asPath } = useRouter();

  const isExactHref = asPath === props.href || asPath === props.as;
  const isHrefContained =
    asPath.startsWith(String(props.href)) ||
    asPath.startsWith(String(props.as));

  const isActive =
    (shouldMatchExactHref && isExactHref) ||
    (!shouldMatchExactHref && isHrefContained);

  return (
    <Link {...props}>
      {cloneElement(children, {
        color: isActive ? "pink.400" : "gray.50",
      })}
    </Link>
  );
}
