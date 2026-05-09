package com.taskmanager.service;

import com.taskmanager.dto.CategoryDTO;
import com.taskmanager.entity.Category;
import com.taskmanager.exception.BadRequestException;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for Task Category management.
 */
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public CategoryDTO createCategory(CategoryDTO dto) {
        if (categoryRepository.existsByCategoryName(dto.getCategoryName())) {
            throw new BadRequestException("Category already exists: " + dto.getCategoryName());
        }
        Category category = Category.builder()
            .categoryName(dto.getCategoryName())
            .build();
        return toDTO(categoryRepository.save(category));
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category", id));
        categoryRepository.delete(category);
    }

    private CategoryDTO toDTO(Category category) {
        return CategoryDTO.builder()
            .id(category.getId())
            .categoryName(category.getCategoryName())
            .build();
    }
}
