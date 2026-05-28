package com.smarthire.pro.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Onboarding entity — tracks post-hire workflow for new employees.
 * Sprint 5: Employee Onboarding
 */
@Entity
@Table(name = "onboarding")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Onboarding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OnboardingStatus status = OnboardingStatus.NOT_STARTED;

    @ElementCollection
    @CollectionTable(name = "onboarding_tasks", joinColumns = @JoinColumn(name = "onboarding_id"))
    @Column(name = "task")
    @Builder.Default
    private List<String> tasks = new ArrayList<>(List.of(
            "Submit ID Documents",
            "Sign Offer Letter",
            "IT Equipment Setup",
            "HR Orientation",
            "Team Introduction",
            "System Access Setup"
    ));

    @ElementCollection
    @CollectionTable(name = "completed_tasks", joinColumns = @JoinColumn(name = "onboarding_id"))
    @Column(name = "task")
    @Builder.Default
    private List<String> completedTasks = new ArrayList<>();

    private LocalDateTime joiningDate;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum OnboardingStatus {
        NOT_STARTED, IN_PROGRESS, COMPLETED
    }
}
