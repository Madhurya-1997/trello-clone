import { z } from "zod";

export const CreateList = z.object({
    title: z.string({
        invalid_type_error: "Title is required",
        required_error: "Title is required"
    }).min(3, {
        message: "Title is too short"
    }),
    boardId: z.string() //board id
})