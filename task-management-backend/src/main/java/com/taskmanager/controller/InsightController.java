package com.taskmanager.controller;

import com.taskmanager.dto.ApiResponse;
import com.taskmanager.dto.InsightDTO;
import com.taskmanager.entity.User;
import com.taskmanager.service.InsightService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for AI-powered productivity insights.
 */
@RestController
@RequestMapping("/api/insights")
@RequiredArgsConstructor
@Tag(name = "Insights", description = "AI-powered productivity insights")
@SecurityRequirement(name = "bearerAuth")
public class InsightController {

    private final InsightService insightService;

    @GetMapping
    @Operation(summary = "Get AI productivity insights",
               description = "Returns AI-generated insights based on task analysis")
    public ResponseEntity<ApiResponse<InsightDTO>> getInsights(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(ApiResponse.success("Insights generated",
            insightService.generateInsights(currentUser)));
    }
}
