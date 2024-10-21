/**
 * @author Victor Zegarra
 * @date 20/10/2024
 */

GAME_WIDTH  = 640;
GAME_HEIGHT = 360;

GAME_WIDTH_HALF  = GAME_WIDTH  >> 1;
GAME_HEIGHT_HALF = GAME_HEIGHT >> 1;

document.addEventListener("DOMContentLoaded", () => {
    // player_dies = new Audio('assets/sfx/player_dies.mp3');
    // player_dies.volume = 0.1;
    bg_music = new Audio('assets/sfx/monkeys.mp3');
    bg_music.loop   = true;
    bg_music.volume = 0.1;

    game = createGame(null, GAME_WIDTH,GAME_HEIGHT, false);
    game.addStage('splash',splash_stage);
    game.addStage('game',game_stage);
    game.startStage('splash');
});