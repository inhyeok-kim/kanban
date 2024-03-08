import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { AttributeType, Attributes, PROJECT_ATTRIBUTE, TYPE_ATTRIBUTE, Task, Todo, WorkNote } from "../../lib/db/db";
import { Autocomplete, Box, Button, Checkbox, Chip, Divider, FormControl, IconButton, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { deleteTodo, deleteWorkNote, putTaskAttribute, putTodo, putWorkNote, removeTaskAttribute, selectProjectAttributes, selectTaskAttributeOfProject, selectTaskAttributeOfTtype, selectTodos, selectTypeAttributes, selectWorkNote, updateTitle } from "../service/KanbanService";
import { getToday } from "../../lib/utils";
import { grey } from "@mui/material/colors";


export interface TaskDrawerProps {
    item : Task
}
export default function TaskDrawer(props : TaskDrawerProps){
    const [workNotes, setWorkNotes] = useState<WorkNote[]>();
    const [currItem, setCurrItem] = useState(props.item);

    useEffect(()=>{
        loadWorkNotes()
    },[props.item]);

    async function loadWorkNotes(){
        const list = (await selectWorkNote(props.item.id!)).sort((a : WorkNote,b : WorkNote)=>(a.date > b.date ? -1 : 1));
        setWorkNotes(list);
    }

    function changeTitle(e:ChangeEvent<HTMLInputElement>){
        const newItem = {...props.item};
        newItem.title = e.currentTarget.value;
        updateTitle(newItem);
        setCurrItem(newItem);
    }

    async function createNewWorkNote(){
        await putWorkNote({
            content : "",
            date : getToday(),
            taskId : props.item.id
        });
        loadWorkNotes();
    }

    return (
        <Grid2 width={'800px'}>
            <Box
                padding={2}
            >
                <FormControl
                    fullWidth
                    margin="normal"
                >
                    <TextField label='title' value={currItem.title} fullWidth
                        onChange={changeTitle}
                    />
                </FormControl>

                <AttributeForm taskId={currItem.id!} />

                <Divider sx={{marginTop:2, fontSize:'13px'}}>Work Todo</Divider>

                <TodoForm taskId={currItem.id!} />
                

                <Divider sx={{marginTop:2, fontSize:'13px'}}>Work Note</Divider>
                <Grid2 >
                    <Button onClick={createNewWorkNote}>New Note</Button>
                </Grid2>
                <Stack spacing={2}>
                    {workNotes?.map(note=>(
                        <WorkNoteForm isNew={note.date === getToday()} key={note.id} item={note} taskId={currItem.id!} onReload={loadWorkNotes} />
                    ))}
                </Stack>
            </Box>
        </Grid2>
    )
}
function AttributeForm(props:{taskId : number}){
    const [typeAttributesOption, setTypeAttributesOption] = useState<any[]>([]);
    const [projectAttributesOption, setProjectAttributesOption] = useState<any[]>([]);
    const [typeAttribute, setTypeAttribute] = useState<Attributes|null>();
    const [projectAttribute, setProjectAttribute] = useState<Attributes|null>();

    useEffect(()=>{
        getTypeAttributes().then(ats=>setTypeAttributesOption(ats.map(at=>({id : at.id, label : at.name}))));
        getProjectAttributes().then(ats=>setProjectAttributesOption(ats.map(at=>({id : at.id, label : at.name}))));
        selectTaskAttributeOfProject(props.taskId).then(at=>{if(at) setProjectAttribute(at)});
        selectTaskAttributeOfTtype(props.taskId).then(at=>{if(at)setTypeAttribute(at)});
    },[]);
    
    async function getTypeAttributes(){
        const list = await selectTypeAttributes();
        return list;
    }
    async function getProjectAttributes(){
        const list = await selectProjectAttributes();
        return list;
    }

    function fnChangeType(atr : Attributes |null){
        if(atr != null){
            setTypeAttribute(atr)
            putTaskAttribute({attributeId : atr.id!, taskId : props.taskId});
        } else {
            if(typeAttribute){
                removeTaskAttribute(props.taskId,typeAttribute.id!)
                setTypeAttribute(null)
            }
        }
        
    }
    function fnChangeProject(atr : Attributes |null){
        if(atr != null){
            setProjectAttribute(atr);
            putTaskAttribute({attributeId : atr.id!, taskId : props.taskId});
        } else {
            if(projectAttribute){
                removeTaskAttribute(props.taskId,projectAttribute.id!)
                setProjectAttribute(null)
            }
        }
    }

    return (
        <Grid2>
            <Grid2 container alignItems={'center'}>
                <Typography width={60} fontSize={12}>유형</Typography>
                <Autocomplete
                    disablePortal
                    size="small"
                    value={typeAttribute ? {id : typeAttribute.id, label : typeAttribute.name} :null}
                    onChange={(e,newValue)=>{fnChangeType(newValue ? {id : newValue.id, name : newValue.label, type : TYPE_ATTRIBUTE} : null)}}
                    options={typeAttributesOption}
                    sx={{ width: 100}}
                    renderInput={(params) => <TextField {...params}
                        size="small"
                        variant="standard"/>
                    }
                />
            </Grid2>
            <Grid2 container alignItems={'center'}>
                <Typography width={60} fontSize={12}>프로젝트</Typography>
                <Autocomplete
                    size="small"
                    value={projectAttribute ? {id : projectAttribute.id, label : projectAttribute.name} :null}
                    onChange={(e,newValue)=>{fnChangeProject(newValue?{id : newValue.id, name : newValue.label, type : PROJECT_ATTRIBUTE}:null)}}
                    options={projectAttributesOption}
                    sx={{ width: 100}}
                    renderInput={(params) => <TextField {...params}
                        FormHelperTextProps={{sx : {fontSize : 10}}}
                        size="small"
                        variant="standard"/>
                    }
                />
            </Grid2>
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
    const [isEdit, setIsEdit] = useState<boolean>(props.isNew ? true : false);

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
        setIsEdit(false);
    }
    async function doDelete(){
        await deleteWorkNote(props.item!.id!);
        props.onReload();
    }

    function doCancel(){
        setIsEdit(false);
    }

    return (
        <Grid2>
        {isEdit?
            <>
                <Grid2 container justifyContent={'space-between'}>
                    <TextField type="date" size="small" variant="standard" value={date} onChange={dateChangeHandler}/>
                    <Grid2>
                        <Button size="small" onClick={doSave}>Save</Button>
                        <Button color="secondary" size="small" onClick={doCancel}>Cancel</Button>
                    </Grid2>
                </Grid2>
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
            </>
            :
            <>
                <Grid2>
                    <Grid2 container justifyContent={'space-between'} alignItems={'center'}>
                        <Typography variant="body2">{date}</Typography>
                        <Grid2>
                            <Button size="small" onClick={()=>{setIsEdit(true)}}>Edit</Button>
                            <Button size="small" color="secondary" onClick={doDelete}>Del</Button>
                        </Grid2>
                    </Grid2>
                    <Grid2 border={1} borderColor={grey[400]} borderRadius={1} padding={1}>
                        {content.split("\n").map(str=><Typography variant="body2" fontSize={'0.8rem'}>{str}</Typography>)}
                    </Grid2>
                </Grid2>
            </>
        }
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