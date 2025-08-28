import { useState } from "react";
import { api, setUser } from "./api";

type Props = { onLoggedIn: (user: {id:number; username:string}) => void };

export default function Login({ onLoggedIn }: Props){
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    async function submit(){
        const name = username.trim();
        if(!name){ setErr("Please enter a username"); return; }
        setErr(""); setLoading(true);
        try{
            // 1) 拉取用户列表
            const users = (await api.get<{id:number; username:string}[]>("/users")).data;
            let user = users.find(u => u.username.toLowerCase() === name.toLowerCase());

            if(!user){
                user = (await api.post<{id:number; username:string}>("/users", { username: name })).data;
            }

            setUser(user.id);
            localStorage.setItem("fake_auth_user", JSON.stringify(user));

            onLoggedIn(user);
        }catch(e:any){
            setErr("Login failed");
        }finally{
            setLoading(false);
        }
    }

    return (
        <div style={{maxWidth:360, margin:"80px auto", padding:20, background:"#fff", borderRadius:12}}>
            <h2 style={{marginTop:0}}>Login</h2>
            <p style={{color:"#64748b", marginTop:0}}>Enter you user name.</p>
            <input
                placeholder="Username (e.g. alice)"
                value={username}
                onChange={e=>setUsername(e.target.value)}
                style={{width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid #e5e7eb", marginBottom:10}}
            />
            <button
                onClick={submit}
                disabled={loading}
                style={{width:"100%", padding:"10px 12px", borderRadius:8, border:"none", background:"#2563eb", color:"#fff", fontWeight:600}}
            >
                {loading? "Signing in..." : "Sign in"}
            </button>
            {err && <div style={{color:"#dc2626", marginTop:8}}>{err}</div>}
        </div>
    );
}
