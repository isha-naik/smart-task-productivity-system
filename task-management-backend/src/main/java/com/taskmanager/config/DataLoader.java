package com.taskmanager.config;

import com.taskmanager.entity.*;
import com.taskmanager.repository.CategoryRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * DataLoader seeds the database with realistic sample data on first startup.
 * Provides demo-ready data for: Managers, Employees, Tasks, Categories.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping data initialization.");
            return;
        }

        log.info("Seeding database with sample data...");

        // Create Categories
        Category dev = categoryRepository.save(Category.builder().categoryName("Development").build());
        Category design = categoryRepository.save(Category.builder().categoryName("Design").build());
        Category marketing = categoryRepository.save(Category.builder().categoryName("Marketing").build());
        Category qa = categoryRepository.save(Category.builder().categoryName("QA Testing").build());
        Category devops = categoryRepository.save(Category.builder().categoryName("DevOps").build());

        // Create Manager
        User manager = userRepository.save(User.builder()
            .name("Arjun Sharma")
            .email("manager@taskmanager.com")
            .password(passwordEncoder.encode("manager123"))
            .role(Role.MANAGER)
            .build());

        // Create Employees
        User emp1 = userRepository.save(User.builder()
            .name("Priya Patel")
            .email("priya@employee.com")
            .password(passwordEncoder.encode("employee123"))
            .role(Role.EMPLOYEE)
            .build());

        User emp2 = userRepository.save(User.builder()
            .name("Rahul Verma")
            .email("rahul@employee.com")
            .password(passwordEncoder.encode("employee123"))
            .role(Role.EMPLOYEE)
            .build());

        User emp3 = userRepository.save(User.builder()
            .name("Sneha Gupta")
            .email("sneha@employee.com")
            .password(passwordEncoder.encode("employee123"))
            .role(Role.EMPLOYEE)
            .build());

        // Create Sample Tasks
        List<Task> tasks = List.of(
            Task.builder().title("Design Login UI").description("Create wireframes and Figma designs for the login page.")
                .status(TaskStatus.COMPLETED).priority(TaskPriority.HIGH).dueDate(LocalDate.now().minusDays(2))
                .assignedTo(emp1).createdBy(manager).category(design).build(),

            Task.builder().title("Implement JWT Authentication").description("Set up Spring Security with JWT tokens.")
                .status(TaskStatus.COMPLETED).priority(TaskPriority.HIGH).dueDate(LocalDate.now().minusDays(5))
                .assignedTo(emp2).createdBy(manager).category(dev).build(),

            Task.builder().title("Build Dashboard Charts").description("Integrate Chart.js for analytics visualization.")
                .status(TaskStatus.IN_PROGRESS).priority(TaskPriority.MEDIUM).dueDate(LocalDate.now().plusDays(2))
                .assignedTo(emp1).createdBy(manager).category(dev).build(),

            Task.builder().title("Write API Documentation").description("Document all REST endpoints using Swagger/OpenAPI.")
                .status(TaskStatus.IN_PROGRESS).priority(TaskPriority.MEDIUM).dueDate(LocalDate.now().plusDays(3))
                .assignedTo(emp2).createdBy(manager).category(dev).build(),

            Task.builder().title("Setup CI/CD Pipeline").description("Configure GitHub Actions for automated deployment.")
                .status(TaskStatus.PENDING).priority(TaskPriority.HIGH).dueDate(LocalDate.now().plusDays(7))
                .assignedTo(emp3).createdBy(manager).category(devops).build(),

            Task.builder().title("Fix Login Page Bugs").description("Resolve reported bugs in the authentication flow.")
                .status(TaskStatus.OVERDUE).priority(TaskPriority.HIGH).dueDate(LocalDate.now().minusDays(3))
                .assignedTo(emp1).createdBy(manager).category(qa).build(),

            Task.builder().title("Create Email Marketing Campaign").description("Design Q2 email campaign for product launch.")
                .status(TaskStatus.PENDING).priority(TaskPriority.MEDIUM).dueDate(LocalDate.now().plusDays(10))
                .assignedTo(emp3).createdBy(manager).category(marketing).build(),

            Task.builder().title("Database Performance Optimization").description("Optimize slow queries and add indexes.")
                .status(TaskStatus.PENDING).priority(TaskPriority.HIGH).dueDate(LocalDate.now().plusDays(5))
                .assignedTo(emp2).createdBy(manager).category(dev).build(),

            Task.builder().title("Mobile Responsiveness Testing").description("Test app across mobile devices and fix issues.")
                .status(TaskStatus.IN_PROGRESS).priority(TaskPriority.LOW).dueDate(LocalDate.now().plusDays(4))
                .assignedTo(emp1).createdBy(manager).category(qa).build(),

            Task.builder().title("Update UI Component Library").description("Upgrade ShadCN components to latest version.")
                .status(TaskStatus.PENDING).priority(TaskPriority.LOW).dueDate(LocalDate.now().plusDays(14))
                .assignedTo(emp3).createdBy(manager).category(dev).build()
        );

        taskRepository.saveAll(tasks);

        log.info("✅ Sample data loaded successfully!");
        log.info("Demo Credentials:");
        log.info("  Manager  → manager@taskmanager.com / manager123");
        log.info("  Employee → priya@employee.com / employee123");
        log.info("  Employee → rahul@employee.com / employee123");
        log.info("  Employee → sneha@employee.com / employee123");
    }
}
