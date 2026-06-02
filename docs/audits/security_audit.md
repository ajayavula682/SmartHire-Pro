# 🔒 SmartHire Pro — Security Audit Report

**Date**: May 28, 2026  
**Scope**: Environment variables, secrets management, configuration files, and production safety

---

## Overall Verdict

> [!TIP]
> Your application follows **solid security practices** for secrets management. No hardcoded production secrets were found. All sensitive values are externalized via `${ENV_VAR}` placeholders. Below are findings organized by severity.

---

## ✅ What's Done Right

| Area | Status | Details |
|------|--------|---------|
| `.gitignore` | ✅ Excellent | Covers `.env`, `*.pem`, `*.key`, `*.p12`, `*.jks` |
| `.env` file | ✅ Safe | No `.env` file committed to git |
| `.env.example` | ✅ Good | Contains only placeholder values, no real secrets |
| Prod DB credentials | ✅ Safe | Uses `${DB_URL}`, `${DB_USERNAME}`, `${DB_PASSWORD}` |
| Prod mail credentials | ✅ Safe | Uses `${MAIL_USERNAME}`, `${MAIL_PASSWORD}` |
| JWT secret (prod) | ✅ Safe | Uses `${JWT_SECRET}` with no hardcoded fallback in prod |
| Docker Compose | ✅ Safe | Loads secrets from `.env` file via `env_file: .env` |
| Swagger in prod | ✅ Disabled | `springdoc.swagger-ui.enabled=false` in prod profile |
| SQL logging in prod | ✅ Off | `org.hibernate.SQL=OFF` — prevents PII leaks |
| Error details in prod | ✅ Hidden | `include-message=never`, `include-stacktrace=never` |
| Actuator in prod | ✅ Restricted | Only `health,info,prometheus` on separate port 9090 |
| Flyway in prod | ✅ Strict | `ddl-auto=none`, `clean-disabled=true` |
| Password storage | ✅ BCrypt | Uses `BCryptPasswordEncoder` — industry standard |
| Java source code | ✅ Clean | No hardcoded secrets in any `.java` files |

---

## ⚠️ Issues Found

### 🔴 CRITICAL — JWT Dev Fallback Secret in Base Config

