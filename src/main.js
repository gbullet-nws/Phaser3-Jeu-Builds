// ----------------------------------------//
// ----------------- main -----------------//
// ----------------------------------------//

// console.dir(Phaser)

var config =                            // tableau contenant les paramètres du jeu
{
    type: Phaser.AUTO,                  // gestion auto par Phaser 
    width: 1200,                         // largeur
    height: 800,                        // hauteur
    physics: 
    {
        default: 'arcade',                // type de jeu arcade
        arcade:                 
        {
            gravity: { y: 300 },            // gravité
            debug: true                    // debug des éléments
        }
    },
    scene: 
    {
        preload: preload,               // appelle preload
        create: create,                 // appelle create
        update: update                  // appelle update
    }
};

var platforms ;                                 // plateformes
var player ;                                    // joueur
var copperCoins ;                               // pièces de cuivre
var silverCoins ;                               // pièces d'argent
var goldCoins ;                                 // pièce en or
var stones ;                                    // pierres
var bombs ;                                     // objets adverses
var cursors ;                                   // touches du clavier
var gameOver = false ;  

var game = new Phaser.Game(config) ;                // objet Game qui prend en paramètres les configurations

var score = 0 ;                                              // score

var higherScore = localStorage.getItem("HigherScore") ;                 // meilleur score
checkHigherScore();

// ---------------------------------------- //--// ---------------------------------------- //

function preload()                                                                      // préchargement des différents assets
{
    this.load.image('background', 'assets/BackgroundGrottePixels.jpg') ;
    this.load.image('upperPlatform', 'assets/plateforme.png') ;
    this.load.image('sol', 'assets/sol.jpg') ;
    this.load.image('copperCoin', 'assets/pieceDeBronze.png') ;
    this.load.image('silverCoin', 'assets/pieceEnArgent.png') ;
    this.load.image('goldCoin', 'assets/pieceEnOr.png') ;
    this.load.image('bomb', 'assets/bomb.png') ;
    this.load.image('stone', 'assets/pierre.png' , { frameWidth: 20, frameHeight: 12 }) ;
    this.load.spritesheet('dude', 'assets/dude.png' , { frameWidth: 32, frameHeight: 48 }) ;
    document.getElementById("score").innerHTML = score ;                                        // précharge l'affichage du score
    document.getElementById("highScore").innerHTML = higherScore ;                              // précharge l'affichage du higherScore
}

// ---------------------------------------- //--// ---------------------------------------- //

