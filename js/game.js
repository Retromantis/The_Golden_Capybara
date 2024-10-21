/**
 * @author Victor Zegarra
 * @date 19/10/2024
 */

game_stage = new KaiStage();

GAME_WIDTH_HALF  = GAME_WIDTH  >> 1;
GAME_HEIGHT_HALF = GAME_HEIGHT >> 1;

STATE_GET_READY     = 0;
STATE_PLAY_GAME     = 1;
STATE_PAUSE_GAME    = 2;
STATE_PLAYER_DEATH  = 3;
STATE_TRY_AGAIN     = 4;
STATE_LEVEL_CLEARED = 5;
STATE_GAME_OVER     = 6;

CLEAN_TILES_MAX = 64;
STAIN_TILES_MAX = 64;
TILE_WDT = 40;
TILE_HGT = 40;

BOARD_ROWS = 8;
BOARD_COLS = 8;
BOARD_X = 160;
BOARD_Y = 20;

PLAYER_WDT = 40;
PLAYER_HGT = 40;
PLAYER_MAXX = BOARD_COLS - 1;
PLAYER_MAXY = BOARD_ROWS - 1;

ENEMY_WDT = 40;
ENEMY_HGT = 40;
ENEMY_MAX = 8;
ENEMY_MAXX = BOARD_COLS - 1;
ENEMY_MAXY = BOARD_ROWS - 1;

PLANT_WDT = 40;
PLANT_HGT = 40;
PLANT_MAX = 8;

JUMP_UP = [
    [-8,-8],
    [-4,-8],
    [0,-8],
    [4,-8],
    [8,-8]
];

JUMP_DOWN = [
    [-8,8],
    [-4,8],
    [0,8],
    [4,8],
    [8,8]
];

JUMP_LEFT = [
    [-8,-8],
    [-8,-4],
    [-8,0],
    [-8,4],
    [-8,8]
];

JUMP_RIGHT = [
    [8,-8],
    [8,-4],
    [8,0],
    [8,4],
    [8,8]
];

JUMP_LEN = JUMP_RIGHT.length;

game_stage.preload = function() {
    this.addImage('bg','assets/game/bg.png');
    this.addImage('clean','assets/game/clean.png');
    this.addImage('stain','assets/game/stain.png');
    this.addImage('player','assets/game/player.png');
    this.addImage('snake','assets/game/snake.png');
    this.addImage('plant','assets/game/plant.png');
    this.addImage('get_ready', 'assets/game/get_ready.png');
    this.addImage('level_cleared', 'assets/game/level_cleared.png');
    this.addImage('try_again', 'assets/game/try_again.png');
    this.addImage('paused', 'assets/game/paused.png');

}

