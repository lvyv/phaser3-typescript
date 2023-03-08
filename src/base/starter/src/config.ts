import { BootScene } from './scenes/boot-scene';
import { GameScene } from './scenes/game-scene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: '前端可视化',
  url: 'https://github.com/lvyv/phaser3-typescript',
  version: '2.0',
  type: Phaser.AUTO,
  width: 832,
  height: 832,
  // zoom: 0.6,
  parent: 'container',
  pixelArt: true,
  backgroundColor: '#000000',
  scene: [BootScene, GameScene],
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
