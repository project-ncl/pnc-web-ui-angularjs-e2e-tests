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
    cy.wait(2500);
    cy.get("pnc-project-link > a").contains(projectName).click({
      force: true,
    });
  }
}

export default ProjectsListPage;
