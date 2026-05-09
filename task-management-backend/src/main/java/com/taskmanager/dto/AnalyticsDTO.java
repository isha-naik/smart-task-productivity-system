package com.taskmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/** DTO for dashboard analytics data */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDTO {
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private long inProgressTasks;
    private long overdueTasks;
    private long highPriorityTasks;
    private long mediumPriorityTasks;
    private long lowPriorityTasks;
    private double completionRate;
    private int productivityScore;
    private Map<String, Long> tasksByStatus;
    private Map<String, Long> tasksByPriority;
}
