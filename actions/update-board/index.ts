"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateBoard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { title, id: boardId } = data;

    let board = null;
    try {
        board = await db.board.update({
            where: {
                id: boardId,
                orgId
            },
            data: {
                title
            }
        })
    } catch (error) {
        return {
            error: "Failed to update board title"
        }
    }

    revalidatePath(`/board/${boardId}`)

    return { data: board };
}

export const updateBoard = createSafeAction(UpdateBoard, handler);