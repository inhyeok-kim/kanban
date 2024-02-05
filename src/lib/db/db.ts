import Dexie, { IndexableType, Table } from "dexie";

export class KanbanDatabase extends Dexie {

    columns! : Table<Column>;
    tasks! : Table<Task>;
    config! : Table<Config>;
    workNote! : Table<WorkNote>;
    todos! : Table<Todo>;

    constructor(){
        super('kanban');
        this.version(0.5).stores({
            columns : '++id, name',
            tasks : '++id, columnId, title, order',
            workNote : '++id, taskId, date, content',
            config : 'key, value',
            todos : '++id,taskId,title,isCheck',
        });
    }
}

export const DB = new KanbanDatabase();

export interface Column{
    id? : number
    name : string
    items? : Task[]
}

export interface Task {
    id? : number
    columnId? : number | string | IndexableType
    title : string
    order : number
}
export interface WorkNote {
    id? : number
    taskId? : number | string | IndexableType
    content : string
    date : string
}

export interface Todo {
    id? : number
    taskId? : number | string | IndexableType
    title : string
    isCheck : boolean
}

export interface Config {
    key : string,
    value : string
}