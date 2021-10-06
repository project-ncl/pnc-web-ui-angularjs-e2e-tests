import PncPage from "../elements/pages/PncPage";
import ProjectDetailPage from "../elements/pages/ProjectDetailPage";
import ProjectsListPage from "../elements/pages/ProjectsListPage";
import BuildConfigDetailPage from "../elements/pages/BuildConfigDetailPage";

before(() => {
  cy.fixture("env").then(function (env) {
    this.env = env;
  });
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
  let now = new Date();
  const buildConfig = {
    name: "E2E-TEST" + now.getTime(),
    environment: "OpenJDK 11",
    buildType: "Maven",
    buildScript: "mvn deploy -Dmaven.test.skip",
    repositoryURL:
      "git+ssh://code.stage.engineering.redhat.com/jboss-modules/jboss-modules.git",
    revision: "1.5.0.Final",
  };

  it("should be able to get JBoss Modules project detail page", function () {
    const pncPage = new PncPage();
    const projectsListPage = new ProjectsListPage();
    const projectDetailPage = new ProjectDetailPage();
    pncPage.gotoSection("projects");
    cy.wait(1200);
    projectsListPage.clickLinkByProjectName(`JBoss Modules`);
    cy.wait(1200);
    projectDetailPage.verifyProjectName(`JBoss Modules`);
  });

  it("should pass new BC wizard step 1", function () {
    const projectDetailPage = new ProjectDetailPage();
    projectDetailPage.fillNewBCWizardStep1A(buildConfig);
    projectDetailPage.fillNewBCWizardStep1B(buildConfig);
    projectDetailPage.fillNewBCWizardStep1C(buildConfig);
    projectDetailPage.fillNewBCWizardStep1D(buildConfig);
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

describe("Luanch new build", () => {
  it("should be able to run a successful build", function () {
    const buildConfigDetailPage = new BuildConfigDetailPage();

    buildConfigDetailPage.luanchCurrentBuild();
  });
});
