class ProjectsListPage {
  constructor() {}

  visit() {
    cy.visit(`/#/projects`);
  }

  clickLinkByProjectName(projectName) {
    const field = cy.get("div.ng-scope > .form-control");
    field.clear();
    field.type(projectName + `{enter}`);
    cy.wait(1000);
    cy.get("a").contains(projectName).click();
  }
}

export default ProjectsListPage;
