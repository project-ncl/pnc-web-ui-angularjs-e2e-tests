import SSOLoginPage from "./SSOLoginPage";

class PncPage {
  constructor() {}

  visit() {
    cy.visit("/");
    cy.wait(2000);
  }

  login(username, password) {
    const ssoLoginPage = new SSOLoginPage();
    cy.get("#login-button").click();
    ssoLoginPage.fillUsername(username);
    ssoLoginPage.fillPassword(password);
    ssoLoginPage.submit();
    cy.get(`#username`).should("contain", username);
    return;
  }

  gotoSection(sectionName) {
    switch (sectionName.toLowerCase()) {
      case "dashboard":
        cy.get(".navbar-primary > :nth-child(1) > a").click();
        break;

      case "products":
        cy.get(".navbar-primary > :nth-child(2) > a").click();
        break;

      case "projects":
        cy.get(".navbar-primary > :nth-child(3) > a").click();
        break;

      case "build configs":
        cy.get("#configs-dropdown-button").click();
        cy.wait(200);
        cy.get(".open > .dropdown-menu > :nth-child(1) > a").click();
        break;

      case "group configs":
        cy.get("#configs-dropdown-button").click();
        cy.wait(200);
        cy.get(".open > .dropdown-menu > :nth-child(2) > a").click();
        break;

      case "builds":
        cy.get("#builds-dropdown-button").click();
        cy.wait(200);
        cy.get(".open > .dropdown-menu > :nth-child(1) > a").click();
        break;

      case "group builds":
        cy.get("#builds-dropdown-button").click();
        cy.wait(200);
        cy.get(".open > .dropdown-menu > :nth-child(2) > a").click();
        break;

      case "artifacts":
        cy.get(".navbar-primary > :nth-child(6) > a").click();
        break;

      case "scms":
        cy.get(".navbar-primary > :nth-child(7) > a").click();
        break;
    }
  }
}

export default PncPage;
