class BuildConfigDetailPage {
  constructor() {}

  visit(projectId, buildConfigId) {
    cy.visit(`/#/projects/${projectId}/build-configs/${buildConfigId}`);
  }

  luanchCurrentBuild() {
    cy.wait(500);
    cy.get(".btn-group > .btn-primary").contains("Build").click();
    cy.wait(500);
    cy.get(".ng-scope.ng-isolate-scope > .ng-scope > .ng-binding", {
      timeout: 20000,
    }).click();
  }
}
export default BuildConfigDetailPage;
