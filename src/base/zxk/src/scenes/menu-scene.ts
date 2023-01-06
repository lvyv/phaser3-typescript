import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

export class MenuScene extends Phaser.Scene {
  private rexUI: RexUIPlugin;  // Declare scene property 'rexUI' as RexUIPlugin type
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
  preload(): void {
    this.load.scenePlugin({
      key: 'rexuiplugin',
      url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
      sceneKey: 'rexUI'
  });
  }
  create(): void {
    this.add.image(960, 540, 'bgimg');
    this.add.image(960, 270, 'logo');
    

    var style = { font: "bold 20px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

    //  The Text is positioned at 0, 100
    var text = this.add.text(820, 800, "按 's' 键，进入多智能体寻径仿真平台", style);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    var dialog = this.rexUI.add.dialog({
      x: 400,
      y: 300,
      width: 500,

      background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

      title: createLabel(this, 'Title').setDraggable(),

      toolbar: [
          createLabel(this, 'O'),
          createLabel(this, 'X')
      ],

      leftToolbar: [
          createLabel(this, 'A'),
          createLabel(this, 'B')
      ],  

      content: createLabel(this, 'Content'),

      description: createLabel(this, 'Description'),

      choices: [
          createLabel(this, 'Choice0'),
          createLabel(this, 'Choice1'),
          createLabel(this, 'Choice2')
      ],

      actions: [
          createLabel(this, 'Action0'),
          createLabel(this, 'Action1')
      ],

      space: {
          left: 20,
          right: 20,
          top: -20,
          bottom: -20,

          title: 25,
          titleLeft: 30,
          content: 25,
          description: 25,
          descriptionLeft: 20,
          descriptionRight: 20,
          choices: 25,

          toolbarItem: 5,
          choice: 15,
          action: 15,
      },

      expand: {
          title: false,
          // content: false,
          // description: false,
          // choices: false,
          // actions: true,
      },

      align: {
          title: 'center',
          // content: 'left',
          // description: 'left',
          // choices: 'left',
          actions: 'right', // 'center'|'left'|'right'
      },

      click: {
          mode: 'release'
      }
  })
  .setDraggable('background')   // Draggable-background
  .layout()
  // .drawBounds(this.add.graphics(), 0xff0000)
  .popUp(1000);

var tween = this.tweens.add({
  targets: dialog,
  scaleX: 1,
  scaleY: 1,
  ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
  duration: 1000,
  repeat: 0, // -1: infinity
  yoyo: false
});

this.print = this.add.text(0, 0, '');
dialog
  .on('button.click', function (button, groupName, index, pointer, event) {
      this.print.text += groupName + '-' + index + ': ' + button.text + '\n';
  }, this)
  .on('button.over', function (button, groupName, index, pointer, event) {
      button.getElement('background').setStrokeStyle(1, 0xffffff);
  })
  .on('button.out', function (button, groupName, index, pointer, event) {
      button.getElement('background').setStrokeStyle();
  });

        // resume GameScene
        this.input.once('pointerdown', function () {

          this.scene.resume('GameScene');

      }, this);

  }

  update(): void {
    if (this.startKey.isDown) {
      this.scene.start('GameScene');
    }
  }
}
