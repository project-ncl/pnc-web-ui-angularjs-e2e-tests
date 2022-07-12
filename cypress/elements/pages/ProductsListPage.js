class ProductsListPage {
  constructor() {}

  visit() {
    cy.visit(`/#/products`);
  }

  clickLinkByProductName(productName) {
    const field = cy.get(
      "pnc-products-list-page [placeholder='string | !string | s?ring | st*ng']"
    );
    field.clear();
    field.type(productName + `{enter}`);
    cy.wait(2000);
    cy.get("a").contains(productName).click();
  }
}

export default ProductsListPage;
