class GroupConfigsListPage {
  constructor() {}

  visit() {
    cy.visit(`/#/group-configs`);
  }

  createGroupConfig(groupConfig) {
    cy.get('[title="Create Group Config"]').click();
    cy.get("#input-name").type(groupConfig.name);
    const comboBoxProduct = cy.get(
      "pnc-product-combobox > px-combobox > .combobox-container > .input-group > input"
    );
    //Workaround for NCL-6921 issue
    comboBoxProduct.type(
      groupConfig.productName.substring(0, groupConfig.productName.length - 1)
    );
    cy.wait(2000);
    cy.get(".px-combobox-option > .ng-binding")
      .contains(groupConfig.productName)
      .click();
    const comboBoxVersion = cy.get(
      "pnc-product-version-combobox > px-combobox > .combobox-container > .input-group > input"
    );
    comboBoxVersion.type(groupConfig.versionName);
    cy.wait(2000);
    cy.get(".px-combobox-option > .ng-binding")
      .contains(groupConfig.versionName)
      .click();
    cy.get('[type="submit"]').click();
  }
}

export default GroupConfigsListPage;
