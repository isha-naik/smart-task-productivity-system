package com.taskmanager.dto;

import com.taskmanager.entity.TaskPriority;
import com.taskmanager.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/** DTO for Task create/update/response operations */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private Long id;

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;

    @NotNull(message = "Task status is required")
    private TaskStatus status;

    @NotNull(message = "Task priority is required")
    private TaskPriority priority;

    private LocalDate dueDate;
    private LocalDateTime createdAt;

    // Assigned employee info
    private Long assignedToId;
    private String assignedToName;

    // Creator info
    private Long createdById;
    private String createdByName;

    // Category info
    private Long categoryId;
    private String categoryName;
}
