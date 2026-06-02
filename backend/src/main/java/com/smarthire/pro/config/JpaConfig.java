package com.smarthire.pro.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Enables @CreatedDate and @LastModifiedDate in entities.
 */
@Configuration
@EnableJpaAuditing
public class JpaConfig {
}
