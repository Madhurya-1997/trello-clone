"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { hasAvailableCount, incrementAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const canCreate = await hasAvailableCount();
    const isPremium = await checkSubscription();

    if (!canCreate && !isPremium) {
        return {
            error: "You have reached your limit of free boards. Please upgrade to create more."
        }
    }

    const { title, image } = data;

    const [
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUsername,
    ] = image.split("|");

    if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUsername) {
        return {
            error: "Missing fields. Failed to create board"
        }
    }


    let board = null;
    try {
        board = await db.board.create({
            data: {
                orgId,
                title,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageUsername,
                imageLinkHTML,
            }
        });

        if (!isPremium) await incrementAvailableCount();

        await createAuditLog({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.CREATE
        });
    } catch (error) {
        return {
            error: "Failed to create board"
        }
    }

    revalidatePath(`/board/${board.id}`)

    return { data: board };
}

export const createBoard = createSafeAction(CreateBoard, handler);