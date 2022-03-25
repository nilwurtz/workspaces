use axum::{Json, Router, routing::get};
use serde_json::{json, Value};

pub fn routes() -> Router {
    Router::new().route("/ping", get(get_ping))
}

async fn get_ping() -> Json<Value> {
    Json(json!({"message": "OK"}))
}
