/**
 * @author Victor Zegarra
 * @date 20/10/2024
 */

splash_stage = new KaiStage();

splash_stage.preload = function() {
    this.addImage('bg1','assets/splash/bg1.png');
    this.addImage('bg2','assets/splash/bg2.png');
    this.addImage('bg3','assets/splash/bg3.png');
    this.addImage('bg4','assets/splash/bg4.png');
    this.addImage('bg5','assets/splash/bg5.png');
    this.addImage('key_click','assets/splash/key_click.png');
}

splash_stage.create = function() {
    screen = 0;
    img_splash = new KaiImage(this.getImage('bg1'));
    this.add(img_splash);
    
    spr_key_click = new KaiSprite(this.getImage('key_click'),160,17);
    spr_key_click.centerX = true;
    spr_key_click.position(GAME_WIDTH_HALF, GAME_HEIGHT - 25);
    spr_key_click.setAnimation([0,-1],8,true);
    spr_key_click.update = function() {
        this.animate();
    }
    this.add(spr_key_click);
}

splash_stage.keyDown = function(event) {
    next_screen();
}

splash_stage.touchDown = function(x,y) {
    next_screen();
}

next_screen = function() {
    screen++;
    switch(screen) {
        case 1:
            img_splash.setImage(splash_stage.getImage('bg2'));
            break;
        case 2:
            img_splash.setImage(splash_stage.getImage('bg3'));
            break;
        case 3:
            img_splash.setImage(splash_stage.getImage('bg4'));
            break;
        case 4:
            img_splash.setImage(splash_stage.getImage('bg5'));
            break;
        case 5:
            game.startStage('game');
            break;
    }
}