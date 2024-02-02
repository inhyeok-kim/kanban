import React, { createContext, useContext, useEffect, useState } from "react";
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
import { Drawer, Stack } from "@mui/material";
import { Column, DB, Task } from "../../lib/db/db";
import { createKanbanCard, selectKanbanData, reorderTask, deleteKanbanCard } from "../service/KanbanService";
import TaskDrawer from "./TaskDrawer";

export const BoardContext = createContext<BoardContext>({
  createNewCard : ()=>{},
  deleteCard : ()=>{},
  openDrawer : ()=>{}
});
export interface BoardContext {
  createNewCard : Function
  deleteCard : Function
  openDrawer : Function
}

export interface BoardData {
  [index : string | number] : Column
}

export default function Board() {
  const [items, setItems] = useState({} as BoardData);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerItem, setDrawerItem] = useState<Task|null>(null);

  useEffect(()=>{
    loadBoardData();
  },[]);

  async function loadBoardData(){
    const data : BoardData = {};
    const list = await selectKanbanData();
    for(let i=0; i < list.length; i++){
      const column = list[i];
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
    // useSensor(KeyboardSensor, {
    //   coordinateGetter: sortableKeyboardCoordinates
    // })
  );

  async function createNewCard(colId : string){
    const id = parseInt(colId.replace('Col',''));
    await createKanbanCard(id);
    loadBoardData();
  }

  async function deleteCard(item : Task){
    await deleteKanbanCard(item);
    loadBoardData();
  }

  function openDrawer(item : Task){
    setDrawerOpen(true);
    setDrawerItem(item);
  }

  return (
    <BoardContext.Provider value={{createNewCard, deleteCard, openDrawer}}>
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
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={()=>{setDrawerOpen(false)}}
      >
        {drawerItem?
          <TaskDrawer item={drawerItem} />
          :''
        }
      </Drawer>
    </BoardContext.Provider>
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
    let newItems = items;
    if (activeIndex !== overIndex) {
      newItems = {
        ...items,
        [overContainer]: {
            id : items[activeContainer].id,
            name : items[activeContainer].name,
            items : arrayMove(items[overContainer].items!, activeIndex, overIndex)
        }
      };
      setItems(newItems);
    }
    newItems[activeContainer].items?.forEach((item,index)=>{
      const updt = {...item};
      updt.columnId = newItems[activeContainer].id!;
      updt.order = index;
      reorderTask(updt);
    });

    //@ts-ignore
    setActiveId(null);
  }
}