game_stage.create = function() {
    screen = 0;
    img_bg = new KaiImage(this.getImage('bg'));
    img_clean = new KaiImage(this.getImage('clean'));
    img_stain = new KaiImage(this.getImage('stain'));
    this.add(img_bg);

    level0 = {
        tiles:[
            [1,1,1,1,1,1,1,1],
            [1,1,2,1,1,1,1,1],
            [1,1,1,2,1,1,1,1],
            [1,1,1,1,2,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,2,2,2,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1]
        ],
        player_col:6,
        player_row:6,
        enemies:[
            [0,0,1],
            [3,3,1]
        ]
    };

    level1 = {
        tiles:[
            [1,1,1,1,1,1,1,1],
            [1,1,2,1,1,1,1,1],
            [1,1,1,2,1,1,1,1],
            [1,1,2,2,2,1,1,1],
            [2,1,1,1,1,2,1,1],
            [1,1,2,2,2,1,1,1],
            [1,2,1,1,1,1,2,1],
            [1,1,1,1,1,1,1,1]
        ],
        player_col:5,
        player_row:0,
        enemies:[
            [0,0,1],
            [0,5,1],
            [7,2,1]
        ]
    };

    level2 = {
        tiles:[
            [1,1,1,1,1,1,1,1],
            [1,1,2,1,1,2,1,1],
            [1,1,1,2,1,1,2,1],
            [1,1,2,2,2,1,1,1],
            [1,1,1,1,1,2,1,1],
            [1,1,2,2,2,1,1,1],
            [1,2,1,1,1,1,2,1],
            [1,1,1,1,1,1,1,1]
        ],
        player_col:7,
        player_row:7,
        enemies:[
            [0,0,1],
            [0,5,1],
            [7,2,2],
            [4,0,2],
            [0,4,2]
        ]
    };

    level3 = {
        tiles:[
            [1,1,1,1,1,1,1,1],
            [1,1,2,1,1,2,1,1],
            [1,1,1,2,1,1,2,1],
            [1,1,2,2,2,1,1,1],
            [1,1,1,1,1,2,1,1],
            [1,1,2,2,2,1,1,1],
            [1,2,1,1,1,1,2,1],
            [1,1,1,1,1,1,1,1]
        ],
        player_col:7,
        player_row:7,
        enemies:[
            [0,0,1],
            [0,5,1],
            [7,2,1],
            [4,0,2],
            [0,4,2],
            [3,7,2],
        ]
    };

    create_clean_tiles();
    create_stain_tiles();

    player = new KaiSprite(game_stage.getImage('player'), PLAYER_WDT,PLAYER_HGT);
    player.update = player_update;
    player.setAnimation(null,2,true);
    player.setCollider(7,11,21,25);
    this.add(player);

    create_snakes();
    create_plants();

    spr_get_ready = new KaiSprite(this.getImage('get_ready'), 200,44);
    spr_get_ready.centerX = true;
    spr_get_ready.centerY = true;
    spr_get_ready.position(GAME_WIDTH_HALF, GAME_HEIGHT_HALF);
    spr_get_ready.setAnimation([0,-1,0,-1,0,-1,0],3,false);
    spr_get_ready.update = function() {
        this.animate();
    }
    spr_get_ready.onEndAnimation = function(anim) {
        state = STATE_PLAY_GAME;
        bg_music.play();
        this.isVisible = false;
    }

    spr_try_again = new KaiSprite(this.getImage('try_again'),200,44);
    spr_try_again.centerX = true;
    spr_try_again.centerY = true;
    spr_try_again.position(GAME_WIDTH_HALF, GAME_HEIGHT_HALF);

    spr_level_cleared = new KaiSprite(this.getImage('level_cleared'),190,44);
    spr_level_cleared.centerX = true;
    spr_level_cleared.centerY = true;
    spr_level_cleared.position(GAME_WIDTH_HALF, GAME_HEIGHT_HALF);

    paused = new KaiImage(this.getImage('paused'));
    paused.centerX = true;
    paused.centerY = true;
    paused.position(GAME_WIDTH_HALF, GAME_HEIGHT_HALF);

    this.add(spr_get_ready);
    this.add(spr_try_again);
    this.add(spr_level_cleared);
    this.add(paused);

    board = null;
}

game_stage.start = function() {
    level_idx = 0;
    play_game();
}

play_game = function() {
    let level = null;
    switch(level_idx) {
        case 0:
            level = level0;
            break;
        case 1:
            level = level1;
            break;
        case 2:
            level = level2;
            break;
        case 3:
            level = level3;
            break;
        default:
            level = level0;
            break;
    }
    reset_board();
    fill_board(level);
    player_reset();

    state = STATE_GET_READY;

    spr_get_ready.setFrame(0,true);
    spr_get_ready.isVisible   = true;
    spr_level_cleared.isVisible = false;
    spr_try_again.isVisible   = false;
    paused.isVisible      = false;
}

pause_game = function() {
}

unpauseplay_game = function() {
}

game_stage.keyDown = function(event) {
    // game.startStage('level');
}

create_clean_tiles = function() {
    clean_tiles = new Array(CLEAN_TILES_MAX);
    for(var idx=0; idx < CLEAN_TILES_MAX; idx++) {
        clean_tiles[idx] = new KaiSprite(game_stage.getImage('clean'), TILE_WDT,TILE_HGT);
        clean_tiles[idx].isVisible = false;
        game_stage.add(clean_tiles[idx]);
    }
}

create_stain_tiles = function() {
    stain_tiles = new Array(STAIN_TILES_MAX);
    for(var idx=0; idx < STAIN_TILES_MAX; idx++) {
        stain_tiles[idx] = new KaiSprite(game_stage.getImage('stain'), TILE_WDT,TILE_HGT);
        stain_tiles[idx].isVisible = false;
        game_stage.add(stain_tiles[idx]);
    }
}

create_snakes = function() {
    enemies = new Array(ENEMY_MAX);
    for(var idx=0; idx < ENEMY_MAX; idx++) {
        enemies[idx] = new KaiSprite(game_stage.getImage('snake'), ENEMY_WDT,ENEMY_HGT);
        enemies[idx].isVisible = false;
        game_stage.add(enemies[idx]);
    }
}

