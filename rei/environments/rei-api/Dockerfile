FROM rust:1.59.0-slim-buster

WORKDIR /app

COPY . .

RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/app/target \
    cargo build --release

CMD ["/app/target/release/rei-api"]