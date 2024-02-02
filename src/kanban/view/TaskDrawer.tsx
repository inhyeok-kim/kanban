import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Task, WorkNote } from "../../lib/db/db";
import { Box, Button, Divider, FormControl, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { putWorkNote, selectWorkNote } from "../service/KanbanService";
import { getToday } from "../../lib/utils";


export interface TaskDrawerProps {
    item : Task
}
export default function TaskDrawer(props : TaskDrawerProps){
    const [workNotes, setWorkNotes] = useState<WorkNote[]>();

    useEffect(()=>{
        loadWorkNotes()
    },[props.item]);

    async function loadWorkNotes(){
        const list = await selectWorkNote(props.item.id!);
        setWorkNotes(list);
    }

    return (
        <Grid2 width={'600px'}>
            <Box
                padding={2}
            >
                <FormControl
                    fullWidth
                    margin="normal"
                >
                    <TextField label='title' value={props.item.title} fullWidth />
                </FormControl>

                <Divider sx={{marginTop:2, fontSize:'13px'}}>Work Note</Divider>
                <Stack>
                    <WorkNoteForm isNew={true} taskId={props.item.id!} />
                    {workNotes?.map(note=>(
                        <WorkNoteForm key={note.id} item={note} taskId={props.item.id!} />
                    ))}
                </Stack>
            </Box>
        </Grid2>
    )
}

interface WorkNoteProps {
    isNew? : boolean
    item? : WorkNote
    taskId : number
}
function WorkNoteForm(props:WorkNoteProps){
    const [date,setDate] = useState<string>(props.item ? props.item.date : getToday());
    const [content,setContent] = useState<string>(props.item ? props.item.content : '');
    
    function dateChangeHandler(e : ChangeEvent<HTMLInputElement>){
        setDate(e.currentTarget.value);
    }
    function contentChangeHandler(e : ChangeEvent<HTMLInputElement>){
        setContent(e.currentTarget.value);
    }

    function doSave(){
        putWorkNote({
            content : content,
            date : date,
            taskId : props.taskId
        });
    }

    return (
        <Grid2>
            <FormControl
                margin="dense"
            >
                <TextField type="date" size="small" variant="standard" value={date} onChange={dateChangeHandler}/>
            </FormControl>
            <FormControl
                fullWidth
                margin="dense"
            >
                <TextField label="Note" fullWidth multiline minRows={5} value={content} onChange={contentChangeHandler}  />
            </FormControl>
            <Stack direction={'row'} justifyContent={'end'} spacing={1}>
                <Button variant="outlined" size="small" onClick={doSave}>Save</Button>
                {props.isNew ? 
                    <Button variant="outlined" color="secondary" size="small" >Cancel</Button>
                    :
                    <Button variant="outlined" color="secondary" size="small">Del</Button>
                }
            </Stack>
        </Grid2>
    )
}