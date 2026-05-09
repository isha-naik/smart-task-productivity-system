package com.taskmanager.repository;

import com.taskmanager.entity.Task;
import com.taskmanager.entity.TaskPriority;
import com.taskmanager.entity.TaskStatus;
import com.taskmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository for Task entity with analytics and filtering queries.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Find tasks for a specific employee
    List<Task> findByAssignedTo(User user);

    // Find tasks by status
    List<Task> findByStatus(TaskStatus status);

    // Find tasks by priority
    List<Task> findByPriority(TaskPriority priority);

    // Count by status
    long countByStatus(TaskStatus status);

    // Count by priority
    long countByPriority(TaskPriority priority);

    // Find tasks assigned to a specific user with given status
    List<Task> findByAssignedToAndStatus(User user, TaskStatus status);

    // Find overdue tasks (past due date, not completed)
    @Query("SELECT t FROM Task t WHERE t.dueDate < :today AND t.status != 'COMPLETED'")
    List<Task> findOverdueTasks(LocalDate today);

    // Count overdue tasks for a user
    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignedTo = :user AND t.dueDate < :today AND t.status != 'COMPLETED'")
    long countOverdueTasksForUser(User user, LocalDate today);

    // Find tasks by assigned user
    List<Task> findByAssignedToId(Long userId);

    // Find tasks created by a manager
    List<Task> findByCreatedById(Long managerId);
}
