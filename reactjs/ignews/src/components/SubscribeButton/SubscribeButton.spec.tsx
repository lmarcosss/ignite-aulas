import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { signIn, useSession } from 'next-auth/client';
import { SubscribeButton } from '.';
import { useRouter } from 'next/router'

jest.mock('next-auth/client');
jest.mock('next/router');

describe('SubscribeButton component', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(
      <SubscribeButton />
    );
  
    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  });

  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = mocked(signIn);
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(
      <SubscribeButton />
    );

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it('redirects to posts when user already authenticated', () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);

    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: 'Fulano de Tal',
          email: 'fulanodetal@gmail.com',
        },
        expires: 'fake-expires',
        activeSubscription: 'fake-active-subscription',
      }, 
      false
    ])

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    render(
      <SubscribeButton />
    );

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith('/posts');
  });
})