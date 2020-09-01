//  FIREBASE CONFIGURATION
var firebaseConfig = {
  apiKey: "AIzaSyBkWOEJC9MiuLMRdG9l6ivHeLmfRQfRtwk",
  authDomain: "to-do-list-1c4ba.firebaseapp.com",
  databaseURL: "https://to-do-list-1c4ba.firebaseio.com",
  projectId: "to-do-list-1c4ba",
  storageBucket: "to-do-list-1c4ba.appspot.com",
  messagingSenderId: "367750220743",
  appId: "1:367750220743:web:08c1d4564fdc4bfc1c67e2",
};
//  INITIALIZE FIREBASE
firebase.initializeApp(firebaseConfig);

//  CONST
const db = firebase.database();
const addBtn = document.querySelector(".todo-btn");
const itemInput = document.querySelector(".todo-input");
const listContainer = document.querySelector(".container");
const signContainer = document.querySelector(".sign-in-container");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const logInBtn = document.getElementById("log-in-btn");
const signUpBtn = document.getElementById("sign-up-btn");
const logOutBtn = document.getElementById("log-out-btn");

let toDoTasksUpdates = {};
let completeTasksUpdates = {};
let list;

//  ADD ITEMS TO FIREBASE
function addItems(e) {
  e.preventDefault();
  const itemToAdd = itemInput.value;

  const toDoTasks_key = db.ref().child("toDoTasks").push().key;
  const completeTasks_key = db.ref().child("completeTasks").push().key;

  //  ADD ITEMS TO FIREBASE NAD LIST
  if (itemToAdd) {
    let toDoTasks = {
      task: itemToAdd,
      key: toDoTasks_key,
    };

    //  ADD ITEMS TO FIREBASE
    toDoTasksUpdates["toDoTasks/" + toDoTasks_key] = toDoTasks;
    db.ref().update(toDoTasksUpdates);

    document.querySelector(".todo-input").value = "";

    list = completed
      ? document.getElementById("todo")
      : document.getElementById("completed");

    createItems(itemToAdd, toDoTasks_key, completeTasks_key, list);
  }
}

//  CREATE ITEMS ON THE LIST
function createItems(inputItem, toDoTasks_key, completeTasks_key, list) {
  const item = document.createElement("li");
  item.innerText = inputItem;

  const buttons = document.createElement("div");
  buttons.classList.add("buttons");

  const completeBtn = document.createElement("i");
  completeBtn.innerHTML = `<i class="fas fa-check"></i>`;

  const deleteBtn = document.createElement("i");
  deleteBtn.innerHTML = `<i class="fas fa-trash-alt"></i>`;

  buttons.appendChild(completeBtn);
  buttons.appendChild(deleteBtn);
  item.appendChild(buttons);
  list.appendChild(item);

  //  DELETE ITEM
  deleteBtn.addEventListener("click", function deleteItem() {
    const item = this.parentNode.parentNode;
    const parent = item.parentNode;
    const id = parent.id;

    if (id === "todo") {
      db.ref("toDoTasks/" + toDoTasks_key).remove();
    } else {
      db.ref("completeTasks/" + completeTasks_key).remove();
    }

    parent.removeChild(item);
  });

  //  COMPLETE ITEM
  completeBtn.addEventListener("click", function completeItem() {
    const item = this.parentNode.parentNode;
    const parent = item.parentNode;
    const id = parent.id;

    let toDoTasks = {
      task: inputItem,
      key: toDoTasks_key,
    };

    let completeTasks = {
      task: inputItem,
      key: completeTasks_key,
    };

    if (id === "todo") {
      db.ref("toDoTasks/" + toDoTasks_key).remove();
      completeTasksUpdates[
        "completeTasks/" + completeTasks_key
      ] = completeTasks;
      db.ref().update(completeTasksUpdates);
    } else {
      db.ref("completeTasks/" + completeTasks_key).remove();
      toDoTasksUpdates["toDoTasks/" + toDoTasks_key] = toDoTasks;
      db.ref().update(toDoTasksUpdates);
    }

    //    CHECK IF ITEM SHOULD BE ADD TO TODO OR COMPLETE LIST
    let target =
      id === "todo"
        ? document.getElementById("completed")
        : document.getElementById("todo");

    parent.removeChild(item);
    target.insertBefore(item, target.childNodes[0]);
  });
}

//  SHOWING DATA FROM FIREBASE
function showData() {
  //  toDoTasks
  db.ref("toDoTasks").once("value", (toDoSnap) => {
    toDoSnap.forEach((toDoChildSnap) => {
      const toDoTasks = [];
      const toDoChildData = toDoChildSnap.val();

      toDoTasks.push(Object.values(toDoChildData));

      toDoTasks.forEach((el) => {
        let toDoTasks_key = el[0];
        let toDoTasks_task = el[1];

        list = completed
          ? document.getElementById("todo")
          : document.getElementById("completed");

        createItems(toDoTasks_task, toDoTasks_key, toDoTasks_key, list);
      });
    });
  });

  //  completeTasks
  db.ref("completeTasks").once("value", (completeSnap) => {
    completeSnap.forEach((completeChildSnap) => {
      const completeTasks = [];
      const completeChildData = completeChildSnap.val();

      completeTasks.push(Object.values(completeChildData));

      completeTasks.forEach((el) => {
        let completeTasks_key = el[0];
        let completeTasks_task = el[1];

        list = completed
          ? document.getElementById("completed")
          : document.getElementById("todo");

        createItems(
          completeTasks_task,
          completeTasks_key,
          completeTasks_key,
          list
        );
      });
    });
  });
}

//  EVENTLISTENERS
addBtn.addEventListener("click", addItems);

//  LOG IN
logInBtn.addEventListener("click", () => {
  const email = emailInput.value;
  const pass = passwordInput.value;
  const auth = firebase.auth();

  const promise = auth.signInWithEmailAndPassword(email, pass);
  promise.catch((e) => {
    Toast.show(`${e.message}`, `error`);
  });
});

//  SIGN UP
signUpBtn.addEventListener("click", () => {
  const email = emailInput.value;
  const pass = passwordInput.value;
  const auth = firebase.auth();

  const promise = auth.createUserWithEmailAndPassword(email, pass);
  promise.catch((e) => {
    Toast.show(`${e.message}`, `error`);
  });
});

//  LOG OUT
logOutBtn.addEventListener("click", () => {
  firebase.auth().signOut();
  Toast.show(`Logged out`, `success`);

  window.location.reload();
});

firebase.auth().onAuthStateChanged((firebaseUser) => {
  if (firebaseUser) {
    listContainer.classList.remove("hidden");
    signContainer.classList.add("sign-in-form-hidden");

    Toast.show(`Welcome ${firebaseUser.email}`, "success");

    //  DISPLAY DATA FROM FIREBASE
    showData();
  } else {
    console.log("not logged in");
    listContainer.classList.add("hidden");
    signContainer.classList.remove("sign-in-form-hidden");
  }
});

//  TOAST NOTIFICATION
const Toast = {
  init() {
    this.hideTimeout = null;

    this.toast = document.createElement("div");
    this.toast.className = "toast";
    document.body.appendChild(this.toast);
  },

  show(message, status) {
    clearTimeout(this.hideTimeout);

    this.toast.textContent = message;
    this.toast.className = "toast toast--visible";

    if (status) this.toast.classList.add(`toast--${status}`);

    this.hideTimeout = setTimeout(() => {
      this.toast.classList.remove("toast--visible");
    }, 3000);
  },
};

document.addEventListener("DOMContentLoaded", () => Toast.init());
