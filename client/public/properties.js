import { ctx } from "./game.js";

export const gunProperties =
{
    "Canon": { price: 50, distMax: 100, fillStyle: "#556ee6", speed: 10, width: 20, damages: "None", lockRot: false },
    "Sniper": { price: 350, distMax: 250, fillStyle: "#fca909", speed: 20, width: 20, damages: "Explosion", lockRot: false, damageRadius: 100 },
    "Laser": { price: 400, distMax: 100, fillStyle: "#7f8c8d", speed: 20, width: 20, damages: "None", lockRot: false },
    "Slower": { price: 15, distMax: 100, fillStyle: "#7f8c8d", speed: 20, width: 20, damages: "None", lockRot: true },
};

gunProperties["Canon"].img = new Image();
gunProperties["Canon"].img.src = "client/public/img/Canon.png";
let ratio = gunProperties["Canon"].img.width / gunProperties["Canon"].img.height;
gunProperties["Canon"].height = gunProperties["Canon"].width / ratio;

gunProperties["Sniper"].img = new Image();
gunProperties["Sniper"].img.src = "client/public/img/Sniper.png";
ratio = gunProperties["Sniper"].img.width / gunProperties["Sniper"].img.height;
gunProperties["Sniper"].height = gunProperties["Sniper"].width / ratio;

gunProperties["Laser"].img = new Image();
gunProperties["Laser"].img.src = "client/public/img/Laser.png";
ratio = gunProperties["Laser"].img.width / gunProperties["Laser"].img.height;
gunProperties["Laser"].height = gunProperties["Laser"].width / ratio;

gunProperties["Slower"].img = new Image();
gunProperties["Slower"].img.src = "client/public/img/Slower.png";
ratio = gunProperties["Slower"].img.width / gunProperties["Slower"].img.height;
gunProperties["Slower"].height = gunProperties["Slower"].width / ratio;