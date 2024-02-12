import { Separator } from "@/components/ui/separator";
import { Information } from "./_components/Information";
import { BoardList } from "./_components/BoardList";

export default function OrganizationIdPage() {

    return (
        <div className="w-full mb-20">
            <Information />
            <Separator className="my-4" />

            <div className="px-2 md:px-4">
                <BoardList />
            </div>
        </div>
    )
}