import { z } from "zod";

export const CopyCard = z.object({
    id: z.string(), //card id
    boardId: z.string(),
})