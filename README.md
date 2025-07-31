# Kafka + Redis + Nx + Spring Boot Starter

This monorepo demonstrates a simple event-driven architecture using:

- **KafkaJS (TypeScript)** — Kafka Producer & Consumer
- **Redis** — For persisting consumed messages
- **Spring Boot** — REST API to fetch those messages
- **Nx** — Monorepo orchestration for TS & Java apps
- **Docker Compose** — Local Kafka + Redis setup

---

## 🧭 Architecture

```text
+--------------+         +--------------------+        +----------------------+
|              |         |                    |        |                      |
| KafkaProducer| ──────▶ |     Kafka Broker    | ─────▶ |   KafkaConsumer      |
| (TypeScript) |         |   (localhost:9092)  |        |   (TypeScript)       |
|              |         |                    |        |                      |
+--------------+         +--------------------+        +----------┬-----------+
                                                                    │
                                                                    ▼
                                                         +----------------------+
                                                         |                      |
                                                         |      Redis           |
                                                         |  (localhost:6379)    |
                                                         |                      |
                                                         +----------┬-----------+
                                                                    │
                                                                    ▼
                                                         +----------------------+
                                                         |                      |
                                                         | Spring Boot API      |
                                                         |  GET /messages       |
                                                         |  GET /messages/latest|
                                                         +----------------------+
```

## 🚀 Getting Started

### Start Kafka and Redis
````bash
make run-kafka
# or
docker-compose up
````

### Run Producer (TypeScript)
```bash
make run-producer
# or
nx run kafka-producer:serve
```

### Run Consumer (TypeScript)
```bash
make run-consumer
# or
nx run kafka-consumer:serve
``` 

### Run Spring Boot REST API
```bash
make run-api
# or
nx run spring-api:bootRun
```

## 📁 Repo Structure
apps/
├── kafka-consumer/   # TypeScript Kafka consumer
├── kafka-producer/   # TypeScript Kafka producer
└── spring-api/       # Java Spring Boot REST API

Swagger UI for API
- Access at `http://localhost:8080/swagger-ui.html`
