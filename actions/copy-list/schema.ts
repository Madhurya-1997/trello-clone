import { z } from "zod";

export const CopyList = z.object({
    id: z.string(), //list id
    boardId: z.string()
})