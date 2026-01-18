FROM azul/zulu-openjdk-alpine:21-latest AS builder

WORKDIR /app

COPY . .

RUN ./gradlew bootJar

FROM azul/zulu-openjdk-alpine:21-latest

COPY --from=builder /app/build/libs/*.jar /app.jar

EXPOSE 9090

ENTRYPOINT ["java", "-jar", "/app.jar"]