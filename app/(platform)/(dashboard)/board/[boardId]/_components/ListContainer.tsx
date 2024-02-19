"use client"

import { ListWithCards } from "@/types";
import { ListForm } from "./ListForm";
import { useEffect, useState } from "react";
import { ListItem } from "./ListItem";

import {
    DragDropContext,
    Droppable
} from "@hello-pangea/dnd";
import { reorder } from "@/lib/reorder";

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
    }, [data]);

    const onDragEnd = (result: any) => {
        console.log(result);
        const { destination, source, type } = result;

        if (!destination) {
            return;
        }

        // if the list or card is dropped in the same position
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        // if list is being drag and dropped
        if (type === "list") {
            // reorder it in component's state
            const items = reorder(
                orderedData,
                source.index,
                destination.index
            ).map((item, index) => (
                { ...item, order: index }
            ));

            setOrderedData(items);

            // todo: use server action to persist it in DB
        }

        // if card is being drag and dropped
        if (type === "card") {
            // reorder it in component's state
            const newOrderedData = [...orderedData];

            // find the source and destination list to rearrange the cards
            const sourceList = newOrderedData.find(list => list.id === source.droppableId);
            const destinationList = newOrderedData.find(list => list.id === destination.droppableId);

            if (!sourceList || !destinationList) {
                return;
            }

            if (!sourceList.cards) {
                sourceList.cards = [];
            }
            if (!destination.cards) {
                destination.cards = [];
            }

            // moving the card in same list
            if (source.droppableId === destination.droppableId) {
                const reorderedCards = reorder(
                    sourceList.cards,
                    source.index,
                    destination.index
                );
                reorderedCards.forEach((card, i) => {
                    card.order = i;
                });
                sourceList.cards = reorderedCards;

                setOrderedData(newOrderedData);
                // todo: use server action to persist it in DB
            } else {
                // remove card from sourceList
                const [movedCard] = sourceList.cards.splice(source.index, 1);

                // add the removed card into the destination list
                movedCard.listId = destinationList.id;

                // add the card to the destination list
                destinationList.cards.splice(destination.index, 0, movedCard);

                sourceList.cards.forEach((card, i) => {
                    card.order = i;
                })
                destinationList.cards.forEach((card, i) => {
                    card.order = i;
                })

                setOrderedData(newOrderedData);
                // todo: use server action to persist it in DB
            }
        }
    }


    return (
        <DragDropContext onDragEnd={onDragEnd}>
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