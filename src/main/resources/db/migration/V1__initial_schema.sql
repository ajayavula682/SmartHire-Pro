-- ============================================================
-- Flyway Migration V1 — Initial Schema
-- SmartHire Pro: AI-Based Recruitment Management System
--
-- Naming convention: V{version}__{description}.sql
-- This script is immutable once applied to any environment.
-- ============================================================

-- ─── Users ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    name        VARCHAR(150)    NOT NULL,
    email       VARCHAR(255)    NOT NULL,
    password    VARCHAR(255)    NOT NULL,
    role        ENUM('ADMIN','HR','RECRUITER') NOT NULL DEFAULT 'RECRUITER',
    active      BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at  DATETIME(6),
    updated_at  DATETIME(6),
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_users_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Candidates ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS candidates (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    name                VARCHAR(150)    NOT NULL,
    email               VARCHAR(255)    NOT NULL,
    phone               VARCHAR(20),
    skills              TEXT,
    resume_url          VARCHAR(500),
    current_location    VARCHAR(150),
    experience_years    VARCHAR(10),
    status              ENUM('APPLIED','SCREENED','SHORTLISTED','INTERVIEW_SCHEDULED',
                             'INTERVIEWED','HIRED','REJECTED') NOT NULL DEFAULT 'APPLIED',
    created_at          DATETIME(6),
    updated_at          DATETIME(6),
    CONSTRAINT pk_candidates PRIMARY KEY (id),
    CONSTRAINT uq_candidates_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Job Postings ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_postings (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    title               VARCHAR(255)    NOT NULL,
    description         TEXT            NOT NULL,
    department          VARCHAR(150),
    location            VARCHAR(150),
    experience_required VARCHAR(50),
    skills              VARCHAR(1000),
    status              ENUM('OPEN','CLOSED','ON_HOLD') NOT NULL DEFAULT 'OPEN',
    closing_date        DATE,
    posted_by           BIGINT,
    created_at          DATETIME(6),
    updated_at          DATETIME(6),
    CONSTRAINT pk_job_postings PRIMARY KEY (id),
    CONSTRAINT fk_job_posted_by FOREIGN KEY (posted_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Applications ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
    id              BIGINT  NOT NULL AUTO_INCREMENT,
    candidate_id    BIGINT  NOT NULL,
    job_posting_id  BIGINT  NOT NULL,
    status          ENUM('PENDING','UNDER_REVIEW','SHORTLISTED','REJECTED','HIRED')
                            NOT NULL DEFAULT 'PENDING',
    screening_score INT,
    recruiter_notes TEXT,
    applied_at      DATETIME(6),
    CONSTRAINT pk_applications PRIMARY KEY (id),
    CONSTRAINT uq_application UNIQUE (candidate_id, job_posting_id),
    CONSTRAINT fk_app_candidate FOREIGN KEY (candidate_id)  REFERENCES candidates(id),
    CONSTRAINT fk_app_job      FOREIGN KEY (job_posting_id) REFERENCES job_postings(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Interviews ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS interviews (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    application_id      BIGINT          NOT NULL,
    scheduled_at        DATETIME(6)     NOT NULL,
    mode                ENUM('VIRTUAL','IN_PERSON','PHONE') NOT NULL DEFAULT 'VIRTUAL',
    meeting_link        VARCHAR(500),
    interviewer_name    VARCHAR(150),
    feedback            TEXT,
    result              ENUM('PENDING','PASSED','FAILED','NO_SHOW') NOT NULL DEFAULT 'PENDING',
    created_at          DATETIME(6),
    updated_at          DATETIME(6),
    CONSTRAINT pk_interviews PRIMARY KEY (id),
    CONSTRAINT uq_interview_application UNIQUE (application_id),
    CONSTRAINT fk_interview_application FOREIGN KEY (application_id) REFERENCES applications(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Onboarding ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS onboarding (
    id              BIGINT  NOT NULL AUTO_INCREMENT,
    candidate_id    BIGINT  NOT NULL,
    status          ENUM('NOT_STARTED','IN_PROGRESS','COMPLETED') NOT NULL DEFAULT 'NOT_STARTED',
    joining_date    DATETIME(6),
    created_at      DATETIME(6),
    updated_at      DATETIME(6),
    CONSTRAINT pk_onboarding PRIMARY KEY (id),
    CONSTRAINT uq_onboarding_candidate UNIQUE (candidate_id),
    CONSTRAINT fk_onboarding_candidate FOREIGN KEY (candidate_id) REFERENCES candidates(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Onboarding Tasks (element collection) ────────────────────
CREATE TABLE IF NOT EXISTS onboarding_tasks (
    onboarding_id   BIGINT          NOT NULL,
    task            VARCHAR(255)    NOT NULL,
    CONSTRAINT fk_task_onboarding FOREIGN KEY (onboarding_id) REFERENCES onboarding(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Completed Tasks ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS completed_tasks (
    onboarding_id   BIGINT          NOT NULL,
    task            VARCHAR(255)    NOT NULL,
    CONSTRAINT fk_completed_onboarding FOREIGN KEY (onboarding_id) REFERENCES onboarding(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Indexes for performance ───────────────────────────────────
CREATE INDEX idx_candidates_status   ON candidates(status);
CREATE INDEX idx_jobs_status         ON job_postings(status);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_interviews_scheduled ON interviews(scheduled_at);
