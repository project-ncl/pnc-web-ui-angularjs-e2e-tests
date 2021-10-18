# PNC Web UI AngularJS End-to-End Tests

## Changelog

[Changelog](https://github.com/project-ncl/pnc-web-ui-angularjs-e2e-tests/wiki/Change-logs)

## Prerequisites

1. `Node.js` version >= 14
2. `NPM` version >= 7
3. `Prettier`

## Environment setup

1. Update the environment `cypress.json` file with the URL of PNC UI that you want to test at here: ./cypress.json

```
{
  "baseUrl": "<URL of PNC UI to Test>"
}
```

 - NOTE: Add `"chromeWebSecurity": false` if you want to test with localhost.


2. Update the environment `env.json` file with the credentials of PNC UI that you want to test at here: ./cypress/fixtures/env.json

```
{
  "PNC_USERNAME": "<your username for pnc>",
  "PNC_PASSWORD": "<your password for pnc>",
  "HEADLESS": false
}
```

NOTE: Headless should be false for CI environments. Set to true when developing / debugging.

## Installation

Prepare project locally:

```bash
git clone <yourGitForkUrl> pnc-web-ui-angularjs-e2e-tests
cd ./pnc-web-ui-angularjs-e2e-tests/
npm install
```

## Running the tests

Start your test by following steps:

**1) Deploy the PNC Web UI AngularJS to the http://localhost:9000/ (if you are using the default `cypress.json`)**

**2a) Run the test with Cypress GUI**

```bash
npm run test-gui  # Opens Cypress in the interactive GUI.
```

**2b) Run all tests with command line**

```bash
npm run test-cli   # Run all test cases.
```

**2c) Run specific test with command line**

```bash
npm run test-cli --spec "cypress/integration/<Test Name>.js"  # Run specific test case.
```

**3) Enjoy it!**
