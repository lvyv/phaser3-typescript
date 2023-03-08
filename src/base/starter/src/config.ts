import { BootScene } from './scenes/boot-scene';
import { GameScene } from './scenes/game-scene';
import { MenuScene } from './scenes/menu-scene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Tank',
  url: 'https://github.com/lvyv/phaser3-typescript',
  version: '2.0',
  type: Phaser.AUTO,
  width: 820,
  height: 820,
  // zoom: 0.6,
  parent: 'game',
  pixelArt: true,
  backgroundColor: '#000000',
  scene: [BootScene, MenuScene, GameScene],
  input: {
    keyboard: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  render: { pixelArt: false, antialias: true }
};
