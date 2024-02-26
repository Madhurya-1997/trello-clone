import { checkSubscription } from "@/lib/subscription"
import { Information } from "../_components/Information";
import { Separator } from "@/components/ui/separator";
import { SubscriptionButton } from "./_components/SubscriptionButton";


export default async function BillingPage() {
    const isPremium = await checkSubscription();

    return (
        <div className="w-full">
            <Information isPremium={isPremium} />
            <Separator className="my-2" />
            <SubscriptionButton isPremium={isPremium} />
        </div>
    )
}