function create()
{
    this.add.image(400, 300, 'background') ;                                 //  background
    platforms = this.physics.add.staticGroup() ;                             //  définition des plateformes
    platforms.create(1, 800, 'sol').setScale(6).refreshBody() ;             //  définition de la plateforme du sol

    platforms.create(600, 650, 'upperPlatform').setScale(4).refreshBody() ;                // Plateforme 1
    platforms.create(600, 500, 'upperPlatform').setScale(4).refreshBody() ;                // Plateforme 2
    platforms.create(150, 600, 'upperPlatform').setScale(4).refreshBody() ;                // Plateforme 3
    platforms.create(1050, 600, 'upperPlatform').setScale(4).refreshBody() ;               // Plateforme 4
    platforms.create(0, 450, 'upperPlatform').setScale(4).refreshBody() ;                  // Plateforme 5
    platforms.create(1200, 450, 'upperPlatform').setScale(4).refreshBody() ;               // Plateforme 6
    platforms.create(400, 400, 'upperPlatform').setScale(4).refreshBody() ;                // Plateforme 7
    platforms.create(800, 400, 'upperPlatform').setScale(4).refreshBody() ;                // Plateforme 7
    platforms.create(600, 200, 'upperPlatform').setScale(4).refreshBody() ;                // Plateforme 8
    platforms.create(150, 300, 'upperPlatform').setScale(4).refreshBody() ;                // Plateforme 9
    platforms.create(1050, 300, 'upperPlatform').setScale(4).refreshBody() ;               // Plateforme 10

    player = this.physics.add.sprite(100, 450, 'dude') ;                     // configuration du personnage 

    player.setBounce(0.2);                                                  // rebond du personnage selon sa velocité
    player.setCollideWorldBounds(true) ;                                    // collision du rebbond
    
    // ---------------------------------------- //

    this.anims.create(                                                      // animation vers la gauche
    {   
        key: 'left',                                                                // direction gauche
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),      // animation du perso par frames du png
        frameRate: 10,                                                              // taux de frames
        repeat: -1                                                                  // en boucle
    });
    this.anims.create(                                                      // animation de face
    {
        key: 'turn',                                                                // direction : se tourne pour être de face
        frames: [ { key: 'dude', frame: 4 } ],                                      // animation du perso par frames du png
        frameRate: 20                                                               // taux de frames
    });
    this.anims.create(                                                      // animation vers la droite
    {
        key: 'right',                                                               // direction flèche de droite
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),      // animation du perso par frames du png
        frameRate: 10,                                                              // taux de frames
        repeat: -1                                                                  // en boucle
    });

    cursors = this.input.keyboard.createCursorKeys() ;                              //  Évènements lors d'un input d'une touche

    // ---------------------------------------- //

    copperCoins = this.physics.add.group(                                               // objets à collecter : pièce en cuivre
        {   
            key: 'copperCoin',                                                          // clef de l'objet -> sprite
            repeat: 19,                                                                  // nombre
            setXY: { x: 50, y: 400, stepX: 100 }                                          // positionnement à partir du premier
        });
    copperCoins.children.iterate(function (child)                                         // lis le nombre d'étoile et exeucte une fonction avec l'héritage
    {       
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)) ;                          // rebonds aléatoires pour chaque étoile trouvée
    });

    silverCoins = this.physics.add.group(                                                   // objets à collecter : pièce en cuivre
        {   
            key: 'silverCoin',                                                              // clef de l'objet -> sprite
            repeat: 4,                                                                      // nombre
            setXY: { x: 100, y: 0, stepX: 200 }                                              // positionnement à partir du premier
        });
    silverCoins.children.iterate(function (child)                                            // lis le nombre d'étoile et exeucte une fonction avec l'héritage
    {       
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)) ;                               // rebonds aléatoires pour chaque étoile trouvée
    });

    goldCoins = this.physics.add.group(                                                     // objets à collecter : pièce en cuivre
        {   
            key: 'goldCoin',                                                                // clef de l'objet -> sprite
            repeat: 0,                                                                      // nombre
            setXY: { x: 600, y: 0, stepX: 200 }                                              // positionnement à partir du premier
        });
    goldCoins.children.iterate(function (child)                                             // lis le nombre d'étoile et exeucte une fonction avec l'héritage
    {       
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)) ;                              // rebonds aléatoires pour chaque étoile trouvée
    });

    bombs = this.physics.add.group() ;                                                      // phhsique des bombes
    stones = this.physics.add.group() ;                                                     // physique des pierres

    // scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' }) ;       // écriture dans le jeu

    // ---------------------------------------- //

    //  Collisions entre les différents éléments
    this.physics.add.collider(player, platforms) ;
    this.physics.add.collider(copperCoins, platforms) ;
    this.physics.add.collider(silverCoins, platforms) ;
    this.physics.add.collider(goldCoins, platforms) ;
    this.physics.add.collider(bombs, platforms) ;
    this.physics.add.collider(stones, platforms) ;

    this.physics.add.overlap(player, copperCoins, collectCopperCoins, null, this) ;           //  Permet au joueur de récupérer les objets en passant dessus
    this.physics.add.overlap(player, silverCoins, collectSilverCoins, null, this) ;           //  Permet au joueur de récupérer les objets en passant dessus
    this.physics.add.overlap(player, goldCoins, collectGoldCoins, null, this) ;             //  Permet au joueur de récupérer les objets en passant dessus
    this.physics.add.collider(player, bombs, hitBomb, null, this) ;                         //  lors d'une collision entre player et bomb on appelle hitbomb
    this.physics.add.collider(player, stones, hitStone, null, this) ;

}
// ---------------------------------------- //--// ---------------------------------------- //

function update()
{
    playerMoves() ;
    checkHigherScore() ;
    document.getElementById("score").innerHTML = score ;
    document.getElementById("highScore").innerHTML = higherScore ;
    if(gameOver === true)
    {
        popUpGameOver() ;
        return;
    } 
}

// ---------------------------------------- //--// ---------------------------------------- //

collectCopperCoins() ;   // incrémente score quand collision, fait disparaitre item et si 0 items alors respawn
collectSilverCoins() ;   // incrémente score quand collision, fait disparaitre item et si 0 items alors respawn
collectGoldCoins() ;     // incrémente score quand collision, fait disparaitre item et si 0 items alors respawn

hitBomb() ;                              // collision bomb -> gameOver = true ;
hitStone() ;

// ----------------------------------------//--// ----------------------------------------//
// ----------------------------------------//--// ----------------------------------------//

// FONCTIONS De Gameplay et GameOver

// ----------------------------------------//
// ------------ playerMoves -------------//
// ----------------------------------------//

function playerMoves()                                  // déplacement du joueur
{
    if( cursors.left.isDown )                             // touche flèche de gauche appuyée
    {
        player.setVelocityX(-160) ;

        player.anims.play('left', true) ;
    }
    else if( cursors.right.isDown )                      // touche flèche de droite appuyée
    {
        player.setVelocityX(160) ;

        player.anims.play('right', true) ;
    }   
    else                                                // aucune touche appuyée
    {
        player.setVelocityX(0);

        player.anims.play('turn') ;
    }   

    if( cursors.up.isDown && player.body.touching.down )            // toucher le sol ralenti drastiquement la vitesse
    {
        player.setVelocityY(-330) ;
    }
}

