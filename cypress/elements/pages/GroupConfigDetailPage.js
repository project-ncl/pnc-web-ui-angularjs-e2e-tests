class GroupConfigDetailPage {
  constructor() {}

  visit(groupConfigId) {
    cy.visit(`/#/group-configs/${groupConfigId}`);
  }

  addBCToGroupConfig(buildConfig) {
    cy.get(
      '.toolbar-actions > [title="Add or remove build configs to the list"]'
    ).click();
    cy.get(".search-pf-input-group > input").type(buildConfig.projectName);
    cy.get(".search-pf-input-group > ul > li > a >strong")
      .contains(buildConfig.projectName)
      .click();
    cy.wait(500);
    cy.get(".list-group-item-heading")
      .contains(buildConfig.name)
      .parent()
      .parent()
      .prev()
      .click();
    cy.get(".btn-primary").contains("Add Selected").click();
    cy.get(".btn-primary").contains("Save").click();
  }
  clickGCProductVersionLink(groupConfig) {
    cy.wait(500);
    cy.get("pnc-product-version-link > div > a")
      .contains(`${groupConfig.productName} - v${groupConfig.versionName}`)
      .click();
  }
}

export default GroupConfigDetailPage;
