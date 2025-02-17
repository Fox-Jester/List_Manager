

const App = {
    $: {
        page: document.querySelector(".page-container"),
        addListBtn: document.querySelector("#add-list"),

        storageBtn: document.querySelector("#storage-btn"),
        storageContainer: document.querySelector("#storage-container"),

        listContainer: document.querySelector("#list-container"),

        idCounter: 0
    },


    init(){
        this.load()
        this.applyMainListeners()
        this.applyListListeners()
      
    },

    applyMainListeners(){

        this.$.listContainer?.addEventListener("click", (e) => {
            const target = <HTMLElement>e.target;
            const parent = target.parentElement;

            if(target.classList.contains("checkbox")){
                target.classList.toggle("checked");
                App.checkboxChecker()
                App.save()
            }
            else if(parent?.classList.contains("checkbox")){
                parent.classList.toggle("checked")
                App.checkboxChecker()
                App.save()
            }

            if(target.classList.contains("task-delete")){
                parent?.remove()
                App.taskChecker()
                App.checkboxChecker()
                App.save()
            }
        })

        this.$.addListBtn?.addEventListener("click", (e) => {
            const exist = document.querySelector(".list")
            if(exist){
                /* CHANGE TO SWAP LATER_______________*/
                alert("only 1 list up at a time");
            }
            else{
                const list = document.createElement("div")
                list.classList.add("list");
                list.innerHTML = `
                <div class="list-top">
                <i id="store-list" class="fa-solid fa-box-archive fa-border"></i>
                <input class="list-name" type="text" placeholder="List Name" />
                <i id="list-delete" class="fa-solid fa-x fa-border"></i>
                </div>
                <div class="list-bottom">
                <div class="input-group">
                <input class="input" type="text" />
                <button class="add-btn">ADD</button>
                </div>
                <div class="task-box"></div>
                <span class="task-tracker"><p><p id="checked-counter">0</p> / <p id="task-counter">0</p> Tasks Completed</p></span>
                </div>
                </div>`

                App.$.listContainer?.appendChild(list);
                App.applyListListeners()
                App.save()
            }
        })

        this.$.storageBtn?.addEventListener("click", (e) => {
            if(this.$.storageContainer!.childElementCount > 0){
                this.$.storageContainer?.classList.toggle("hidden")
            }
        })


    },

    applyListListeners(){

        const listStoreBtn = document.querySelector("#store-list");
        listStoreBtn?.addEventListener("click", App.storingList)


        const deleteBtn = document.querySelector("#list-delete");

        deleteBtn?.addEventListener("click", (e) => {
            const parent = deleteBtn.parentElement;
            parent?.parentElement?.remove();
            App.save()
        })


        const nameInput = document.querySelector<HTMLInputElement>(".list-name");

        nameInput?.addEventListener("keydown", (e) => {
            const KeyboardEvent = <KeyboardEvent>e
            if(KeyboardEvent.key === "Enter"){
                nameInput.blur()
            }
            App.save()
        })



        const input = document.querySelector<HTMLInputElement>(".input");
        const addBtn = document.querySelector(".add-btn");
        const regex = /\S/
        
        addBtn?.addEventListener("click", (e) => {
            if(input?.value.match(regex)){
                const trimmed = input?.value.trim()
                input.value = ""
                App.createTask(trimmed);
              
            }
            else{
                alert("Enter a Task!")
            }
        })
    },

    save(){
        const listContent = this.$.listContainer?.innerHTML;
        localStorage.setItem("listData", `${listContent}`);

        const storageContent = this.$.storageContainer?.innerHTML;
        localStorage.setItem("storageData", `${storageContent}`);
    },

    load(){
        if(localStorage.getItem("listData")){
            const html = <string>localStorage.getItem("listData")
            App.$.listContainer!.innerHTML = html
        }

        if(localStorage.getItem("storageData")){
            const html = <string>localStorage.getItem("storageData")
            App.$.storageContainer!.innerHTML = html
        }


        App.taskChecker()
        App.checkboxChecker()

        this.loadIdCounter()

        this.applyBoxListeners()
    },
    
    saveIdCounter(){
        localStorage.setItem("idCounterData", `${this.$.idCounter}`)
    },
    
    loadIdCounter(){
        if(localStorage.getItem("idCounterData")){
            this.$.idCounter = Number(localStorage.getItem("idCounterData"));
        }
    },
    storingList(){
        const list = document.querySelector(".list")
        const taskBox = document.querySelector(".task-box");
        const tasks = taskBox?.innerHTML
        const listName = document.querySelector(".list-name");
        const inputName = <HTMLInputElement>listName;

        

        let name: string = "List"

        if(inputName.value){
            name = inputName.value;
        }
        list?.remove()
        App.boxify(App.$.idCounter, name)
        localStorage.setItem(`${App.$.idCounter}`, `${tasks}`)
        App.applyBoxListener(App.$.idCounter);
        App.$.idCounter++
        App.saveIdCounter()
    },

    boxify(number: number, name: string){
        const span = document.createElement("span");
        span.id = number.toString();
        span.classList.add("list-box")
        const p = document.createElement("p");
        p.innerHTML = name;
        span.appendChild(p);
        this.$.storageContainer?.appendChild(span);

        App.save()

    },

    applyBoxListener(id: number){
        const listBox = document.getElementById(`${id}`);

        listBox?.addEventListener("click", (e) => {
            const p = listBox.firstChild;
            const name = <HTMLParagraphElement>p
                App.listify(id, name.innerHTML)
                listBox.remove()

        });
    },
    applyBoxListeners(){
        if(document.querySelectorAll(".list-box")){
            const listBoxes = document.querySelectorAll(".list-box")
    
                listBoxes.forEach(box => {
                    box.addEventListener("click", (e) => {
                        const id = Number(box.id);
                        const p = box.firstChild;
                        const name = <HTMLParagraphElement>p
                            App.listify(id, name.innerHTML)
                            box.remove()
            
                    });

                })

        }
       
    },


    listify(id: number, name: string){
        const list = document.createElement("div");
        list.classList.add("list");


        list.innerHTML = `<div class="list-top">
                            <i id="store-list" class="fa-solid fa-box-archive fa-border"></i>
                            <input class="list-name" type="text" value="${name}" />
                            <i id="list-delete" class="fa-solid fa-x fa-border"></i>
                            </div>
                            <div class="list-bottom">
                            <div class="input-group">
                            <input class="input" type="text" />
                            <button class="add-btn">ADD</button>
                            </div>
                            <div class="task-box">${localStorage.getItem(`${id}`)}</div>
                            <span class="task-tracker"><p><p id="checked-counter">0</p> / <p id="task-counter">0</p> Tasks Completed</p></span>
                            </div>
                            </div>`

        this.$.listContainer?.appendChild(list);

        App.taskChecker()
        App.checkboxChecker()
   
        App.save()
        
        App.applyListListeners()
       
    },

    createTask(value: string){
        
        const taskBox = document.querySelector(".task-box")
        const span = document.createElement("span")
        span.classList.add("task-wrapper");

        span.innerHTML = `<span class="checkbox">
                            <i class="fa-solid fa-check checkmark"></i>
                            </span>
                            <p>${value}</p>
                            <i class="fa-solid fa-x task-delete"></i`

        

        taskBox?.appendChild(span);
     
        
        
        App.taskChecker()
        App.save()
       
    },

    taskChecker(){
        if(document.querySelector("#task-counter")){
            const taskCounter = document.querySelector("#task-counter")
    
            const tasks = document.querySelectorAll(".task-wrapper");
            const num = tasks.length
            
            taskCounter!.innerHTML = `${num}`

        }

    },


    checkboxChecker(){
        if(document.querySelector("#checked-counter")){
            const checkedCounter = document.querySelector("#checked-counter");
    
            const checkedBoxes = document.querySelectorAll(".checked");
            const num = checkedBoxes.length;
    
            checkedCounter!.innerHTML = `${num}`;


        }
    }
    




  

 
   

   
}


App.init()

