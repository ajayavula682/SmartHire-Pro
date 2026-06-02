package com.smarthire.pro.repository;

import com.smarthire.pro.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {

    Optional<Interview> findByApplicationId(Long applicationId);

    @Query("SELECT i FROM Interview i WHERE i.scheduledAt BETWEEN :start AND :end")
    List<Interview> findInterviewsInRange(@Param("start") LocalDateTime start,
                                          @Param("end") LocalDateTime end);

    long countByResult(Interview.InterviewResult result);
}
