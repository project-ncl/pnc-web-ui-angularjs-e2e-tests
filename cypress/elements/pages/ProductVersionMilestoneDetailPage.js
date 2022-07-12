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
    cy.get(`tr.ng-scope > [ng-if="::$ctrl.showColumn('status')"]`).contains(
      "SUCCESS",
      { timeout: waitTimeout ? waitTimeout : 10000 }
    );
  }

  closeMilestoneAndVerifySuccessStatus(waitTimeout) {
    cy.get(
      'pnc-product-milestone-actions > .btn-group > [title="Close Milestone"]'
    ).click();
    cy.get(
      '[name="productMilestoneForm"] > .form-group > div > [type="submit"]'
    ).click();
    cy.get("pnc-milestone-close-status-label > .label-success", {
      timeout: waitTimeout ? waitTimeout : 10000,
    });
  }

  verifyHasNBuilds(buildNumber) {
    cy.get(
      'pnc-builds-list > table > tbody > [ng-repeat="item in $ctrl.items"]'
    ).should("have.length", buildNumber);
  }
}

export default ProductVersionMilestoneDetailPage;
