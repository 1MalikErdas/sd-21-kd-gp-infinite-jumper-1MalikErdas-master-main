import Phaser from 'phaser';
import bgLayer from '../assets/Background/bg_layer1.png';
import platform from '../assets/Environment/ground_grass.png';
import character from '../assets/Players/bunny1_ready.png';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;

  preload() {
    this.load.image('background', bgLayer);
    this.load.image('ground_grass', platform);

    this.load.image('bunny1_ready.png', character);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    this.platforms;

    this.add.image(240, 320, 'background');

    this.platforms = this.physics.add.staticGroup();

    for (let i = 0; i < 5; ++i) {
      const x = Phaser.Math.Between(80, 400);
      const y = 150 * i;

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const ground_grass = this.platforms.create(x, y, 'ground_grass');
      ground_grass.scale = 0.5;

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = ground_grass.body;
      body.updateFromGameObject();
    }

    this.player = this.physics.add
      .sprite(240, 320, 'bunny1_ready.png')
      .setScale(0.5);

    this.physics.add.collider(this.platforms, this.player);

    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;

    this.cameras.main.startFollow(this.player);

    this.cameras.main.setDeadzone(this.scale.width * 1.5);
  }

  update(t, dt) {
    const touchingDown = this.player.body.touching.down;

    if (touchingDown) {
      this.player.setVelocityY(-300);
    }
    this.platforms.children.iterate(child => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const ground_grass = child;

      const scrollY = this.cameras.main.scrollY;
      if (ground_grass.y >= scrollY + 700) {
        ground_grass.y = scrollY - Phaser.Math.Between(50, 100);
        ground_grass.body.updateFromGameObject();
      }

      if (touchingDown) {
        this.player.setVelocityY(-300);
      }

      if (this.cursors.left.isDown && !touchingDown) {
        this.player.setVelocityX(-200);
      } else if (this.cursors.right.isDown && !touchingDown) {
        this.player.setVelocityX(200);
      } else {
        this.player.setVelocityX(0);
      }

      this.horizantalWrap(this.player);
    });
  }

  /**
   * @param {Phaser.GameObjects.Sprite} sprite
   */
  horizantalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5;
    const gameWidth = this.scale.width;
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth = halfWidth;
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
    }
  }
  
}
