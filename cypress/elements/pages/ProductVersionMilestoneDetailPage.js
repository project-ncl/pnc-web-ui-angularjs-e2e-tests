class ProductVersionMilestoneDetailPage {
  constructor() {}

  visit(productId, versionId, milestoneId) {
    cy.visit(
      `/#/products/${productId}/versions/${versionId}/milestones/${milestoneId}`
    );
  }

  visit(productVersionMilestone) {
    cy.visit(
      `/#/products/${productVersionMilestone.productId}/versions/${productVersionMilestone.versionId}/milestones/${productVersionMilestone.milestoneId}`
    );
  }

  waitAndVerifySuccessBuild(waitTimeout) {
    // work around for NCL-7233 Build status not refreshed automatically on Product Milestone detail page
    cy.get(`pnc-build-link`, {
      timeout: 10000,
    })
      .first()
      .click();
    cy.get(".current-build-status").contains("SUCCESS", {
      timeout: waitTimeout ? waitTimeout : 10000,
    });
    cy.go("back");

    cy.get(`tr.ng-scope > [ng-if="::$ctrl.showColumn('status')"]`, {
      timeout: 10000,
    }).contains("SUCCESS", { timeout: waitTimeout ? waitTimeout : 10000 });
  }

  closeMilestoneAndVerifySuccessStatus(waitTimeout) {
    cy.get(
      'pnc-product-milestone-actions > .btn-group > [title="Close Milestone"]',
      { timeout: 10000 }
    ).click();
    cy.get(
      '[name="productMilestoneForm"] > .form-group > div > [type="submit"]',
      { timeout: 10000 }
    ).click();
    cy.get("pnc-milestone-close-status-label > .label-success", {
      timeout: waitTimeout ? waitTimeout : 10000,
    });
  }

  verifyHasNBuilds(buildNumber) {
    cy.get(
      'pnc-builds-list > table > tbody > [ng-repeat="item in $ctrl.items"]',
      { timeout: 10000 }
    ).should("have.length", buildNumber);
  }
}

export default ProductVersionMilestoneDetailPage;
