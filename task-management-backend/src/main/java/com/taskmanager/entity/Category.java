package com.taskmanager.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Category entity for grouping tasks (e.g., Development, Design, Marketing).
 */
@Entity
@Table(name = "categories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String categoryName;
}
