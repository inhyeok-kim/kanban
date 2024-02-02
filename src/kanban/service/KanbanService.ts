import { Column, DB, Task } from "../../lib/db/db";

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