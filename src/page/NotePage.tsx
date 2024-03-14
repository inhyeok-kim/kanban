import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { ChangeEvent, useEffect, useState } from "react";
import { selectOneTask, selectWorkNoteByDate, selectWorkNoteByPeriod } from "../note/service/NoteService";
import { Attributes, PROJECT_ATTRIBUTE, Task, WorkNote } from "../lib/db/db";
import { Button, Card, CardContent, CardHeader, TextField, Typography } from "@mui/material";
import { getToday, getWeekStartEnd } from "../lib/utils";
import { blueGrey } from "@mui/material/colors";
import { selectTaskAttributeOfProject } from "../kanban/service/KanbanService";

export default function NotePage(){
    const [date,setDate] = useState<string[]>(getWeekStartEnd(new Date()));
    const [dataMap, setDataMap] = useState<{[index:number] : [Task,WorkNote[]]}>({});
    const [projectMap, setProjectMap] = useState<{[key:number]: [Attributes,Task[]]}>({});

    useEffect(()=>{
        loadNoteList();
    },[date]);

    async function loadNoteList(){
        const list = await selectWorkNoteByPeriod(date[0],date[1]);
        const map : {[index:number] : [Task,WorkNote[]]} = {}
        const pmap : {[index:number] : [Attributes,Task[]]} = {}
        for(let index = 0; index < list.length; index++) {
            const note = list[index];
            const task = await selectOneTask(note.taskId!);
            const project = await selectTaskAttributeOfProject(task?.id!) ?? {id: 0, name : '미상', type : PROJECT_ATTRIBUTE} as Attributes;
            if(task){
                if(map[task.id!]){
                    map[task.id!][1].push(note);
                } else {
                    map[task.id!] = [task,[note]];
                    if(pmap[project.id!]){
                        pmap[project.id!][1].push(task);
                    } else {
                        pmap[project.id!] = [project,[task]];
                    }
                }
                
            }
        }
        setDataMap(map);
        setProjectMap(pmap);
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
                    sx={{
                        background : 'white',
                        paddingLeft : 3,
                        paddingRight : 3
                    }}
                >
                    <ul style={{paddingLeft : 15}}>
                        {
                            Object.values(projectMap)?.map(project=>{
                                return (
                                    <li key={project[0].id} style={{marginBottom:10}}>
                                        <Typography fontWeight={'bold'} fontSize={13}>{project[0].name}</Typography>
                                        <ul style={{paddingLeft : 15}}>
                                            {project[1].map(task=>{
                                                const data = dataMap[task.id!];
                                                return (
                                                <li>
                                                    <Typography fontWeight={'bold'}fontSize={12}>{data[0].title}</Typography>
                                                    {data[1].map(note=>(
                                                        <Grid2
                                                            key={note.id} 
                                                            position={'relative'}
                                                        >
                                                            <Typography
                                                                marginBottom={0}
                                                                paragraph={true} 
                                                                paddingLeft={3} 
                                                                style={{whiteSpace:'pre-line'}}
                                                                fontSize={12}
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
                                                                ({note.date.substring(8,10)})
                                                            </Typography>
                                                        </Grid2>
                                                    ))}
                                                </li>
                                                )})
                                            }
                                        </ul>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </CardContent>
            </Card>
        </Grid2>
    )
}