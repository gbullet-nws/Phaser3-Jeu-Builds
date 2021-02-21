// ----------------------------------------//
// ----------------- Game -----------------//
// ----------------------------------------//

import Phaser from "./lib/phaser.js"

export default class Game extends Phaser.Scene
{
    //---// Constructeur //---//

    constructor()
    {
        super('game') ;
    }

    preload()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create()
    {
        //  background
        this.add.image(400, 300, 'sky');

        //  définition des plateformes
        platforms = this.physics.add.staticGroup();

        // définition de la plateforme du sol
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        // Emplacement des plateformes supérieures
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        // configuration du personnage 
        player = this.physics.add.sprite(100, 450, 'dude');

        //  Player physics properties. Give the little guy a slight bounce.
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();

        //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate(function (child) {

            //  Give each star a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });

        bombs = this.physics.add.group();

        //  The score
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        //  Collide the player and the stars with the platforms
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(bombs, platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(player, stars, collectStar, null, this);

        this.physics.add.collider(player, bombs, hitBomb, null, this);
    }

    update()
    {
        if(gameOver === true)
        {
            return;
        }

        playerMoves();
        
    }

    playerActions();

    // ----------------------------------------//--// ----------------------------------------//
    // ----------------------------------------//--// ----------------------------------------//

    // FONCTIONS De Gameplay et GameOver

    // ----------------------------------------//
    // ------------ playerActions -------------//
    // ----------------------------------------//

    playerMoves()
    {
        if(cursors.left.isDown)
        {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-330);
        }
    }

    // ----------------------------------------//
    // ------------ playerActions -------------//
    // ----------------------------------------//

    playerActions()
    {

        collectItems (player, star)
        {
            star.disableBody(true, true);
            //  Add and update the score
            score += 10;
            scoreText.setText('Score: ' + score);

            createNewItems();
        }
        
        hitBomb (player, bomb)
        {
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            gameOver = true;
        }

    }

    // ----------------------------------------//
    // ------------ createNewItems ------------//
    // ----------------------------------------//

    createNewItems()
    {
        if (stars.countActive(true) === 0)
        {
            //  A new batch of stars to collect
            stars.children.iterate(function (child) 
            {
                child.enableBody(true, child.x, 0, true, true);
            });
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
        }
    }

    // ----------------------------------------//
    // --------------- GameOver ---------------//
    // ----------------------------------------//

    popUpGameOver()
    {
        // sélection de la div de la popup
        var popupGameOver = document.getElementById("popupGameOver");

        // sélection du <span> de la popup pour la refermer
        var fermerPopUp = document.getElementById("fermerPopUp");

        // Si (pacman.mort == true) alors affiche la Popup
        function GameOver()
        {
            popupGameOver.style.display = "block";
        }
        // condition d'affichage de la popup
        if( gameOver === true )
        {
            GameOver();
            document.getElementById("popupScore").innerHTML = score;
        }
        
        // Refermer la Popup
        fermerPopUp.onclick = function() 
        {
            popupGameOver.style.display = "none";
        }
        // en cliquant en dehors
        window.onclick = function(event) 
        {
            if (event.target == popupGameOver) 
            {
                popupGameOver.style.display = "none";
            }
        }
    }

}
