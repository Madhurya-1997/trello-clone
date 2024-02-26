import { Separator } from "@/components/ui/separator";
import { Information } from "../_components/Information";
import { Suspense } from "react";
import ActivityList from "./_components/ActivityList";
import { checkSubscription } from "@/lib/subscription";


export default async function ActivityPage() {

    const isPremium = await checkSubscription();

    return (
        <div className="w-full">
            <Information isPremium={isPremium} />
            <Separator className="my-2" />

            <Suspense fallback={<ActivityList.Skeleton />}>
                <ActivityList />
            </Suspense>
        </div>
    )
}