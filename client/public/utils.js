import { sizeObstacles, sizeTower, ennemySpeed, grill, InitGrill, width, height } from "./game.js";

export function drawRoundedRect(ctx, x, y, width, height, radius, fillColor) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
}

export const getObstacleByPos = (x, y) =>
{
    obstacles.map((o) =>
    {
        if(Math.abs(x - o.x) <= sizeObstacles / 2 && Math.abs(y - o.y) <= sizeObstacles / 2)
        {
            return true;
        }
    });

    return false;
}

export const Init = (obstacles, tower, ennemyTowers, ennemies, grill) =>
{
    let towerOk = false;
    let row = 0, col = 0;
    const nbRows = Math.floor(height / (1.1 * sizeTower));
    const nbCols = Math.floor(width / (1.1 * sizeTower));
    
    for(let y = 0 ; y < height ; y += 1.1 * sizeObstacles)
    {
        col = 0;
        
        for(let x = 0 ; x < width ; x += 1.1 * sizeObstacles)
        {
            if(Math.abs(x - width / 2) <= 1.1 * sizeTower / 2 && Math.abs(y - height / 2) <= 1.1 * sizeTower / 2 && !towerOk)
            {
                tower.x = x;
                tower.y = y;

                towerOk = true;
            }

            else
            if(row == 2 && col == nbCols - 5 || row == nbRows - 2 && col == 5)
            {
                ennemyTowers.push({ x, y });
            }

            col++;
        }

        row++;
    }
    
    InitGrill();

    //console.log(grill);

    const start1 = convertColRow(ennemyTowers[0].x + sizeTower / 2, ennemyTowers[0].y + sizeTower / 2);
    /*{
        col: parseInt(((ennemyTowers[0].x + 1.1 * sizeTower / 2) / width) * grill[0].length) - 1,
        row: parseInt(((ennemyTowers[0].y + 1.1 * sizeTower / 2) / height) * grill.length)
    };*/
    const start2 = convertColRow(ennemyTowers[1].x + sizeTower / 2, ennemyTowers[1].y + sizeTower / 2);
    /*{
        col: parseInt(((ennemyTowers[1].x + 1.1 * sizeTower / 2) / width) * grill[0].length),
        row: parseInt(((ennemyTowers[1].y + 1.1 * sizeTower / 2) / height) * grill.length)
    };*/

    const goal = convertColRow(tower.x + sizeTower / 2, tower.y + sizeTower / 2);
    /*{
        col: parseInt((tower.x / width) * grill[0].length),
        row: parseInt((tower.y / height) * grill.length)
    };*/

    //console.log(start1, goal);
    const path1 = a_star(grill, start1, goal);
    const path2 = a_star(grill, start2, goal);

    const nbEnnemies = 100;
    let offset = 0;

    for (let i = 0 ; i < nbEnnemies ; i += 2)
    {
        ennemies.push({ x: ennemyTowers[0].x + sizeTower / 2, y: ennemyTowers[0].y + sizeTower / 2, offset, path: path1, pathNode: 0, hp: 10, damage: 4 });
        ennemies.push({ x: ennemyTowers[1].x + sizeTower / 2, y: ennemyTowers[1].y + sizeTower / 2, offset, path: path2, pathNode: 0, hp: 10, damage: 4 });

        offset += 300;
    }

    /////////////////////////////////////////////////////////////

    row = 0;
    col = 0;
    
    for(let y = 0 ; y < height ; y += 1.1 * sizeObstacles)
    {
        col = 0;
        
        for(let x = 0 ; x < width ; x += 1.1 * sizeObstacles)
        {
            if(Math.random() < 0.2)
            {
                const posObstacle = { col, row };

                /*console.log(posObstacle, path1.filter((p) => {return p.col == posObstacle.col && p.row == posObstacle.row}));
                console.log(posObstacle, path2.filter((p) => {return p.col == posObstacle.col && p.row == posObstacle.row}));*/

                if(path1.filter((p) => {return p.col == posObstacle.col && p.row == posObstacle.row}).length == 0 &&
                   path2.filter((p) => {return p.col == posObstacle.col && p.row == posObstacle.row}).length == 0)
                {
                    obstacles.push({ x, y });
                }

                /*path1.map((p) =>
                {
                    if(p.col != posObstacle.col && p.row != posObstacle.row)
                    {
                        console.log("!");
                    }
                });*/
            }

            col++;
        }

        row++;
    }
}

