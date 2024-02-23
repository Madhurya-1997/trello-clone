"use client";

import { Card } from "@prisma/client";

import {
    Draggable
} from "@hello-pangea/dnd"
import { useCardModal } from "@/hooks/useCardModal";


interface CardItemProps {
    index: number;
    data: Card;
}


export const CardItem = ({
    data,
    index
}: CardItemProps) => {

    const cardModal = useCardModal();

    return (
        <Draggable draggableId={data.id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    onClick={() => cardModal.onOpen(data.id)}
                    className="truncate border-2 border-transparent hover:border-black py-1 px-3 text-sm bg-white rounded-md shadow-sm"
                    role="button"
                >
                    {data.title}
                </div>
            )}
        </Draggable>

    )
}