import { Stripe } from 'stripe'

import { protectedProcedure, router } from '../trpc'
import db from '@/server/db/db'
import { users, orders } from '../db/schema'
import { TRPCError } from '@trpc/server'

const { NEXT_PUBLIC_SITE_URL, STRIPE_SECRET_KEY, STRIPE_PRICE_ID } = process.env

export const userRoutes = router({
  getPlan: protectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx
    const result = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, session.user.id),
      columns: { plan: true }
    })

    return result?.plan
  }),
  upgrade: protectedProcedure.mutation(async ({ ctx }) => {
    const stripe = new Stripe(STRIPE_SECRET_KEY!)

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${NEXT_PUBLIC_SITE_URL}/pay/callback/success`,
      cancel_url: `${NEXT_PUBLIC_SITE_URL}/pay/callback/cancel`
    })

    if (!session.url) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR'
      })
    }

    await db.insert(orders).values({
      sessionId: session.id,
      userId: ctx.session.user.id,
      status: 'created'
    })

    return {
      url: session.url
    }

    // await db.update(users).set({
    //   plan: 'payed'
    // })
  })
})
