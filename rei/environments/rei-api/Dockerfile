FROM rust:1.59.0-slim-buster as builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:buster-slim
WORKDIR /app
COPY --from=builder /app/target/release/rest rei-api
EXPOSE 8000
CMD [ "./rei-api" ]