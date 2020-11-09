/// <reference types="Cypress" />

const url = "https://to-do-list-1c4ba.web.app";
const email = "adrestestowy46@gmail.com";
const password = "123456";

let myArray = [1, "banany", "masło", 2, 45, "długopis", "chipsy", "sok", "woda", "chleb", "czekolada", 34, 0, "alkohol", "kalafior", "ziemniaki", "szklanki", "nowe buty", "wypłacić pieniądze"];
let usedItemsFromMyArray = [];

//  FUNCTIONS
function addItemToList() {
  let item = myArray[Math.floor(Math.random() * myArray.length)];
  myArray.splice(myArray.indexOf(item), 1)[0];

  cy.get(".todo-input").type(item);
  cy.get(".todo-btn").click();

  //  filling array with random items used in to-do list
  usedItemsFromMyArray.push(item)
}

function logInToAccount(email, password) {
  cy.get("#email-input").type(email);
  cy.get("#password-input").type(`${password}`);
  cy.get('#log-in-btn').click()

  waitForExactTime(3000)
}

function waitForExactTime(time) {
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

function deleteItemFromList() {
  cy.get(`[data-cy="deleteBtn-${getRandomItems()}"]`).click()
  
  usedItemsFromMyArray.splice(usedItemsFromMyArray.indexOf(getRandomItems()), 1)[0]

  waitForExactTime(2000)
}

function completeItem() {
  cy.get(`[data-cy="completeBtn-${getRandomItems()}"]`).click()

  waitForExactTime(3000)
}

//  function gets random items from usedItemsFromMyArray
function getRandomItems() {
  let item = usedItemsFromMyArray[Math.floor(Math.random() * usedItemsFromMyArray.length)];
  return item;
}

//  TESTS
describe("Testing To-Do List", () => {
  before(() => {
    cy.visit("/");

    waitForExactTime(2000)

    logInToAccount(email, password);
  })

  context("tests", () => {
    //  chcecking if both lists are empty
    it('check if todo and completed list are empty', () => {
      checkToDoItems(0)
      checkCompletedItems(0)

      waitForExactTime(2000)
    })

    //  adding items to list
    it("adding 1st item to list", () => {
      addItemToList();
    });

    it("adding 2nd item to list", () => {
      addItemToList();

    });

    //  checking number of items in todo list
    it('check number of todo items', () => {
      checkToDoItems(2)
    })

    //  adding more items to list
    it("adding 3rd item to list", () => {
      addItemToList();
    });

    it("adding 4th item to list", () => {
      addItemToList();
    });

    it("adding 5th item to list", () => {
      addItemToList();
    });

    it("adding 6th item to list", () => {
      addItemToList();
    });

    // completing random items
    it("click completeBtn in random list item", () => {
      completeItem()
    });

    it("click completeBtn in random list item", () => {
      completeItem()
    });

    //  checking number of items in todo list
    it('check number of todo items', () => {
      checkToDoItems(4)
    })

    //  checking number of items in completed list
    it('check number of completed items', () => {
      checkCompletedItems(2)
    })

    // deleting random items from list
    it("deleting items from the list", () => {
      deleteItemFromList()
      deleteItemFromList()
      deleteItemFromList()
    });
    });
  });
