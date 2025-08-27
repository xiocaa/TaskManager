import CreateUser from "./components/CreateUser";
import { useEffect, useState } from "react";
import { api, setUser } from "./api";
import type { Task, User } from "./types";

const statusOptions: Task["status"][] = ["TODO", "IN_PROGRESS", "DONE"];

export default function App(){
    const [users,setUsers] = useState<User[]>([]);
    const [userId,setUserId] = useState<number>();
    const [tasks,setTasks] = useState<Task[]>([]);
    const [title,setTitle] = useState("");

    useEffect(()=>{
        api.get<User[]>("/users").then(r=>{
            setUsers(r.data);
            if(r.data[0]) changeUser(r.data[0].id);
        });
    },[]);

    function changeUser(id:number){
        setUserId(id); setUser(id);
        api.get<Task[]>("/tasks").then(r=>setTasks(r.data));
    }

    async function addTask(){
        if(!userId || !title.trim()) return;
        const res = await api.post<Task>("/tasks",{ title });
        setTasks([res.data, ...tasks]);
        setTitle("");
    }

    async function updateTask(partial: Partial<Task> & {id:number}){
        const idx = tasks.findIndex(t=>t.id===partial.id);
        if(idx<0) return;
        const before = tasks[idx];
        const next: Task = { ...before, ...partial };
        setTasks(tasks.map(t=>t.id===next.id? next : t));
        try{
            const res = await api.put<Task>(`/tasks/${next.id}`, next);
            setTasks(tasks.map(t=>t.id===next.id? res.data : t));
        }catch(e){
            setTasks(tasks.map(t=>t.id===before.id? before : t));
            alert("Update failed");
        }
    }

    async function deleteTask(id:number){
        const before = tasks;
        setTasks(tasks.filter(t=>t.id!==id));
        try{
            await api.delete(`/tasks/${id}`);
        }catch(e){
            setTasks(before);
            alert("Delete failed");
        }
    }

    return (
        <div style={{maxWidth:900, margin:"40px auto", fontFamily:"Inter,system-ui"}}>
            <h1>Task Manager</h1>
            <CreateUser
                onCreated={(u) => {
                    setUsers((prev) => [u, ...prev]);
                    changeUser(u.id);
                }}
            />
            <div style={{marginBottom:16}}>
                <label>User:&nbsp;</label>
                <select value={userId} onChange={e=>changeUser(Number(e.target.value))}>
                    {users.map(u=><option key={u.id} value={u.id}>{u.username}</option>)}
                </select>
            </div>

            <div style={{display:"flex", gap:8, marginBottom:12}}>
                <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="New task title" style={{flex:1}}/>
                <button onClick={addTask}>Add</button>
            </div>

            <table style={{width:"100%", borderCollapse:"collapse"}}>
                <thead>
                <tr>
                    <th style={th}>Title</th>
                    <th style={th}>Status</th>
                    <th style={th}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {tasks.map(t=>(
                    <tr key={t.id}>
                        <td style={td}>
                            <input
                                value={t.title}
                                onChange={e=>updateTask({id:t.id, title:e.target.value})}
                                style={{width:"100%"}}
                            />
                        </td>
                        <td style={td}>
                            <select
                                value={t.status}
                                onChange={e=>updateTask({id:t.id, status: e.target.value as Task["status"]})}
                            >
                                {statusOptions.map(s=> <option key={s} value={s}>{s}</option>)}
                            </select>
                        </td>
                        <td style={td}>
                            <button onClick={()=>deleteTask(t.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                {tasks.length===0 && (
                    <tr><td colSpan={3} style={{padding:12, color:"#777"}}>No tasks.</td></tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

const th: React.CSSProperties = { textAlign:"left", borderBottom:"1px solid #ddd", padding:"8px" };
const td: React.CSSProperties = { borderBottom:"1px solid #f0f0f0", padding:"8px", verticalAlign:"middle" };

