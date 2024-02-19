"use client";

import { Card } from "@prisma/client";


interface CardItemProps {
    index: number;
    data: Card;
}


export const CardItem = ({
    data,
    index
}: CardItemProps) => {
    return (
        <div
            className="truncate border-2 border-transparent hover:border-black py-1 px-3 text-sm bg-white rounded-md shadow-sm"
            role="button"
        >
            {data.title}
        </div>
    )
}