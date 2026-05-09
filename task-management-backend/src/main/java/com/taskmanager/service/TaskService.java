package com.taskmanager.service;

import com.taskmanager.dto.TaskDTO;
import com.taskmanager.entity.*;
import com.taskmanager.exception.BadRequestException;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.exception.UnauthorizedException;
import com.taskmanager.repository.CategoryRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Task CRUD operations and business logic.
 * Handles task creation, assignment, status updates, and filtering.
 */
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    /** Get all tasks (Manager sees all, Employee sees their own) */
    public List<TaskDTO> getAllTasks(User currentUser) {
        List<Task> tasks;
        if (currentUser.getRole() == Role.MANAGER) {
            tasks = taskRepository.findAll();
        } else {
            tasks = taskRepository.findByAssignedTo(currentUser);
        }
        // Auto-mark overdue tasks
        tasks.forEach(this::checkAndMarkOverdue);
        return tasks.stream().map(this::toDTO).collect(Collectors.toList());
    }

    /** Get task by ID */
    public TaskDTO getTaskById(Long id, User currentUser) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task", id));

        // Employees can only view their own tasks
        if (currentUser.getRole() == Role.EMPLOYEE &&
            (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(currentUser.getId()))) {
            throw new UnauthorizedException("Access denied to this task");
        }

        return toDTO(task);
    }

    /** Create a new task */
    public TaskDTO createTask(TaskDTO dto, User currentUser) {
        Task.TaskBuilder builder = Task.builder()
            .title(dto.getTitle())
            .description(dto.getDescription())
            .status(dto.getStatus() != null ? dto.getStatus() : TaskStatus.PENDING)
            .priority(dto.getPriority() != null ? dto.getPriority() : TaskPriority.MEDIUM)
            .dueDate(dto.getDueDate())
            .createdBy(currentUser);

        // Assign to employee (Manager workflow)
        if (dto.getAssignedToId() != null) {
            User assignee = userRepository.findById(dto.getAssignedToId())
                .orElseThrow(() -> new ResourceNotFoundException("User", dto.getAssignedToId()));
            builder.assignedTo(assignee);
        } else {
            // Employee creating personal task — assigned to self
            builder.assignedTo(currentUser);
        }

        // Set category if provided
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", dto.getCategoryId()));
            builder.category(category);
        }

        Task saved = taskRepository.save(builder.build());
        return toDTO(saved);
    }

    /** Update an existing task */
    public TaskDTO updateTask(Long id, TaskDTO dto, User currentUser) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task", id));

        // Employees can only update their assigned tasks
        if (currentUser.getRole() == Role.EMPLOYEE &&
            (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(currentUser.getId()))) {
            throw new UnauthorizedException("Cannot update this task");
        }

        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus());
        task.setPriority(dto.getPriority());
        task.setDueDate(dto.getDueDate());

        // Manager can re-assign tasks
        if (currentUser.getRole() == Role.MANAGER && dto.getAssignedToId() != null) {
            User assignee = userRepository.findById(dto.getAssignedToId())
                .orElseThrow(() -> new ResourceNotFoundException("User", dto.getAssignedToId()));
            task.setAssignedTo(assignee);
        }

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", dto.getCategoryId()));
            task.setCategory(category);
        }

        return toDTO(taskRepository.save(task));
    }

    /** Delete a task (Manager only) */
    public void deleteTask(Long id, User currentUser) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task", id));

        if (currentUser.getRole() == Role.EMPLOYEE) {
            throw new UnauthorizedException("Only managers can delete tasks");
        }

        taskRepository.delete(task);
    }

    /** Auto-mark task as OVERDUE if past due date */
    private void checkAndMarkOverdue(Task task) {
        if (task.getDueDate() != null &&
            task.getDueDate().isBefore(LocalDate.now()) &&
            task.getStatus() != TaskStatus.COMPLETED &&
            task.getStatus() != TaskStatus.OVERDUE) {
            task.setStatus(TaskStatus.OVERDUE);
            taskRepository.save(task);
        }
    }

    /** Map Task entity to TaskDTO */
    public TaskDTO toDTO(Task task) {
        return TaskDTO.builder()
            .id(task.getId())
            .title(task.getTitle())
            .description(task.getDescription())
            .status(task.getStatus())
            .priority(task.getPriority())
            .dueDate(task.getDueDate())
            .createdAt(task.getCreatedAt())
            .assignedToId(task.getAssignedTo() != null ? task.getAssignedTo().getId() : null)
            .assignedToName(task.getAssignedTo() != null ? task.getAssignedTo().getName() : null)
            .createdById(task.getCreatedBy() != null ? task.getCreatedBy().getId() : null)
            .createdByName(task.getCreatedBy() != null ? task.getCreatedBy().getName() : null)
            .categoryId(task.getCategory() != null ? task.getCategory().getId() : null)
            .categoryName(task.getCategory() != null ? task.getCategory().getCategoryName() : null)
            .build();
    }
}
