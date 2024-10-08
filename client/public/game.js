import { drawBackground, drawObstacles, drawTower, drawEnnemies, drawMessages, drawGuns } from "./gameDraw.js";
import { Init, convertColRow, a_star, createPaths } from "./utils.js";
import { attacks, tsModal } from "./gameLogic.js";

const canvas = document.getElementById("gameCanvas");
const canvasStyle = window.getComputedStyle(canvas);

export let width = parseInt(canvasStyle.width);
export let height = parseInt(canvasStyle.height);

export const ctx = canvas.getContext('2d');

export const minDelayLaser = 1000;
export const maxDelayLaser = 3000;

canvas.width = width;
canvas.height = height;

const aspectRatio = canvas.width / canvas.height;

export const textureFire = new Image();
textureFire.src = "client/public/img/Fire.png";

export const sizeObstacles = 35;
export const sizeTower = sizeObstacles;

export let obstacles = [];
export let tower = { hp: 10 };
export let ennemyTowers = [];
export let ennemies = [];
export let guns = [];

export let grill = [];
export const setGrill = (col, row, value) =>
{
    grill[row][col] = value;
}

export let typeGun = "";
export let cash = 200;
export let addCash = (value) =>
{
    cash += value;
    document.getElementById("cash").innerText = `${cash}`;
    document.getElementById("cash").style.color = "#2fcc71";
}

export let ennemiesAttacked = [];

export const addAttack = (value) =>
{
    ennemiesAttacked.push(value);
}

export const reinitAttacks = () =>
{
    ennemiesAttacked.length = 0;
}

export const addGun = (value) =>
{
    guns.push(value);

    const coord = convertColRow(value.x, value.y);

    grill[coord.row][coord.col] = 2;//1;
}

export const deleteLastGun = () =>
{
    const pos = { x: guns[guns.length - 1].x, y: guns[guns.length - 1].y };
    
    guns.pop();

    const coord = convertColRow(pos.x, pos.y);

    grill[coord.row][coord.col] = 0;
}

export const nbParts = 50;

export const relifeTower = () =>
{
    tower.hp = 10;
}

export const clearGuns = () =>
{
    guns.length = 0;
}

export const reinitGuns = () =>
{
    for(let i = 0 ; i < guns.length ; i++)
    {
        guns[i].target = -1;
    }
}

export const reinitEnnemies = () =>
{
    let offset = 0;
    
    for(let i = 0 ; i < ennemies.length ; i += 2)
    {
        ennemies[i + 0].x = ennemyTowers[0].x + sizeTower / 2;
        ennemies[i + 0].y = ennemyTowers[0].y + sizeTower / 2;

        ennemies[i + 1].x = ennemyTowers[1].x + sizeTower / 2;
        ennemies[i + 1].y = ennemyTowers[1].y + sizeTower / 2;

        ennemies[i + 0].hp = 10;
        ennemies[i + 1].hp = 10;

        ennemies[i + 0].pathNode = 0;
        ennemies[i + 1].pathNode = 0;

        ennemies[i + 0].offset = offset;
        ennemies[i + 1].offset = offset;
        
        ennemies[i + 0].damage = ennemies[i + 0].damage / 2;
        ennemies[i + 1].damage = ennemies[i + 1].damage / 2;

        offset += 300;
    }

    ts = Date.now();
}

export const InitGrill = () =>
{
    for(let y = 0 ; y < height ; y += 1.1 * sizeObstacles)
    {
        let line = [];
        
        for(let x = 0 ; x < width ; x += 1.1 * sizeObstacles)
        {
            const obs = obstacles.filter((o) => o.x == x && o.y == y);

            line.push(obs.length);
        }

        grill.push(line);
    }

    let line = [];

    for(let x = 0 ; x < width ; x += 1.1 * sizeObstacles)
    {
        line.push(1);
    }

    grill.push(line);
}

export let level = 1;

export const updateLevel = () =>
{
    level++;
}

export const ennemySpeed = 1;

export let indexThick = 0;

export let ts = Date.now();

const pauseDuration = 10;

let pause = false;
export const setPause = (value) =>
{
    pause = value;
}

Init(obstacles, tower, ennemyTowers, ennemies, grill);

