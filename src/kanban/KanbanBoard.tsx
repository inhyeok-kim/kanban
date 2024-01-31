import KanbanList from "./KanbanList";
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import { useState } from "react";
import { Stack } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

const _data = [
    {
        id : '0',
        name : '대기',
        items : [
            {id : 'test1-1', title : 'hi'},
            {id : 'test2-1', title : 'bye'}
        ]
    },
    {
        id : '1',
        name : '진행',
        items : [
            {id : 'test1-2', title : 'hi'},
            {id : 'test2-2', title : 'bye'}
        ]
    },
]

function reorder(list : Array<any>, startIndex : number, endIndex : number){
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
};

function move(source : Array<any>, startIndex : number, destination :Array<any>, endIndex : number){
    const [removed] = source.splice(startIndex, 1);
    destination.splice(endIndex, 0, removed);
  
    return [source,destination];
};

export default function KanbanBoard(){
    const [data, setData] = useState(_data);

    return (
        <Grid2>

        </Grid2>
    )
}