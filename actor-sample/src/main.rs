use actix::prelude::*;

#[derive(Message)]
#[rtype(result = "String")]
struct Text(String);
struct TextActor;

impl Actor for TextActor {
    type Context = Context<Self>;

    fn started(&mut self, _ctx: &mut Self::Context) {
        println!("TextAcror started");
    }
}

impl Handler<Text> for TextActor {
    type Result = String;

    fn handle(&mut self, msg: Text, _ctx: &mut Context<Self>) -> Self::Result {
        msg.0.to_uppercase()
    }
}

#[actix::main]
async fn main() {
    let addr = TextActor.start();
    let res = addr.send(Text("hello world!".into())).await;

    match res {
        Ok(result) => println!("Returned: {}", result),
        Err(e) => println!("Communication failed. {:?}", e),
    }
}
