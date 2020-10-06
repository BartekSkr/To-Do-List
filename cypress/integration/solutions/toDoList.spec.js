/// <reference types="Cypress" />

const url = "https://to-do-list-1c4ba.web.app";
const email = "bartoszskorka@op.pl";
const password = "123456";

function addItemToList(item) {
  cy.get(".todo-input").type(item);
  cy.get(".todo-btn").click();
}

function logInToAccount(email, password) {
  cy.get("#email-input").type(email);
  cy.get("#password-input").type(`${password}{enter}`);
}

describe("Testing To-Do List", () => {
  context("web run", () => {
    it("visiting To-Do List web", () => {
      cy.visit(url);
    });
  });

  context("tests", () => {
    it("login in to account", () => {
      logInToAccount(email, password);
    });

    it("login out from account", () => {
      cy.get("#log-out-btn").click();
    });

    it("login in to account again", () => {
      logInToAccount(email, password);
    });

    it("adding 1st item to list", () => {
      addItemToList("1");
    });

    it("adding 2nd item to list", () => {
      addItemToList("2");
    });

    it("adding 3rd item to list", () => {
      addItemToList("dżem");
    });

    it("click check button in 2nd list item", () => {
      cy.get(":nth-child(2) > .buttons > :nth-child(1) > .fas").click();
    });

    it("deleting all items from the list", () => {
      cy.get("#todo > :nth-child(1) > .buttons > :nth-child(2) > .fas").click();
      cy.get("#todo > :nth-child(1) > .buttons > :nth-child(2) > .fas").click();
      cy.get("#completed > li > .buttons > :nth-child(2) > .fas").click();
    });

    it("login out from account", () => {
      cy.get("#log-out-btn").click();
    });
  });
});
