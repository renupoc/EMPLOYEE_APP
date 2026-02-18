package tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.*;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.Duration;

public class Test1_OpenHomePage {

    private WebDriver driver;
    private WebDriverWait wait;

    // ⭐ Dynamic base URL (NO HARDCODING)
    private String getBaseUrl() {
        String url = System.getProperty("baseUrl");
        if (url == null || url.isEmpty()) {
            url = "http://localhost:4200"; // fallback for local
        }
        return url;
    }

    // ⭐ Setup driver (Headless for EC2)
    private void setupDriver() {
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();

        // Headless EC2 config
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--window-size=1920,1080");

        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(20));
    }

    private void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void registerAndLoginEmployee() {

        setupDriver();

        driver.get(getBaseUrl());

        // ✔ Open Home
        Assert.assertTrue(driver.getCurrentUrl().contains("http"));

        // ✔ Click Register
        WebElement registerBtn = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath("//button[contains(.,'Register')]")
                )
        );
        registerBtn.click();

        // ✔ Generate dynamic email
        String email = "test" + System.currentTimeMillis() + "@gmail.com";

        // ✔ Register user
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//input[@placeholder='Enter first name']")
        )).sendKeys("Renu");

        driver.findElement(
                By.xpath("//input[@placeholder='Enter last name']")
        ).sendKeys("Automation");

        driver.findElement(
                By.xpath("//input[@placeholder='Enter email']")
        ).sendKeys(email);

        // ✔ Dropdown handling
        Select dept = new Select(driver.findElement(By.tagName("select")));
        dept.selectByIndex(1); // safer for automation

        driver.findElement(
                By.xpath("//input[@placeholder='Create password']")
        ).sendKeys("Test123");

        driver.findElement(
                By.xpath("//input[@placeholder='Confirm password']")
        ).sendKeys("Test123");

        // ✔ Click Register
        driver.findElement(
                By.xpath("//button[contains(.,'Register')]")
        ).click();

        // ✔ Handle Angular success alert
        wait.until(ExpectedConditions.alertIsPresent());
        Alert alert = driver.switchTo().alert();
        System.out.println("Alert message: " + alert.getText());
        alert.accept();

        // ✔ Login user
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//input[@placeholder='Enter your email']")
        )).sendKeys(email);

        driver.findElement(
                By.xpath("//input[@placeholder='Enter your password']")
        ).sendKeys("Test123");

        driver.findElement(
                By.xpath("//button[contains(.,'Login')]")
        ).click();

        // ✔ Dashboard verification
        wait.until(ExpectedConditions.urlContains("dashboard"));
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"));

        System.out.println("✔ Register and Login Successful");

        tearDown();
    }
}

