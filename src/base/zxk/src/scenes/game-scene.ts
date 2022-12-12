import { Player } from '../objects/player';
import { Enemy } from '../objects/enemy';
import { Obstacle } from '../objects/obstacles/obstacle';
import { Bullet } from '../objects/bullet';
import { FBDInputHandler } from '../interfaces/FBDInputHandler'

/* keyboard input mapping */
const INPUT_KEYS_MAPPING = {
  'zoomIn': [
    Phaser.Input.Keyboard.KeyCodes.Z,
  ],
  'zoomOut': [
    Phaser.Input.Keyboard.KeyCodes.X,
  ],
  'exitToMenu': [
    Phaser.Input.Keyboard.KeyCodes.ESC,
  ],
}

export class GameScene extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private layer: Phaser.Tilemaps.TilemapLayer;

  private player: Player;
  private enemies: Phaser.GameObjects.Group;
  private obstacles: Phaser.GameObjects.Group;

  private target: Phaser.Math.Vector2;

  private zxkmap: Phaser.Tilemaps.Tilemap;
  // private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  // private controls: Phaser.Cameras.Controls.FixedKeyControl;
  // private showDebug: boolean;
  private inputHandler: FBDInputHandler;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  init(): void { }

  create(): void {
    this.zxkmap = this.make.tilemap({ key: 'zxkmap' });
    this.tileset = this.zxkmap.addTilesetImage("map-tileset", "tileset");
    const worldLayer = this.zxkmap.createLayer("World", this.tileset, 0, 0);
    worldLayer.setCollisionByProperty({ collides: true });
    this.inputHandler = new FBDInputHandler(this, INPUT_KEYS_MAPPING);

    this.obstacles = this.add.group({
      /*classType: Obstacle,*/
      runChildUpdate: true
    });

    this.enemies = this.add.group({
      /*classType: Enemy*/
    });
    this.convertObjects();

    // collider layer and obstacles
    this.physics.add.collider(this.player, this.layer);
    this.physics.add.collider(this.player, this.obstacles);

    // collider for bullets
    this.physics.add.collider(
      this.player.getBullets(),
      this.layer,
      this.bulletHitLayer,
      null,
      this
    );

    this.physics.add.collider(
      this.player.getBullets(),
      this.obstacles,
      this.bulletHitObstacles,
      null,
      this
    );

    this.enemies.children.each((enemy: Enemy) => {
      this.physics.add.overlap(
        this.player.getBullets(),
        enemy,
        this.playerBulletHitEnemy,
        null,
        this
      );
      this.physics.add.overlap(
        enemy.getBullets(),
        this.player,
        this.enemyBulletHitPlayer,
        null
      );

      this.physics.add.collider(
        enemy.getBullets(),
        this.obstacles,
        this.bulletHitObstacles,
        null
      );
      this.physics.add.collider(
        enemy.getBullets(),
        this.layer,
        this.bulletHitLayer,
        null
      );
    }, this);

    this.cameras.main.startFollow(this.player);
    let cam = this.cameras.main;
    cam.setBounds(0, 0, this.zxkmap.widthInPixels, this.zxkmap.heightInPixels);
  }

  update(): void {
    this.player.update();

    this.enemies.children.each((enemy: Enemy) => {
      enemy.update();
      if (this.player.active && enemy.active) {
        var angle = Phaser.Math.Angle.Between(
          enemy.body.x,
          enemy.body.y,
          this.player.body.x,
          this.player.body.y
        );

        enemy.getBarrel().angle =
          (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
      }
    }, this);

    
    if (this.inputHandler.isJustDown('zoomIn')) {
      // zoomIn
      let cam = this.cameras.main;
      cam.zoomTo(1, 500);
      
    }
    if (this.inputHandler.isJustDown('zoomOut')) {
      // do right code
      let cam = this.cameras.main;
      cam.zoomTo(0.3, 500);
    }
    if (this.inputHandler.isJustDown('exitToMenu')) {
      // do return code
      this.scene.start('MenuScene');
    }
  }

  private convertObjects(): void {
    // find the object layer in the tilemap named 'objects'
    const objects = this.zxkmap.getObjectLayer('objects').objects as any[];

    objects.forEach((object) => {
      let udfProps = object['properties']
      if (udfProps) {
        udfProps.forEach((prop: any) => {
          if (prop.name === 'type' && prop.value === 'player') {
            this.player = new Player({
              scene: this,
              x: object.x,
              y: object.y,
              texture: 'tankBlue'
            });
          } else if (prop.name === 'type' && prop.value === 'enemy') {
            let enemy = new Enemy({
              scene: this,
              x: object.x,
              y: object.y,
              texture: 'tankRed'
            });
            this.enemies.add(enemy);
          } else {
            let obstacle = new Obstacle({
              scene: this,
              x: object.x,
              y: object.y - 40,
              texture: object.type
            });

            this.obstacles.add(obstacle);
          }
        });
      }
    });
  }

  private bulletHitLayer(bullet: Bullet): void {
    bullet.destroy();
  }

  private bulletHitObstacles(bullet: Bullet, obstacle: Obstacle): void {
    bullet.destroy();
  }

  private enemyBulletHitPlayer(bullet: Bullet, player: Player): void {
    bullet.destroy();
    player.updateHealth();
  }

  private playerBulletHitEnemy(bullet: Bullet, enemy: Enemy): void {
    bullet.destroy();
    enemy.updateHealth();
  }

}

