// ----------------------------------------//
// ------------ playerActions -------------//
// ----------------------------------------//

import CreateNewItems from "./gameActions/CreateNewItems.js"

export default class PlayerActions extends Phaser
{

    playerActions()
    {

        collectStar (player, star)
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

}