export const collide = (obstacles, pos) =>
{
    for(const o of obstacles)
    {
        if(Math.abs(pos.x - (o.x + sizeObstacles / 2)) <= sizeObstacles / 2 && Math.abs(pos.y - (o.y + sizeObstacles / 2)) <= sizeObstacles / 2)
        {
            return true;
        }
    }

    return false;
}

export const getLength = (vec) =>
{
    return Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));
}

export const normalize = (vec) =>
{
    const length = getLength(vec);

    if(length == 0)
    {
        console.error("Error : vector nul");
        return {x: 0, y: 0};
    }

    return { x: vec.x / length, y: vec.y / length };
}

export const a_star = (grill, start, goal) =>
{
    let pos = start;        //col, row
    //let path = [];
    let i = 0;
    //let paths = [];
    //let path = { cases: [], score: 0 };
    let path = [];
    
    while(true)
    {
        //console.log(pos);
        path.push({ ...pos });
        
        const pathH = Math.abs(goal.col - pos.col);
        const pathV = Math.abs(goal.row - pos.row);

        if(pathH >= pathV)
        {
            if(goal.col > pos.col)
            {
                /*if(grill[pos.row][pos.col + 1] == 0)
                {
                    console.log(`${pos.col}, ${pos.row} Déplacement droite ok`);
                    pos.col++;
                }

                else
                if(grill[pos.row - 1][pos.col] == 0 && goal.row <= pos.row)
                {
                    console.log(`${pos.col}, ${pos.row} Déplacement droite bloqué, vers le haut`);
                    pos.row--;
                }

                else
                if(grill[pos.row + 1][pos.col] == 0 && goal.row >= pos.row)
                {
                    console.log(`${pos.col}, ${pos.row} Déplacement droite bloqué, vers le bas`);
                    pos.row++;
                }*/

                pos.col++;
            }

            else
            if(goal.col < pos.col)
            {
                /*if(grill[pos.row][pos.col - 1] == 0)
                {
                    console.log(`${pos.col}, ${pos.row} Déplacement gauche ok`);
                    pos.col--;
                }

                else
                if(grill[pos.row - 1][pos.col] == 0 && goal.row <= pos.row)
                {
                    console.log(`${pos.col}, ${pos.row} Déplacement gauche bloqué, vers le haut`);
                    pos.row--;
                }

                else
                if(grill[pos.row + 1][pos.col] == 0 && goal.row >= pos.row)
                {
                    console.log(`${pos.col}, ${pos.row} Déplacement gauche bloqué, vers le bas`);
                    pos.row++;
                }*/

                pos.col--;
            }
        }

        else
        {
            if(goal.row > pos.row)
            {
                /*if(grill[pos.row + 1][pos.col] == 0)
                {
                    console.log(`${pos.col}, ${pos.row} Déplacement bas ok`);
                    pos.row++;
                }

                else
                if(grill[pos.row][pos.col + 1] == 0 && goal.col >= pos.col)
                {
                    console.log(`${pos.col}, ${pos.row} Déplacement bas bloqué, vers la droite`);
                    pos.col++;
                }

                else
                if(grill[pos.row][pos.col - 1] == 0 && goal.col <= pos.col)
                {
                    console.log(`${pos.col}, ${pos.row} Déplacement bas bloqué, vers la gauche`);
                    pos.col--;
                }*/

                pos.row++;
            }

            else
            if(goal.row < pos.row)
            {
                /*if(grill[pos.row - 1][pos.col] == 0)
                {
                    console.log(`${pos.col}, ${pos.row} Déplacement haut ok`);
                    pos.row--;
                }

                else
                if(grill[pos.row][pos.col + 1] == 0 && goal.col >= pos.col)
                {
                    console.log(`${pos.col}, ${pos.row} Déplacement haut bloqué, vers la droite`);
                    pos.col++;
                }

                else
                if(grill[pos.row][pos.col - 1] == 0 && goal.col <= pos.col)
                {
                    console.log(`${pos.col}, ${pos.row} Déplacement haut bloqué, vers la gauche`);
                    pos.col--;
                }*/

                pos.row--;
            }
        }

        i++;

        /*if(i == 1000)
        {
            console.log("Bloqué");
            break;
        }*/

        if(pos.col == goal.col && pos.row == goal.row)
        {
            //console.log("Cible atteinte");
            break;
        }
    }

    path.push({ ...pos });

    //console.log(path);

    return path;
}

export const dot = (vec1, vec2) =>
{
    return vec1.x * vec2.x + vec1.y * vec2.y;
}

export const convertColRow = (x, y) =>
{
    return { col: Math.floor((x / (1.1 * sizeTower))), row: Math.floor((y / (1.1 * sizeTower))) };
}