create_plants = function() {
    plants = new Array(PLANT_MAX);
    for(var idx=0; idx < PLANT_MAX; idx++) {
        plants[idx] = new KaiSprite(game_stage.getImage('plant'), PLANT_WDT,PLANT_HGT);
        plants[idx].isVisible = false;
        game_stage.add(plants[idx]);
    }
}


next_object = function(list) {
    let obj = null;
    let size = list.length;
    for(var idx=0; idx < size; idx++) {
        obj = list[idx];
        if(obj.isVisible == false) break;
    }
    if(obj == null) obj = list[0];
    return obj;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

reset_board = function() {
    if(board) {
        tiles.fill(null);
        for(let i=0; i < CLEAN_TILES_MAX; i++) {
            clean_tiles[i].isVisible = false;
        }
        for(let i=0; i < STAIN_TILES_MAX; i++) {
            stain_tiles[i].isVisible = false;
        }
        for(let i=0; i < ENEMY_MAX; i++) {
            enemies[i].isVisible = false;
        }
        for(let i=0; i < PLANT_MAX; i++) {
            plants[i].isVisible = false;
        }
    }
}

fill_board = function(level) {
    board = level;
    board.cells = new Array(level.tiles.length);
    for (let i = 0; i < level.tiles.length; i++) {
        board.cells[i] = [].concat(level.tiles[i]);
    }
    stain_count = 0;
    tiles = Array(board.cells.length);
    for (let i = 0; i < tiles.length; i++) {
        tiles[i] = new Array(board.cells[0].length).fill(null);
    }

    for(var row=0; row < BOARD_ROWS; row++) {
        var y = row * TILE_HGT + BOARD_Y;
        for(var col=0; col < BOARD_COLS; col++) {
            var x = col * TILE_WDT + BOARD_X;
            var code = board.cells[row][col];
            if(code > 0) {
                var tile = null;
                if(code == 1) {
                    tile = next_object(clean_tiles);
                } else {
                    tile = next_object(stain_tiles);
                    stain_count++;
                }
                tile.position(x,y);
                tile.isVisible = true;
                tiles[row][col] = tile;
             }
        }
    }

    for (let i = 0; i < board.enemies.length; i++) {
        let type = board.enemies[i][2];
        let enemy = null;
        if(type == 1) {
            enemy = next_object(enemies);
            enemy.update = enemy_update;
        } else {
            enemy = next_object(plants);
            enemy.update = plant_update;
        }
        enemy.col = board.enemies[i][0];
        enemy.row = board.enemies[i][1];
        let x = enemy.col * TILE_WDT + BOARD_X;
        let y = enemy.row * TILE_HGT + BOARD_Y;
        enemy.setAnimation(null,2,true);
        enemy.setCollider(9,5,20,27);
        enemy.position(x,y);
        enemy.isVisible = true;
        enemy.isJump = false;
    }
}

enemy_up = function(enemy) {
    if(enemy.row > 0) {
        enemy_jump(enemy, DIR_UP);
    }
}

enemy_down = function(enemy) {
    if(enemy.row < ENEMY_MAXY) {
        enemy_jump(enemy, DIR_DOWN);
    }
}

enemy_left = function(enemy) {
    if(enemy.col > 0) {
        enemy_jump(enemy, DIR_LEFT);
    }
}

enemy_right = function(enemy) {
    if(enemy.col < ENEMY_MAXX) {
        enemy_jump(enemy, DIR_RIGHT);
    }
}

enemy_jump = function(enemy, dir) {
    enemy.dir = dir;
    enemy.isJump = true;
    enemy.jump_idx = 0;
    switch(dir) {
        case DIR_UP:
            enemy.jump_seq = JUMP_UP;
            break;
        case DIR_DOWN:
            enemy.jump_seq = JUMP_DOWN;
            break;
        case DIR_LEFT:
            enemy.jump_seq = JUMP_LEFT;
            break;
        case DIR_RIGHT:
            enemy.jump_seq = JUMP_RIGHT;
            break;
    }
}

enemy_update = function() {
    if(state == STATE_PLAY_GAME) {
        this.animate();
        if(this.isJump) {
            this.move(this.jump_seq[this.jump_idx][0],this.jump_seq[this.jump_idx][1]);
            this.jump_idx++;
            if(this.jump_idx == JUMP_LEN) {
                this.isJump = false;
                switch(this.dir) {
                    case DIR_UP:
                        this.row--;
                        break;
                    case DIR_DOWN:
                        this.row++;
                        break;
                    case DIR_LEFT:
                        this.col--;
                        break;
                    case DIR_RIGHT:
                        this.col++;
                        break;
                }
            }
        } else {
            if(this.collidesWith(player)) {
                try_again();
                return;
            }
            let dir = getRandomInt(4);
            switch(dir) {
                case 0:
                    enemy_up(this)
                    break;
                case 1:
                    enemy_down(this)
                    break;
                case 2:
                    enemy_left(this)
                    break;
                case 3:
                    enemy_right(this)
                    break;
            }
        }
    }
}

plant_update = function() {
    if(state == STATE_PLAY_GAME) {
        this.animate();
        if(this.collidesWith(player)) {
            try_again();
            return;
        }
    }
}

player_reset = function() {
    player.col = board.player_col;
    player.row = board.player_row;
    player.position(player.col * TILE_HGT + BOARD_X, player.row * TILE_WDT + BOARD_Y);
    player.isJump = false;
    player.jump_idx = 0;
}

player_up = function() {
    if(!player.isJump) {
        if(player.row > 0) {
            player_jump(DIR_UP);
        }
    }
}

player_down = function() {
    if(!player.isJump) {
        if(player.row < PLAYER_MAXY) {
            player_jump(DIR_DOWN);
        }
    }
}

player_left = function() {
    if(!player.isJump) {
        if(player.col > 0) {
            player_jump(DIR_LEFT);
        }
    }
}

player_right = function() {
    if(!player.isJump) {
        if(player.col < PLAYER_MAXX) {
            player_jump(DIR_RIGHT);
        }
    }
}

player_jump = function(dir) {
    player.dir = dir;
    player.isJump = true;
    player.jump_idx = 0;
    switch(dir) {
        case DIR_UP:
            player.jump_seq = JUMP_UP;
            break;
        case DIR_DOWN:
            player.jump_seq = JUMP_DOWN;
            break;
        case DIR_LEFT:
            player.jump_seq = JUMP_LEFT;
            break;
        case DIR_RIGHT:
            player.jump_seq = JUMP_RIGHT;
            break;
    }
}

player_update = function() {
    if(state == STATE_PLAY_GAME) {
        this.animate();
        if(this.isJump) {
            this.move(this.jump_seq[this.jump_idx][0],this.jump_seq[this.jump_idx][1]);
            this.jump_idx++;
            if(this.jump_idx == JUMP_LEN) {
                this.isJump = false;
                switch(this.dir) {
                    case DIR_UP:
                        this.row--;
                        break;
                    case DIR_DOWN:
                        this.row++;
                        break;
                    case DIR_LEFT:
                        this.col--;
                        break;
                    case DIR_RIGHT:
                        this.col++;
                        break;
                }
                let tile = tiles[this.row][this.col];
                if(board.cells[this.row][this.col] == 2) {
                    tile.isVisible = false;
                    tile = next_object(clean_tiles);
                    let x = this.col * TILE_WDT + BOARD_X;
                    let y = this.row * TILE_HGT + BOARD_Y;
                    tile.position(x,y);
                    tile.isVisible = true;
                    board.cells[this.row][this.col] = 1;
                    stain_count--;
                    if(stain_count <= 0) {
                        level_cleared()
                    }
                }
            }
        }
    }
}

level_cleared = function() {
    bg_music.pause();
    bg_music.currentTime = 0;
    state = STATE_LEVEL_CLEARED;
    spr_level_cleared.isVisible = true;
}

try_again = function() {
    bg_music.pause();
    bg_music.currentTime = 0;
    state = STATE_TRY_AGAIN;
    spr_try_again.isVisible = true;
}

game_stage.keyDown = function(event) {
    switch(state) {
        case STATE_PLAY_GAME:
            switch(event.key) {
                case ' ':
                case 'Enter':
                    break;
                case 'w':
                case 'W':
                case 'ArrowUp':
                    player_up();
                    break;
                case 's':
                case 'S': 
                case 'ArrowDown':
                    player_down();
                    break;
                case 'a':
                case 'A':    
                case 'ArrowLeft':
                    player_left();
                    break;
                case 'd':
                case 'D':    
                case 'ArrowRight':
                    player_right();
                    break;
            }
            break;
        case STATE_TRY_AGAIN:
            play_game();
            break;
        case STATE_LEVEL_CLEARED:
            level_idx++;
            play_game();
            break;  
    }
}

game_stage.touchDown = function(x,y) {
    switch(state) {
        case STATE_TRY_AGAIN:
            play_game();
            break;
        case STATE_LEVEL_CLEARED:
            level_idx++;
            play_game();
            break;  
    }
}

