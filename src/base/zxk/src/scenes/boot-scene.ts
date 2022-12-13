export class BootScene extends Phaser.Scene {
  private loadingBar: Phaser.GameObjects.Graphics;
  private progressBar: Phaser.GameObjects.Graphics;

  constructor() {
    super({
      key: 'BootScene'
    });
  }

  preload(): void {
    // set the background, create the loading and progress bar
    this.cameras.main.setBackgroundColor(0x000000);
    this.createLoadingGraphics();

    // pass value to change the loading bar fill
    this.load.on(
      'progress',
      function (value: number) {
        this.progressBar.clear();
        this.progressBar.fillStyle(0x88e453, 1);
        this.progressBar.fillRect(
          this.cameras.main.width / 4,
          this.cameras.main.height / 2 - 16,
          (this.cameras.main.width / 2) * value,
          16
        );
      },
      this
    );

    // delete bar graphics, when loading complete
    this.load.on(
      'complete',
      function () {
        this.progressBar.destroy();
        this.loadingBar.destroy();
      },
      this
    );

    
    // load our package
    this.load.pack('preload', './assets/pack.json', 'preload');
    this.load.image("tiles", "./assets/tiles/tiles.png");

    // load zxk menu assets
    this.load.image('bgimg', './assets/menu/background.png');
    this.load.image('logo', './assets/menu/logo_alpha.png');
    // load zxk map and spirites
    this.load.image("tileset", "./assets/tilesets/map-tileset.png");
    this.load.tilemapTiledJSON("zxkmap", "../assets/tilemaps/map3.json");
    this.load.atlas("atlas","./assets/atlas/agv.png" , "../assets/atlas/agv.json");
  }

  update(): void {
    this.scene.start('MenuScene');
  }

  private createLoadingGraphics(): void {
    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0xffffff, 1);
    this.loadingBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.progressBar = this.add.graphics();
  }
}
