import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Task, Todo, WorkNote } from "../../lib/db/db";
import { Box, Button, Checkbox, Divider, FormControl, IconButton, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { deleteTodo, deleteWorkNote, putTodo, putWorkNote, selectTodos, selectWorkNote } from "../service/KanbanService";
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
        const list = (await selectWorkNote(props.item.id!)).sort((a : WorkNote,b : WorkNote)=>(a.date > b.date ? -1 : 1));
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

                <Divider sx={{marginTop:2, fontSize:'13px'}}>Work Todo</Divider>

                <TodoForm taskId={props.item.id!} />
                

                <Divider sx={{marginTop:2, fontSize:'13px'}}>Work Note</Divider>
                <Stack>
                    <WorkNoteForm isNew={true} taskId={props.item.id!} onReload={loadWorkNotes} />
                    {workNotes?.map(note=>(
                        <WorkNoteForm key={note.id} item={note} taskId={props.item.id!} onReload={loadWorkNotes} />
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
    onReload : Function
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

    async function doSave(){
        await putWorkNote({
            id : props.item?.id,
            content : content,
            date : date,
            taskId : props.taskId
        });
        props.onReload();
        if(props.isNew){
            doCancel();
        }
    }
    async function doDelete(){
        await deleteWorkNote(props.item!.id!);
        props.onReload();
    }

    function doCancel(){
        setDate(getToday());
        setContent('');
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
                <TextField label="Note" fullWidth multiline minRows={3} value={content} onChange={contentChangeHandler}
                    inputProps={{
                        style : {
                            fontSize : '13px',
                        }
                    }}
                />
            </FormControl>
            <Stack direction={'row'} justifyContent={'end'} spacing={1}>
                <Button variant="outlined" size="small" onClick={doSave}>Save</Button>
                {props.isNew ? 
                    <Button variant="outlined" color="secondary" size="small" onClick={doCancel} >Cancel</Button>
                    :
                    <Button variant="outlined" color="secondary" size="small" onClick={doDelete}>Del</Button>
                }
            </Stack>
        </Grid2>
    )
}

interface TodoFormProps {
    taskId : number
}
function TodoForm(props : TodoFormProps){
    const [isEdit, setIsEdit] = useState(false);
    const [todoList, setTodoList] = useState<Todo[]>();

    useEffect(()=>{
        loadTodos();
    },[]);
    
    async function loadTodos(){
        const list = (await selectTodos(props.taskId));
        setTodoList(list);
    }

    function fnAddMode(){
        setIsEdit(true);
    }

    function saveHandler(){
        setIsEdit(false);
        loadTodos();
    }

    return (
        <Stack 
            marginTop={2}
            spacing={1}
        >
            {todoList?.map(todo=>(
                <TodoItem taskId={props.taskId}  item={todo} onSave={saveHandler} />
            ))}
            {isEdit?
                <TodoItem taskId={props.taskId} isNew={true} onSave={saveHandler} />
                :
                <Grid2>
                    <Button fullWidth variant="outlined" size="small" onClick={fnAddMode}>+</Button>
                </Grid2>
            }
        </Stack>
        
    )
}

interface TodoItemProps {
    item? : Todo
    isNew? : boolean
    taskId : number
    onSave : Function
}
function TodoItem(props : TodoItemProps){
    const [isEdit, setIsEdit] = useState(props.isNew ? true : false);
    const inputRef = useRef<HTMLInputElement>();

    const [isCheck, setIsCheck] = useState(props.isNew ? false : props.item!.isCheck);
    const [title, setTitle] = useState(props.isNew ? '' : props.item!.title);

    async function changeHandler(e:ChangeEvent<HTMLInputElement>){
        setTitle(e.currentTarget.value);
        if(!props.isNew){
            await putTodo({
                isCheck : isCheck,
                title : e.currentTarget.value,
                id : props.item?.id,
                taskId : props.taskId
            });
        }
    }

    async function checkHandler(e:ChangeEvent<HTMLInputElement>){
        setIsCheck(e.currentTarget.checked);
        if(!props.isNew){
            await putTodo({
                isCheck : e.currentTarget.checked,
                title : title,
                id : props.item?.id,
                taskId : props.taskId
            });
        }
    }

    async function titleChanged(e :ChangeEvent){
        setIsEdit(false);
        await putTodo({
            isCheck : isCheck,
            title : title,
            id : props.item?.id,
            taskId : props.taskId
        });
        props.onSave();
    }

    async function fnRemove(){
        if(!props.isNew){
            await deleteTodo(props.item!.id!);
        }
        props.onSave();
    }

    useLayoutEffect(()=>{
        if(isEdit){
            inputRef.current!.focus();
        }
    },[isEdit]);

    return (
        <Grid2
            container
            justifyContent={"space-between"}
            alignItems={'center'}
        >
            <Checkbox
                size="small"
                onChange={checkHandler}
                checked={isCheck}
                sx={{padding:0}}
            />
            <Grid2
                container
                justifyContent={"space-between"}
                width={'calc(100% - 30px)'}
                alignItems={'center'}
            >
                {   isEdit?
                        <TextField 
                            inputRef={inputRef}
                            variant="outlined" 
                            size="small"
                            InputProps={{
                                // disableUnderline: true,
                                margin:"none",
                            }}
                            value={title}
                            onChange={changeHandler}
                            onClick={(e)=>{e.stopPropagation()}}
                            onKeyDown={(e)=>{if(e.key==='Enter'){inputRef.current!.blur();}}}
                            inputProps={{
                                style : {
                                    fontSize : '12px',
                                    width : 440,
                                    padding : 1
                                }
                            }}
                            onBlur={titleChanged}
                        />
                    :
                    <div
                        style={{minWidth : '440px',minHeight:'18px'}}
                        onClick={(e)=>{
                            setIsEdit(true)
                            e.stopPropagation();
                        }}
                    >
                        <Typography
                            fontSize={12}
                        >
                            {title}
                        </Typography>
                    </div>
                }
                <Button sx={{height:'20px'}} size="small" onClick={fnRemove}>X</Button>
            </Grid2>
        </Grid2>
    )
}