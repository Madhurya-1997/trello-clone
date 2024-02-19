import { updateList } from "@/actions/update-list";
import { UpdateList } from "@/actions/update-list/schema";
import { FormInput } from "@/components/form/input";
import { useAction } from "@/hooks/useAction";
import { List } from "@prisma/client"
import { useParams } from "next/navigation";

import { useState, useRef, ElementRef, KeyboardEvent, KeyboardEventHandler } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { ListOptions } from "./ListOptions";

interface ListHeaderProps {
    data: List;
    onAddCard: () => void;
}

export const ListHeader = ({
    data,
    onAddCard
}: ListHeaderProps) => {

    const params = useParams();

    const [title, setTitle] = useState(data.title);
    const [isEditing, setIsEditing] = useState(false);

    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const { execute } = useAction(updateList, {
        onSuccess: (data) => {
            toast.success(`Renamed to "${data.title}"`);
            setTitle(data.title);
            disableEditing();
        },
        onError: (error) => {
            console.log(error);
            toast.error(error);
        }
    })

    const enableEditing = () => {
        setIsEditing(true);

        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        })
    }

    const disableEditing = () => setIsEditing(false)

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            formRef.current?.requestSubmit();
        }
    }

    useEventListener("keydown", onKeyDown);

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const id = formData.get("id") as string;
        const boardId = params.boardId as string;

        if (title === data.title) {
            disableEditing();
            return;
        }

        execute({ title, boardId, id });
    }

    const onBlur = () => formRef.current?.requestSubmit();

    return (
        <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
            {isEditing ? (
                <form
                    action={onSubmit}
                    ref={formRef}
                    className="flex-1 px-[2px]">
                    <input
                        hidden
                        id="id"
                        name="id"
                        value={data.id}
                        onChange={() => { }}
                    />
                    <input
                        hidden
                        id="boardId"
                        name="boardId"
                        value={data.boardId}
                        onChange={() => { }}
                    />

                    <FormInput
                        ref={inputRef}
                        onBlur={onBlur}
                        id="title"
                        placeholder="Enter list title"
                        defaultValue={title}
                        className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition bg-transparent focus:bg-white truncate"
                    />
                    <button hidden type="submit" />
                </form>
            ) : (
                <div
                    onClick={enableEditing}
                    className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent">
                    {title}
                </div>
            )}

            <ListOptions data={data} onAddCard={onAddCard} />

        </div>
    )
}