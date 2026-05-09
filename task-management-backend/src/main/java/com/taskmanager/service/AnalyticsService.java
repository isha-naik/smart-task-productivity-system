package com.taskmanager.service;

import com.taskmanager.dto.AnalyticsDTO;
import com.taskmanager.entity.Role;
import com.taskmanager.entity.TaskPriority;
import com.taskmanager.entity.TaskStatus;
import com.taskmanager.entity.User;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;

/**
 * Service for generating dashboard analytics.
 * Provides task statistics for both Managers and Employees.
 */
@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final TaskRepository taskRepository;

    /**
     * Generate analytics data based on user role.
     * Managers see team-wide analytics; Employees see personal analytics.
     */
    public AnalyticsDTO getAnalytics(User currentUser) {
        long totalTasks, completedTasks, pendingTasks, inProgressTasks;

        if (currentUser.getRole() == Role.MANAGER) {
            // Team-wide analytics
            totalTasks = taskRepository.count();
            completedTasks = taskRepository.countByStatus(TaskStatus.COMPLETED);
            pendingTasks = taskRepository.countByStatus(TaskStatus.PENDING);
            inProgressTasks = taskRepository.countByStatus(TaskStatus.IN_PROGRESS);
        } else {
            // Personal analytics for employee
            var userTasks = taskRepository.findByAssignedTo(currentUser);
            totalTasks = userTasks.size();
            completedTasks = userTasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();
            pendingTasks = userTasks.stream().filter(t -> t.getStatus() == TaskStatus.PENDING).count();
            inProgressTasks = userTasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        }

        long overdueTasks = taskRepository.findOverdueTasks(LocalDate.now()).size();
        long highPriority = taskRepository.countByPriority(TaskPriority.HIGH);
        long mediumPriority = taskRepository.countByPriority(TaskPriority.MEDIUM);
        long lowPriority = taskRepository.countByPriority(TaskPriority.LOW);

        // Calculate completion rate
        double completionRate = totalTasks > 0
            ? Math.round((double) completedTasks / totalTasks * 100.0) : 0.0;

        // Calculate productivity score (0-100)
        int productivityScore = calculateProductivityScore(completedTasks, totalTasks, overdueTasks);

        return AnalyticsDTO.builder()
            .totalTasks(totalTasks)
            .completedTasks(completedTasks)
            .pendingTasks(pendingTasks)
            .inProgressTasks(inProgressTasks)
            .overdueTasks(overdueTasks)
            .highPriorityTasks(highPriority)
            .mediumPriorityTasks(mediumPriority)
            .lowPriorityTasks(lowPriority)
            .completionRate(completionRate)
            .productivityScore(productivityScore)
            .tasksByStatus(Map.of(
                "PENDING", pendingTasks,
                "IN_PROGRESS", inProgressTasks,
                "COMPLETED", completedTasks,
                "OVERDUE", overdueTasks
            ))
            .tasksByPriority(Map.of(
                "LOW", lowPriority,
                "MEDIUM", mediumPriority,
                "HIGH", highPriority
            ))
            .build();
    }

    /** Calculate a productivity score from 0-100 based on task completion and overdue rate */
    private int calculateProductivityScore(long completed, long total, long overdue) {
        if (total == 0) return 0;
        double completionScore = (double) completed / total * 70;
        double overdueDeduction = total > 0 ? (double) overdue / total * 30 : 0;
        return (int) Math.max(0, Math.min(100, completionScore - overdueDeduction + 30));
    }
}
