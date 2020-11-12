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
//  list
const addBtn = document.querySelector(".todo-btn");
const itemInput = document.querySelector(".todo-input");
const listContainer = document.querySelector(".container");
const logOutBtn = document.getElementById("log-out-btn");
const deleteAccountBtn = document.getElementById("delete-account-btn");
//  sign container
const signContainer = document.querySelector(".sign-in-container");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const logInBtn = document.getElementById("log-in-btn");
const signUpBtn = document.getElementById("sign-up-btn");
const resetPasswordBtn = document.getElementById("reset-password-btn");
//  info container
const infoContainer = document.querySelector(".info-container");
const infoContainerParagraph = document.getElementById(
  "info-container-paragraph"
);
const returnBtn = document.getElementById("return-btn");
//  reset password container
const resetPasswordContainer = document.querySelector(
  ".reset-password-container"
);
const resetEmailInput = document.querySelector("#reset-email-input");
const resetBtn = document.getElementById("reset-btn");
const resetReturnBtn = document.getElementById("reset-container-return-btn");
//  delete account container
const deleteAccountContainer = document.querySelector(
  ".delete-account-container"
);
const confirmBtn = document.getElementById("confirm");
const denyBtn = document.getElementById("deny");
//  firebase auth
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

  //  add items to firebase list
  if (itemToAdd) {
    let toDoTasks = {
      task: itemToAdd,
      key: toDoTasksKey,
      user: user,
    };

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
  item.setAttribute("data-cy", `${inputItem}`);

  const buttons = document.createElement("div");
  buttons.classList.add("buttons");

  const completeBtn = document.createElement("i");
  completeBtn.innerHTML = `<i class="fas fa-check"></i>`;
  completeBtn.setAttribute("data-cy", `completeBtn-${inputItem}`)
  
  const deleteBtn = document.createElement("i");
  deleteBtn.innerHTML = `<i class="fas fa-trash-alt"></i>`;
  deleteBtn.setAttribute("data-cy", `deleteBtn-${inputItem}`)

  buttons.appendChild(completeBtn);
  buttons.appendChild(deleteBtn);
  item.appendChild(buttons);
  list.appendChild(item);

  //  delete item
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

  //  complete item
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

    //  check if item should be add to todo or complete list
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
      infoContainer.classList.remove("hidden");
      infoContainerParagraph.innerText =
        "Verification email has been sent, please check your inbox!";
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

//  DELETE ACCOUNT FUNCTION
function deleteAccount() {
  auth.currentUser
    .delete()
    .then(function () {
      deleteAccountContainer.classList.add("hidden");
      infoContainer.classList.remove("hidden");
      infoContainerParagraph.innerText = `Your account has been successfully deleted!`;
    })
    .catch((e) => {
      Toast.show(`${e.message}`, `error`);
    });
}

//  RESET PASSWORD FUNCTION
function resetPassword() {
  const emailAddress = resetEmailInput.value;

  auth
    .sendPasswordResetEmail(emailAddress)
    .then(function () {
      infoContainer.classList.remove("hidden");
      infoContainerParagraph.innerText =
        "Password reset email has been sent, please check your inbox!";
      resetPasswordContainer.classList.add("hidden");
    })
    .catch((e) => {
      Toast.show(`${e.message}`, `error`);
    });
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

      Toast.show(`Welcome ${firebaseUser.email}`, `success`);

      user = firebaseUser.email;

      //  display from firebase
      showData();
    } else {
      console.log("not logged in");
      listContainer.classList.add("blur");
      signContainer.classList.remove("hidden");
    }
  }
});

//  EVENTLISTENERS
//  list
addBtn.addEventListener("click", addItems);
logOutBtn.addEventListener("click", logOut);
//  sign container
logInBtn.addEventListener("click", logIn);
passwordInput.addEventListener("keyup", (event) => {
  if (event.key === `Enter`) {
    logInBtn.click();
  }
});
signUpBtn.addEventListener("click", signUp);
//  info container
returnBtn.addEventListener("click", () => {
  window.location.reload();
});
//  reset container
resetPasswordBtn.addEventListener("click", () => {
  signContainer.classList.add("hidden");
  resetPasswordContainer.classList.remove("hidden");
});
resetBtn.addEventListener("click", resetPassword);
resetReturnBtn.addEventListener("click", () => {
  // window.location.reload();
  resetPasswordContainer.classList.add("hidden");
  signContainer.classList.remove("hidden");
});
//  delete account container
deleteAccountBtn.addEventListener("click", () => {
  listContainer.classList.add("blur");
  deleteAccountContainer.classList.remove("hidden");
});
confirmBtn.addEventListener("click", deleteAccount);
denyBtn.addEventListener("click", () => {
  deleteAccountContainer.classList.add("hidden");
  listContainer.classList.remove("blur");
});

//  TOAST INIT
document.addEventListener("DOMContentLoaded", () => Toast.init());
