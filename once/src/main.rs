use once_cell::sync::OnceCell;

static ENV: OnceCell<String> = OnceCell::new();

fn main() {
    ENV.set("aaa".to_string()).expect("failed to set");
    println!("Hello, world!");
    println!("=-----{:?}", ENV.get().expect("ENV is not initialized"))
}
