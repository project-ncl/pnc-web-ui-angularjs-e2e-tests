import PncPage from "../elements/pages/PncPage";
import ProjectDetailPage from "../elements/pages/ProjectDetailPage";
import ProjectsListPage from "../elements/pages/ProjectsListPage";
import ProductDetailPage from "../elements/pages/ProductDetailPage";
import ProductsListPage from "../elements/pages/ProductsListPage";
import ProductVersionDetailPage from "../elements/pages/ProductVersionDetailPage";
import GroupConfigsListPage from "../elements/pages/GroupConfigsListPage";
import GroupConfigDetailPage from "../elements/pages/GroupConfigDetailPage";
import ProductVersionMilestoneDetailPage from "../elements/pages/ProductVersionMilestoneDetailPage";

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

describe("Proceed TC 14", () => {
  const pncPage = new PncPage();
  const groupConfigsListPage = new GroupConfigsListPage();
  const groupConfigDetailPage = new GroupConfigDetailPage();
  const productsListPage = new ProductsListPage();
  const productDetailPage = new ProductDetailPage();
  const productVersionDetailPage = new ProductVersionDetailPage();
  const productVersionMilestoneDetailPage =
    new ProductVersionMilestoneDetailPage();
  const projectsListPage = new ProjectsListPage();
  const projectDetailPage = new ProjectDetailPage();

  const now = new Date();
  const buildConfig = {
    name: "AUTO-E2E-TEST-TC14-BC" + now.getTime(),
    projectName: "JBoss Modules",
    environment: "OpenJDK 11",
    buildType: "Maven",
    buildScript: "mvn deploy -Dmaven.test.skip",
    repositoryURL:
      "git+ssh://code.stage.engineering.redhat.com/jboss-modules/jboss-modules.git",
    revision: "1.5.0.Final",
    productName: "Foo Bar",
    versionName: "1.0",
  };
  const groupConfig = {
    name: "AUTO-E2E-TEST-TC14-GC" + now.getTime(),
    productName: "Foo Bar",
    versionName: "1.0",
  };
  let productVersionMilestone = {
    productId: null,
    versionId: null,
    milestoneId: null,
  };
  it("should be able to get detail page of fb-1.0", function () {
    pncPage.gotoSection("products");
    cy.wait(500);
    productsListPage.clickLinkByProductName(`Foo Bar`);
    cy.wait(500);
    productDetailPage.verifyProductName(`Foo Bar`);
    productDetailPage.clickProductVersionByVersionName("1.0");
    cy.wait(500);
    productVersionDetailPage.verifyProductVersionName("1.0");
  });
  it("should create product version milestone", function () {
    const nowTimeSuffix = (now.getTime() + "").substring(7);
    const milestone = {
      name: "tc14e2e" + nowTimeSuffix,
      startDate: "2020/01/01",
      endDate: "2030/12/31",
    };
    productVersionDetailPage.createMilestone(milestone);
    cy.url().then((href) => {
      let urlArray = href.split("#")[1].split("/");
      productVersionMilestone = {
        productId: urlArray[2],
        versionId: urlArray[4],
        milestoneId: urlArray[6],
      };
    });
  });

  it("should be able to get JBoss Modules project detail page", function () {
    pncPage.gotoSection("projects");
    cy.wait(500);
    projectsListPage.clickLinkByProjectName(buildConfig.projectName);
    cy.wait(500);
    projectDetailPage.verifyProjectName(buildConfig.projectName);
  });

  it("should pass new BC wizard step 1", function () {
    cy.wait(500);
    projectDetailPage.fillNewBCWizardStep1(buildConfig);
  });

  it("should pass new BC wizard step 2", function () {
    cy.wait(500);
    projectDetailPage.fillNewBCWizardStep2A(buildConfig);
  });

  it("should match with final review", function () {
    projectDetailPage.finalizeNewBCWizardReview(buildConfig);
  });

  it("should be able to create group config", function () {
    pncPage.gotoSection("Group Configs");
    cy.wait(500);
    groupConfigsListPage.createGroupConfig(groupConfig);
  });

  it("should be able to add BC to GC", function () {
    cy.wait(500);
    groupConfigDetailPage.addBCToGroupConfig(buildConfig);
  });

  it("should be able to trigger build GC", function () {
    groupConfigDetailPage.clickGCProductVersionLink(groupConfig);
    productVersionDetailPage.buildGroupConfigByGC(groupConfig);
  });

  it("should have a sucessfull build in the milestone under Builds Performed", function () {
    productVersionMilestoneDetailPage.visit(productVersionMilestone);
    productVersionMilestoneDetailPage.waitAndVerifySuccessBuild(
      TIMEOUT_MINUTE * 60 * 1000
    );
  });

  it("should Close Milestone", function () {
    productVersionMilestoneDetailPage.visit(productVersionMilestone);
    productVersionMilestoneDetailPage.closeMilestoneAndVerifySuccessStatus();
  });

  it("should go back to Product version page hit Build (force build) under Build Configs", function () {
    productVersionDetailPage.buildGroupConfigByGC(groupConfig, force);
  });

  it("should verify the latest forced build is not in the closed milestone", function () {
    productVersionMilestoneDetailPage.visit(productVersionMilestone);
    productVersionMilestoneDetailPage.verifyHasNBuilds(1);
  });
});
