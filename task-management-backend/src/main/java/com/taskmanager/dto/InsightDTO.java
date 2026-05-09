package com.taskmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/** DTO for AI-generated productivity insights */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InsightDTO {
    private List<String> insights;
    private String overallStatus;
    private int productivityScore;
    private String recommendation;
}
