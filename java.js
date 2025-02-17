const worldContainer = document.getElementById("world-container")
const container = document.querySelector("#container")
const storageContainer = document.querySelector("#storage-container")


let counter = (localStorage.getItem("counterData") > 1) ? localStorage.getItem("counterData") : 1;

const idNumberArray = []

const idBoxArray = []

function extract(string) {
    const parts = string.split('')
    const lastPart = parts.filter((parts) => Number(parts) || parts === "0");
    return lastPart.join('')
}

function extract2(string) {
    const parts = string.split(',')
    const lastPart = parts.filter((parts) => Number(parts) || parts === "0");
    return lastPart
}

function addTask(id) {
    const num = extract(id);
    
    const inputBar = document.querySelector(`#input-bar${num}`);
    const listContainer = document.querySelector(`#list-container${num}`)
    console.log(listContainer);
    console.log(inputBar);

    if (listContainer.childElementCount < 20){
        if (inputBar.value === ""){
            alert("Enter a Task!")
        }
        else {
        let li = document.createElement("li");
        li.innerHTML = `${inputBar.value} <i class="fa-solid fa-border fa-x mini-x"></i>`;
        listContainer.appendChild(li);
        inputBar.value = "";
        saveContainerData();
        retrieveColor();
        darkSwitch();
        }
            
    }
    else {
        alert('Max tasks reached')

    }


   
}





function idRemover(idNum) {
    const index = idNumberArray.indexOf(idNum);
    idNumberArray.splice(index, 1);
    saveIds();
}

function boxIdRemover(idNum) {
    const index = idBoxArray.indexOf(idNum);
    idBoxArray.splice(index, 1);
    saveBoxIds();
}




function namrBarEL(idNum) {
    console.log(idNum)
    const nameBar = document.querySelector(`#name-bar${idNum}`);
    nameBar.addEventListener("keydown", function(e) {
        saveName(idNum);
        if (e.key === "Enter") {
            nameBar.blur();
        }
    })
}



function todoTopEL(idNum) {
    const todoTop = document.querySelector(`#todo-top${idNum}`);
 
    
        todoTop.addEventListener("click", function(e) {
            if (e.target.classList.contains("x-btn")) {
                todoTop.parentElement.remove();
                idRemover(idNum);
                saveContainerData();
                
            }
            
        })
        
    
     
}

function listContainerEL(idNum) {
    
    
    const listContainer = document.querySelector(`#list-container${idNum}`)
   
    listContainer.addEventListener("click", function(e) {
        if(e.target.tagName === "LI"){
            e.target.classList.toggle("checked");
            saveContainerData()
        }
        
        else if(e.target.classList.contains("mini-x")) {
            e.target.parentElement.remove();
            saveContainerData()
        }
    })
    
}


function inputBarEL(idNum) {
    const inputBar = document.querySelector(`#input-bar${idNum}`);
    
    inputBar.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            inputBar.nextElementSibling.click();
        }
    })

}

function dragDropBoxEL(idNum) {
        const dropBox = document.querySelector(`#box${idNum}`);
      
        dropBox.addEventListener("dragstart", function(e){
            localStorage.setItem("dropBoxData", idNum);
            localStorage.setItem("className", "box")
        })
    }

function dragDropEL(idNum) {
    if (idNum === null){}
    else {
       
        const todoTop = document.querySelector(`#todo-top${idNum}`);
        const todolist = todoTop.parentElement;
       
            todolist.addEventListener("dragstart", function(e){
                localStorage.setItem("todoData", idNum);
                localStorage.setItem("className", "todoList")
            })
        }
    }

    function applyDropEL() {

        storageContainer.addEventListener("dragover", function(e) {
            e.preventDefault();
           
        });
        storageContainer.addEventListener("drop", function(e) {
            const className = localStorage.getItem("className")
            if (className === "todoList"){
                if (storageContainer.childElementCount < 12){
                    const id = localStorage.getItem("todoData");
                    const todoTop = document.querySelector(`#todo-top${id}`)
                    const todoList = todoTop.parentElement;
                    storageContainer.appendChild(boxify(id));
                    todoList.remove()
                    
                    
                    
                    dragDropBoxEL(id);
                    fromListToBoxId(id)
                    retrieveColor();
                    darkSwitch()
                    saveContainerData();
                }
                else {alert("Max Lists Stored!")}
            }
            else{} 

        })
           
            

        container.addEventListener("dragover", function(e) {
            e.preventDefault();
        });

        container.addEventListener("drop", function(e) {
            
            const className = localStorage.getItem("className")
            if (className === "box"){
                if (container.childElementCount < 3){
                    if (window.innerWidth > 1540 || container.childElementCount < 2){
                        if (window.innerWidth > 440 || container.childElementCount < 1){
                            const id = localStorage.getItem("dropBoxData");
                            const dropBox = document.querySelector(`#box${id}`)
                            
                        
                            container.appendChild(listify(id));
                            dropBox.remove();
                        
                            
                                    
                                    
                            elRecap(id)
                            fromBoxToListId(id)
                            retrieveColor();
                            darkSwitch()
                            saveContainerData();
                        }
                        else{
                            alert("One list at a time!")
                        }
                        }
                        else {
                            alert("Max of 2 lists!")
                        }
                    }
                else {
                    alert("Max of 3 Lists!")
                }
            }
            

            })


    }

    function fromListToBoxId(idNum){
        idBoxArray.push(idNum);
        saveBoxIds();
        idRemover(idNum);
    }

    function fromBoxToListId(idNum){
        idNumberArray.push(idNum);
        boxIdRemover(idNum)
        saveIds()
    }

    function elRecap(idNum){
        dragDropEL(idNum);
        listContainerEL(idNum);
        inputBarEL(idNum);
        todoTopEL(idNum);
        namrBarEL(idNum);

    }

