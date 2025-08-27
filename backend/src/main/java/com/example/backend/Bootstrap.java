package com.example.backend;
import com.example.backend.task.*;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import org.springframework.boot.CommandLineRunner; import org.springframework.context.annotation.Bean;
import java.time.Instant;

@org.springframework.context.annotation.Configuration
public class Bootstrap {
    @Bean CommandLineRunner seed(UserRepository users, TaskRepository tasks){
        return args -> {
            if (users.count()==0){
                var alice = users.save(User.builder().username("alice").build());
                var bob = users.save(User.builder().username("bob").build());
                tasks.save(Task.builder().title("Welcome")
                        .description("First task for alice").status(Task.Status.TODO)
                        .createdAt(Instant.now()).updatedAt(Instant.now()).user(alice).build());
                tasks.save(Task.builder().title("Try edit")
                        .description("Second task for alice").status(Task.Status.IN_PROGRESS)
                        .createdAt(Instant.now()).updatedAt(Instant.now()).user(alice).build());
                tasks.save(Task.builder().title("Hello Bob")
                        .description("First task for bob").status(Task.Status.DONE)
                        .createdAt(Instant.now()).updatedAt(Instant.now()).user(bob).build());
            }
        };
    }
}

