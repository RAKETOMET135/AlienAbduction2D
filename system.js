const body = document.body
const popUpText = document.querySelector("#pop-up")
const leftDoorText = document.querySelector("#left-door-text")
const rightDoorText = document.querySelector("#right-door-text")
const rooms = document.querySelector("#rooms")
const dataName = "alien_abduction_2d"
const images = "Images/"

class Player{
    constructor(){
        this.posX = 0
        this.posY = 0
        this.inventory = []
        this.horizontalInput = 0
        this.verticalInput = 0
        this.movement = 0
        this.direction = 1
        this.speed = 300
        this.walkLeft = ["MasterRun_0_left.png", "MasterRun_1_left.png", "MasterRun_2_left.png"]
        this.walkRight = ["MasterRun_0.png", "MasterRun_1.png", "MasterRun_2.png"]
        this.idleLeft = ["Me_0_left.png", "Me_1_left.png"]
        this.idleRight = ["Me_0.png", "Me_1.png"]
    }
}

let player = new Player()
let playerCharacter = document.querySelector("#player")
let currentRoom = 0

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
        player.direction = -1
    }
    if (e.key == "d"){
        player.horizontalInput = 1
        player.direction = 1
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

function createRoom(){
    let room = document.createElement("img")
    room.src = images + "Hallway.png"
    room.classList.add("room-default")
    rooms.append(room)

    room.style.left = "500px"
    
}

function limitVerticalMovement(number){
    if (number < 28) number = 28
    if (number > 645) number = 645

    return number
}

function limitHorizontalMovement(number){
    if (number < 330) number = 330
    if (number > 1520){
        number = 1520

        let playerCharacterStyle = window.getComputedStyle(playerCharacter)
        let verticalPosition = getNumberFromPixelString(playerCharacterStyle.top)

        if (verticalPosition > 220 && verticalPosition < 420){
            changeRoom()
        }
    } 

    return number
}

function changeRoom(){
    currentRoom++

    leftDoorText.innerText = currentRoom.toString()
    rightDoorText.innerText = (currentRoom + 1).toString()
}

let idleAnimationFrame = 0
let walkAnimationFrame = 0
function animatePlayer(deltaTime){
    if (walkAnimationFrame + 1 >= 15){
        walkAnimationFrame = 0
    }
    if (idleAnimationFrame + 1 >= 10){
        idleAnimationFrame = 0
    }

    if (player.movement == 0){
        if (player.direction == 1){
            playerCharacter.src = images + player.idleRight[Math.floor(idleAnimationFrame / 5)]
        }
        else{
            playerCharacter.src = images + player.idleLeft[Math.floor(idleAnimationFrame / 5)]
        }
    }
    else{
        if (player.direction == 1){
            playerCharacter.src = images + player.walkRight[Math.floor(walkAnimationFrame / 5)]
        }
        else{
            playerCharacter.src = images + player.walkLeft[Math.floor(walkAnimationFrame / 5)]
        }
    }

    walkAnimationFrame += deltaTime * 35
    idleAnimationFrame += deltaTime * 35
}

let lastRoom = 0
function movePlayer(deltaTime){
    const horizontalMove = player.horizontalInput * player.speed * deltaTime
    const verticalMove = player.verticalInput * player.speed * deltaTime

    let playerCharacterStyle = window.getComputedStyle(playerCharacter)

    playerCharacter.style.left = limitHorizontalMovement((getNumberFromPixelString(playerCharacterStyle.left) + horizontalMove)) + "px"
    playerCharacter.style.top = limitVerticalMovement((getNumberFromPixelString(playerCharacterStyle.top) + verticalMove)) + "px"

    if (lastRoom != currentRoom){
        lastRoom = currentRoom
        playerCharacter.style.left = "375px"
        playerCharacter.style.top = "400px"
    }

    player.movement = Math.abs(horizontalMove) + Math.abs(verticalMove)
}

function onFrame(deltaTime){
    movePlayer(deltaTime)
    animatePlayer(deltaTime)
}

function settup(){
    playerCharacter.style.left = "375px"
    playerCharacter.style.top = "400px"

    createRoom()
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
settup()
requestAnimationFrame(update)