import { Separator } from "@/components/ui/separator";
import { Information } from "../_components/Information";
import { Suspense } from "react";
import ActivityList from "./_components/ActivityList";


export default function ActivityPage() {
    return (
        <div className="w-full">
            <Information />
            <Separator className="my-2" />

            <Suspense fallback={<ActivityList.Skeleton />}>
                <ActivityList />
            </Suspense>
        </div>
    )
}