"use client"

import { ListWithCards } from "@/types";
import { ListForm } from "./ListForm";
import { useEffect, useState } from "react";
import { ListItem } from "./ListItem";

import {
    DragDropContext,
    Droppable
} from "@hello-pangea/dnd";

interface ListContainerProps {
    data: ListWithCards[];
    boardId: string;
}

export const ListContainer = ({
    data,
    boardId
}: ListContainerProps) => {

    /**
     * putting the data prop into state gives us an optimistic mutation updates whenever we are dealing 
     * with drag n drop features...
     * 
     * We could do it in the DB, but having state do it for us and updating accordingly should
     * be a better approach
     */
    const [orderedData, setOrderedData] = useState(data);

    useEffect(() => {
        setOrderedData(data);
    }, [data])


    return (
        <DragDropContext onDragEnd={() => { }}>
            <Droppable droppableId="lists" type="list" direction="horizontal">
                {(provided) => (
                    <ol
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex gap-x-3 h-full">
                        {orderedData.map((list, index) => (
                            <ListItem key={list.id} index={index} data={list} />
                        ))}
                        {provided.placeholder}
                        <ListForm />
                        <div className="flex-shrink-0 w-1" />
                    </ol>
                )}

            </Droppable>

        </DragDropContext>


    )
}