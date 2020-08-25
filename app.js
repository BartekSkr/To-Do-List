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

    //    ADD ITEMS TO FIREBASE
    let toDoTasksUpdates = {};
    toDoTasksUpdates["toDoTasks/" + toDoTasks_key] = toDoTasks;
    db.ref().update(toDoTasksUpdates);

    document.querySelector(".todo-input").value = "";

    //  ADD ITEMS TO LIST
    console.log(itemToAdd, toDoTasks_key);

    const list = completed
      ? document.getElementById("todo")
      : document.getElementById("completed");

    const item = document.createElement("li");
    item.innerText = itemToAdd;

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

    // REMOVE ITEM FROM FIREBASE AND LIST
    deleteBtn.addEventListener("click", function removeItem() {
      const item = this.parentNode.parentNode;
      const parent = item.parentNode;
      const id = parent.id;

      if (id === "todo") {
        db.ref("toDoTasks/" + toDoTasks_key).remove();
        console.log(toDoTasks_key, "deleted");
      } else {
        db.ref("completeTasks/" + completeTasks_key).remove();
        console.log(completeTasks_key, "deleted");
      }

      parent.removeChild(item);
    });

    //  ADD TO COMPLETE LIST
    completeBtn.addEventListener("click", function completeItem() {
      const item = this.parentNode.parentNode;
      const parent = item.parentNode;
      const id = parent.id;

      let completeTasks = {
        task: itemToAdd,
        key: completeTasks_key,
      };

      let completeTasksUpdates = {};
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

      //    CHECK IF THE ITEM SHOULD BE ADDED TO TODO OR COMPLETED LIST
      let target =
        id === "todo"
          ? document.getElementById("completed")
          : document.getElementById("todo");

      parent.removeChild(item);
      target.insertBefore(item, target.childNodes[0]);
    });
  }
}

//  SHOWING DATA FROM FIREBASE
function showData() {
  let toDoTasksUpdates = {};
  let completeTasksUpdates = {};

  //  TO DO TASKS
  db.ref("toDoTasks").once("value", (snap) => {
    snap.forEach((childSnap) => {
      const toDoTasks = [];
      const childData = childSnap.val();

      toDoTasks.push(Object.values(childData));

      for (i = 0; i < toDoTasks.length; i++) {
        console.log("toDoTasks: ", toDoTasks[i]);
        let toDoTasks_key = toDoTasks[i][0];
        let toDoTasks_task = toDoTasks[i][1];

        //  TEN SAM KOD CO PRZY 'ADD ITEMS TO LIST'
        const list = completed
          ? document.getElementById("todo")
          : document.getElementById("completed");

        const item = document.createElement("li");
        item.innerText = toDoTasks_task;

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

        // REMOVE ITEM FROM FIREBASE AND LIST
        deleteBtn.addEventListener("click", function removeItem() {
          const item = this.parentNode.parentNode;
          const parent = item.parentNode;
          const id = parent.id;

          if (id === "todo") {
            db.ref("toDoTasks/" + toDoTasks_key).remove();
            console.log(toDoTasks_key, "deleted");
          } else {
            db.ref("completeTasks/" + toDoTasks_key).remove();
            console.log(toDoTasks_key, "deleted");
          }

          parent.removeChild(item);
        });

        //  ADD TO COMPLETE LIST
        completeBtn.addEventListener("click", function completeItem() {
          const item = this.parentNode.parentNode;
          const parent = item.parentNode;
          const id = parent.id;

          let completeTasks = {
            task: toDoTasks_task,
            key: toDoTasks_key,
          };

          // let completeTasksUpdates = {};
          if (id === "todo") {
            db.ref("toDoTasks/" + toDoTasks_key).remove();
            completeTasksUpdates[
              "completeTasks/" + toDoTasks_key
            ] = completeTasks;
            db.ref().update(completeTasksUpdates);
          } else {
            db.ref("completeTasks/" + toDoTasks_key).remove();
            toDoTasksUpdates["toDoTasks/" + toDoTasks_key] = toDoTasks;
            db.ref().update(toDoTasksUpdates);
          }

          //    CHECK IF THE ITEM SHOULD BE ADDED TO TODO OR COMPLETED LIST
          let target =
            id === "todo"
              ? document.getElementById("completed")
              : document.getElementById("todo");

          parent.removeChild(item);
          target.insertBefore(item, target.childNodes[0]);
        });
      }
    });
  });

  //  COMPLETE TASKS
  db.ref("completeTasks").once("value", (snap) => {
    snap.forEach((childSnap) => {
      const completeTasks = [];
      const childData = childSnap.val();

      completeTasks.push(Object.values(childData));

      for (j = 0; j < completeTasks.length; j++) {
        console.log("completeTasks: ", completeTasks[j]);
        let completeTasks_key = completeTasks[j][0];
        let completeTasks_task = completeTasks[j][1];

        //  TEN SAM KOD CO PRZY 'ADD ITEMS TO LIST'

        const list = completed
          ? document.getElementById("completed")
          : document.getElementById("todo");

        const item = document.createElement("li");
        item.innerText = completeTasks_task;

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

        // REMOVE ITEM FROM FIREBASE AND LIST
        deleteBtn.addEventListener("click", function removeItem() {
          const item = this.parentNode.parentNode;
          const parent = item.parentNode;
          const id = parent.id;

          if (id === "completed") {
            db.ref("completeTasks/" + completeTasks_key).remove();
            console.log(completeTasks_key, "deleted");
          } else {
            db.ref("toDoTasks/" + completeTasks_key).remove();
            console.log(completeTasks_key, "deleted");
          }

          parent.removeChild(item);
        });

        //  ADD TO TODO LIST
        completeBtn.addEventListener("click", function completeItem() {
          const item = this.parentNode.parentNode;
          const parent = item.parentNode;
          const id = parent.id;

          let toDoTasks = {
            task: completeTasks_task,
            key: completeTasks_key,
          };

          // let toDoTasksUpdates = {};
          if (id === "completed") {
            db.ref("completeTasks/" + completeTasks_key).remove();
            toDoTasksUpdates["toDoTasks/" + completeTasks_key] = toDoTasks;
            db.ref().update(toDoTasksUpdates);
          } else {
            db.ref("toDoTasks/" + completeTasks_key).remove();
            completeTasksUpdates[
              "completeTasks/" + completeTasks_key
            ] = toDoTasks;
            db.ref().update(completeTasksUpdates);
          }

          //    CHECK IF THE ITEM SHOULD BE ADDED TO TODO OR COMPLETED LIST
          let target =
            id === "todo"
              ? document.getElementById("completed")
              : document.getElementById("todo");

          parent.removeChild(item);
          target.insertBefore(item, target.childNodes[0]);
        });
      }
    });
  });
}

showData();

//  EVENTLISTENERS
addBtn.addEventListener("click", addItems);
