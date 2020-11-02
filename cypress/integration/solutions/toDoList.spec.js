/// <reference types="Cypress" />

const url = "https://to-do-list-1c4ba.web.app";
const email = "adrestestowy46@gmail.com";
const password = "123456";

function addItemToList(item) {
  cy.get(".todo-input").type(item);
  cy.get(".todo-btn").click();
}

function logInToAccount(email, password) {
  cy.get("#email-input").type(email);
  cy.get("#password-input").type(`${password}`);
  cy.get('#log-in-btn').click()
}

function waitAmoment(time) {
      cy.wait(time)
}

function checkToDoItems(num) {
  cy.get('#todo li')
    .should('have.length', num)
}

function checkCompletedItems(num) { 
  cy.get('#completed li')
  .should('have.length', num)
}

describe("Testing To-Do List", () => {
  context("web run", () => {
    it("visiting To-Do List web", () => {
      cy.visit("/");

      waitAmoment(2000)
    });
  });

  context("tests", () => {
    it("log in to account", () => {
      logInToAccount(email, password);

      waitAmoment(3000)
    });

    it('check if todo and completed list are empty', () => {
      checkToDoItems(0)
      checkCompletedItems(0)

      waitAmoment(2000)
    })

    it("adding 1st item to list", () => {
      addItemToList("1");
    });

    it("adding 2nd item to list", () => {
      addItemToList("2");
    });

    it('check number of todo items', () => {
      checkToDoItems(2)
    })

    it("adding 3rd item to list", () => {
      addItemToList("dżem");
    });

    it("click completeBtn in 2nd list item", () => {
      cy.get(":nth-child(2) > .buttons > :nth-child(1) > .fas").click();
    });

    it('check number of todo items', () => {
      checkToDoItems(2)
    })

    it('check number of completed items', () => {
      checkCompletedItems(1)

      waitAmoment(5000)
    })

    it("deleting all items from the list", () => {
      cy.get("#todo > :nth-child(1) > .buttons > :nth-child(2) > .fas").click();
      cy.get("#todo > :nth-child(1) > .buttons > :nth-child(2) > .fas").click();
      cy.get("#completed > li > .buttons > :nth-child(2) > .fas").click();

      waitAmoment(3000)
    });

    it("login out from account", () => {
      cy.get("#log-out-btn").click();
    });
    });
  });
