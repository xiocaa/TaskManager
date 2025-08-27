import { useState } from "react";
import { api } from "../api";
import type { User } from "../types";

type Props = {
    onCreated: (u: User) => void;
};

export default function CreateUser({ onCreated }: Props) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    async function submit() {
        const username = name.trim();
        if (!username) return;
        setLoading(true);
        setErr(null);
        try {
            const res = await api.post<User>("/users", { username });
            onCreated(res.data);
            setName("");
        } catch (e: any) {
            const msg =
                e?.response?.data?.message ||
                e?.message ||
                "Failed to create user (maybe username already exists).";
            setErr(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
            <input
                placeholder="New username (e.g. charlie)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                style={{ flex: 1 }}
            />
            <button onClick={submit} disabled={loading}>
                {loading ? "Creating..." : "Create User"}
            </button>
            {err && <span style={{ color: "crimson", fontSize: 12 }}>{err}</span>}
        </div>
    );
}
