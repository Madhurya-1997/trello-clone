"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { StripeRedirect } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { absoluteUrl } from "@/lib/utils";
import { stripe } from "@/lib/stripe";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    const user = await currentUser();

    if (!userId || !orgId || !user) {
        return {
            error: "Unauthorized"
        }
    }

    const settingsUrl = absoluteUrl(`/organization/${orgId}`);

    console.log(settingsUrl);

    let url = "";

    try {
        const orgSubscription = await db.orgSubscription.findUnique({
            where: {
                orgId
            }
        });

        if (orgSubscription && orgSubscription.stripeCustomerId) {
            console.log("Inside stripe session");
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: orgSubscription.stripeCustomerId,
                return_url: settingsUrl
            });

            url = stripeSession.url;
        } else {
            console.log("Inside create stripe session");
            const stripeSession = await stripe.checkout.sessions.create({
                success_url: settingsUrl,
                cancel_url: settingsUrl,
                payment_method_types: ["card"],
                mode: "subscription",
                billing_address_collection: "auto",
                customer_email: user.emailAddresses[0].emailAddress,
                line_items: [
                    {
                        price_data: {
                            currency: "USD",
                            product_data: {
                                name: "TaskHub Premium",
                                description: "Unlimited boards for your organization"
                            },
                            unit_amount: 2000,
                            recurring: {
                                interval: "month"
                            }
                        },
                        quantity: 1
                    }
                ],
                metadata: {
                    orgId
                }
            })

            console.log(stripeSession);

            url = stripeSession.url || "";
        }

    } catch (error) {
        console.log(error)
        return {
            error: "Something went wrong"
        }
    }

    revalidatePath(`/organization/${orgId}`);

    return { data: url };
}

export const stripeRedirect = createSafeAction(StripeRedirect, handler);