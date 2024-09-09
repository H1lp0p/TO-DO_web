var jsonData = null;
var fileName = "";
nowData = {}
var id = 0;

let doneBoard = document.getElementById("done");
let doingBoard = document.getElementById("doing");

function inputHandler(event){
    let reader = new FileReader();
    reader.onload = onReadLoad;
    fileName = event.target.files[0].name.split('.')[0];
    reader.readAsText(event.target.files[0]);
}

function onReadLoad(event) {
    let data = JSON.parse(event.target.result);
    jsonData = data;

    for (let i in jsonData.done){
        nowData[id.toString()] = {
            "status" : "done",
            "title" : jsonData.done[i].title,
            "description" : jsonData.done[i].description
        };
        id+=1;
    }

    for (let i in jsonData.doing){
        nowData[id.toString()] = {
            "status" : "doing",
            "title" : jsonData.doing[i].title,
            "description" : jsonData.doing[i].description
        };
        id+=1;
    }

    displayTickets();

    document.getElementById("board-bg-text").innerText = `"${fileName}" board`;

    document.getElementById("clear-board-btn").style.display = "inline-block";
    document.getElementById("input-file-btn").style.display = "none";
    document.getElementById("new-board-btn").style.display = "none";
    document.getElementById("save-btn").style.display = "inline-block";
    document.getElementById("new-ticket").style.display = "inline-block";
}

function newBoard(event){
    fileName = "New board";
    jsonData = {
        "done" : [],
        "doing" : [],
    }
    document.getElementById("board-bg-text").innerText = "New board";
    document.getElementById("clear-board-btn").style.display = "inline-block";
    document.getElementById("input-file-btn").style.display = "none";
    document.getElementById("new-board-btn").style.display = "none";
    document.getElementById("save-btn").style.display = "inline-block";
    document.getElementById("new-ticket").style.display = "inline-block";
}

function saveBoard(event){
    var resultObj = {
        "done" : [],
        "doing" : []
    }
    
    for (let key in nowData){
        let ticket = {
            "title" : nowData[key].title,
            "description" : nowData[key].description
        }

        if (nowData[key].status === "done"){
            resultObj.done.push(ticket);
        }
        else{
            resultObj.doing.push(ticket);
        }
    }

    const blob = new Blob([JSON.stringify(resultObj, null, 2)], {
        type: 'application/json',
    });

    let a = document.createElement('a');
    let url = URL.createObjectURL(blob);
    a.href = url;
    a.download = `newBoard.json`;
    a.click();
    URL.revokeObjectURL(url);

}

function clearBoard(event){

    document.getElementById("board-bg-text").innerText = "";

    document.getElementById("input-json").value = null;
    document.getElementById("new-board-btn").style.display = "inline-block";
    document.getElementById("input-file-btn").style.display = "inline-block";
    document.getElementById("clear-board-btn").style.display = "none";
    document.getElementById("save-btn").style.display = "none";
    document.getElementById("new-ticket").style.display = "none";
    doneBoard.innerHTML = "";
    doingBoard.innerHTML = "";
    nowData = {};
    jsonData = null;
}

function dragStartHandler(event){
    event.target.classList.add("selected");
    event.dataTransfer.setData("text", event.target.id);
    done.classList.add("dragstart-done");
    doing.classList.add("dragstart-doing");
}

function dragStopHandler(event){
    event.target.classList.remove("selected");
    done.classList.remove("dragstart-done");
    doing.classList.remove("dragstart-doing");
}

function dropHandler(event){
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    if (event.target.id === "done" || event.target.id === "doing"){
        event.target.appendChild(document.getElementById(data));
        event.target.classList.remove("on-dragover");
        
        nowData[data].status = event.target.id;
    }
}

function dragenterHandler(event){
    event.preventDefault();
    event.target.classList.add("on-dragover");
}

function dragoverHandler(event){
    event.preventDefault();
    if (event.target.id === "done" || event.target.id === "doing"){
        event.target.classList.add("on-dragover");
    }
}

function dragleaveHandler(event){
    event.preventDefault();
    event.target.classList.remove("on-dragover");
}

function addTicket(data, container, id){
    let div = document.createElement("div");
    div.className = "ticket";
    div.draggable = "true";
    div.id = id;
    div.innerHTML = `<span>${data.title}</span>${data.description}`
    div.ondragstart = (event) => dragStartHandler(event);
    div.ondragend = (event) => dragStopHandler(event);
    div.ondblclick = (event) => dbHandler(event);
    container.appendChild(div);
}

function newTicket(){
    nowData[id.toString()] = {
        "status" : "doing",
        "title" : "new ticket",
        "description" : "..."
    }
    addTicket(nowData[id.toString()], doing, id.toString());
    id+=1;
}

function displayTickets(){
    if (jsonData !== null) {
        for (const key in nowData){
            if (nowData[key].status === "done"){
                addTicket(nowData[key], done, key);
            }
            else{
                addTicket(nowData[key], doing, key);
            }
        }
    }
}

function changeTicket(id, newTitle, newDescription){
    let nowTicket = document.getElementById(id);
    nowData[id].title = newTitle;
    nowData[id].description = newDescription;
    nowTicket.innerHTML = `<span>${newTitle}</span>${newDescription}`
    nowTicket.draggable = true;
    nowTicket.style.display = "flex";
}

function deleteTicket(id){
    delete nowData[id];
    document.getElementById(id).outerHTML = '';
}

function dbHandler(event){
    const nowTicketId = event.currentTarget.id;
    
    let titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "titleInput";
    titleInput.name = "titleInput";
    titleInput.placeholder = "Title";
    titleInput.value = nowData[nowTicketId].title;

    let descriptionInput = document.createElement("input");
    descriptionInput.type = "text";
    descriptionInput.id = "descriptionInput";
    descriptionInput.name = "descriptionInput";
    descriptionInput.placeholder = "Description";
    descriptionInput.value = nowData[nowTicketId].description;

    submit = document.createElement("button");
    submit.innerText = "submit";
    submit.onclick = (event) => {
        changeTicket(
            nowTicketId, 
            titleInput.value, 
            descriptionInput.value);
    };

    let delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    delBtn.onclick = (event) => {
        deleteTicket(nowTicketId);
    }

    event.currentTarget.draggable = false;
    event.currentTarget.innerHTML = "";
    event.currentTarget.style.display = "grid";
    event.currentTarget.appendChild(titleInput);
    event.currentTarget.appendChild(descriptionInput);
    event.currentTarget.appendChild(submit);
    event.currentTarget.appendChild(delBtn);
}

function onInputBtnClick(event){
    document.getElementById("input-json").click();
}

done.ondrop = (event) => dropHandler(event);
done.ondragover = (event) => dragoverHandler(event);
done.ondragleave = (event) => dragleaveHandler(event);

doing.ondrop = (event) => dropHandler(event);
doing.ondragover = (event) => dragoverHandler(event);
doing.ondragleave = (event) => dragleaveHandler(event);

document.getElementById("input-json").onchange = inputHandler;

document.getElementById("new-board-btn").onclick = newBoard;

document.getElementById("clear-board-btn").onclick = clearBoard;

document.getElementById("save-btn").onclick = saveBoard;

document.getElementById("new-ticket").onclick = newTicket;

document.getElementById("input-file-btn").onclick = onInputBtnClick;