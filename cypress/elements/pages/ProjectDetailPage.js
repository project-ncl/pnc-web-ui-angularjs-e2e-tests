class ProjectDetailPage {
  constructor() {}

  visit(projectId) {
    cy.visit(`/#/projects/${projectId}`);
  }

  verifyProjectName(projectName) {
    return cy.get("#input-name").should("have.text", projectName);
  }

  fillNewBCWizardStep1A(buildConfig) {
    cy.get(".ng-isolate-scope > .btn").click({ force: true });
    cy.wait(500);
    cy.get("#build-config-name").type(buildConfig.name);

    if (buildConfig.description) {
      const descriptionField = cy.get("#build-config-description");
      descriptionField.type(buildConfig.description);
    }

    const environmentField = cy.get(
      ".ng-invalid-required > .ng-isolate-scope > .combobox-container > .input-group"
    );
    environmentField.type(buildConfig.environment);
    cy.wait(1500);
    cy.get(".typeahead > :nth-child(1) > .ng-binding").click();

    cy.get(".filter-option").click();
    cy.wait(200);
    cy.get("a").contains(buildConfig.buildType).click();

    const buildScriptField = cy.get("#build-config-build-script");
    buildScriptField.type(buildConfig.buildScript);

    cy.get("#nextButton").its("disabled").should("not.exist");
    cy.get("#nextButton").click();
  }

  fillNewBCWizardStep1B(buildConfig) {
    // Todo: Integrate test for step 1B when involved
    cy.wait(200);
    if (buildConfig.productName) {
      let comboBox = cy.get(
        "pnc-product-combobox > px-combobox > .combobox-container > .input-group > input"
      );
      //Workaround for NCL-6921 issue
      comboBox.type(
        buildConfig.productName.substring(0, buildConfig.productName.length - 1)
      );
      cy.wait(1000);
      cy.get(".px-combobox-option > .ng-binding")
        .contains(buildConfig.productName)
        .click();
      cy.get(
        "pnc-product-version-combobox > px-combobox > .combobox-container > .input-group > input"
      ).type(buildConfig.versionName);
    }
    cy.get(".px-combobox-option > .ng-binding")
      .contains(buildConfig.versionName)
      .click();
    cy.wait(1000);
    cy.get("#nextButton").its("disabled").should("not.exist");
    cy.get("#nextButton").click();
  }
  fillNewBCWizardStep1C(buildConfig) {
    cy.wait(200);
    if (buildConfig.buildParameterList) {
      for (const buildParameter of buildConfig.buildParameterList) {
        let comboBox = cy.get(
          ".form-horizontal > :nth-child(1) > .clearfix > .form-group > px-combobox > .combobox-container > .input-group > input"
        );
        comboBox.type(buildParameter.key);
        cy.wait(200);
        cy.get(".typeahead > :nth-child(1) > .ng-scope").click();
        cy.wait(200);
        cy.get("form > div > .clearfix > :nth-child(3) > :nth-child(2)").type(
          buildParameter.value
        );
        cy.get(
          ".form-horizontal > :nth-child(1) > .clearfix > .pull-right > .btn-primary"
        ).click();
        cy.wait(200);
      }
    }
    cy.get("#nextButton").its("disabled").should("not.exist");
    cy.get("#nextButton").click();
  }
  fillNewBCWizardStep1D(buildConfig) {
    cy.wait(200);
    if (buildConfig.dependencyNameList) {
      for (const dependencyName of buildConfig.dependencyNameList) {
        let comboBox = cy.get(
          "ng-form > .clearfix > .form-group > pnc-build-config-combobox > px-combobox > .combobox-container > .input-group > input"
        );
        //Workaround for NCL-6921: Unable to add dependency with long bc name
        comboBox.type(dependencyName.substring(0, dependencyName.length - 1));
        cy.wait(1000);
        cy.get(".typeahead > :nth-child(1) > .ng-binding").click();
        cy.wait(200);
        cy.get("#addButton").click();
        cy.wait(200);
      }
    }
    cy.get("#nextButton").click();
  }
  fillNewBCWizardStep2A(buildConfig) {
    cy.contains("Repository URL")
      .next()
      .click()
      .type(buildConfig.repositoryURL);
    cy.contains("Revision").next().click().type(buildConfig.revision);

    cy.get("#nextButton").click();
  }

  finalizeNewBCWizardReview(buildConfig, waitTimeout) {
    cy.get(
      ":nth-child(1) > .wizard-pf-review-content > div.ng-scope > .form > :nth-child(1) > .wizard-pf-review-item-value"
    ).contains(buildConfig.name);

    if (buildConfig.description) {
      cy.get(
        ":nth-child(1) > .wizard-pf-review-content > div.ng-scope > .form > :nth-child(2)"
      ).contains(buildConfig.description);
    }
    cy.get(
      ":nth-child(1) > .wizard-pf-review-content > div.ng-scope > .form > :nth-child(3) > .wizard-pf-review-item-value"
    ).contains(buildConfig.environment);
    cy.get(".wizard-pf-review-item-value > .ng-binding").contains(
      buildConfig.buildScript
    );
    cy.get(
      ".wizard-pf-review-substeps > .wizard-pf-review-content > div.ng-scope > .form > :nth-child(1) > .wizard-pf-review-item-value"
    ).contains(buildConfig.repositoryURL);
    cy.get(
      ".wizard-pf-review-substeps > .wizard-pf-review-content > div.ng-scope > .form > :nth-child(2) > .wizard-pf-review-item-value"
    ).contains(buildConfig.revision);

    cy.get("#nextButton").click();

    cy.get("#view-build-config-button", {
      timeout: waitTimeout ? waitTimeout : 10000,
    }).click();
  }

  fillNewBCWizardStep1(buildConfig) {
    this.fillNewBCWizardStep1A(buildConfig);
    this.fillNewBCWizardStep1B(buildConfig);
    this.fillNewBCWizardStep1C(buildConfig);
    this.fillNewBCWizardStep1D(buildConfig);
  }

  redirectToProjectPage() {
    cy.get(".dl-horizontal > :nth-child(2) > .ng-binding").click();
  }
}

export default ProjectDetailPage;
