import {
    AuditLog
} from "@prisma/client";

export const activityLogMessage = ({
    action,
    entityTitle,
    entityType
}: AuditLog) => {

    switch (action) {
        case "CREATE":
            return `created ${entityType.toLocaleLowerCase()} "${entityTitle}"`
        case "UPDATE":
            return `updated ${entityType.toLocaleLowerCase()} "${entityTitle}"`
        case "DELETE":
            return `deleted ${entityType.toLocaleLowerCase()} "${entityTitle}"`
        default:
            return `unknown action ${entityType.toLocaleLowerCase()} "${entityTitle}"`
    }
}