use axum::Router;

use crate::v1::systems;

pub fn routes() -> Router {
    Router::new().nest("/systems", systems::routes())
}