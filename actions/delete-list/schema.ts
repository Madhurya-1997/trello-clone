import { z } from "zod";

export const DeleteList = z.object({
    id: z.string(), //list id
    boardId: z.string()
})