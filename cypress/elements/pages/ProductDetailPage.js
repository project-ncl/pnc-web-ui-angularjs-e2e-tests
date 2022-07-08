class ProductDetailPage {
  constructor() {}

  visit(productId) {
    cy.visit(`/#/products/${productId}`);
  }

  verifyProductName(productName) {
    return cy.get("#input-name").should("have.text", productName);
  }

  clickProductVersionByVersionName(productVersionName) {
    cy.get(`[ng-if="::$ctrl.showColumn('version')"] > .ng-binding`)
      .contains(productVersionName)
      .click();
  }

  redirectToProductPage() {
    cy.get(".navbar-primary > :nth-child(2) > a").click();
  }
}

export default ProductDetailPage;
