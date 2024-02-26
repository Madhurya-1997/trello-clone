import Stripe from "stripe";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error) {
        return new NextResponse("Webhook error", { status: 400 });
    }

    /**
     * once the event is created, user can complete the payment and checkout (after they enter credit card
     * creds)
     */
    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

        if (!session?.metadata?.orgId) {
            return new NextResponse("OrgId is required", { status: 400 });
        }

        const newSub = await db.orgSubscription.create({
            data: {
                orgId: session?.metadata?.orgId,
                stripeCustomerId: subscription.customer as string,
                stripeSubscriptionId: subscription.id,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
            }
        })

        console.log("New subscription: ", newSub);
    }

    // user renewed their subscription
    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

        const updatedSub = await db.orgSubscription.update({
            where: {
                stripeSubscriptionId: subscription.id
            },
            data: {
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
            }
        })

        console.log("Updated subscription: ", updatedSub);
    }

    return new NextResponse(null, { status: 200 });
}