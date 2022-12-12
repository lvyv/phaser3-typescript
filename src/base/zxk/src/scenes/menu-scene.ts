export class MenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key;
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];

  constructor() {
    super({
      key: 'MenuScene'
    });
  }

  init(): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    this.startKey.isDown = false;
  }

  create(): void {
    this.add.image(960, 540, 'bgimg');
    this.add.image(960, 270, 'logo');
    

    var style = { font: "bold 20px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

    //  The Text is positioned at 0, 100
    var text = this.add.text(820, 800, "按 's' 键，进入多智能体寻径仿真平台", style);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

    // this.bitmapTexts.push(
    //   this.add.bitmapText(
    //     this.sys.canvas.width / 2 - 120,
    //     this.sys.canvas.height / 2,
    //     'font',
    //     'PRESS S TO PLAY',
    //     30
    //   )
    // );

    // this.bitmapTexts.push(
    //   this.add.bitmapText(
    //     this.sys.canvas.width / 2 - 120,
    //     this.sys.canvas.height / 2 - 100,
    //     'font',
    //     'TANK',
    //     100
    //   )
    // );
  }

  update(): void {
    if (this.startKey.isDown) {
      this.scene.start('GameScene');
    }
  }
}
