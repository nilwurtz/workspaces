use yew::prelude::*;
use components::title::Title;

mod components;

#[function_component(App)]
fn app() -> Html {
    html! {
        <div>
            <Title text="This is Title."/>
            <h2>{"Hello World"}</h2>
        </div>
    }
}

fn main() {
    yew::start_app::<App>();
}
