package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.Select;

public class RegisterPage {

    private WebDriver driver;

    public RegisterPage(WebDriver driver) {
        this.driver = driver;
    }

    public void register(String email) {

        driver.findElement(By.xpath("//input[@placeholder='Enter first name']")).sendKeys("Renu");

        driver.findElement(By.xpath("//input[@placeholder='Enter last name']")).sendKeys("Test");

        driver.findElement(By.xpath("//input[@placeholder='Enter email']")).sendKeys(email);

        Select select = new Select(driver.findElement(By.xpath("//select")));
        select.selectByVisibleText("IDIS");

        driver.findElement(By.xpath("//input[@placeholder='Create password']")).sendKeys("Test123");

        driver.findElement(By.xpath("//input[@placeholder='Confirm password']")).sendKeys("Test123");

        driver.findElement(By.xpath("//button[contains(.,'Register')]")).click();
    }
}

