import PncPage from "../elements/pages/PncPage";
import ProjectDetailPage from "../elements/pages/ProjectDetailPage";
import ProjectsListPage from "../elements/pages/ProjectsListPage";
import BuildConfigDetailPage from "../elements/pages/BuildConfigDetailPage";
import BuildDetailPage from "../elements/pages/BuildDetailPage";

// Set the timeout for the build of this test case
const TIMEOUT_MINUTE = 30;

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
  it("should login successfully", function () {
    const pncPage = new PncPage();
    pncPage.visit();
    pncPage.login(this.env.PNC_USERNAME, this.env.PNC_PASSWORD);
    cy.wait(500);
  });
});

describe("Create Build Config", () => {
  const now = new Date();
  const buildConfig = {
    name: "AUTO-E2E-TEST-TC5-" + now.getTime(),
    environment: "OpenJDK 11",
    buildType: "Maven",
    buildScript: "mvn clean deploy",
    buildParameterList: [
      { key: "ALIGNMENT_PARAMETERS", value: "-DversionOverride=0.9.9" },
    ],
    repositoryURL: "https://github.com/michalszynkiewicz/empty.git",
    revision: "master",
  };

  it("should be able to get TC5 Test project detail page", function () {
    const pncPage = new PncPage();
    const projectsListPage = new ProjectsListPage();
    const projectDetailPage = new ProjectDetailPage();
    pncPage.gotoSection("projects");
    cy.wait(500);
    projectsListPage.clickLinkByProjectName(`TC5 Test`);
    cy.wait(500);
    projectDetailPage.verifyProjectName(`TC5 Test`);
  });

  it("should pass new BC wizard step 1", function () {
    const projectDetailPage = new ProjectDetailPage();
    cy.wait(500);
    projectDetailPage.fillNewBCWizardStep1(buildConfig);
  });

  it("should pass new BC wizard step 2", function () {
    const projectDetailPage = new ProjectDetailPage();
    projectDetailPage.fillNewBCWizardStep2A(buildConfig);
  });

  it("should match with final review", function () {
    const projectDetailPage = new ProjectDetailPage();
    projectDetailPage.finalizeNewBCWizardReview(buildConfig);
  });
});

describe("Luanch new build and view it", () => {
  it("should be able to run a build", function () {
    const buildConfigDetailPage = new BuildConfigDetailPage();
    buildConfigDetailPage.luanchCurrentBuild();
  });

  it(`should wait and be able to get a build result within ${TIMEOUT_MINUTE} minutes`, function () {
    const buildDetailPage = new BuildDetailPage();
    buildDetailPage.getBuildResult(TIMEOUT_MINUTE * 60 * 1000);
  });

  it(`should get a SUCCESS result`, function () {
    const buildDetailPage = new BuildDetailPage();
    buildDetailPage.reloadForResult();
  });
});

describe("Verify the artifacts version overrided", () => {
  it("should be able to get to the artifacts tab of a build", function () {
    const buildDetailPage = new BuildDetailPage();
    buildDetailPage.switchToArtifactsTab();
    buildDetailPage.containsVersionNumber("0.9.9");
  });
});
