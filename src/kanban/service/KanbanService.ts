import { AttributeType, Column, DB, PROJECT_ATTRIBUTE, TYPE_ATTRIBUTE, Task, TaskAttribute, Todo, TypeAttribute, WorkNote } from "../../lib/db/db";

export async function selectKanbanData(){
    const columns : Column[] = await DB.columns.orderBy('order').toArray();
    for(let i=0; i < columns.length; i++){
      const column = columns[i];
      const tasks = await DB.tasks.filter(task=>task.columnId === column.id).sortBy('order');
      column.items = tasks;
    }
    return columns;
}

export async function createKanbanCard(id : number){
    await DB.tasks.filter(task=>task.columnId === id ).modify(task=>{task.order++})
    await DB.tasks.add({order: 0, title : '새로운 할일', columnId : id});
}

export async function deleteKanbanCard(item : Task){
    await DB.tasks.filter(task=>task.columnId === item.columnId && task.order > item.order).modify(task=>{task.order--});
    await DB.tasks.delete(item.id!);
}

export async function reorderTask(item : Task){
    DB.tasks.update(item.id!,{order : item.order, columnId : item.columnId});
}

export async function updateTitle(item : Task){
    DB.tasks.update(item.id!,{title : item.title});
}

export async function selectWorkNote(taskId : number){
    const list = await DB.workNote.filter(note=>note.taskId === taskId).toArray();
    return list;
}

export async function putWorkNote(workNote : WorkNote){
    await DB.workNote.put(workNote);
}

export async function deleteWorkNote(key : number){
    await DB.workNote.delete(key);
}

export async function selectTodos(taskId : number){
    const list = await DB.todos.filter(todo=>todo.taskId === taskId).toArray();
    return list;
}

export async function putTodo(todo : Todo){
    await DB.todos.put(todo);
}

export async function deleteTodo(key : number){
    await DB.todos.delete(key);
}

export async function selectProjectAttributes(){
    const result = await DB.attributes.filter(attr=>attr.type === PROJECT_ATTRIBUTE).toArray();
    return result;
}

export async function selectTypeAttributes(){
    const result = await DB.attributes.filter(attr=>attr.type === TYPE_ATTRIBUTE).toArray();
    return result;
}

export async function selectTaskAttributeOfTtype(taskId : number){
    const taskAttributes = (await DB.taskAttribute.filter(at=>at.taskId === taskId).toArray()).map(at=>at.attributeId);
    const list = await DB.attributes.filter(ta=>ta.type === TYPE_ATTRIBUTE && taskAttributes.indexOf(ta.id!)>-1).toArray();
    const result = list.length > 0 ? list[0] : undefined
    return result;
}

export async function selectTaskAttributeOfProject(taskId : number){
    const taskAttributes = (await DB.taskAttribute.filter(at=>at.taskId === taskId).toArray()).map(at=>at.attributeId);
    const list = await DB.attributes.filter(ta=>ta.type === PROJECT_ATTRIBUTE && taskAttributes.indexOf(ta.id!)>-1).toArray();
    const result = list.length > 0 ? list[0] : undefined
    return result;
}

export async function putTaskAttribute(item : TaskAttribute){
    await DB.taskAttribute.put(item);
}

export async function removeTaskAttribute(taskId : number, atId : number){
    await DB.taskAttribute.filter(ta=>ta.taskId===taskId && ta.attributeId === atId).delete();
}
export async function removeTaskAttributeOfType(taskId : number){
    const tat = (await DB.attributes.filter(at=>at.type === TYPE_ATTRIBUTE).toArray()).map(v=>v.id);
    await DB.taskAttribute.filter(ta=>ta.taskId===taskId && tat.includes(ta.attributeId)).delete();
}
export async function removeTaskAttributeOfProject(taskId : number){
    const pat = (await DB.attributes.filter(at=>at.type === PROJECT_ATTRIBUTE).toArray()).map(v=>v.id);
    await DB.taskAttribute.filter(ta=>ta.taskId===taskId && pat.includes(ta.attributeId)).delete();
}
