import { sizeTower, ennemyTowers, addGun, obstacles, tower, guns, ennemies, ennemiesAttacked, addAttack, typeGun, nbParts, cash, addCash } from "./game.js";
import { convertColRow } from "./utils.js";

export const gapHp = 0.2;
const distMinGun = 800;

export let tsModal = 0;
export const resetTsModal = () =>
{
    tsModal = Date.now();
}

export const attacks = (tower, ennemies) =>
{
    ennemies.map((e, i) =>
    {
        const xTower = tower.x + sizeTower / 2;
        const yTower = tower.y + sizeTower / 2;
        const dist = Math.sqrt(Math.pow(e.x - xTower, 2) + Math.pow(e.y - yTower, 2));
        
        if(dist <= sizeTower / 2 && ennemiesAttacked.indexOf(i) == -1 && tower.hp >= gapHp && e.hp > 0)
        {
            tower.hp -= gapHp;
            addAttack(i);
        }
    });

    /*for(let i = ennemies.length - 1 ; i > -1 ; i--)
    {
        if(ennemies[i] && ennemies[i].hp <= 0)
        {
            ennemies = ennemies.slice(i);
            //console.log(`Défaite ennemi ${i}`);
            break;
        }
    }*/

    /////////////////////////////////////////////////////////////////////////////////

    const xTower = tower.x + sizeTower / 2;
    const yTower = tower.y + sizeTower / 2;

    const posTower = convertColRow(xTower, yTower);
    
    guns.map((gun, i) =>
    {
        //console.log(gun.target);
        
        if(gun.target == -1)
        {
            let distMin = 10000000000;
        
            ennemies.map((e, j) =>
            {
                const dist = Math.sqrt(Math.pow(gun.x - e.x, 2) + Math.pow(gun.y - e.y, 2));

                const posEnnemy = convertColRow(e.x, e.y);
                const posGun = convertColRow(gun.x, gun.y);
                
                if(dist < distMin &&
                    posEnnemy.col != posTower.col && posEnnemy.row != posTower.row &&
                    posEnnemy.col != ennemyTowers[0].col && posEnnemy.row != ennemyTowers[0].row &&
                    posEnnemy.col != ennemyTowers[1].col && posEnnemy.row != ennemyTowers[1].row &&
                    posGun.col != posEnnemy.col && posGun.row != posEnnemy.row && e.hp > 0)
                {
                    distMin = dist;
                    gun.target = j;
                }
            });
        }

        else
        {
            const posEnnemy = convertColRow(ennemies[gun.target].x, ennemies[gun.target].y);
            const posAmmo = convertColRow(gun.xAmmo, gun.yAmmo);

            if(posEnnemy.col == posAmmo.col && posEnnemy.row == posAmmo.row)
            {
                gun.xAmmo = gun.x;
                gun.yAmmo = gun.y;
                
                if(gun.typeGun == "Canon")
                {
                    ennemies[gun.target].hp -= ennemies[gun.target].damage;

                    if(ennemies[gun.target].hp <= 0)
                    {
                        ennemies[gun.target].hp = 0;
                        addCash(2);
                    }
                }

                else
                if(gun.typeGun == "Bazooka")
                {
                    //ennemies[gun.target].hp -= 4 * ennemies[gun.target].damage;

                    const posTarget = { x: ennemies[gun.target].x, y: ennemies[gun.target].y };

                    for(let j = 0 ; j < ennemies.length ; j++)
                    {
                        const dist = Math.sqrt(Math.pow(posTarget.x - ennemies[j].x, 2) + Math.pow(posTarget.y - ennemies[j].y, 2));

                        if(dist < 100)
                        {
                            ennemies[j].hp -= 4 * ennemies[j].damage;

                            if(ennemies[j].hp <= 0)
                            {
                                ennemies[j].hp = 0;
                                addCash(2);
                            }
                        }
                    }

                    for(let j = 0 ; j < nbParts ; j++)
                    {
                        guns[i].parts[j].x = posTarget.x;
                        guns[i].parts[j].y = posTarget.y;
                    }

                    guns[i].ts = Date.now();
                }
            }

            const posTower = convertColRow(xTower, yTower);
            const posTarget = convertColRow(ennemies[gun.target].x, ennemies[gun.target].y);
            
            //if(dist > distMinGun || ennemies[gun.target].hp <= 0)
            if(ennemies[gun.target].hp <= 0 || posTarget.col == posTower.col && posTarget.row == posTower.row)
            {
                guns[i].target = -1;
                //console.log(`Cible de canon ${i} devient nulle`);

                gun.xAmmo = gun.x;
                gun.yAmmo = gun.y;
            }
        }

        //console.log(gun.target);
        
        //console.log(`Gun ${i} ammo ${gun.xAmmo, gun.yAmmo}`);
    });
}

document.getElementById("gameCanvas").addEventListener("click", (e) =>
{
    const xCase = Math.floor(e.offsetX / (1.1 * sizeTower)) * (1.1 * sizeTower) + (1.1 * sizeTower / 2);
    const yCase = Math.floor(e.offsetY / (1.1 * sizeTower)) * (1.1 * sizeTower) + (1.1 * sizeTower / 2);
    let message = "";

    const posClick = convertColRow(e.offsetX, e.offsetY);
    //console.log(e.offsetX / width, (e.offsetX / width) * grill[0].length, Math.floor((e.offsetX / width) * grill[0].length));
    
    let forbidden = false;

    obstacles.map((o) =>
    {
        const posObstacle = convertColRow(o.x, o.y);

        //console.log(posObstacle, posClick);

        if(posClick.col == posObstacle.col && posClick.row == posObstacle.row)
        {
            forbidden = true;
            message = "You can't place gun on obstacle !";
        }
    });

    ennemyTowers.map((t) =>
    {
        const posTower = convertColRow(t.x, t.y);

        //console.log(posTower, posClick);

        if(posClick.col == posTower.col && posClick.row == posTower.row)
        {
            forbidden = true;
            message = "You can't place gun on tower !";
        }
    });

    /*ennemies.map((ennemy) =>
    {
        const posEnnemy = convertColRow(ennemy.x, ennemy.y);

        if(posClick.col == posEnnemy.col && posClick.row == posEnnemy.row)
        {
            forbidden = true;
            message = "You can't place gun on enemy !";
        }
    });*/

    if(Math.abs(tower.x - xCase) <= sizeTower + 10 && Math.abs(tower.y - yCase) <= sizeTower + 10)
    {
        forbidden = true;
        message = "You can't place gun on tower !";
    }

    if(typeGun == "")
    {
        forbidden = true;
        message = "Please choose a gun !";
    }
    
    let price;

    if(typeGun == "Canon")
    {
        price = 50;
    }

    else
    if(typeGun == "Bazooka")
    {
        price = 150;
    }

    if(cash - price < 0)
    {
        forbidden = true;
        message = "You don't have enough money !";
    }
    
    if(!forbidden)
    {
        let parts = [];
        
        for(let i = 0 ; i < nbParts ; i++)
        {
            const angle = Math.random() * 2 * Math.PI;
            let vec = { x: Math.cos(angle), y: Math.sin(angle) };
            const speed = 5 * Math.random();
            
            parts.push({ x: 0, y: 0, dir: vec, life: 1, speed });
        }
        
        addGun({ x: xCase, y: yCase, xAmmo: xCase, yAmmo: yCase, target: -1, angle: 0, typeGun, ts: Date.now(), parts });

        addCash(-price);
    }

    else
    {
        document.getElementsByClassName("message")[0].style.display = "block";
        document.getElementById("message").innerText = message;
        tsModal = Date.now();
    }
});