import { BootScene } from './scenes/boot-scene';
import { GameScene } from './scenes/game-scene';
import { MenuScene } from './scenes/menu-scene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'MAPF',
  url: 'https://github.com/lvyv/phaser3-typescript',
  version: '2.0',
  width: 1920,
  height: 1080,
  zoom: 1,
  type: Phaser.AUTO,
  parent: 'simulator',
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
  backgroundColor: '#000000',
  render: { pixelArt: false, antialias: true }
};
