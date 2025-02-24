"use strict";
const App = {
    $: {
        page: document.querySelector(".page-container"),
        colorBtn: document.querySelector("#color-btn"),
        addListBtn: document.querySelector("#add-list"),
        storageBtn: document.querySelector("#storage-btn"),
        storageContainer: document.querySelector("#storage-container"),
        listContainer: document.querySelector("#list-container"),
        pageBottom: document.querySelector(".page-bottom"),
        idCounter: 0
    },
    init() {
        this.load();
        this.applyMainListeners();
        this.applyListListeners();
    },
    applyMainListeners() {
        var _a, _b, _c, _d;
        (_a = this.$.listContainer) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (e) => {
            const target = e.target;
            const parent = target.parentElement;
            if (target.classList.contains("checkbox")) {
                target.classList.toggle("checked");
                App.checkboxChecker();
                App.save();
            }
            else if (parent === null || parent === void 0 ? void 0 : parent.classList.contains("checkbox")) {
                parent.classList.toggle("checked");
                App.checkboxChecker();
                App.save();
            }
            if (target.classList.contains("task-delete")) {
                parent === null || parent === void 0 ? void 0 : parent.remove();
                App.taskChecker();
                App.checkboxChecker();
                App.save();
            }
        });
        (_b = this.$.colorBtn) === null || _b === void 0 ? void 0 : _b.addEventListener("click", App.colorChange);
        (_c = this.$.addListBtn) === null || _c === void 0 ? void 0 : _c.addEventListener("click", (e) => {
            const exist = document.querySelector(".list");
            if (exist) {
                const nameInput = document.querySelector(".list-name");
                const taskBox = document.querySelector(".task-box");
                if (nameInput.value || taskBox.childElementCount > 0) {
                    App.storingList();
                    App.createList();
                }
                else {
                    App.notify("Already have a List");
                }
            }
            else {
                App.createList();
            }
        });
        (_d = this.$.storageBtn) === null || _d === void 0 ? void 0 : _d.addEventListener("click", (e) => {
            var _a;
            if (this.$.storageContainer.childElementCount > 0) {
                (_a = this.$.storageContainer) === null || _a === void 0 ? void 0 : _a.classList.toggle("hidden");
            }
        });
    },
    createList() {
        var _a;
        const list = document.createElement("div");
        list.classList.add("list");
        list.innerHTML = `
        <div class="list-top">
        <i id="store-list" class="fa-solid fa-box-archive fa-border"></i>
        <input class="list-name" type="text" placeholder="List Name"  maxlength="40"/>
        <i id="list-delete" class="fa-solid fa-x fa-border"></i>
        </div>
        <div class="list-bottom">
        <div class="input-group">
        <input class="input" type="text" maxlength="210" />
        <button class="add-btn">ADD</button>
        </div>
        <div class="task-box"></div>
        <span class="task-tracker"><p><p id="checked-counter">0</p> / <p id="task-counter">0</p> Tasks Completed</p></span>
        </div>
        </div>`;
        (_a = App.$.listContainer) === null || _a === void 0 ? void 0 : _a.appendChild(list);
        App.applyListListeners();
        App.save();
    },
    applyListListeners() {
        const listStoreBtn = document.querySelector("#store-list");
        listStoreBtn === null || listStoreBtn === void 0 ? void 0 : listStoreBtn.addEventListener("click", (e) => {
            App.storingList();
            App.notify("List Stored");
        });
        const deleteBtn = document.querySelector("#list-delete");
        deleteBtn === null || deleteBtn === void 0 ? void 0 : deleteBtn.addEventListener("click", (e) => {
            var _a;
            const parent = deleteBtn.parentElement;
            (_a = parent === null || parent === void 0 ? void 0 : parent.parentElement) === null || _a === void 0 ? void 0 : _a.remove();
            App.save();
            App.notify("List Deleted");
        });
        const nameInput = document.querySelector(".list-name");
        nameInput === null || nameInput === void 0 ? void 0 : nameInput.addEventListener("keydown", (e) => {
            const KeyboardEvent = e;
            if (KeyboardEvent.key === "Enter") {
                nameInput.blur();
            }
            App.save();
        });
        const input = document.querySelector(".input");
        const addBtn = document.querySelector(".add-btn");
        const regex = /\S/;
        input === null || input === void 0 ? void 0 : input.addEventListener("keydown", (e) => {
            const KeyboardEvent = e;
            if (KeyboardEvent.key === "Enter") {
                addBtn.click();
            }
        });
        addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener("click", (e) => {
            if (input === null || input === void 0 ? void 0 : input.value.match(regex)) {
                const trimmed = input === null || input === void 0 ? void 0 : input.value.trim();
                input.value = "";
                App.createTask(trimmed);
            }
            else {
                alert("Enter a Task!");
            }
        });
    },
    save() {
        var _a, _b;
        const listContent = (_a = this.$.listContainer) === null || _a === void 0 ? void 0 : _a.innerHTML;
        localStorage.setItem("listData", `${listContent}`);
        const storageContent = (_b = this.$.storageContainer) === null || _b === void 0 ? void 0 : _b.innerHTML;
        localStorage.setItem("storageData", `${storageContent}`);
    },
    load() {
        if (localStorage.getItem("listData")) {
            const html = localStorage.getItem("listData");
            App.$.listContainer.innerHTML = html;
        }
        if (localStorage.getItem("storageData")) {
            const html = localStorage.getItem("storageData");
            App.$.storageContainer.innerHTML = html;
        }
        App.loadColor();
        App.taskChecker();
        App.checkboxChecker();
        this.loadIdCounter();
        this.applyBoxListeners();
    },
    saveIdCounter() {
        localStorage.setItem("idCounterData", `${this.$.idCounter}`);
    },
    loadIdCounter() {
        if (localStorage.getItem("idCounterData")) {
            this.$.idCounter = Number(localStorage.getItem("idCounterData"));
        }
    },
    saveColor() {
        var _a;
        const color = (_a = this.$.page) === null || _a === void 0 ? void 0 : _a.classList.item(1);
        localStorage.setItem("ColorData", color);
    },
    loadColor() {
        var _a, _b;
        if (localStorage.getItem("ColorData")) {
            const color = localStorage.getItem("ColorData");
            (_a = this.$.page) === null || _a === void 0 ? void 0 : _a.classList.remove("color-palette-A");
            (_b = this.$.page) === null || _b === void 0 ? void 0 : _b.classList.add(`${color}`);
        }
    },
    colorChange() {
        var _a;
        const currentColor = App.$.page.classList.item(1);
        let nextColor = "";
        if (currentColor === "color-palette-A") {
            nextColor = "color-palette-B";
        }
        else if (currentColor === "color-palette-B") {
            nextColor = "color-palette-C";
        }
        else if (currentColor === "color-palette-C") {
            nextColor = "color-palette-A";
        }
        (_a = App.$.page) === null || _a === void 0 ? void 0 : _a.classList.replace(`${currentColor}`, `${nextColor}`);
        App.saveColor();
    },
    storingList() {
        const list = document.querySelector(".list");
        const taskBox = document.querySelector(".task-box");
        const tasks = taskBox === null || taskBox === void 0 ? void 0 : taskBox.innerHTML;
        const listName = document.querySelector(".list-name");
        const inputName = listName;
        let name = "List";
        if (inputName.value) {
            name = inputName.value;
        }
        list === null || list === void 0 ? void 0 : list.remove();
        App.boxify(App.$.idCounter, name);
        App.save();
        localStorage.setItem(`${App.$.idCounter}`, `${tasks}`);
        App.$.idCounter++;
        App.saveIdCounter();
    },
    boxify(number, name) {
        var _a;
        const span = document.createElement("span");
        span.id = number.toString();
        span.classList.add("list-box");
        const p = document.createElement("p");
        p.innerHTML = name;
        span.appendChild(p);
        (_a = this.$.storageContainer) === null || _a === void 0 ? void 0 : _a.appendChild(span);
        span.addEventListener("click", (e) => {
            const p = span.firstChild;
            const name = p;
            if (this.$.listContainer.childElementCount > 0) {
                App.storingList();
                App.notify("List Swapped");
            }
            App.listify(number, name.innerHTML);
            span.remove();
            App.storageChecker();
            App.save();
        });
    },
    applyBoxListeners() {
        if (document.querySelectorAll(".list-box")) {
            const listBoxes = document.querySelectorAll(".list-box");
            listBoxes.forEach(box => {
                box.addEventListener("click", (e) => {
                    const id = Number(box.id);
                    const p = box.firstChild;
                    const name = p;
                    if (this.$.listContainer.childElementCount > 0) {
                        App.storingList();
                        App.notify("List Swapped");
                    }
                    App.listify(id, name.innerHTML);
                    box.remove();
                    App.storageChecker();
                    App.save();
                });
            });
        }
    },
    listify(id, name) {
        var _a;
        const list = document.createElement("div");
        list.classList.add("list");
        list.innerHTML = `<div class="list-top">
                            <i id="store-list" class="fa-solid fa-box-archive fa-border" aria-hidden="false"></i>
                            <input class="list-name" type="text" value="${name}" maxlength="40"/>
                            <i id="list-delete" class="fa-solid fa-x fa-border" aria-hidden="false"></i>
                            </div>
                            <div class="list-bottom">
                            <div class="input-group">
                            <input class="input" type="text" maxlength="210"/>
                            <button class="add-btn">ADD</button>
                            </div>
                            <div class="task-box">${localStorage.getItem(`${id}`)}</div>
                            <span class="task-tracker"><p><p id="checked-counter">0</p> / <p id="task-counter">0</p> Tasks Completed</p></span>
                            </div>
                            </div>`;
        (_a = this.$.listContainer) === null || _a === void 0 ? void 0 : _a.appendChild(list);
        App.taskChecker();
        App.checkboxChecker();
        App.applyListListeners();
    },
    createTask(value) {
        const taskBox = document.querySelector(".task-box");
        const span = document.createElement("span");
        span.classList.add("task-wrapper");
        span.innerHTML = `<span class="checkbox">
                            <i class="fa-solid fa-check checkmark"></i>
                            </span>
                            <p>${value}</p>
                            <i class="fa-solid fa-x task-delete"></i`;
        taskBox === null || taskBox === void 0 ? void 0 : taskBox.appendChild(span);
        App.taskChecker();
        App.save();
    },
    taskChecker() {
        if (document.querySelector("#task-counter")) {
            const taskCounter = document.querySelector("#task-counter");
            const tasks = document.querySelectorAll(".task-wrapper");
            const num = tasks.length;
            taskCounter.innerHTML = `${num}`;
        }
    },
    checkboxChecker() {
        if (document.querySelector("#checked-counter")) {
            const checkedCounter = document.querySelector("#checked-counter");
            const checkedBoxes = document.querySelectorAll(".checked");
            const num = checkedBoxes.length;
            checkedCounter.innerHTML = `${num}`;
        }
    },
    storageChecker() {
        var _a;
        if (((_a = App.$.storageContainer) === null || _a === void 0 ? void 0 : _a.childElementCount) === 0) {
            App.$.storageContainer.classList.toggle("hidden");
        }
    },
    notify(notif) {
        var _a;
        const span = document.createElement("span");
        span.classList.add("notification");
        span.classList.add("fade-in");
        const p = document.createElement("p");
        p.innerHTML = notif;
        span.appendChild(p);
        (_a = this.$.pageBottom) === null || _a === void 0 ? void 0 : _a.appendChild(span);
        setTimeout(() => {
            span.remove();
        }, 1500);
    }
};
App.init();
