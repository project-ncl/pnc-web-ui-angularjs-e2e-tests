class BuildDetailPage {
  constructor() {}

  visit(projectId, buildConfigId, buildId) {
    cy.visit(
      `/#/projects/${projectId}/build-configs/${buildConfigId}/builds/${buildId}`
    );
  }

  /* Wait for build result(if building) and return it*/
  getBuildResult(waitTimeout) {
    cy.get(".current-build-status").contains("SUCCESS", {
      timeout: waitTimeout ? waitTimeout : 10000,
    });
  }

  /* Reload the page and get result*/
  reloadForResult() {
    cy.reload();
    cy.get(".current-build-status").contains("SUCCESS");
  }

  /* Switch to Artifacts tab */
  switchToArtifactsTab() {
    cy.get(".col-md-12 > .nav > :nth-child(4) > a").click();
  }

  /* Expcet artifact tab to contain specific content */
  containsVersionNumber(versionNumber) {
    cy.get("body").contains(":pom:" + versionNumber);
  }
}
export default BuildDetailPage;
