class SSOLoginPage {
  fillUsername(value) {
    const field = cy.get(`#username`);
    field.clear();
    field.type(value);
    return this;
  }

  fillPassword(value) {
    const field = cy.get(`#password`);
    field.clear();
    field.type(value);

    return this;
  }

  submit() {
    const button = cy.get(`#kc-login`);
    button.click();
  }
}

export default SSOLoginPage;
