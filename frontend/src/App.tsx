import "@/styles.css";
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, User, CheckCircle2, Trash2, Search } from "lucide-react"
import { api, loadUserFromStorage, setUser } from "@/api"

type Status = "TODO" | "IN_PROGRESS" | "DONE"
interface Task {
    id: number
    title: string
    status: Status
    category?: string
}

export default function App() {
    const [userName, setUserName] = useState<string>("")
    const [isEditingName, setIsEditingName] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const [tasks, setTasks] = useState<Task[]>([])
    const [newTask, setNewTask] = useState("")

    useEffect(() => {
        async function boot() {
            const name = window.prompt("Enter username (e.g. alice)") || ""
            const username = name.trim() || "demo"

            const users = (await api.get<Array<{id:number; username:string}>>("/users")).data
            let user = users.find(u => u.username.toLowerCase() === username.toLowerCase())
            if (!user) {
                user = (await api.post<{id:number; username:string}>("/users", { username })).data
            }

            setUser(user.id)
            setUserName(user.username)

            const res = await api.get<Task[]>("/tasks")
            setTasks(res.data.map(t => ({ ...t, category: "General" })))
        }
        boot()
    }, [])

    const inProgressCount = useMemo(() => tasks.filter(t => t.status === "IN_PROGRESS").length, [tasks])
    const completedCount  = useMemo(() => tasks.filter(t => t.status === "DONE").length, [tasks])
    const progressPercentage = useMemo(() => tasks.length ? (completedCount / tasks.length) * 100 : 0, [tasks, completedCount])

    const filteredTasks = useMemo(
        () => tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())),
        [tasks, searchQuery]
    )

    const getStatusColor = (status: Status) => {
        switch (status) {
            case "TODO":         return "bg-muted text-muted-foreground"
            case "IN_PROGRESS":  return "bg-primary text-primary-foreground"
            case "DONE":         return "bg-emerald-500 text-white"
            default:             return "bg-muted text-muted-foreground"
        }
    }

    const addTask = async () => {
        const title = newTask.trim()
        if (!title) return
        try {
            const res = await api.post<Task>("/tasks", { title })
            setTasks([ { ...res.data, category: "General" }, ...tasks ])
            setNewTask("")
        } catch {
            alert("Create failed")
        }
    }

    const cycleStatus = (s: Status): Status => {
        const order: Status[] = ["TODO","IN_PROGRESS","DONE"]
        const i = order.indexOf(s)
        return order[(i+1) % order.length]
    }

    const updateTaskStatus = async (id: number) => {
        const t = tasks.find(x => x.id === id)
        if (!t) return
        const next = { ...t, status: cycleStatus(t.status) }
        setTasks(tasks.map(x => x.id === id ? next : x))
        try {
            const res = await api.put<Task>(`/tasks/${id}`, next)
            setTasks(tasks.map(x => x.id === id ? { ...res.data, category: t.category } : x))
        } catch {
            setTasks(tasks.map(x => x.id === id ? t : x))
            alert("Update failed")
        }
    }

    const deleteTask = async (id: number) => {
        const before = tasks
        setTasks(tasks.filter(t => t.id !== id))
        try {
            await api.delete(`/tasks/${id}`)
        } catch {
            setTasks(before)
            alert("Delete failed")
        }
    }

    const handleNameEdit = () => setIsEditingName(false)

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto p-6 max-w-4xl">
                {/* Header with User Name */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <User className="h-6 w-6 text-primary" />
                        {isEditingName ? (
                            <Input
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                onBlur={handleNameEdit}
                                onKeyDown={(e) => e.key === "Enter" && handleNameEdit()}
                                className="text-xl font-semibold max-w-xs"
                                autoFocus
                            />
                        ) : (
                            <h2
                                className="text-xl font-semibold text-foreground cursor-pointer hover:text-primary"
                                onClick={() => setIsEditingName(true)}
                            >
                                {userName || "Demo User"}
                            </h2>
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">Task Manager</h1>
                    <p className="text-muted-foreground text-pretty">Stay organized and productive with your daily tasks</p>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                            Progress Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Tasks In Progress</span>
                                <Badge variant="outline" className="bg-primary/10 text-primary">
                                    {inProgressCount}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                  <span>
                    {completedCount} of {tasks.length} tasks completed
                  </span>
                                    <span>{Math.round(progressPercentage)}%</span>
                                </div>
                                <Progress value={progressPercentage} className="h-2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add a new task..."
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addTask()}
                                className="flex-1"
                            />
                            <Button onClick={addTask} className="shrink-0">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Task
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-3">
                    {filteredTasks.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <p className="text-muted-foreground">
                                    {searchQuery ? "No tasks match your search." : "No tasks found. Add one above!"}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredTasks.map((task) => (
                            <Card key={task.id} className="transition-all hover:shadow-md">
                                <CardContent className="pt-4">
                                    <div className="flex items-center gap-3">
                                        <Badge
                                            className={`${getStatusColor(task.status)} cursor-pointer hover:opacity-80 shrink-0`}
                                            onClick={() => updateTaskStatus(task.id)}
                                        >
                                            {task.status}
                                        </Badge>

                                        <div className="flex-1 min-w-0">
                                            <h3
                                                className={`font-medium ${task.status === "DONE" ? "line-through text-muted-foreground" : "text-foreground"}`}
                                            >
                                                {task.title}
                                            </h3>
                                            <div className="text-sm text-muted-foreground mt-1">{task.category || "General"}</div>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteTask(task.id)}
                                            className="shrink-0 text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}