function boxifyInfo(idNum){
    if (document.querySelector(`#list-container${idNum}`)) {
        const listContainer = document.querySelector(`#list-container${idNum}`);
        localStorage.setItem(`listData${idNum}`, listContainer.innerHTML);
    };

    
}

function boxify(idNum) {
    boxifyInfo(idNum);
    const div = document.createElement("div");
    div.classList.add("storage-box", "white");;
    div.setAttribute("id", `box${idNum}`);
    div.setAttribute("draggable", `true`);
    const name = document.createElement("div")
    name.innerHTML = localStorage.getItem(`nameData${idNum}`);
    div.appendChild(name);
    
    
    return div;
}


function reColor() {
    const colorBtn = document.querySelector("#recolor");
    if (colorBtn.classList.contains("white")) {
        colorWheel("red") 
    }
    else if (colorBtn.classList.contains("red")) {
        colorWheel("blue")
       
    }
    else if (colorBtn.classList.contains("blue")) {
        colorWheel("green")
        
    }
    else if (colorBtn.classList.contains("green")) {
        colorWheel("yellow")
        
    }
    else if (colorBtn.classList.contains("yellow")) {
        colorWheel("purple")
       
    }
    else if (colorBtn.classList.contains("purple")) {
        colorWheel("pink")
       
    }
    else if (colorBtn.classList.contains("pink")) {
        colorWheel("white")
    
    }
    
    

}

function colorWheel(newColor) {
    if (newColor === null){}
    else{
        
        saveColor(newColor);
        massColor(newColor);
    } ;
}

function massColor(color) {


    const todoTops = document.querySelectorAll(".todo-top");
    const TodoBottoms = document.querySelectorAll(".todo-bottom");
    const addBtns = document.querySelectorAll(".add-btn");
    const xBtns = document.querySelectorAll(".x-btn");
    const listContainers = document.querySelectorAll(".list-container");
    const bigBtns = document.querySelectorAll(".big-btn");
    const storageBox = document.querySelectorAll(".storage-box");
    const storageGroup = document.querySelector("#storage-group");
    const siteBlock = document.querySelector("#site-block");
    const siteName = document.querySelector("#site-name");


    todoTops.forEach((e) => e.classList.remove("white", "red", "blue", "green", "yellow", "purple", "pink"));
    TodoBottoms.forEach((e) => e.classList.remove("white", "red", "blue", "green", "yellow", "purple", "pink"));
    addBtns.forEach((e) => e.classList.remove("white", "red", "blue", "green", "yellow", "purple", "pink"));
    xBtns.forEach((e) => e.classList.remove("white", "red", "blue", "green", "yellow", "purple", "pink"));
    listContainers.forEach((e) => e.classList.remove("white", "red", "blue", "green", "yellow", "purple", "pink"));
    bigBtns.forEach((e) => e.classList.remove("white", "red", "blue", "green", "yellow", "purple", "pink"));
    storageBox.forEach((e) => e.classList.remove("white", "red", "blue", "green", "yellow", "purple", "pink"));
    storageContainer.classList.remove("white", "red", "blue", "green", "yellow", "purple", "pink");
    storageGroup.classList.remove("white", "red", "blue", "green", "yellow", "purple", "pink");
    worldContainer.classList.remove("white", "red", "blue", "green", "yellow", "purple", "pink");
    siteName.classList.remove("white", "red", "blue", "green", "yellow", "purple", "pink");
    siteBlock.classList.remove("white", "red", "blue", "green", "yellow", "purple", "pink");




    todoTops.forEach((e) => e.classList.add(color));
    TodoBottoms.forEach((e) => e.classList.add(color));
    addBtns.forEach((e) => e.classList.add(color));
    xBtns.forEach((e) => e.classList.add(color));
    listContainers.forEach((e) => e.classList.add(color));
    bigBtns.forEach((e) => e.classList.add(color));
    storageBox.forEach((e) => e.classList.add(color));
    storageContainer.classList.add(color);
    storageGroup.classList.add(color);
    siteName.classList.add(color);
    siteBlock.classList.add(color);
    worldContainer.classList.add(color);

  
}


