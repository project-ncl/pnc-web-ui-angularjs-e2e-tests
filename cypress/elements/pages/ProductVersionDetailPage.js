class ProductVersionDetailPage {
  constructor() {}

  visit(productId, versionId) {
    cy.visit(`/#/products/${productId}/versions/${versionId}`);
  }

  verifyProductVersionName(productVersionName) {
    return cy
      .get("#input-version")
      .contains(productVersionName)
      .should("exist");
  }

  createMilestone(milestone) {
    cy.get(
      ".clearfix > pnc-header > .row > .col-md-12 > .page-header > .btn-toolbar > .ng-scope > .btn"
    ).click();
    cy.get("#input-version").type(milestone.name);
    cy.get('[ng-model="$ctrl.startingDate"]').type(milestone.startDate);
    cy.get('[ng-model="$ctrl.plannedEndDate"]').type(milestone.endDate);
    cy.get("#input-set-current").check();
    cy.get('.col-sm-offset-2 > [value="Create"]').click();
    cy.get(".header-title > .ng-binding")
      .contains(milestone.name)
      .should("exist");
  }

  buildGroupConfigByGC(groupConfig, force = false) {
    cy.get(
      "pnc-group-configs-data-table > .row > pnc-toolbar > pf-toolbar > .container-fluid > .table-view-pf-toolbar > .col-sm-12 > form > .toolbar-apf-filter > pf-filter-fields > .filter-fields > .input-group > .ng-scope > input"
    ).type(
      groupConfig.name.substring(0, groupConfig.name.length - 1) + "{enter}"
    );
    cy.wait(500);
    if (force) {
      cy.get("pnc-group-config-link > a")
        .contains(groupConfig.name)
        .parent()
        .parent()
        .next()
        .contains("Build")
        .next()
        .click();
      cy.get(".dropdown-menu").contains("Force").click();
    }
    cy.contains(groupConfig.name)
      .parent()
      .parent()
      .next()
      .contains("Build")
      .click();
  }
}

export default ProductVersionDetailPage;
