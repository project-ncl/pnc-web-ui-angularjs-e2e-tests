import PncPage from "../elements/pages/PncPage";
import ProjectDetailPage from "../elements/pages/ProjectDetailPage";
import ProjectsListPage from "../elements/pages/ProjectsListPage";
import BuildConfigDetailPage from "../elements/pages/BuildConfigDetailPage";
import BuildDetailPage from "../elements/pages/BuildDetailPage";

// Set the timeout for the build of this test case
const TIMEOUT_MINUTE = 20;

before(() => {
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

describe("Find TC3 project", () => {
  it("should be able to get TC3 Test project detail page", function () {
    const pncPage = new PncPage();
    const projectsListPage = new ProjectsListPage();
    const projectDetailPage = new ProjectDetailPage();
    pncPage.gotoSection("projects");
    cy.wait(1200);
    projectsListPage.clickLinkByProjectName(`TC3 Test`);
    cy.wait(1200);
    projectDetailPage.verifyProjectName(`TC3 Test`);
  });
});

describe("Create Build Configs", () => {
  let now = new Date();
  let buildConfig1 = {
    name: "AUTO-E2E-TEST-TC3-1-" + now.getTime(),
    environment: "OpenJDK 11",
    buildType: "Maven",
    buildScript: "mvn clean deploy -DskipTests=true",
    revision: "4.0.4",
    repositoryURL:
      "git+ssh://code.stage.engineering.redhat.com/git/twitter4j.git",
  };

  let buildConfig2 = {
    name: "AUTO-E2E-TEST-TC3-2-" + now.getTime(),
    environment: "OpenJDK 11",
    buildType: "Maven",
    buildScript: "mvn clean deploy -DskipTests=true",
    revision: "1.2.0",
    repositoryURL: "https://github.com/project-ncl/dependency-analysis.git",
  };

  let buildConfig3 = {
    name: "AUTO-E2E-TEST-TC3-3-" + now.getTime(),
    environment: "OpenJDK 1.8; Mvn 3.3.9",
    buildType: "Maven",
    buildScript: "mvn clean deploy -DskipTests=true",
    revision: "1.5.0.Final",
    repositoryURL:
      "git+ssh://code.stage.engineering.redhat.com/thescouser89/jboss-modules-test-1.git",
  };

  let mainBuildConfig = {
    name: "AUTO-E2E-TEST-TC3-MAIN-" + now.getTime(),
    environment: "OpenJDK 11",
    buildType: "Maven",
    buildScript: "mvn clean deploy -DskipTests=true",
    revision: "1.4.0",
    repositoryURL: "https://github.com/thescouser89/pnc-test-scenario-3",
    dependencyNameList: [
      "AUTO-E2E-TEST-TC3-1-" + now.getTime(),
      "AUTO-E2E-TEST-TC3-2-" + now.getTime(),
      "AUTO-E2E-TEST-TC3-3-" + now.getTime(),
    ],
  };
  it("should be able to create BC 1", function () {
    createBcByConfig(buildConfig1, false);
  });
  it("should be able to create BC 2", function () {
    createBcByConfig(buildConfig2, false);
  });
  it("should be able to create BC 3", function () {
    createBcByConfig(buildConfig3, false);
  });
  it("should be able to create main BC", function () {
    createBcByConfig(mainBuildConfig, true);
  });
});

describe("Luanch new build and view the result", () => {
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

let createBcByConfig = (buildConfig, isMainProject) => {
  const projectDetailPage = new ProjectDetailPage();

  cy.wait(500);
  projectDetailPage.fillNewBCWizardStep1(buildConfig);

  projectDetailPage.fillNewBCWizardStep2A(buildConfig);

  projectDetailPage.finalizeNewBCWizardReview(
    buildConfig,
    TIMEOUT_MINUTE * 60 * 1000
  );
  if (!isMainProject) {
    projectDetailPage.redirectToProjectPage();
  }
};