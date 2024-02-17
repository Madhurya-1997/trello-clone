import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ListContainer } from "./_components/ListContainer";

interface BoardIdListProps {
    boardId: string;
}

export default async function BoardIdList({
    boardId
}: BoardIdListProps) {

    const { orgId } = auth();

    if (!orgId) {
        redirect("/select-org");
    }

    const lists = await db.list.findMany({
        where: {
            boardId,
            board: {
                orgId
            }
        },
        include: {
            cards: {
                orderBy: {
                    order: "asc"
                }
            }
        },
        orderBy: {
            order: "asc"
        }
    })

    return (
        <div className="p-4 h-full overflow-x-auto">
            <ListContainer boardId={boardId} data={lists} />
        </div>
    )
}