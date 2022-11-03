fn return_ok() -> anyhow::Result<String> {
    Ok("awesome string".into())
}

fn return_err() -> anyhow::Result<String> {
    Err(anyhow::anyhow!("awesome error"))
}

fn main() {
    // 2つの Result の両方 OK なら A, どちらか Err なら B という処理をいい感じに書きたい

    // 素直 だが 取り出すのは面倒
    println!("=== if ===");
    let o1 = return_ok();
    let e1 = return_err();
    if o1.is_ok() && e1.is_ok() {
        println!("Both result is ok :) {} {}", o1.unwrap(), e1.unwrap())
    } else {
        println!(
            "Either one is an error :/ {} {}",
            o1.unwrap_or_else(|e| e.to_string()),
            e1.unwrap_or_else(|e| e.to_string())
        )
    }
    // else 内でやらないとここでは o1 e1 共にMoveされている

    // 若干 unwrap がめんどくさいが、よさそう
    // インデントは深い
    println!("=== match ===");
    match (return_ok(), return_err()) {
        (Ok(s1), Ok(s2)) => {
            println!("Both result is ok :) {} {}", s1, s2)
        }
        (x, y) => {
            println!(
                "Either one is an error :/ {} {}",
                x.unwrap_or_else(|e| e.to_string()),
                y.unwrap_or_else(|e| e.to_string())
            )
        }
    };

    // 補完ができるし、明示的なのでこういうのもそんなに悪くない
    println!("=== match2 ===");
    match (return_ok(), return_ok()) {
        (Ok(s1), Ok(s2)) => {
            println!("Both result is ok :) {} {}", s1, s2)
        }
        (Ok(_), Err(_)) => todo!(),
        (Err(_), Ok(_)) => todo!(),
        (Err(_), Err(_)) => todo!(),
    };

    // Enumなら普通に Match 書いたほうがわかりやすい
    // これから条件が増えていくとかなら良さそう
    println!("=== match with guard ===");
    match (return_ok(), return_err()) {
        (x, y) if x.is_ok() && y.is_ok() => {
            println!("Both result is ok :) {} {}", x.unwrap(), y.unwrap())
        }
        (x, y) => {
            println!(
                "Either one is an error :/ {} {}",
                x.unwrap_or_else(|e| e.to_string()),
                y.unwrap_or_else(|e| e.to_string())
            )
        }
    };

    // インデントが少なくて済むし明示的
    // else で変数の中身がいらないなら一番スッキリ
    println!("=== if let ===");
    let r1 = return_ok();
    let r2 = return_err();
    // as_ref しないと r1 r2 の move が起き、else で見れなくなる
    if let (Ok(o1), Ok(o2)) = (r1.as_ref(), r2.as_ref()) {
        // o1 o2 は &String
        println!("Both result is ok :) {} {}", o1, o2)
    } else {
        println!(
            "Either one is an error :/ {}, {}",
            r1.unwrap_or_else(|e| e.to_string()),
            r2.unwrap_or_else(|e| e.to_string())
        )
    }
}
