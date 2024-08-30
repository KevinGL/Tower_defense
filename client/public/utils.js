import { sizeObstacles, sizeTower, deleteLastGun, grill, obstacles, InitGrill, width, height, ennemies, tower, ennemyTowers } from "./game.js";
import { resetTsModal } from "./gameLogic.js";

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

export const indexOfObstacles = (col, row) =>
{
    for(let i = 0 ; i < obstacles.length ; i++)
    {
        if(obstacles[i].col == col && obstacles[i].row == row)
        {
            return i;
        }
    }

    return -1;
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

    //console.log(grill);

    /*const start1 = convertColRow(ennemyTowers[0].x + sizeTower / 2, ennemyTowers[0].y + sizeTower / 2);
    const start2 = convertColRow(ennemyTowers[1].x + sizeTower / 2, ennemyTowers[1].y + sizeTower / 2);
    const goal = convertColRow(tower.x + sizeTower / 2, tower.y + sizeTower / 2);
    
    const path1 = a_star(grill, start1, goal);
    const path2 = a_star(grill, start2, goal);*/

    const nbEnnemies = 100;
    let offset = 0;

    for (let i = 0 ; i < nbEnnemies ; i += 2)
    {
        /*ennemies.push({ x: ennemyTowers[0].x + sizeTower / 2, y: ennemyTowers[0].y + sizeTower / 2, offset, path: path1, pathNode: 0, hp: 10, damage: 4 });
        ennemies.push({ x: ennemyTowers[1].x + sizeTower / 2, y: ennemyTowers[1].y + sizeTower / 2, offset, path: path2, pathNode: 0, hp: 10, damage: 4 });*/

        ennemies.push({ x: ennemyTowers[0].x + sizeTower / 2, y: ennemyTowers[0].y + sizeTower / 2, offset, path: [], pathNode: 0, hp: 10, damage: 4 });
        ennemies.push({ x: ennemyTowers[1].x + sizeTower / 2, y: ennemyTowers[1].y + sizeTower / 2, offset, path: [], pathNode: 0, hp: 10, damage: 4 });

        offset += 300;
    }

    //createPaths(ennemies);

    /////////////////////////////////////////////////////////////

    row = 0;
    col = 0;
    
    for(let y = 0 ; y < height ; y += 1.1 * sizeObstacles)
    {
        col = 0;
        
        for(let x = 0 ; x < width ; x += 1.1 * sizeObstacles)
        {
            if(Math.random() < 0.1 && x != tower.x && y != tower.y)
            {
                obstacles.push({ x, y, col, row, active: true });
            }

            col++;
        }

        row++;
    }

    InitGrill();
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

export const createPaths = (ennemies) =>
{
    /*const posTower = convertColRow(tower.x, tower.y);
    
    for(let i = 0 ; i < ennemies.length ; i++)
    {
        ennemies[i].path.length = 0;
        let j = 0;
        let pos = null;

        if(i % 2 == 0)
        {
            pos = convertColRow(ennemyTowers[0].x, ennemyTowers[0].y);
        }

        else
        {
            pos = convertColRow(ennemyTowers[1].x, ennemyTowers[1].y);
            pos.col--;
        }
        
        while(true)
        {
            j++;

            if(pos.col == posTower.col && pos.row == posTower.row)
            //if(j == 100)
            {
                break;
            }
            
            if(pos.col != posTower.col)
            {
                if(pos.col > posTower.col)
                {
                    pos.col--;
                }
    
                else
                if(pos.col < posTower.col)
                {
                    pos.col++;
                }
            }
    
            else
            {
                if(pos.row < posTower.row)
                {
                    pos.row++;
                }
    
                else
                if(pos.row > posTower.row)
                {
                    pos.row--;
                }
            }

            ennemies[i].path.push({ ...pos });
        }
    }*/

    const start1 = convertColRow(ennemyTowers[0].x, ennemyTowers[0].y);
    const end = convertColRow(tower.x, tower.y);

    let path1 = [{ ...start1 }];

    let current = { ...start1 };

    let visited = new Set();
    visited.add(`${current.col},${current.row}`);
    
    let j = 0;

    while(true)
    {
        const neighbors =
        [
            { col: current.col + 1, row: current.row },
            { col: current.col - 1, row: current.row },
            { col: current.col, row: current.row + 1 },
            { col: current.col, row: current.row - 1 }
        ];

        let costs = [];

        neighbors.forEach((n, i) =>
        {
            // Vérifier si le voisin est dans la grille et n'est pas un obstacle
            if (n.row >= 0 && n.row < grill.length && n.col >= 0 && n.col < grill[0].length && grill[n.row][n.col] == 0)
            {
                if (!visited.has(`${n.col},${n.row}`))
                {
                    const g = path1.length; // Simplement la longueur du chemin parcouru pour représenter g
                    const h = Math.sqrt(Math.pow(end.col - n.col, 2) + Math.pow(end.row - n.row, 2));
                    const f = g + h;
                    costs.push({ cost: f, neighbor: n });
                }
            }
        });

        if (costs.length === 0)
        {
            for(let i = 0 ; i < neighbors.length ; i++)
            {
                const n = neighbors[i];
                
                if (n.row >= 0 && n.row < grill.length && n.col >= 0 && n.col < grill[0].length && grill[n.row][n.col] == 2)
                {
                    deleteLastGun();

                    document.getElementsByClassName("message")[0].style.display = "block";
                    document.getElementById("message").innerText = "You can't block ennemis !";
                    resetTsModal();

                    break;
                }
            }

            neighbors.forEach((n, i) =>
            {
                if (n.row >= 0 && n.row < grill.length && n.col >= 0 && n.col < grill[0].length && grill[n.row][n.col] == 0)
                {
                    if (!visited.has(`${n.col},${n.row}`))
                    {
                        const g = path1.length;
                        const h = Math.sqrt(Math.pow(end.col - n.col, 2) + Math.pow(end.row - n.row, 2));
                        const f = g + h;
                        costs.push({ cost: f, neighbor: n });
                    }
                }
            });
        }

        if (costs.length === 0)
        {
            // Si aucun voisin valide, casse la boucle
            //break;

            console.log("Chemin 1 bloqué, recherche d'un chemin déjà emprunté");

            neighbors.forEach((n, i) =>
            {
                if (n.row >= 0 && n.row < grill.length && n.col >= 0 && n.col < grill[0].length && grill[n.row][n.col] == 0)
                {
                    //if (!visited.has(`${n.col},${n.row}`))
                    {
                        const g = path1.length; // Simplement la longueur du chemin parcouru pour représenter g
                        const h = Math.sqrt(Math.pow(end.col - n.col, 2) + Math.pow(end.row - n.row, 2));
                        const f = g + h;
                        costs.push({ cost: f, neighbor: n });
                    }
                }
            });
        }

        let nextStep = costs.reduce((acc, curr) => (curr.cost < acc.cost ? curr : acc));

        current = nextStep.neighbor;
        visited.add(`${current.col},${current.row}`);
        path1.push(current);

        j++;

        //if(j == 10)
        if(current.col == end.col && current.row == end.row)
        {
            break;
        }
    }

    ///////////////////////////////////////////////////////////////////

    visited.clear();

    const start2 = convertColRow(ennemyTowers[1].x, ennemyTowers[1].y);

    current = { ...start2 };
    let path2 = [{ ...start2 }];

    while(true)
    {
        const neighbors =
        [
            { col: current.col + 1, row: current.row },
            { col: current.col - 1, row: current.row },
            { col: current.col, row: current.row + 1 },
            { col: current.col, row: current.row - 1 }
        ];

        let costs = [];

        neighbors.forEach((n, i) =>
        {
            // Vérifier si le voisin est dans la grille et n'est pas un obstacle
            if (n.row >= 0 && n.row < grill.length && n.col >= 0 && n.col < grill[0].length && grill[n.row][n.col] == 0)
            {
                if (!visited.has(`${n.col},${n.row}`))
                {
                    const g = path2.length; // Simplement la longueur du chemin parcouru pour représenter g
                    const h = Math.sqrt(Math.pow(end.col - n.col, 2) + Math.pow(end.row - n.row, 2));
                    const f = g + h;
                    costs.push({ cost: f, neighbor: n });
                }
            }
        });

        if (costs.length === 0)
        {
            for(let i = 0 ; i < neighbors.length ; i++)
            {
                const n = neighbors[i];
                
                if (n.row >= 0 && n.row < grill.length && n.col >= 0 && n.col < grill[0].length && grill[n.row][n.col] == 2)
                {
                    deleteLastGun();

                    document.getElementsByClassName("message")[0].style.display = "block";
                    document.getElementById("message").innerText = "You can't block ennemis !";
                    resetTsModal();

                    break;
                }
            }

            neighbors.forEach((n, i) =>
            {
                if (n.row >= 0 && n.row < grill.length && n.col >= 0 && n.col < grill[0].length && grill[n.row][n.col] == 0)
                {
                    if (!visited.has(`${n.col},${n.row}`))
                    {
                        const g = path2.length;
                        const h = Math.sqrt(Math.pow(end.col - n.col, 2) + Math.pow(end.row - n.row, 2));
                        const f = g + h;
                        costs.push({ cost: f, neighbor: n });
                    }
                }
            });
        }

        if (costs.length === 0)
        {
            // Si aucun voisin valide, casse la boucle
            //break;

            console.log("Chemin 2 bloqué, recherche d'un chemin déjà emprunté");

            neighbors.forEach((n, i) =>
            {
                if (n.row >= 0 && n.row < grill.length && n.col >= 0 && n.col < grill[0].length && grill[n.row][n.col] == 0)
                {
                    //if (!visited.has(`${n.col},${n.row}`))
                    {
                        const g = path2.length; // Simplement la longueur du chemin parcouru pour représenter g
                        const h = Math.sqrt(Math.pow(end.col - n.col, 2) + Math.pow(end.row - n.row, 2));
                        const f = g + h;
                        costs.push({ cost: f, neighbor: n });
                    }
                }
            });
        }

        let nextStep = costs.reduce((acc, curr) => (curr.cost < acc.cost ? curr : acc));

        current = nextStep.neighbor;
        visited.add(`${current.col},${current.row}`);
        path2.push(current);

        j++;

        //if(j == 10)
        if(current.col == end.col && current.row == end.row)
        {
            break;
        }
    }

    //console.log(path1);

    for(let i = 0 ; i < ennemies.length ; i += 2)
    {
        ennemies[i + 0].path = path1;
        ennemies[i + 1].path = path2;
    }
}

export const drawPolygon = (ctx, x, y, radius, n) =>
{
    ctx.save();
    ctx.translate(x, y);

    ctx.beginPath();

    ctx.moveTo(radius, 0);

    for(let angle = 0 ; angle < 2 * Math.PI ; angle += (2 * Math.PI / n))
    {
        const xPos = radius * Math.cos(angle);
        const yPos = radius * Math.sin(angle);
        ctx.lineTo(xPos, yPos);
    }

    ctx.closePath();

    ctx.fill();

    ctx.restore();
}