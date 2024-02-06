import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { ChangeEvent, useEffect, useState } from "react";
import { selectOneTask, selectWorkNoteByDate, selectWorkNoteByPeriod } from "../note/service/NoteService";
import { Task, WorkNote } from "../lib/db/db";
import { Button, Card, CardContent, CardHeader, TextField, Typography } from "@mui/material";
import { getToday } from "../lib/utils";
import { blueGrey } from "@mui/material/colors";

export default function NotePage(){
    const [date,setDate] = useState<string[]>([getToday(),getToday()]);
    const [dataMap, setDataMap] = useState<{[index:number] : [Task,WorkNote[]]}>({});

    useEffect(()=>{
        loadNoteList();
    },[date]);

    async function loadNoteList(){
        const list = await selectWorkNoteByPeriod(date[0],date[1]);
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

    function dateChangeHandler(e : ChangeEvent<HTMLInputElement>, index :number){
        const newDate = [...date];
        newDate[index] = e.currentTarget.value;
        setDate(newDate);
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
                        <>
                            <TextField type="date" size="small" 
                                inputProps={{style:{fontSize : '13px', height:'15px'}}} variant="outlined" value={date[0]} onChange={(e : ChangeEvent<HTMLInputElement>)=>{dateChangeHandler(e,0)}}
                                sx={{background:'white'}}
                            /> 
                            &nbsp;&nbsp;~&nbsp;&nbsp;
                            <TextField type="date" size="small" 
                                inputProps={{style:{fontSize : '13px', height:'15px'}}} variant="outlined" value={date[1]} onChange={(e : ChangeEvent<HTMLInputElement>)=>{dateChangeHandler(e,1)}}
                                sx={{background:'white'}}
                            />
                        </>
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
                                        <Grid2
                                            position={'relative'}
                                        >
                                            <Typography key={note.id} paragraph={true} paddingLeft={2} style={{whiteSpace:'pre-line'}}
                                                fontSize={13}
                                            >
                                                {note.content}
                                            </Typography>
                                            <Typography
                                                sx={{userSelect:'none'}}
                                                position={'absolute'}
                                                top={0}
                                                left={0}
                                                component={'span'}
                                                fontSize={11}
                                                color={blueGrey[500]}
                                            >
                                                {note.date.substring(8,10)}
                                            </Typography>
                                        </Grid2>
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