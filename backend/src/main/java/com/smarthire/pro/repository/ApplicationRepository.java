package com.smarthire.pro.repository;

import com.smarthire.pro.entity.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Page<Application> findByJobPostingId(Long jobPostingId, Pageable pageable);

    Page<Application> findByCandidateId(Long candidateId, Pageable pageable);

    Optional<Application> findByCandidateIdAndJobPostingId(Long candidateId, Long jobId);

    boolean existsByCandidateIdAndJobPostingId(Long candidateId, Long jobId);

    long countByStatus(Application.ApplicationStatus status);
}
