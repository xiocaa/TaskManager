import { useEffect, useState } from "react";
import { api, setUser } from "./api";
import type { Task, User } from "./types";

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
        setTasks([res.data, ...tasks]); setTitle("");
    }

    return (
        <div style={{maxWidth:820, margin:"40px auto", fontFamily:"Inter,system-ui"}}>
            <h1>Task Manager</h1>

            <div style={{marginBottom:16}}>
                <label>User:&nbsp;</label>
                <select value={userId} onChange={e=>changeUser(Number(e.target.value))}>
                    {users.map(u=><option key={u.id} value={u.id}>{u.username}</option>)}
                </select>
            </div>

            <div style={{display:"flex", gap:8}}>
                <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="New task title" style={{flex:1}}/>
                <button onClick={addTask}>Add</button>
            </div>

            <ul>
                {tasks.map(t=>(
                    <li key={t.id} style={{marginTop:12}}>
                        <b>{t.title}</b> &nbsp; <small>({t.status})</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}

