const dataName = "alien_abduction_2d"
const popUpText = document.querySelector("#pop-up")
const body = document.body

class Player{
    constructor(){
        this.posX = 0
        this.posY = 0
        this.inventory = []
        this.horizontalInput = 0
        this.verticalInput = 0
        this.speed = 300
        
    }
}

let player = new Player()
let playerCharacter = document.querySelector("#player")

function addItemToInventory(itemName){
    player.inventory.push(itemName)
}

function removeItemFromInventory(itemName){
    let itemIndex = player.inventory.indexOf(itemName)

    player.inventory.splice(itemIndex, 1)
}

async function popUp(messageText, messageDurationSeconds, messageColor) {
    popUpText.innerText = messageText
    popUpText.style.color = messageColor

    await wait(messageDurationSeconds)

    popUpText.innerText = ""
}

async function wait(waitTimeSeconds) {
    return new Promise((resolve) => setTimeout(resolve, waitTimeSeconds*1000))
}

function saveData(){
    let dataObject = {
        inventoryItems: player.inventory
    }

    localStorage.setItem(dataName, JSON.stringify(dataObject))
}

function loadData(){
    let stringData = localStorage.getItem(dataName)
    let dataObject = JSON.parse(stringData)

    player.inventory = dataObject.inventory
}

function keyDownEvent(e){
    if (e.key == "w"){
        player.verticalInput = -1
    }
    if (e.key == "s"){
        player.verticalInput = 1
    }
    
    if (e.key == "a"){
        player.horizontalInput = -1
    }
    if (e.key == "d"){
        player.horizontalInput = 1
    }
}

function keyUpEvent(e){
    if (e.key == "w"){
        player.verticalInput = 0
    }
    if (e.key == "s"){
        player.verticalInput = 0
    }
    
    if (e.key == "a"){
        player.horizontalInput = 0
    }
    if (e.key == "d"){
        player.horizontalInput = 0
    }
}

function getNumberFromPixelString(pixelString){
    let number = Number(pixelString.slice(0, pixelString.length -2))

    if (!number) number = 0

    return number
}

function onFrame(deltaTime){
    const horizontalMove = player.horizontalInput * player.speed * deltaTime
    const verticalMove = player.verticalInput * player.speed * deltaTime

    let playerCharacterStyle = window.getComputedStyle(playerCharacter)

    playerCharacter.style.left = (getNumberFromPixelString(playerCharacterStyle.left) + horizontalMove) + "px"
    playerCharacter.style.top = (getNumberFromPixelString(playerCharacterStyle.top) + verticalMove) + "px"
}

let updateTime = 0
function update(time){
    const deltaTime = (time - updateTime) / 1000
    updateTime = time
    
    onFrame(deltaTime)

    requestAnimationFrame(update)
}
body.addEventListener("keydown", keyDownEvent)
body.addEventListener("keyup", keyUpEvent)
requestAnimationFrame(update)