import Phaser from "phaser";
import Game from "./scene/game";

const config = ({
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 480,
  height: 640,
  scene: Game,
  physics: {
    default:'arcade',
    arcade: {
        gravity: {
          y: 200
        },
        debug:true
        }
        }
      });

const game = new Phaser.Game(config);

