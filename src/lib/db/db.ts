import Dexie, { IndexableType, Table } from "dexie";

const DB_VERSION = 0.6

export class KanbanDatabase extends Dexie {

    columns! : Table<Column>;
    tasks! : Table<Task>;
    config! : Table<Config>;
    workNote! : Table<WorkNote>;
    todos! : Table<Todo>;
    taskAttribute! : Table<TaskAttribute>;
    attributes! : Table<Attributes>;

    constructor(){
        super('kanban');
        this.version(DB_VERSION).stores({
            columns : '++id, name',
            tasks : '++id, columnId, title, order',
            workNote : '++id, taskId, date, content',
            config : 'key, value',
            todos : '++id,taskId,title,isCheck',
            taskAttribute : '++id,taskId,attributeId',
            attributes : '++id, name, type'
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

export interface TaskAttribute {
    id? : number
    taskId : number
    attributeId : number
}

export interface Attributes {
    id? : number
    name : string
    type : AttributeType
}

export type AttributeType = TypeAttribute | ProjectAttribute;
export const TYPE_ATTRIBUTE = 0;
export const PROJECT_ATTRIBUTE = 1;
export type TypeAttribute = 0;
export type ProjectAttribute = 1;

export interface Config {
    key : string,
    value : string
}

export function doDBSetting(){
    DB.config.get('init',(config)=>{
        if(!config){
          DB.config.add({key : 'init',value:"true"});
          DB.columns.add({name : '대기'})
            .then(key=>{
              DB.tasks.add({
                columnId : key,
                title : '할일1',
                order : 0
              }).then(()=>{
                DB.tasks.add({
                  columnId : key,
                  title : '할일2',
                  order : 1
                })
              })
            });
          DB.columns.add({name : '진행'});
          DB.columns.add({name : '완료'});
          DB.columns.add({name : '지연'});
          DB.columns.add({name : '취소'});
          DB.columns.add({name : '백로그'});
        } else {
          if(config){
            DB.config.get('version',(version)=>{
              if(!version){
                DB.columns.add({name : '백로그'});
                DB.columns.add({name : '지연'});
                DB.config.add({key:'version',value:`${DB_VERSION}`});
              } else {
                if(version.value < '0.5'){
                  DB.columns.filter((column)=>column.name === '중단').modify(column=>{column.name = '지연'});
                }
                if(version.value < '0.6'){
                    DB.attributes.add({name : '이슈', type : TYPE_ATTRIBUTE});
                    DB.attributes.add({name : '상시', type : TYPE_ATTRIBUTE});
                    DB.attributes.add({name : '수시', type : TYPE_ATTRIBUTE});
                    DB.attributes.add({name : '긴급', type : TYPE_ATTRIBUTE});

                    DB.attributes.add({name : 'ERP', type : PROJECT_ATTRIBUTE});
                    DB.attributes.add({name : 'GW', type : PROJECT_ATTRIBUTE});
                    DB.attributes.add({name : 'FlexSync', type : PROJECT_ATTRIBUTE});
                    DB.attributes.add({name : 'Atm', type : PROJECT_ATTRIBUTE});
                    DB.attributes.add({name : '기타', type : PROJECT_ATTRIBUTE});
                }
                if(version.value != `${DB_VERSION}`){
                    DB.config.add({key:'version',value:`${DB_VERSION}`});
                }
              }
            })
          }
        }
    });
}