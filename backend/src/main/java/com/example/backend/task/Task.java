package com.example.backend.task;
import com.example.backend.user.User;
import jakarta.persistence.*; import lombok.*;
import java.time.Instant;
@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name="tasks")
public class Task {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
    @Column(nullable=false) String title;
    String description;
    @Enumerated(EnumType.STRING) Status status;
    Instant dueDate;
    Instant createdAt;
    Instant updatedAt;
    @ManyToOne(optional=false) @JoinColumn(name="user_id") User user;
    public enum Status { TODO, IN_PROGRESS, DONE }
}

