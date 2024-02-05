import { Column, DB, Task, Todo, WorkNote } from "../../lib/db/db";

export async function selectKanbanData(){
    const columns : Column[] = await DB.columns.toArray();
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
