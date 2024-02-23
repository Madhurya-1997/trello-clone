import { z } from "zod";

export const DeleteCard = z.object({
    id: z.string(), //card id
    boardId: z.string(),
})