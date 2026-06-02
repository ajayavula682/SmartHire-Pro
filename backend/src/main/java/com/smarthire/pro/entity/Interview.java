package com.smarthire.pro.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Interview entity — manages scheduling, mode, and result.
 * Sprint 4: Interview Scheduling & Notifications
 */
@Entity
@Table(name = "interviews")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(nullable = false)
    private LocalDateTime scheduledAt;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private InterviewMode mode = InterviewMode.VIRTUAL;

    private String meetingLink;         // for virtual interviews

    private String interviewerName;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private InterviewResult result = InterviewResult.PENDING;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum InterviewMode {
        VIRTUAL, IN_PERSON, PHONE
    }

    public enum InterviewResult {
        PENDING, PASSED, FAILED, NO_SHOW
    }
}
