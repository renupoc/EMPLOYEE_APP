package tests;

import base.BaseTest;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.*;
import org.testng.Assert;
import org.testng.annotations.Test;
import pages.LoginPage;

import java.time.Duration;

public class EmployeeTest extends BaseTest {

    @Test
    public void endToEndRegisterLogin() {

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));

        // ✅ Open Register
        wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[contains(.,'Register')]")
        )).click();

        // Dynamic email
        String email = "test" + System.currentTimeMillis() + "@gmail.com";
        String password = "Test123";

        // Fill form
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//input[contains(@placeholder,'first name')]")
        )).sendKeys("Renu");

        driver.findElement(
                By.xpath("//input[contains(@placeholder,'last name')]")
        ).sendKeys("Test");

        driver.findElement(
                By.xpath("//input[contains(@placeholder,'email')]")
        ).sendKeys(email);

        // Dropdown
        WebElement dept = driver.findElement(By.tagName("select"));
        new Select(dept).selectByIndex(1);

        driver.findElement(
                By.xpath("//input[contains(@placeholder,'Create password')]")
        ).sendKeys(password);

        driver.findElement(
                By.xpath("//input[contains(@placeholder,'Confirm password')]")
        ).sendKeys(password);

        driver.findElement(
                By.xpath("//button[contains(.,'Register')]")
        ).click();

        // ✅ Handle success alert
        try {
            Alert alert = wait.until(ExpectedConditions.alertIsPresent());
            System.out.println("Alert message: " + alert.getText());
            alert.accept();
        } catch (Exception ignored) {
        }

        // ✅ Login
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login(email, password);

        loginPage.handleAlertIfPresent();

        // ✅ Verify dashboard
        wait.until(ExpectedConditions.urlContains("dashboard"));
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"));

        System.out.println("✔ Register and Login Successful");
    }
}

