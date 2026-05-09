package com.taskmanager.controller;

import com.taskmanager.dto.AnalyticsDTO;
import com.taskmanager.dto.ApiResponse;
import com.taskmanager.entity.User;
import com.taskmanager.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for dashboard analytics data.
 */
@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Dashboard analytics and productivity metrics")
@SecurityRequirement(name = "bearerAuth")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    @Operation(summary = "Get analytics data", description = "Returns task statistics and productivity metrics")
    public ResponseEntity<ApiResponse<AnalyticsDTO>> getAnalytics(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(ApiResponse.success("Analytics retrieved",
            analyticsService.getAnalytics(currentUser)));
    }
}
