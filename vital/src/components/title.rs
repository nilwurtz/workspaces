use yew::{html, Html, Properties, function_component};

#[derive(Properties, PartialEq)]
pub struct TitleProps {
    pub text: String
}

#[function_component(Title)]
pub fn title(props: &TitleProps) -> Html {
    html! {
        <h1>{props.text.clone()}</h1>
    }
}