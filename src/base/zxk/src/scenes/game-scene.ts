import { Player } from '../objects/player';
import { Enemy } from '../objects/enemy';
import { Agv } from '../objects/agv'
import { Obstacle } from '../objects/obstacles/obstacle';
import { Bullet } from '../objects/bullet';
import { FBDInputHandler } from '../interfaces/FBDInputHandler';
import { Body } from 'matter';

function getRand(max: number, min: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function pathManager(jsoncache: any, physics: Phaser.Physics.Arcade.ArcadePhysics = null, agvs: Phaser.GameObjects.Group = null, graphics: Phaser.GameObjects.Graphics = null) {
  // jsoncache保存的载入json是后台生成路径，直接生成path路径到dist文件
  // 此处解析文件，得到所有求出的路径
  let mapfs = jsoncache.json.get('pathData');
  let keys = Object.keys(mapfs);
  keys.forEach((val, idx, karr)=> { 
    let pts = mapfs[val];
    // find the nearest agv to the start point of the path
    let closest = physics.closest({ x: pts[0][0], y: pts[0][1] }, agvs.getChildren()) as Phaser.Physics.Arcade.Body;
    let path = new Phaser.Curves.Path(closest.x, closest.y);
    for (let iii = 1; iii < pts.length; iii++) {
      // let ind = getRand(0, pts.length);
      let cpt = pts[iii];
      path.lineTo(cpt[0], cpt[1]);
    }

    //对每条路径，计算总长度
    let arr = path.getCurveLengths();
    let sLen = 0;
    arr.forEach(function (val, idx, arr) { sLen += val; }, 0);

    let agv = closest as unknown as Agv;
    agv.setPath(path);
    path.getCurveLengths();
    agv.startFollow({
      positionOnPath: true,
      duration: sLen / agv.getSpeed(),
      yoyo: false,
      repeat: -1,
      rotateToPath: true,
      // verticalAdjust: true
    });

    // draw path line
    if (graphics) {
      graphics.lineStyle(6, 0x0000ff, 1);
      path.draw(graphics, 64);
    }
 
  }, 0);

  // return path;
  // return new Phaser.Curves.Path(obj.x, obj.y).circleTo(200);
}

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
  private agvs: Phaser.GameObjects.Group;
  private obstacles: Phaser.GameObjects.Group;

  private target: Phaser.Math.Vector2;

  private zxkmap: Phaser.Tilemaps.Tilemap;
  private gfx: Phaser.GameObjects.Graphics;
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
    // this.tileset = this.zxkmap.addTilesetImage("map3", "tileset");
    this.tileset = this.zxkmap.addTilesetImage("preview256x128", "tileset");
   
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

    this.agvs = this.add.group({
      /*classType: Agv*/
    });
    this.convertObjects();

    // collider layer and obstacles
    this.physics.add.collider(this.player, this.layer);
    this.physics.add.collider(this.player, this.obstacles);
    this.physics.add.collider(this.player, this.enemies);
    this.physics.add.collider(this.player, this.agvs);

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

    // draw path
    this.gfx = this.add.graphics();
    pathManager(this.cache, this.physics, this.agvs, this.gfx);


    // set viewpoint    
    this.cameras.main.startFollow(this.player);
    let cam = this.cameras.main;
    cam.setBounds(0, 0, this.zxkmap.widthInPixels, this.zxkmap.heightInPixels);
  }

  update(): void {
    this.player.update();
    // agvs redraw
    this.agvs.children.each((agv: Enemy) => {
      agv.update();
    }, this);


    // player as a detector
    let closest = this.physics.closest(this.player) as Phaser.Physics.Arcade.Body;
    // if(closest) {
    // this.gfx.clear()
    //     .lineStyle(2, 0xff3300)
    //     .lineBetween(closest.x, closest.y, this.player.x, this.player.y);
    // }

    // aim
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

    // map zoom
    if (this.inputHandler.isJustDown('zoomIn')) {
      // zoomIn
      let cam = this.cameras.main;
      cam.zoomTo(1, 500);
    }
    if (this.inputHandler.isJustDown('zoomOut')) {
      // zoomOut
      let cam = this.cameras.main;
      cam.zoomTo(0.2, 500);
    }
    if (this.inputHandler.isJustDown('exitToMenu')) {
      // backToMenu
      this.scene.start('MenuScene');
    }

    // draw path
    // this.drawPath(this.gfx);
  }
  /* instantialize objects in the map */
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
              texture: 'tankBlue',
              // texture: 'atlas',
              frame: 'agv/up/0001'
            });
          } else if (prop.name === 'type' && prop.value === 'camera') {
            let enemy = new Enemy({
              scene: this,
              x: object.x,
              y: object.y,
              texture: 'tankBlue'
            });
            this.enemies.add(enemy);
            // enemy.body.setFriction(1);
          } else if (prop.name === 'type' && prop.value === 'agv') {
            let agv = new Agv({
              scene: this,
              path: null,
              x: object.x,
              y: object.y,
              texture: 'atlas',
              frame: 'agv/right/0001',
              speed: 40
            });
            agv.setScale(.5);
            this.agvs.add(agv);
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
  /* draw scheduled path */
  // private drawPath(): void {
  //   let curve = pathManager();
  //   this.gfx.lineStyle(1, 0xffffff, 1);
  //   curve.draw(this.gfx, 64);
  // }

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

