import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { ChangeEvent, useEffect, useState } from "react";
import { selectOneTask, selectWorkNoteByDate } from "../note/service/NoteService";
import { Task, WorkNote } from "../lib/db/db";
import { Card, CardContent, CardHeader, TextField, Typography } from "@mui/material";
import { getToday } from "../lib/utils";

export default function NotePage(){
    const [date,setDate] = useState<string>(getToday());
    const [dataMap, setDataMap] = useState<{[index:number] : [Task,WorkNote[]]}>({});

    useEffect(()=>{
        loadNoteList(date);
    },[date]);

    async function loadNoteList(date : string){
        const list = await selectWorkNoteByDate(date);
        const map : {[index:number] : [Task,WorkNote[]]} = {}
        for(let index = 0; index < list.length; index++) {
            const note = list[index];
            const task = await selectOneTask(note.taskId!);
            if(task){
                if(map[task.id!]){
                    map[task.id!][1].push(note);
                } else {
                    map[task.id!] = [task,[note]];
                }
            }
        }
        setDataMap(map);
    }

    function dateChangeHandler(e : ChangeEvent<HTMLInputElement>){
        setDate(e.currentTarget.value);
    }

    return (
        <Grid2
            width={'fit-content'}
        >
            <Card
                sx={{background : 'rgba(255,255,255,0.5)'}}
            >
                <CardHeader
                    title={
                        <TextField type="date" size="small" 
                            inputProps={{style:{fontSize : '13px', height:'15px'}}} variant="outlined" value={date} onChange={dateChangeHandler}
                            sx={{background:'white'}}
                         />
                    }
                />
                <CardContent
                    sx={{background : 'white'}}
                >
                    {
                        Object.keys(dataMap)?.map(taskId=>{
                            const data = dataMap[parseInt(taskId)];
                            return (
                                <Grid2 key={data[0].id}>
                                    <Typography fontWeight={'bold'} fontSize={13}>{data[0].title}</Typography>
                                    {data[1].map(note=>(
                                        <Typography key={note.id} paragraph={true} paddingLeft={2} style={{whiteSpace:'pre-line'}}
                                            fontSize={13}
                                        >{note.content}</Typography>
                                    ))}
                                </Grid2>
                            )
                        })
                    }
                </CardContent>
            </Card>
        </Grid2>
    )
}