// ----------------------------------------//
// ------------ playerActions -------------//
// ----------------------------------------//

    function collectCopperCoins(player, copperCoin)                     // fonction de collecte des objets 
    {
        copperCoin.disableBody(true, true);  
        if( copperCoin.disableBody(true,true) )
        {
            score += 1;                                         // incrémentation du score
        }
        checkHigherScore();                                 // fonction de check du High Score
        createNewItems();                                   // spawn de nouveaux items
    }
    function collectSilverCoins(player, silverCoin)                     // fonction de collecte des objets 
    {
        silverCoin.disableBody(true, true);  
        if( silverCoin.disableBody(true,true) )
        {
            score += 5;                                         // incrémentation du score
        }
        checkHigherScore();                                 // fonction de check du High Score
        createNewItems();                                   // spawn de nouveaux items
    }
    function collectGoldCoins(player, goldCoin)                     // fonction de collecte des objets 
    {
        goldCoin.disableBody(true, true);  
        if( goldCoin.disableBody(true,true) )
        {
            score += 10;                                         // incrémentation du score
        }
        checkHigherScore();                                 // fonction de check du High Score
        createNewItems();                                   // spawn de nouveaux items
    }
    
    function hitBomb(player, bomb)                          // fonction de collision avec une bombe
    {
        this.physics.pause() ;                              // met en pause la physique du jeu
        player.setTint(0xff0000) ;                          // change la couleur du joueur quand il collisionne
        player.anims.play('turn') ;                         // tour le player vers l'écran
        gameOver = true ;                                   // gameOver prend la valeur TRUE ( ce qui arrête le jeu )
    }

    function hitStone(player, stone)                         // fonction de collision avec une pierre
    {
        stone.disableBody(true, true) ; 
        // player.setTint(0xff0000) ;                           // change la couleur du joueur quand il collisionne
        player.anims.play('turn') ;                         // tourne le player vers l'écran
        score -= 10 ;
    }

// ----------------------------------------//
// ------------ createNewItems ------------//
// ----------------------------------------//

function createNewItems()                                                                           // Fonction de création des collectibles pour le score
{
    if ( copperCoins.countActive(true) === 0 && silverCoins.countActive(true) === 0 && goldCoins.countActive(true) === 0)                                                              // Compte des objets
    {
        copperCoins.children.iterate(function (child)                                               // spawn de nouveaux objets
        {                                                       
            child.enableBody(true, child.x, 0, true, true);                                         // création d'enfants de l'original  
        });
        silverCoins.children.iterate(function (child)                                               // spawn de nouveaux objets
        {                                                       
            child.enableBody(true, child.x, 0, true, true);                                         // se base sur les anciens objets avec héritage   
        });
        goldCoins.children.iterate(function (child)                                               // spawn de nouveaux objets
        {                                                       
            child.enableBody(true, child.x, 0, true, true);                                         // se base sur les anciens objets avec héritage   
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);     // donne la zone de spawn des nouveaux objets

        var bomb = bombs.create(x, 16, 'bomb');                                                     // création des objets piégés
        bomb.setBounce(1);                                                                          // en ajoute 1 par 1
        bomb.setCollideWorldBounds(true);                                                           // ajoute le rebond à la collision avec le "monde" ( objets du jeu )
        bomb.setVelocity(Phaser.Math.Between(-100, 100), 10);                                       // gère la vitesse via setVelocity avec Phaser
        bomb.allowGravity = false;                                                                  // ajoute la gravité, qui réduit progressivement le bon des collectibles

        var stone = stones.create(x, 100, 'stone');                                                   // création des objets piégés
    }
}

// ----------------------------------------//
// --------------- GameOver ---------------//
// ----------------------------------------//

function popUpGameOver()
{
    var popupGameOver = document.getElementById("popupGameOver") ;      // sélection de la div de la popup
    var fermerPopUp = document.getElementById("fermerPopUp") ;          // sélection du <span> de la popup pour la refermer
    function GameOver()                                                 // affichage de la popUp
    {               
        popupGameOver.style.display = "block" ;                          
    }
    if( gameOver === true )                                              // condition d'affichage de la popup
    {
        GameOver() ;
        chronoStop() ;
        checkHigherScore() ;
        document.getElementById("popupScore").innerHTML = score ;
        document.getElementById("popupHigherScore").innerHTML = higherScore ;
    }
    
    // Refermer la Popup
    fermerPopUp.onclick = function() 
    {
        popupGameOver.style.display = "none" ;
    }
    // en cliquant en dehors
    window.onclick = function(event) 
    {
        if (event.target == popupGameOver) 
        {
            popupGameOver.style.display = "none" ;
        }
    }
}

// ----------------------------------------//
// ----------- checkHigherScore -----------//
// ----------------------------------------//

var higherScore = localStorage.getItem("HigherScoreGreedyDwarf") ;
checkHigherScore() ;

function checkHigherScore()											// Fonction de gestion du HigherScore
{
	if( localStorage.getItem("HigherScoreGreedyDwarf") === null )
	{
		higherScore = score ;
		localStorage.setItem("HigherScoreGreedyDwarf", higherScore) ;
	}
	else
	{
		if( score > higherScore )
		{
			higherScore = score ;
			localStorage.setItem("HigherScoreGreedyDwarf", higherScore) ;
		}
		else
		{
			higherScore = higherScore ;
		}
	}
}


