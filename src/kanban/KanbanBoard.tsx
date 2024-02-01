import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  useSensor,
  useSensors,
  MouseSensor
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import KanbanList from "./KanbanList";
import KanbanCard from "./KanbanCard";
import { Stack } from "@mui/material";

const wrapperStyle = {
  display: "flex",
  flexDirection: "row"
};

export default function Board() {
  const [items, setItems] = useState({
    'T1': {id : 'T1', name:'대기',items : [{id:"a1",content:'a1'}, {id:"a2",content:'a2'}, {id:"a3",content:'a3'}]},
    'T2': {id : 'T2', name:'진행',items : [{id:"b1",content:'b1'}, {id:"b2",content:'b2'}, {id:"b3",content:'b3'}]},
    'T3': {id : 'T3', name:'완료',items : [{id:"c1",content:'c1'}, {id:"c2",content:'c2'}, {id:"c3",content:'c3'}]},
    'T4': {id : 'T4', name:'취소',items : [{id:"d1",content:'d1'}, {id:"d2",content:'d2'}, {id:"d3",content:'d3'}]},
  } as {[index : string] : any});
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
    <div style={wrapperStyle as React.CSSProperties}>
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
              <KanbanList key={id} itemList={items[id]} />
          ))}
        </Stack>
        <DragOverlay>{activeItem ? <KanbanCard item={activeItem} /> : null}</DragOverlay>
      </DndContext>
    </div>
  );

  function findContainer(id : any) {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].items.find((item : any)=>item.id===id));
  }

  function handleDragStart(event : any) {
    const { active } = event;
    const { data } = active;
    
    
    setActiveId(data.current);
  }

  function handleDragOver(event : any) {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over;

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
      const activeItems = prev[activeContainer].items;
      const overItems = prev[overContainer].items;

      // Find the indexes for the items
      const activeIndex = activeItems.findIndex((item : any)=>item.id === id);
      const overIndex = overItems.findIndex((item : any)=>item.id === overId);
      
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
            items : [...prev[activeContainer].items.filter((item : any) => item.id !== active.id)]
        },
        [overContainer]: {
            id : prev[overContainer].id,
            name : prev[overContainer].name,
            items : [...prev[overContainer].items.slice(0, newIndex),
            items[activeContainer].items[activeIndex],
            ...prev[overContainer].items.slice(newIndex, prev[overContainer].length)]
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

    const activeIndex = items[activeContainer].items.findIndex((item : any)=>item.id === active.id);
    const overIndex = items[overContainer].items.findIndex((item : any)=>item.id === overId);

    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: {
            id : items[activeContainer].id,
            name : items[activeContainer].name,
            items : arrayMove(items[overContainer].items, activeIndex, overIndex)
        }
      }));
    }

    //@ts-ignore
    setActiveId(null);
  }
}
