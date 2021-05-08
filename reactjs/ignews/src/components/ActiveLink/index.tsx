import Link, { LinkProps } from 'next/link';
import { ReactElement, cloneElement } from 'react';
import { useRouter } from 'next/router';

interface Props extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}
export function ActiveLink({ activeClassName, children, ...rest }: Props) {
  const { asPath } = useRouter();

  const className = rest.href === asPath ? activeClassName : '';

  return <Link {...rest}>{cloneElement(children, { className })}</Link>;
}
