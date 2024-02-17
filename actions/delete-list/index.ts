"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteList } from "./schema";
import { redirect } from "next/navigation";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { id, boardId } = data;

    try {
        await db.list.delete({
            where: {
                id,
                boardId,
                board: {
                    orgId
                }
            }
        })
    } catch (error) {
        return {
            error: "Failed to delete list"
        }
    }

    revalidatePath(`/board/${boardId}`)

    redirect(`/board/${boardId}`);
}

export const deleteList = createSafeAction(DeleteList, handler);