function darkMode() {
    worldContainer.classList.toggle("dark-mode");
    if (worldContainer.classList.contains("dark-mode")) {
        localStorage.setItem("dark", "yes")
    }
    else {
        localStorage.setItem("dark", "no")
    }
    darkSwitch()
};

function reDark(answer) {
    if (answer === "yes") {
        darkMode();
    }
    else {
        darkSwitch()
    } 
};

function darkSwitch(){


    const todoTops = document.querySelectorAll(".todo-top");
    const TodoBottoms = document.querySelectorAll(".todo-bottom");
    const addBtns = document.querySelectorAll(".add-btn");
    const xBtns = document.querySelectorAll(".x-btn");
    const listContainers = document.querySelectorAll(".list-container");
    const bigBtns = document.querySelectorAll(".big-btn");
    const storageBox = document.querySelectorAll(".storage-box");
    const storageGroup = document.querySelector("#storage-group");
    const siteBlock = document.querySelector("#site-block");
    const siteName = document.querySelector("#site-name");



    if (worldContainer.classList.contains("dark-mode")) {
        console.log("yo its dark af in here!")
        todoTops.forEach((e) => e.classList.add("dark-mode"));
        TodoBottoms.forEach((e) => e.classList.add("dark-mode"));
        addBtns.forEach((e) => e.classList.add("dark-mode"));
        xBtns.forEach((e) => e.classList.add("dark-mode"));
        listContainers.forEach((e) => e.classList.add("dark-mode"));
        bigBtns.forEach((e) => e.classList.add("dark-mode"));
        storageBox.forEach((e) => e.classList.add("dark-mode"));
        storageContainer.classList.add("dark-mode");
        storageGroup.classList.add("dark-mode");
        siteName.classList.add("dark-mode");
        siteBlock.classList.add("dark-mode");
        worldContainer.classList.add("dark-mode");
    }
    else {
        console.log("I SEE THE LIGHT!")
        todoTops.forEach((e) => e.classList.remove("dark-mode"));
        TodoBottoms.forEach((e) => e.classList.remove("dark-mode"));
        addBtns.forEach((e) => e.classList.remove("dark-mode"));
        xBtns.forEach((e) => e.classList.remove("dark-mode"));
        listContainers.forEach((e) => e.classList.remove("dark-mode"));
        bigBtns.forEach((e) => e.classList.remove("dark-mode"));
        storageBox.forEach((e) => e.classList.remove("dark-mode"));
        storageContainer.classList.remove("dark-mode");
        storageGroup.classList.remove("dark-mode");
        worldContainer.classList.remove("dark-mode");
        siteName.classList.remove("dark-mode");
        siteBlock.classList.remove("dark-mode");
    }
}


function listify(idNum){

    const NewTodoList = document.createElement("div")
    NewTodoList.classList.add("todo-list")
    NewTodoList.setAttribute("draggable", `true`);
           
    NewTodoList.appendChild(createListTop(idNum));
    NewTodoList.appendChild(createListBottom(idNum));

    return NewTodoList;
}



function createListTop(idNum) {
    let newTodoTop = document.createElement("div");
    newTodoTop.classList.add("todo-top", "white");
    newTodoTop.setAttribute("id", `todo-top${idNum}`);
    const name = localStorage.getItem(`nameData${idNum}`)
    
    if (name === null) {
        newTodoTop.innerHTML =`<input type="text" maxlength="25" class="name-bar" id="name-bar${idNum}" placeholder="List name">
          <i class="fa-solid fa-x fa-border x-btn icon white"></i>`;
          return newTodoTop;
    }
    else {
        newTodoTop.innerHTML =`<input type="text" maxlength="25" class="name-bar" id="name-bar${idNum}"  value="${name}" placeholder="List name">
              <i class="fa-solid fa-x fa-border x-btn icon white"></i>`;
              return newTodoTop;
    }

   
}

function createListBottom(idNum) {
    let newTodoBottom = document.createElement("div");
    newTodoBottom.classList.add("todo-bottom", "white");
    newTodoBottom.setAttribute("id", `todo-bottom${idNum}`);
    
    const lists = localStorage.getItem(`listData${idNum}`);

    newTodoBottom.innerHTML =
        `<div class="input-group">
            <input type="text" name="" maxlength="28" id="input-bar${idNum}" 
            class="input-bar" />
            <button class="add-btn white" id="add-btn${idNum}" onclick="addTask(this.id)">
              Add
            </button>
          </div>
          <ul
            class="list-container white"
            id="list-container${idNum}"
            
          >${lists}</ul>`;

   return newTodoBottom;
}


