import PncPage from "../elements/pages/PncPage";
import ProjectDetailPage from "../elements/pages/ProjectDetailPage";
import ProjectsListPage from "../elements/pages/ProjectsListPage";
import BuildConfigDetailPage from "../elements/pages/BuildConfigDetailPage";
import BuildDetailPage from "../elements/pages/BuildDetailPage";

// Set the timeout for the build of this test case
const TIMEOUT_MINUTE = 5;

before(() => {
  cy.clearCookies();
  cy.fixture("env").then(function (env) {
    this.env = env;
  });
});

beforeEach(() => {
  // Keep SSO Cookies to preserve the user status
  Cypress.Cookies.preserveOnce(
    "KEYCLOAK_SESSION",
    "KEYCLOAK_IDENTITY",
    "AUTH_SESSION_ID"
  );
});
describe("Login", () => {
  const pncPage = new PncPage();
  it("should login successfully", function () {
    pncPage.visit();
    pncPage.login(this.env.PNC_USERNAME, this.env.PNC_PASSWORD);
    cy.wait(500);
  });
});

describe("Create Build Config", () => {
  const pncPage = new PncPage();
  const projectsListPage = new ProjectsListPage();
  const projectDetailPage = new ProjectDetailPage();
  const now = new Date();
  const buildConfig = {
    name: "AUTO-E2E-TEST-TC6-" + now.getTime(),
    environment: "OpenJDK 11",
    buildType: "Maven",
    buildScript: "mvn deploy -Dmaven.test.skip",
    repositoryURL:
      "git+ssh://code.stage.engineering.redhat.com/jboss-modules/jboss-modules.git",
    revision: "1.5.0.Final",
  };

  it("should be able to get JBoss Modules project detail page", function () {
    pncPage.gotoSection("projects");
    cy.wait(500);
    projectsListPage.clickLinkByProjectName(`JBoss Modules`);
    cy.wait(500);
    projectDetailPage.verifyProjectName(`JBoss Modules`);
  });

  it("should pass new BC wizard step 1", function () {
    cy.wait(500);
    projectDetailPage.fillNewBCWizardStep1(buildConfig);
  });

  it("should pass new BC wizard step 2", function () {
    projectDetailPage.fillNewBCWizardStep2A(buildConfig);
  });

  it("should match with final review", function () {
    projectDetailPage.finalizeNewBCWizardReview(buildConfig);
  });
});

describe("Luanch new build and view it", () => {
  const buildConfigDetailPage = new BuildConfigDetailPage();
  const buildDetailPage = new BuildDetailPage();
  it("should be able to run a build", function () {
    buildConfigDetailPage.luanchCurrentBuild();
  });

  it("shoule get into BUILDING status in 10 minutes", () => {
    buildDetailPage.getBuildingStatus(10 * 60 * 1000);
  });

  it(`should be able to cancel the build and get CANCELLED result`, function () {
    buildDetailPage.cancelBuildAndGetResult(TIMEOUT_MINUTE * 60 * 1000);
  });
});
