package com.example.backend.user;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/users")
public class UserController {
    private final UserRepository repo;
    public UserController(UserRepository repo){ this.repo = repo; }

    @PostMapping public ResponseEntity<User> create(@RequestBody User u){
        return ResponseEntity.ok(repo.save(User.builder().username(u.getUsername()).build()));
    }
    @GetMapping public List<User> list(){ return repo.findAll(); }
}

