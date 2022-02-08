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

  getBuildingStatus(queueForBuildingTimeout) {
    cy.get(".current-build-status").contains("BUILDING", {
      timeout: queueForBuildingTimeout ? queueForBuildingTimeout : 60000,
    });
  }

  /* Cancel the build after 1 min and get CANCELED result*/
  cancelBuildAndGetResult(waitTimeout) {
    // Workaround for NCLSUP-560: Live logs don't work at all
    // Will need to verify the live log instead of waiting for 30 sec
    cy.wait(30000);
    cy.contains("Abort").click();
    cy.get(".current-build-status").contains("CANCELLED", {
      timeout: waitTimeout ? waitTimeout : 10000,
    });
  }
}
export default BuildDetailPage;
