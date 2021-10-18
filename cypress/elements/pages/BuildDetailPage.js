class BuildDetailPage {
    constructor() {}
  
    visit(projectId, buildConfigId, buildId) {
      cy.visit(`/#/projects/${projectId}/build-configs/${buildConfigId}/builds/${buildId}`);
    }

    /* Wait for build result(if building) and return it*/
    getBuildResult(){
        const statusIcon = cy.get('h1 > pnc-build-status-icon.ng-isolate-scope > .build-status-icon > span > img');
        statusIcon.debug();
        statusIcon.its("alt").should('not.equal', 'ENQUEUED')
    }

  }
  export default BuildDetailPage;