import { Player } from '../objects/player';
import { Enemy } from '../objects/enemy';
import { Obstacle } from '../objects/obstacles/obstacle';
import { Bullet } from '../objects/bullet';

export class GameScene extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private layer: Phaser.Tilemaps.TilemapLayer;

  private player: Player;
  private enemies: Phaser.GameObjects.Group;
  private obstacles: Phaser.GameObjects.Group;

  private target: Phaser.Math.Vector2;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  init(): void {}

  create(): void {
    var map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight:16 });
    var tileset = map.addTilesetImage('tiles', null);
    var layer = map.createLayer(0, tileset, 0, 0);
    var player = this.add.image(32,32, 'car').setOrigin(0,0).setScale(0.5);

  }

  update(): void {

  }


}