function update()
{
    if(!pause)
    {
        //const canvas = document.getElementById('gameCanvas');
        const ratio = window.innerWidth / window.innerHeight;
        canvas.height = canvas.width / ratio;       //Responsive

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBackground(ctx, canvas.width, canvas.height);
        drawObstacles(ctx);
        drawEnnemies(ctx);
        drawTower(ctx);
        drawGuns(ctx);
        drawMessages(ctx);

        createPaths(ennemies);
        attacks(tower, ennemies);

        setTimeout(() => {
            requestAnimationFrame(update);
        }, pauseDuration);

        indexThick++;
    }

    //console.log(Date.now() - tsModal);
    if(Date.now() - tsModal > 5000)
    {
        document.getElementById("snackbar").style.opacity = "0";
    }
}

window.addEventListener('load', () => {
    requestAnimationFrame(update);
});

document.addEventListener('visibilitychange', function()
{
    if(document.visibilityState === 'visible')
    {
        pause = false;
    }
    else
    if(document.visibilityState === 'hidden')
    {
        pause = true;
    }
});

//////////////////////////////////////////////////////////////////////////////

document.getElementById("selectCanon").addEventListener("click", () =>
{
    if(typeGun == "")
    {
        typeGun = "Canon";

        /*document.getElementById("selectCanon").style.border = "solid";
        document.getElementById("selectCanon").style.borderWidth = "2px";
        document.getElementById("selectCanon").style.borderColor = "white";
        document.getElementById("selectCanon").style.borderRadius = "5px";

        document.getElementById("selectSniper").style.border = "none";
        document.getElementById("selectLaser").style.border = "none";*/

        document.getElementById("typeGun").innerText = "You have chosen the canon (Price : 50)";
    }

    else
    {
        typeGun = "";

        //document.getElementById("selectCanon").style.border = "none";
        document.getElementById("typeGun").innerText = "";
    }
});

document.getElementById("selectSniper").addEventListener("click", () =>
{
    if(typeGun == "")
    {
        typeGun = "Sniper";

        /*document.getElementById("selectSniper").style.border = "solid";
        document.getElementById("selectSniper").style.borderWidth = "2px";
        document.getElementById("selectSniper").style.borderColor = "white";
        document.getElementById("selectSniper").style.borderRadius = "5px";

        document.getElementById("selectCanon").style.border = "none";
        document.getElementById("selectLaser").style.border = "none";
        document.getElementById("selectSlower").style.border = "none";*/

        document.getElementById("typeGun").innerText = "You have chosen the sniper (Price : 350)";
    }

    else
    {
        typeGun = "";

        //document.getElementById("selectSniper").style.border = "none";
        document.getElementById("typeGun").innerText = "";
    }
});

document.getElementById("selectLaser").addEventListener("click", () =>
{
    if(typeGun == "")
    {
        typeGun = "Laser";

        /*document.getElementById("selectLaser").style.border = "solid";
        document.getElementById("selectLaser").style.borderWidth = "2px";
        document.getElementById("selectLaser").style.borderColor = "white";
        document.getElementById("selectLaser").style.borderRadius = "5px";

        document.getElementById("selectSniper").style.border = "none";
        document.getElementById("selectCanon").style.border = "none";
        document.getElementById("selectSlower").style.border = "none";*/

        document.getElementById("typeGun").innerText = "You have chosen the laser (Price : 400)";
    }

    else
    {
        typeGun = "";

        //document.getElementById("selectLaser").style.border = "none";
        document.getElementById("typeGun").innerText = "";
    }
});

document.getElementById("selectSlower").addEventListener("click", () =>
{
    if(typeGun == "")
    {
        typeGun = "Slower";

        /*document.getElementById("selectSlower").style.border = "solid";
        document.getElementById("selectSlower").style.borderWidth = "2px";
        document.getElementById("selectSlower").style.borderColor = "white";
        document.getElementById("selectSlower").style.borderRadius = "5px";

        document.getElementById("selectSniper").style.border = "none";
        document.getElementById("selectCanon").style.border = "none";
        document.getElementById("selectLaser").style.border = "none";*/

        document.getElementById("typeGun").innerText = "You have chosen the slower (Price : 150)";
    }

    else
    {
        typeGun = "";

        //document.getElementById("selectLaser").style.border = "none";
        document.getElementById("typeGun").innerText = "";
    }
});

document.getElementById("restart").onclick = () =>
{
    location.reload();
}

/*window.addEventListener("blur", function()
{
    pause = true;
});

window.addEventListener("focus", function()
{
    pause = false;
    update();
});*/