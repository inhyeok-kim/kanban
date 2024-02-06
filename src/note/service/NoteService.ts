import { IndexableType } from "dexie";
import { DB } from "../../lib/db/db";

export async function selectWorkNoteByDate(date : string){
    const list = await DB.workNote.filter(note=>note.date === date).toArray();
    return list;
}

export async function selectWorkNoteByPeriod(from : string, to:string){
    const list = await DB.workNote.filter(note=>note.date >= from && note.date <= to).toArray();
    return list;
}

export async function selectOneTask(taskId : number|IndexableType){
    const task = await DB.tasks.get(taskId);
    return task;
}