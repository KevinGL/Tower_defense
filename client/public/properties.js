import { ctx } from "./game.js";

export const gunProperties =
{
    "Canon": { price: 50, distMax: 100, fillStyle: "#556ee6", speed: 10, shape: "Circle", size: 10, focaliseOne: false, damages: "None" },
    "Bazooka": { price: 150, distMax: 200, fillStyle: "#fca909", speed: 20, shape: "Pentagon", size: 12, focaliseOne: false, damages: "Explosion" },
    "Laser": { price: 10, distMax: 100, fillStyle: "#7f8c8d", speed: 20, shape: "Texture", size: 20, focaliseOne: true, damages: "Explosion" },
};

gunProperties["Laser"].img = new Image();
gunProperties["Laser"].img.src = "client/public/img/Laser.png";