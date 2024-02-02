import React, { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  useSensor,
  useSensors,
  MouseSensor,
  DragOverEvent
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import KanbanList from "./KanbanList";
import KanbanCard from "./KanbanCard";
import { Stack } from "@mui/material";
import { Column, DB, Task } from "../lib/db/db";

export interface BoardData {
  [index : string | number] : Column
}

export default function Board() {
  const [items, setItems] = useState({
  } as BoardData);

  useEffect(()=>{
    initBoardData();
  },[]);
  useEffect(()=>{
    // console.log(items);
  },[items]);

  async function initBoardData(){
    const data : BoardData = {};
    const columns : Column[] = await DB.columns.toArray();
    for(let i=0; i < columns.length; i++){
      const column = columns[i];
      const tasks = await DB.tasks.filter(task=>task.columnId === column.id).toArray();
      column.items = tasks;
      data["Col"+column.id!] = column;
    }
    setItems(data);
  }
  
  const [activeItem, setActiveId] = useState();

  const sensors = useSensors(
    useSensor(MouseSensor,{
        activationConstraint : {
            distance : 5,
        }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  return (
    <DndContext
      // announcements={defaultAnnouncements}
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Stack
        direction={"row"}
        spacing={2}
      >
        {Object.keys(items).map((id : any)=>(
            <KanbanList key={"Col"+id} itemList={items[id]} />
        ))}
      </Stack>
      <DragOverlay>{activeItem ? <KanbanCard item={activeItem} /> : null}</DragOverlay>
    </DndContext>
  );

  function findContainer(id : any) {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].items!.find((item : any)=>item.id===id));
  }

  function handleDragStart(event : any) {
    const { active } = event;
    const { data } = active;
    
    
    setActiveId(data.current);
  }

  function handleDragOver(event : DragOverEvent) {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over!;
    // Find the containers
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer].items!;
      const overItems = prev[overContainer].items!;

      // Find the indexes for the items
      const activeIndex = activeItems.findIndex((item : Task)=>item.id === id);
      const overIndex = overItems.findIndex((item : Task)=>item.id === overId);
      
      let newIndex;
      if (overId in prev) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
            over &&
            overIndex === overItems.length - 1;
        //   draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;
            const modifier = isBelowLastItem ? 1 : 0;
    
            newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;

      }

      return {
        ...prev,
        [activeContainer]: {
            id : prev[activeContainer].id,
            name : prev[activeContainer].name,
            items : [...prev[activeContainer].items!.filter((item : Task) => item.id !== active.id)]
        },
        [overContainer]: {
            id : prev[overContainer].id,
            name : prev[overContainer].name,
            items : [...prev[overContainer].items!.slice(0, newIndex),
            items[activeContainer].items![activeIndex],
            ...prev[overContainer].items!.slice(newIndex, prev[overContainer].items!.length)]
        }
      };
    });
  }

  function handleDragEnd(event : any) {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = items[activeContainer].items!.findIndex((item : Task)=>item.id === active.id);
    const overIndex = items[overContainer].items!.findIndex((item : Task)=>item.id === overId);

    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: {
            id : items[activeContainer].id,
            name : items[activeContainer].name,
            items : arrayMove(items[overContainer].items!, activeIndex, overIndex)
        }
      }));
    }

    //@ts-ignore
    setActiveId(null);
  }
}
