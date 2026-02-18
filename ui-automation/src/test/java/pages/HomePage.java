package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class HomePage {

    private WebDriver driver;

    private By registerBtn = By.xpath("//button[contains(.,'Register')]");
    private By loginBtn = By.xpath("//button[contains(.,'Login')]");

    public HomePage(WebDriver driver) {
        this.driver = driver;
    }

    public void clickRegister() {
        driver.findElement(registerBtn).click();
    }

    public void clickLogin() {
        driver.findElement(loginBtn).click();
    }
}

