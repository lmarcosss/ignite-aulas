import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import Stripe from 'stripe';
import { stripe } from '../../services/stripe';
import { saveSubscription } from './_lib/manageSubscription';

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const EVENT = {
  CHECKOUT_SESSION_COMPLETED: 'checkout.session.completed',
  CUSTOMER_SUBSCRIPTION_CREATED: 'customer.subscription.created',
  CUSTOMER_SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  CUSTOMER_SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
};

const relevantEvents = new Set([
  EVENT.CHECKOUT_SESSION_COMPLETED,
  EVENT.CUSTOMER_SUBSCRIPTION_CREATED,
  EVENT.CUSTOMER_SUBSCRIPTION_UPDATED,
  EVENT.CUSTOMER_SUBSCRIPTION_DELETED,
]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const secret = req.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      return res.status(400).send(`Webhook-error: ${error.message}`);
    }

    const type = event.type;

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case EVENT.CUSTOMER_SUBSCRIPTION_CREATED:
          case EVENT.CUSTOMER_SUBSCRIPTION_DELETED:
          case EVENT.CUSTOMER_SUBSCRIPTION_UPDATED:
            const subscription = event.data.object as Stripe.Subscription;

            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              type === EVENT.CUSTOMER_SUBSCRIPTION_CREATED,
            );
            break;

          case EVENT.CHECKOUT_SESSION_COMPLETED:
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;

            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true,
            );
            break;

          default:
            throw new Error('Unhandled event.');
        }
      } catch (error) {
        return res.json({ error: 'Webhook handler failed.' });
      }
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not alowed');
  }
};
