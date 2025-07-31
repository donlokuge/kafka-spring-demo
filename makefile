run-kafka:
	docker-compose up

stop-kafka:
	docker-compose down

run-producer:
	nx run kafka-producer:serve

run-consumer:
	nx run kafka-consumer:serve