use std::net::SocketAddr;

use axum::{Router, Server};

mod v1;

fn main() {
    run()
}

#[tokio::main]
async fn run() {
    let app = Router::new().nest("/v1", v1::routes());

    let addr = SocketAddr::from(([0, 0, 0, 0], 8000));

    Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .expect("Failed to run server!!")
}
