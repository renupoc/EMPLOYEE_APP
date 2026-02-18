package pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.*;

import java.time.Duration;

public class LoginPage {

    WebDriver driver;
    WebDriverWait wait;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    public void login(String email, String password) {

        // Wait for login page
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//input[contains(@placeholder,'email')]")
        ));

        driver.findElement(
                By.xpath("//input[contains(@placeholder,'email')]")
        ).sendKeys(email);

        driver.findElement(
                By.xpath("//input[contains(@placeholder,'password')]")
        ).sendKeys(password);

        driver.findElement(
                By.xpath("//button[contains(.,'Login')]")
        ).click();
    }

    // ✅ Handle alert after login if any
    public void handleAlertIfPresent() {
        try {
            Alert alert = wait.until(ExpectedConditions.alertIsPresent());
            System.out.println("Alert: " + alert.getText());
            alert.accept();
        } catch (Exception ignored) {
        }
    }
}

