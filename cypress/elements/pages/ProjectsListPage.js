class ProjectsListPage {
  constructor() {}

  visit() {
    cy.visit(`/#/projects`);
  }

  clickLinkByProjectName(projectName) {
    const field = cy.get(
      "pnc-projects-list-page [placeholder='string | !string | s?ring | st*ng']"
    );
    field.clear();
    field.type(projectName + `{enter}`);
    cy.wait(1000);
    cy.get("pnc-project-link > a").contains(projectName).click();
  }
}

export default ProjectsListPage;
