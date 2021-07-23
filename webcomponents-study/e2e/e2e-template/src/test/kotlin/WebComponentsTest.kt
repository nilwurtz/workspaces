import com.codeborne.selenide.Condition
import com.codeborne.selenide.Selenide
import com.codeborne.selenide.selector.ByShadow
import org.junit.jupiter.api.Test

class WebComponentsTest {
    @Test
    fun test() {
        Selenide.open("http://localhost:8080")
        Selenide.`$`(ByShadow.cssSelector("div", "x-greeting")).shouldHave(Condition.text("hoge"))
    }
}