import { z } from "zod";

export const UpdateCard = z.object({
    title: z.optional(
        z.string({
            invalid_type_error: "Title is required",
            required_error: "Title is required"
        }).min(3, {
            message: "Title is too short"
        })
    ),
    description: z.optional(
        z.string({
            invalid_type_error: "Description is required",
            required_error: "Description is required"
        }).min(3, {
            message: "Description is too short"
        })
    ),
    boardId: z.string(),
    id: z.string() //card id
})