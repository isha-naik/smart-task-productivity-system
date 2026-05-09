package com.taskmanager.service;

import com.taskmanager.dto.InsightDTO;
import com.taskmanager.entity.Role;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.TaskPriority;
import com.taskmanager.entity.TaskStatus;
import com.taskmanager.entity.User;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * AI-powered Productivity Insights Service.
 * Analyzes task patterns and generates intelligent recommendations.
 * Simulates AI-based insights (suitable for AI-assisted development showcase).
 */
@Service
@RequiredArgsConstructor
public class InsightService {

    private final TaskRepository taskRepository;

    /**
     * Generate AI-style productivity insights for the current user.
     */
    public InsightDTO generateInsights(User currentUser) {
        List<Task> tasks;
        if (currentUser.getRole() == Role.MANAGER) {
            tasks = taskRepository.findAll();
        } else {
            tasks = taskRepository.findByAssignedTo(currentUser);
        }

        List<String> insights = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // Analyze overdue tasks
        long overdueTasks = tasks.stream()
            .filter(t -> t.getDueDate() != null &&
                         t.getDueDate().isBefore(today) &&
                         t.getStatus() != TaskStatus.COMPLETED)
            .count();

        if (overdueTasks > 0) {
            insights.add("⚠️ You have " + overdueTasks + " overdue task" + (overdueTasks > 1 ? "s" : "") + ". Consider reprioritizing your workload.");
        }

        // High priority tasks analysis
        long highPriorityPending = tasks.stream()
            .filter(t -> t.getPriority() == TaskPriority.HIGH &&
                         t.getStatus() != TaskStatus.COMPLETED)
            .count();

        if (highPriorityPending > 0) {
            insights.add("🔴 " + highPriorityPending + " high-priority task" + (highPriorityPending > 1 ? "s" : "") + " need" + (highPriorityPending == 1 ? "s" : "") + " your immediate attention.");
        }

        // Completion rate analysis
        long totalTasks = tasks.size();
        long completedTasks = tasks.stream()
            .filter(t -> t.getStatus() == TaskStatus.COMPLETED)
            .count();

        if (totalTasks > 0) {
            double completionRate = (double) completedTasks / totalTasks * 100;
            if (completionRate >= 70) {
                insights.add("✅ Excellent productivity! You've completed " + String.format("%.0f", completionRate) + "% of your tasks.");
            } else if (completionRate >= 40) {
                insights.add("📈 Good progress! " + String.format("%.0f", completionRate) + "% tasks completed. Keep up the momentum!");
            } else {
                insights.add("💡 Focus mode needed. Only " + String.format("%.0f", completionRate) + "% of tasks completed. Try tackling smaller tasks first.");
            }
        }

        // Tasks due soon (within 3 days)
        long tasksDueSoon = tasks.stream()
            .filter(t -> t.getDueDate() != null &&
                         !t.getDueDate().isBefore(today) &&
                         t.getDueDate().isBefore(today.plusDays(3)) &&
                         t.getStatus() != TaskStatus.COMPLETED)
            .count();

        if (tasksDueSoon > 0) {
            insights.add("⏰ " + tasksDueSoon + " task" + (tasksDueSoon > 1 ? "s are" : " is") + " due within the next 3 days. Plan accordingly!");
        }

        // In-progress tasks
        long inProgressTasks = tasks.stream()
            .filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS)
            .count();

        if (inProgressTasks > 3) {
            insights.add("🔄 You have " + inProgressTasks + " tasks in progress simultaneously. Consider focusing on completing some before starting new ones.");
        }

        // Positive insight when all caught up
        if (overdueTasks == 0 && highPriorityPending == 0 && totalTasks > 0) {
            insights.add("🌟 Great work! No overdue or urgent tasks. You're on top of your workload!");
        }

        if (insights.isEmpty()) {
            insights.add("📋 No tasks assigned yet. Ready to take on new challenges!");
        }

        // Overall status
        String overallStatus = determineOverallStatus(overdueTasks, highPriorityPending, totalTasks, completedTasks);
        int productivityScore = calculateScore(completedTasks, totalTasks, overdueTasks);
        String recommendation = generateRecommendation(overdueTasks, highPriorityPending, inProgressTasks);

        return InsightDTO.builder()
            .insights(insights)
            .overallStatus(overallStatus)
            .productivityScore(productivityScore)
            .recommendation(recommendation)
            .build();
    }

    private String determineOverallStatus(long overdue, long highPriority, long total, long completed) {
        if (total == 0) return "NO_TASKS";
        if (overdue > 2) return "CRITICAL";
        if (overdue > 0 || highPriority > 2) return "AT_RISK";
        if ((double) completed / total > 0.7) return "EXCELLENT";
        return "ON_TRACK";
    }

    private int calculateScore(long completed, long total, long overdue) {
        if (total == 0) return 0;
        double base = (double) completed / total * 100;
        double penalty = overdue * 5;
        return (int) Math.max(0, Math.min(100, base - penalty));
    }

    private String generateRecommendation(long overdue, long highPriority, long inProgress) {
        if (overdue > 0) return "Address overdue tasks immediately to improve your productivity score.";
        if (highPriority > 0) return "Focus on completing high-priority tasks before taking on new work.";
        if (inProgress > 3) return "Limit work in progress to maintain focus and quality.";
        return "Maintain your current pace. Consider breaking large tasks into smaller milestones.";
    }
}
