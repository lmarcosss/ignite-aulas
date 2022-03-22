import { render, screen } from '@testing-library/react';
import { stripe } from '../../services/stripe';
import Home, { getStaticProps } from '../../pages';
import { mocked } from 'jest-mock';

jest.mock('next/router');
jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false]
    }
  }
});

jest.mock('../../services/stripe');

describe('Home page', () => {
  it('renders correctly', () => {
    const amountMock = '$10,00';

    render(<Home product={{
      priceId: 'fake-price-id',
      amount: amountMock,
    }} />);

    expect(screen.getByText(`for ${amountMock} month`)).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve);

    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    )
  })
}) 