function createList() {
    
    
    if (container.childElementCount < 3){
        if (window.innerWidth > 1540 || container.childElementCount < 2){
            if (window.innerWidth > 1010 || container.childElementCount < 1){
                counter++
                idNumberArray.push(counter);
        
                let NewTodoList = document.createElement("div")
                NewTodoList.classList.add("todo-list")
                NewTodoList.setAttribute("draggable", `true`);
                
                container.appendChild(NewTodoList);
                NewTodoList.appendChild(createTodoTop());
                NewTodoList.appendChild(createTodoBottom());




            }
            else {
                alert('1 list at a time! ')
            }
        }
        else {
            alert('2 lists Max!')
        }
    }
    else {
        alert('3 Lists Max!');
    }
    
    elRecap(counter);
    
    
    saveIds();
    saveCounterData();
    saveContainerData();
    retrieveColor();
    darkSwitch()
}

function createTodoTop(){
    let newTodoTop = document.createElement("div");
    newTodoTop.classList.add("todo-top", "white");
    newTodoTop.setAttribute("id", `todo-top${counter}`);
    
    
    newTodoTop.innerHTML =`<input type="text" maxlength="25" id="name-bar${counter}" 
    class="name-bar" placeholder="List name" />
          <i class="fa-solid fa-x fa-border x-btn icon white"></i>`;

    return newTodoTop;
};
    
function createTodoBottom() {
    let newTodoBottom = document.createElement("div");
    newTodoBottom.classList.add("todo-bottom", "white");
    newTodoBottom.setAttribute("id", `todo-bottom${counter}`);
    

    newTodoBottom.innerHTML =
        `<div class="input-group">
            <input type="text" name="" maxlength="28" id="input-bar${counter}" 
            class="input-bar" />
            <button class="add-btn white" id="add-btn${counter}" onclick="addTask(this.id)">
              Add
            </button>
          </div>
          <ul
            class="list-container white"
            id="list-container${counter}"
            
          ></ul>`;

   return newTodoBottom;
}





function saveName(idNum) {
    const nameBar = document.querySelector(`#name-bar${idNum}`);
    localStorage.setItem(`nameData${idNum}`, nameBar.value);
}

function retrieveName(idNum) {
    const nameBar = document.querySelector(`#name-bar${idNum}`);
    if (localStorage.getItem(`nameData${idNum}`) !== null) {
        nameBar.value = localStorage.getItem(`nameData${idNum}`);
    }
}


function retrieveDark() {
   const answer = localStorage.getItem("dark")
   reDark(answer);
}

function saveColor(color) {
    localStorage.setItem("colorData", color);
}

function retrieveColor() {
    const color = localStorage.getItem("colorData")
    colorWheel(color);
}

function saveContainerData() {
    localStorage.setItem("containerData", container.innerHTML);
    localStorage.setItem("storageContainerData", storageContainer.innerHTML);
}

function retrieveContainerData() {
    container.innerHTML = localStorage.getItem("containerData")
    storageContainer.innerHTML = localStorage.getItem("storageContainerData")
    
}

function saveCounterData() {
    localStorage.setItem("counterData", counter);
}


function saveBoxIds() {
    localStorage.setItem("boxIdData", idBoxArray);
};

function retrieveBoxIds() {
    if (localStorage.getItem("boxIdData") === null){}
    else {
        const splitData = extract2(localStorage.getItem("boxIdData"))
       splitData.forEach((num) => idBoxArray.push(num));
       console.log(idBoxArray);
    }
   
   }



function saveIds() {
     localStorage.setItem("idData", idNumberArray);
};


 function retrieveIds() {
    if (localStorage.getItem("idData") === null){}
    else {
        const splitData = extract2(localStorage.getItem("idData"))
       splitData.forEach((num) => idNumberArray.push(num));
       console.log(idNumberArray);
    }

}


function reapplyEventListeners() {
    for (num of idNumberArray) {
        todoTopEL(num);
    }
    for (num of idNumberArray) {
        listContainerEL(num);
    }
    for (num of idNumberArray) {
        inputBarEL(num);
    }
    for (num of idNumberArray) {
        dragDropEL(num);
    }
    for (num of idNumberArray) {
        namrBarEL(num);
    }
    for (num of idNumberArray) {
        retrieveName(num)
    }

    if (idBoxArray.length !== 0 ){
        for (num of idBoxArray) {
            dragDropBoxEL(num)
        }
        
    };
    
}

applyDropEL()


retrieveBoxIds()

retrieveIds()

retrieveContainerData()

reapplyEventListeners()

retrieveDark()
retrieveColor()
