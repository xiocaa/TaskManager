export type Task = {
    id:number; title:string; description?:string;
    status:"TODO"|"IN_PROGRESS"|"DONE";
    dueDate?:string; createdAt:string; updatedAt:string;
};
export type User = { id:number; username:string };
