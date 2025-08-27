package com.example.backend.task;
import com.example.backend.common.*; import com.example.backend.user.*;
import org.springframework.http.*; import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant; import java.util.*;
import org.springframework.web.server.ResponseStatusException;
@RestController @RequestMapping("/api/tasks")
public class TaskController {
    private final TaskRepository tasks; private final UserRepository users;
    public TaskController(TaskRepository t, UserRepository u){ this.tasks=t; this.users=u; }
    private CurrentUser cu(HttpServletRequest req){ return (CurrentUser) req.getAttribute(CurrentUserResolver.ATTR); }

    @GetMapping
    public ResponseEntity<List<Task>> list(HttpServletRequest req){
        CurrentUser cu = cu(req); if (cu==null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(tasks.findByUserIdOrderByCreatedAtDesc(cu.id()));
    }
    @PostMapping
    public ResponseEntity<Task> create(@RequestBody Task dto, HttpServletRequest req){
        CurrentUser cu = cu(req); if (cu==null) return ResponseEntity.badRequest().build();
        User u = users.findById(cu.id()).orElseThrow();
        Task t = Task.builder().title(dto.getTitle()).description(dto.getDescription())
                .status(dto.getStatus()==null? Task.Status.TODO : dto.getStatus())
                .dueDate(dto.getDueDate()).createdAt(Instant.now()).updatedAt(Instant.now()).user(u).build();
        return ResponseEntity.ok(tasks.save(t));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Long id, @RequestBody Task dto, HttpServletRequest req){
        CurrentUser cu = cu(req); if (cu==null) return ResponseEntity.badRequest().build();
        Task t = tasks.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found")); // ← 修改
        if (!t.getUser().getId().equals(cu.id())) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        t.setTitle(dto.getTitle()); t.setDescription(dto.getDescription());
        t.setStatus(dto.getStatus()); t.setDueDate(dto.getDueDate()); t.setUpdatedAt(Instant.now());
        return ResponseEntity.ok(tasks.save(t));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, HttpServletRequest req){
        CurrentUser cu = cu(req); if (cu==null) return ResponseEntity.badRequest().build();
        Task t = tasks.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found")); // ← 修改
        if (!t.getUser().getId().equals(cu.id())) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        tasks.delete(t); return ResponseEntity.noContent().build();
    }
}