**File**: [application.properties](file:///Users/avulaajaykumarreddy/Developer/SmartHire%20Pro/src/main/resources/application.properties#L62)

```properties
jwt.secret=${JWT_SECRET:SmartHireDevSecretKey_ReplaceInProdWith256BitKey!}
```

> [!CAUTION]
> The base `application.properties` has a **hardcoded fallback JWT secret**. If `JWT_SECRET` env var is not set in production (misconfiguration), the app will silently use this weak dev key — meaning **anyone who reads the source code can forge JWT tokens**.

**Fix**: Remove the fallback from base config and add it only to `application-dev.properties`:

```diff
# application.properties (line 62)
-jwt.secret=${JWT_SECRET:SmartHireDevSecretKey_ReplaceInProdWith256BitKey!}
+jwt.secret=${JWT_SECRET}

# application-dev.properties (add at bottom)
+jwt.secret=${JWT_SECRET:SmartHireDevSecretKey_OnlyForLocalDev_32chars!}
```

This way, **production will fail to start** if `JWT_SECRET` is missing — which is the safe behavior.

---

### 🟡 MEDIUM — Dev DB Password Has Hardcoded Fallback

**File**: [application-dev.properties](file:///Users/avulaajaykumarreddy/Developer/SmartHire%20Pro/src/main/resources/application-dev.properties#L15)

```properties
spring.datasource.password=${DB_PASSWORD:root}
```

> [!WARNING]
> The dev profile falls back to `root` as the MySQL password. While this is dev-only, it's a common credential that could be exploited if the dev profile is accidentally activated in staging/prod.

**Fix** (optional but recommended):
```diff
-spring.datasource.password=${DB_PASSWORD:root}
+spring.datasource.password=${DB_PASSWORD}
```

---

### 🟡 MEDIUM — Dev Actuator Exposes All Endpoints

**File**: [application-dev.properties](file:///Users/avulaajaykumarreddy/Developer/SmartHire%20Pro/src/main/resources/application-dev.properties#L48)

```properties
management.endpoints.web.exposure.include=*
```

> [!WARNING]
> Exposing all actuator endpoints in dev (including `/env`, `/configprops`, `/beans`) can leak environment variables, DB credentials, and internal config if the dev port is accessible on a network. This is fine for localhost-only but risky on shared networks.

**Fix**: Limit to useful dev endpoints:
```diff
-management.endpoints.web.exposure.include=*
+management.endpoints.web.exposure.include=health,info,metrics,env,beans,mappings
```

---

### 🟡 MEDIUM — Git Remote URL Contains PAT Token

**Current state**: Your git remote URL has the PAT token embedded:
```
https://ajayavula682:ghp_xxx...@github.com/ajayavula682/SmartHire-Pro.git
```

> [!WARNING]
> Anyone with access to this machine can see the token via `git remote -v`. The token is also stored in `.git/config`.

**Fix**: Run this command to clean the remote URL:
```bash
git remote set-url origin https://github.com/ajayavula682/SmartHire-Pro.git
```

Then configure git to use the credential helper for future pushes:
```bash
git config --global credential.helper osxkeychain
```

---

### 🟢 LOW — Dockerfile Runs as Root

**File**: [Dockerfile](file:///Users/avulaajaykumarreddy/Developer/SmartHire%20Pro/Dockerfile#L10-L15)

> [!NOTE]
> The container runs the app as `root` user. In production, this is a security concern — if the app is compromised, the attacker has root access inside the container.

**Fix**: Add a non-root user:
```diff
 FROM eclipse-temurin:17-jre-alpine
 WORKDIR /app
+RUN addgroup -S appgroup && adduser -S appuser -G appgroup
 RUN mkdir -p /app/uploads/resumes
+RUN chown -R appuser:appgroup /app
 COPY --from=builder /app/target/*.jar app.jar
+USER appuser
 EXPOSE 8080
 ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

### 🟢 LOW — No CORS Configuration

**File**: [SecurityConfig.java](file:///Users/avulaajaykumarreddy/Developer/SmartHire%20Pro/src/main/java/com/smarthire/pro/config/SecurityConfig.java)

> [!NOTE]
> No CORS policy is configured. When you add a frontend, you'll need explicit CORS rules. Without them, Spring defaults to blocking all cross-origin requests — which is safe, but should be explicitly configured for production.

---

### 🟢 LOW — No Rate Limiting on Auth Endpoints

**File**: [SecurityConfig.java](file:///Users/avulaajaykumarreddy/Developer/SmartHire%20Pro/src/main/java/com/smarthire/pro/config/SecurityConfig.java#L37)

> [!NOTE]
> `/auth/**` is publicly accessible with no rate limiting. Brute-force attacks on login are possible. Consider adding rate limiting via a filter or API gateway in production.

---

### 🟢 LOW — Missing Security Headers

> [!NOTE]
> No explicit HSTS, X-Frame-Options, or Content-Security-Policy headers configured. Spring Security provides some defaults, but production should explicitly set:
> - `Strict-Transport-Security` (HSTS)
> - `X-Content-Type-Options: nosniff`
> - `X-Frame-Options: DENY`
> - `Content-Security-Policy`

---

## 📊 Summary

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 Critical | 1 | JWT fallback secret in base config |
| 🟡 Medium | 3 | Dev DB fallback, Actuator exposure, Git remote token |
| 🟢 Low | 4 | Dockerfile root, No CORS, No rate limit, Missing headers |
| ✅ Passing | 14 | All production secrets properly externalized |

---

## 🎯 Recommended Immediate Actions

1. **[CRITICAL]** Move JWT secret fallback from `application.properties` to `application-dev.properties` only
2. **[MEDIUM]** Clean the PAT token from your git remote URL
3. **[MEDIUM]** Remove dev DB password fallback
4. **[LOW]** Add non-root user to Dockerfile

Would you like me to apply these fixes automatically?
