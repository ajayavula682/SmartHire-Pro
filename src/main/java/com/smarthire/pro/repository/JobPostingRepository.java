package com.smarthire.pro.repository;

import com.smarthire.pro.entity.JobPosting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {

    Page<JobPosting> findByStatus(JobPosting.JobStatus status, Pageable pageable);

    Page<JobPosting> findByDepartment(String department, Pageable pageable);

    @Query("SELECT j FROM JobPosting j WHERE " +
           "LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.skills) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.department) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<JobPosting> searchJobs(@Param("keyword") String keyword, Pageable pageable);

    long countByStatus(JobPosting.JobStatus status);
}
