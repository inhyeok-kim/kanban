import Dexie, { IndexableType, Table } from "dexie";

export class KanbanDatabase extends Dexie {

    columns! : Table<Column>;
    tasks! : Table<Task>;
    config! : Table<Config>;

    constructor(){
        super('kanban');
        this.version(0.2).stores({
            columns : '++id, name',
            tasks : '++id, columnId, title, order',
            config : 'key, value'
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

export interface Config {
    key : string,
    value : string
}