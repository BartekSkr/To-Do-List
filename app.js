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
const verifyContainer = document.querySelector(".verify-info-container");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const logInBtn = document.getElementById("log-in-btn");
const signUpBtn = document.getElementById("sign-up-btn");
const logOutBtn = document.getElementById("log-out-btn");
const returnBtn = document.getElementById("return-btn");

const auth = firebase.auth();

let toDoTasksUpdates = {};
let completeTasksUpdates = {};
let list;
let user;

//  ADD ITEMS TO FIREBASE
function addItems(e) {
  e.preventDefault();
  const itemToAdd = itemInput.value;

  const toDoTasksKey = db.ref().child("toDoTasks").push().key;
  const completeTasksKey = db.ref().child("completeTasks").push().key;

  //  ADD ITEMS TO FIREBASE NAD LIST
  if (itemToAdd) {
    let toDoTasks = {
      task: itemToAdd,
      key: toDoTasksKey,
      user: user,
    };

    //  ADD ITEMS TO FIREBASE
    toDoTasksUpdates["toDoTasks/" + toDoTasksKey] = toDoTasks;
    db.ref().update(toDoTasksUpdates);

    document.querySelector(".todo-input").value = "";

    list = completed
      ? document.getElementById("todo")
      : document.getElementById("completed");

    createItems(itemToAdd, toDoTasksKey, completeTasksKey, list);
  }
}

//  CREATE ITEMS ON THE LIST
function createItems(inputItem, toDoTasksKey, completeTasksKey, list) {
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
      db.ref("toDoTasks/" + toDoTasksKey).remove();
    } else {
      db.ref("completeTasks/" + completeTasksKey).remove();
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
      key: toDoTasksKey,
      user: user,
    };

    let completeTasks = {
      task: inputItem,
      key: completeTasksKey,
      user: user,
    };

    if (id === "todo") {
      db.ref("toDoTasks/" + toDoTasksKey).remove();
      completeTasksUpdates["completeTasks/" + completeTasksKey] = completeTasks;
      db.ref().update(completeTasksUpdates);
    } else {
      db.ref("completeTasks/" + completeTasksKey).remove();
      toDoTasksUpdates["toDoTasks/" + toDoTasksKey] = toDoTasks;
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
        let toDoTasksKey = el[0];
        let toDoTasksTask = el[1];
        let toDoTasksUser = el[2];

        list = completed
          ? document.getElementById("todo")
          : document.getElementById("completed");

        if (user === toDoTasksUser) {
          createItems(toDoTasksTask, toDoTasksKey, toDoTasksKey, list);
        }
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
        let completeTasksKey = el[0];
        let completeTasksTask = el[1];
        let completeTasksUser = el[2];

        list = completed
          ? document.getElementById("completed")
          : document.getElementById("todo");
        if (user === completeTasksUser) {
          createItems(
            completeTasksTask,
            completeTasksKey,
            completeTasksKey,
            list
          );
        }
      });
    });
  });
}

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
    this.toast.className = "toast visible";

    if (status) this.toast.classList.add(`${status}`);

    this.hideTimeout = setTimeout(() => {
      this.toast.classList.remove("visible");
    }, 3000);
  },
};

//  LOG IN FUNCTION
function logIn() {
  const email = emailInput.value;
  const pass = passwordInput.value;

  auth.signInWithEmailAndPassword(email, pass).catch((e) => {
    Toast.show(`${e.message}`, `error`);
  });
}

//  SIGN UP FUNCTION
function signUp() {
  const email = emailInput.value;
  const pass = passwordInput.value;

  auth
    .createUserWithEmailAndPassword(email, pass)
    .then(() => {
      sendVerificationEmail();
      signContainer.classList.add("hidden");
      verifyContainer.classList.remove("hidden");
    })
    .catch((e) => {
      Toast.show(`${e.message}`, `error`);
    });
}

//  LOG OUT FUNCTION
function logOut() {
  firebase.auth().signOut();
  Toast.show(`Logged out`, `success`);

  window.location.reload();
}

//  SEND VERIFICATION MAIL FUNCTION
function sendVerificationEmail() {
  auth.currentUser.sendEmailVerification().then(() => {});
}

firebase.auth().onAuthStateChanged((firebaseUser) => {
  if (firebaseUser) {
    if (firebaseUser.emailVerified === true) {
      listContainer.classList.remove("blur");
      signContainer.classList.add("hidden");

      Toast.show(`Welcome ${firebaseUser.email}`, "success");

      user = firebaseUser.email;

      // console.log(firebaseUser);

      //  DISPLAY DATA FROM FIREBASE
      showData();
    } else {
      console.log("not logged in");
      listContainer.classList.add("blur");
      signContainer.classList.remove("hidden");
    }
  }
});

//  EVENTLISTENERS
addBtn.addEventListener("click", addItems);
logInBtn.addEventListener("click", logIn);
signUpBtn.addEventListener("click", signUp);
logOutBtn.addEventListener("click", logOut);
returnBtn.addEventListener("click", () => {
  window.location.reload();
});

//  TOAST INIT
document.addEventListener("DOMContentLoaded", () => Toast.init());
