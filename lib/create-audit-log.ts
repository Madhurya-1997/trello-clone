import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs";
import { db } from "./db";

interface Props {
    entityId: string;
    entityType: ENTITY_TYPE;
    entityTitle: string;
    action: ACTION;
}

export const createAuditLog = async ({
    entityId,
    entityTitle,
    entityType,
    action
}: Props) => {

    try {
        const { orgId } = auth();
        const user = await currentUser();

        if (!orgId || !user) {
            throw new Error("User not found");
        }

        await db.auditLog.create({
            data: {
                orgId,
                entityId,
                entityType,
                action,
                entityTitle,
                userId: user.id,
                userName: `${user.firstName} ${user.lastName}`,
                userImage: user.imageUrl
            }
        })

    } catch (error) {
        console.log("[AUDIT_LOG_ERROR]", error)
    }

}