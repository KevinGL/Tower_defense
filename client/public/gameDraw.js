import { drawRoundedRect, collide, normalize, getLength, dot, convertColRow, drawPolygon } from "./utils.js";
import { sizeObstacles, obstacles, tower, sizeTower, ennemyTowers, typeGun, ennemies, ts, ennemySpeed, guns, relifeTower, grill, reinitEnnemies, reinitGuns, InitGrill, reinitAttacks, width, height, level, updateLevel, nbParts, textureFire, setPause } from "./game.js";
import { gapHp, resetTsModal } from "./gameLogic.js";
import { gunProperties } from "./properties.js";

export let indexEnnemyNearest = -1;

const backgroundColor = '#1f2125';

let xMouse = 0;
let yMouse = 0;

export const drawBackground = (ctx, width, height) =>
{
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#24262a";

    for(let x = 1.1 * sizeTower ; x < width ; x += 1.1 * sizeTower)
    {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    for(let y = 1.1 * sizeTower ; y < height ; y += 1.1 * sizeTower)
    {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

export const drawObstacles = (ctx) =>
{
    obstacles.map((o) =>
    {
        if(o.active)
        {
            drawRoundedRect(ctx, o.x, o.y, sizeObstacles, sizeObstacles, 5, "#4a4a4e");
        }
    });
}

export const drawTower = (ctx) =>
{
    //console.log(tower);

    /*ctx.beginPath();
    ctx.arc(tower.x, tower.y, 5, 0, Math.PI * 2, true);
    ctx.fillStyle = "#00ff00";
    ctx.fill();*/

    drawRoundedRect(ctx, tower.x, tower.y, sizeTower, sizeTower, 5, "#27ae60");
}

export const drawEnnemies = (ctx) =>
{
    //console.log(ennemiesPaths);

    ennemyTowers.map((e) =>
    {
        drawRoundedRect(ctx, e.x, e.y, sizeTower, sizeTower, 5, "#c34667");
    });

    let nbEnnemiesFinished = 0;

    ennemies.map((e, i) =>
    {
        ctx.globalAlpha = e.hp / 10.0;
        
        ctx.beginPath();
        ctx.arc(e.x, e.y, 5, 0, Math.PI * 2, true);
        ctx.fillStyle = "#c34667";
        ctx.fill();

        if(Date.now() - ts >= e.offset && e.pathNode < e.path.length - 1)
        {
            let vecDisplace = { x: 0, y: 0 };
            let dist, distMax;

            if(e.path[e.pathNode + 1].col - e.path[e.pathNode].col > 0)
            {
                vecDisplace = { x: ennemySpeed, y: 0 };
                dist = Math.abs(e.x - (e.path[e.pathNode].col * 1.1 * sizeTower + 1.1 * sizeTower / 2));
                distMax = Math.abs((e.path[e.pathNode + 1].col - e.path[e.pathNode].col) * 1.1 * sizeTower);
            }

            else
            if(e.path[e.pathNode + 1].col - e.path[e.pathNode].col < 0)
            {
                vecDisplace = { x: -ennemySpeed, y: 0 };
                dist = Math.abs(e.x - (e.path[e.pathNode].col * 1.1 * sizeTower + 1.1 * sizeTower / 2));
                distMax = Math.abs((e.path[e.pathNode].col - e.path[e.pathNode + 1].col) * 1.1 * sizeTower);
            }

            else
            if(e.path[e.pathNode + 1].row - e.path[e.pathNode].row > 0)
            {
                vecDisplace = { x: 0, y: ennemySpeed };
                dist = Math.abs(e.y - (e.path[e.pathNode].row * 1.1 * sizeTower + 1.1 * sizeTower / 2));
                distMax = Math.abs((e.path[e.pathNode + 1].row - e.path[e.pathNode].row) * 1.1 * sizeTower);
            }

            else
            if(e.path[e.pathNode + 1].row - e.path[e.pathNode].row < 0)
            {
                vecDisplace = { x: 0, y: -ennemySpeed };
                dist = Math.abs(e.y - (e.path[e.pathNode].row * 1.1 * sizeTower + 1.1 * sizeTower / 2));
                distMax = Math.abs((e.path[e.pathNode].row - e.path[e.pathNode + 1].row) * 1.1 * sizeTower);
            }

            e.x += vecDisplace.x;
            e.y += vecDisplace.y;

            /*const startPoint = 
            {
                x: 1.1 * sizeTower / 2 + e.path[e.pathNode].col * 1.1 * sizeTower,
                y: 1.1 * sizeTower / 2 + e.path[e.pathNode].row * 1.1 * sizeTower
            };

            const endPoint = 
            {
                x: 1.1 * sizeTower / 2 + e.path[e.pathNode + 1].col * 1.1 * sizeTower,
                y: 1.1 * sizeTower / 2 + e.path[e.pathNode + 1].row * 1.1 * sizeTower
            };

            const distMax = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));
            const dist = Math.sqrt(Math.pow(e.x - startPoint.x, 2) + Math.pow(e.y - startPoint.y, 2));*/

            /*if(i == 0)
            {
                console.log(vecDisplace);
            }*/

            if(dist > distMax)
            {
                e.x = 1.1 * sizeTower / 2 + e.path[e.pathNode + 1].col * 1.1 * sizeTower;
                e.y = 1.1 * sizeTower / 2 + e.path[e.pathNode + 1].row * 1.1 * sizeTower;

                e.pathNode++;
            }
        }

        const posEnnemy = convertColRow(e.x, e.y);
        const posTower = convertColRow(tower.x, tower.y);

        if(posEnnemy.col == posTower.col && posEnnemy.row == posTower.row || e.hp == 0)
        {
            nbEnnemiesFinished++;
        }
    });

    if(nbEnnemiesFinished == ennemies.length)
    {
        reinitEnnemies();
        InitGrill();
        reinitAttacks();

        //clearGuns();
        reinitGuns();
        relifeTower();

        updateLevel();

        //console.log("REINIT ENNEMIES");
        document.getElementById("level").innerText = `Level : ${level}`;
    }

    ctx.globalAlpha = 1;
}

export const drawMessages = (ctx) =>
{
    /*const barrWidth = 150;
    const barrHeight = 20;
    const xBarr = 20;
    const yBarr = 20;

    ctx.fillStyle = "#c34667";

    ctx.beginPath();
    ctx.arc(xBarr + barrHeight / 2, yBarr + barrHeight / 2, barrHeight / 2, Math.PI / 2, (3 * Math.PI) / 2, false);
    ctx.arc(xBarr + barrHeight / 2 + barrWidth, yBarr + barrHeight / 2, barrHeight / 2, (3 * Math.PI) / 2, Math.PI / 2, false);
    ctx.closePath();

    ctx.fill();*/

    if(tower.hp > gapHp)
    {
        /*ctx.fillStyle = "#27ae60";

        ctx.beginPath();
        ctx.arc(xBarr + barrHeight / 2, yBarr + barrHeight / 2, barrHeight / 2, Math.PI / 2, (3 * Math.PI) / 2, false);
        ctx.arc(xBarr + barrHeight / 2 + (tower.hp / 10) * barrWidth, yBarr + barrHeight / 2, barrHeight / 2, (3 * Math.PI) / 2, Math.PI / 2, false);
        ctx.closePath();

        ctx.fill();*/

        document.getElementById("life").innerText = `Life : ${Math.floor((tower.hp / 10) * 100)} %`;
    }

    else
    {
        //alert("Game over");
        resetTsModal();
        setPause(true);
        document.getElementsByClassName("game_over")[0].style.display = "block";
        //location.reload();
    }

    //console.log(gunProperties[typeGun]);

    const posMouse = convertColRow(xMouse, yMouse);
    const posTower = convertColRow(tower.x, tower.y);
    const posEnnemy1 = convertColRow(ennemyTowers[0].x, ennemyTowers[0].y);
    const posEnnemy2 = convertColRow(ennemyTowers[1].x, ennemyTowers[1].y);

    if(typeGun != "" &&
        grill[posMouse.row][posMouse.col] == 0 &&
        (posMouse.col != posTower.col || posMouse.row != posTower.row) &&
        (posMouse.col != posEnnemy1.col || posMouse.row != posEnnemy1.row) &&
        (posMouse.col != posEnnemy2.col || posMouse.row != posEnnemy2.row))
    {
        ctx.fillStyle = gunProperties[typeGun].fillStyle;
        ctx.globalAlpha = 0.5;

        const xCase = Math.floor(xMouse / (1.1 * sizeTower)) * (1.1 * sizeTower);
        const yCase = Math.floor(yMouse / (1.1 * sizeTower)) * (1.1 * sizeTower);

        ctx.beginPath();
        ctx.arc(xCase + (sizeTower) / 2, yCase + (sizeTower) / 2, gunProperties[typeGun].distMax, 0, 2 * Math.PI, false);
        ctx.closePath();

        ctx.fill();

        //drawRoundedRect(ctx, xCase, yCase, sizeTower, sizeTower, 5, "#ffffff");

        ctx.fillStyle = gunProperties[typeGun].fillStyle;

        ctx.save();
        ctx.translate(xCase + (sizeTower) / 2, yCase + (sizeTower) / 2);

        if(typeGun == "Canon")
        {
            ctx.beginPath();
            ctx.arc(0, 0, 10, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fill();
        }
        
        else
        if(typeGun == "Bazooka")
        {
            drawPolygon(ctx, 0, 0, 12, 5);
        }

        ctx.rect(5, -4, 10, 8);
        ctx.fill();

        ctx.restore();
    }
}

document.addEventListener("mousemove", (e) =>
{
    xMouse = e.clientX;
    yMouse = e.clientY;
    //console.log(`Cursor coordinates relative to the viewport: X=${x}, Y=${y}`);
});


export const drawGuns = (ctx) =>
{
    const xTower = tower.x + sizeTower / 2;
    const yTower = tower.y + sizeTower / 2;
    
    guns.map((gun, i) =>
    {
        let vec = {x: 0, y: 0};

        if(gun.target != -1 && ennemies[gun.target])
        {
            vec = normalize({ x: ennemies[gun.target].x - gun.xAmmo, y: ennemies[gun.target].y - gun.yAmmo });

            gun.angle = Math.acos(dot({ x: 1, y: 0}, vec));

            if(vec.y < 0)
            {
                gun.angle *= -1;
            }
        }

        ctx.fillStyle = gunProperties[gun.typeGun].fillStyle;

        /*let speed;

        if(gun.typeGun == "Canon")
        {
            ctx.fillStyle = "#556ee6";
            speed = 10;
        }

        else
        if(gun.typeGun == "Bazooka")
        {
            ctx.fillStyle = "#fca909";
            speed = 20;
        }*/

        ctx.save();
        ctx.translate(gun.x, gun.y);
        ctx.rotate(gun.angle);

        if(gun.typeGun == "Canon")
        {
            ctx.beginPath();
            ctx.arc(0, 0, 10, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fill();
        }

        else
        if(gun.typeGun == "Bazooka")
        {
            drawPolygon(ctx, 0, 0, 12, 5);
        }

        ctx.rect(5, -4, 10, 8);
        ctx.fill();

        ctx.restore();

        if(gun.target != -1)// && Math.abs(ennemies[gun.target].x - xTower) > sizeTower / 2 && Math.abs(ennemies[gun.target].y - yTower) > sizeTower / 2)
        {
            if(gun.typeGun == "Canon")
            {
                ctx.beginPath();
                ctx.arc(gun.xAmmo, gun.yAmmo, 7, 2 * Math.PI, false);
                ctx.closePath();

                ctx.fill();

                gun.xAmmo += gunProperties[gun.typeGun].speed * vec.x;
                gun.yAmmo += gunProperties[gun.typeGun].speed * vec.y;

                if(gun.xAmmo < 0 || gun.xAmmo > width || gun.yAmmo < 0 || gun.yAmmo > height)
                {
                    gun.xAmmo = gun.x;
                    gun.yAmmo = gun.y;
                }
            }

            else
            if(gun.typeGun == "Bazooka")
            {
                if(gun.xAmmo != gun.x && gun.yAmmo != gun.y)
                {
                    ctx.strokeStyle = "#fca909";
                
                    ctx.save();
                    ctx.translate(gun.xAmmo, gun.yAmmo);
                    ctx.rotate(gun.angle);

                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(20, 0);
                    ctx.stroke();

                    ctx.restore();
                }

                if(Date.now() - gun.ts > 2000)
                {
                    gun.xAmmo += gunProperties[gun.typeGun].speed * vec.x;
                    gun.yAmmo += gunProperties[gun.typeGun].speed * vec.y;

                    if(gun.xAmmo < 0 || gun.xAmmo > width || gun.yAmmo < 0 || gun.yAmmo > height)
                    {
                        gun.xAmmo = gun.x;
                        gun.yAmmo = gun.y;
                    }
                }
            }

            //console.log(ennemyNearest.x- gun.xAmmo);
        }

        ////////////////////////////////////////

        //ctx.fillStyle = "#ffff00";
        const partSize = 60;

        if(gun.typeGun == "Bazooka")
        {
            let addDisapparead = true;
            
            guns[i].parts.map((part, j) =>
            {
                if(part.x != 0 && part.y != 0)
                {
                    ctx.globalAlpha = Math.max(0, part.life);

                    ctx.drawImage(textureFire, part.x, part.y, partSize, partSize);
                    
                    /*ctx.rect(part.x - partSize / 2, part.y - partSize / 2, partSize, partSize);
                    ctx.fill();*/

                    /*ctx.beginPath();
                    ctx.arc(part.x, part.y, partSize, 2 * Math.PI, false);
                    ctx.closePath();
                    ctx.fill();*/

                    guns[i].parts[j].x += guns[i].parts[j].speed * guns[i].parts[j].dir.x;
                    guns[i].parts[j].y += guns[i].parts[j].speed * guns[i].parts[j].dir.y;
                    guns[i].parts[j].life -= 0.025;

                    if(guns[i].parts[j].life < 0)
                    {
                        guns[i].parts[j].life = 0;
                    }
                    else
                    {
                        addDisapparead = false;
                    }
                }
            });

            if(addDisapparead)
            {
                for(let j = 0 ; j < nbParts ; j++)
                {
                    guns[i].parts[j].x = 0;
                    guns[i].parts[j].y = 0;
                    guns[i].parts[j].life = 1;
                }
            }

            ctx.globalAlpha = 1;
        }

        ctx.fillStyle = "#ffffff";
    });
}