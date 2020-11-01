/*
    Noah Tomkins, 000790079
    Created: 27/10/2020
*/
window.addEventListener("load", function() {

    let dice = ['die1', 'die2', 'die3', 'die4', 'die5'];
    let diceValues = [0,0,0,0,0];
    let heldDice = [false, false, false, false, false];
    let round = 0;
    let score = 0;
    
    let upperSectionIds = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
    let upperSectionValues = [0,0,0,0,0,0];
    let upperSectionScored = [false, false, false, false, false, false];

    let lowerSectionIds = ['kind3', 'kind4', 'fullHouse', 'smallStraight', 'largeStraight', 'yahtzee', 'chance'];
    let lowerSectionValues = [0,0,0,0,0,0,0];
    let lowerSectionScored = [false, false, false, false, false, false, false];

    let rolling = false;
    let sureUpper = -1;
    let sureLower = -1;

    /* Node variables */

    // headers
    let welcomeMsg = document.getElementById('welcomeMsg');
    let sureMsg = document.getElementById('sureMsg');
    let rollMsg = document.getElementById('rollMsg');
    let rollNumberMsg = document.getElementById('rollNumber');
    let winMsg = document.getElementById('winMsg');
    let scoreMsg = document.getElementById('scoreMsg');

    // pages
    let playerPage = document.getElementById('player');
    let welcomePage = document.getElementById('welcome');
    let instructionPage = document.getElementById('instructions');

    // buttons
    let startBtn = document.getElementById('start');
    let readInstructionsBtn = document.getElementById('read');
    let instructionsStartBtn = document.getElementById('instStart');
    let gameReadInstructionsBtn = document.getElementById('gameRead');
    let newGameBtn = document.getElementById('newGame');
    let sureYesBtn = document.getElementById('sureYes');
    let sureNoBtn = document.getElementById('sureNo');
    let rollDice = document.getElementById('rollDice');

    // pop-up
    let areYouSure = document.getElementById('areYouSure');

    /**
     * Player init page submit button
     * User enters: name, age, and fav color
     * Changes player init page to welcome page
     */
    document.forms.player_form.addEventListener("submit", function(event) {
        event.preventDefault();
        name = document.forms.player_form.name.value;
        age = document.forms.player_form.age.value;
        color = document.forms.player_form.color.value;
        console.log("New player: name=" + name + ", age=" + age + ", color=" + color);

        welcomeMsg.innerHTML = "Welcome " + name +  " to Yahtzee";

        //Switch from the player setup to game
        playerPage.style.display = "none";
        welcomePage.style.display = "block";

        document.getElementById('body').style.backgroundColor = color;
    });

    /**
     * Welcome page start game button
     * User chooses to start the game and not read the instructions
     */
    startBtn.addEventListener("click", function() {
        console.log("Player started game");

        //Switch from the welcome to game
        welcomePage.style.display = "none";
        showGame();
    });

    /**
     * Welcome page read instructions button
     * User chooses to read the instructions before starting the game
     */
    readInstructionsBtn.addEventListener("click", function() {
        console.log("Player read instructions");

        //Switch from the welcome to instructions
        welcomePage.style.display = "none";
        instructionPage.style.display = "block";
    });

    /**
     * Instructions page start game button
     * User has read the instructions and is ready to start the game
     */
    instructionsStartBtn.addEventListener("click", function() {
        console.log("Player started game");

        //Switch from the instructions to game
        instructionPage.style.display = "none";
        showGame();
    });

    /**
     * Game page read instructions button
     * User would like to read the instructions once the game has already been started
     */
    gameReadInstructionsBtn.addEventListener("click", function() {
        console.log("Player read instructions");

        //Switch from the welcome to instructions
        hideGame();
        instructionPage.style.display = "block";
        document.getElementById('instStart').innerHTML = "continue";
    });

    /**
     * Game page new game button
     * User would like to start a new game
     * This refreshes the page, reseting everthing
     */
    newGameBtn.addEventListener("click", function() {
        console.log("New Game");

        location.reload();
    });

    /**
     * Dice img has been clicked
     * 
     * Saves the dice to the held dice, 
     * or removes from saved dice if they choose to click the die again
     */
    for (let i = 0; i < dice.length; i++){
        document.getElementById(dice[i]).addEventListener("click", function() {
            console.log("Clicked die: " + dice[i]);

            if (round !== 0 && !rolling){ 
                if (!heldDice[i]){
                    heldDice[i] = true;
                    document.getElementById(dice[i]).className = "heldDice";
                } else {
                    heldDice[i] = false;
                    document.getElementById(dice[i]).className = "";
                }
            }
        });
    }

    /**
     * Upper scoreboard valuses have been selected
     * 
     * Saves the temp value (possible score) to the scoreboard
     */
    for (let i = 0; i < upperSectionIds.length; i++){
        let node = document.getElementById(upperSectionIds[i]);
        
        node.addEventListener("click", function() {
            console.log("upper: " + upperSectionValues[i] + ", scored=" + upperSectionScored[i]);
            if (!upperSectionScored[i] && round !== 0 && !rolling){
                if (upperSectionValues[i] === 0){
                    sureUpper = i;
                    sureMsg.innerHTML = "Do you want to score 0 points for: " + upperSectionIds[i] + "?";
                    areYouSure.style.display = "grid";
                } else {
                    upperSectionScored[i] = true;
                    nextRound();
                }
            }
        });
    }

    /**
     * Lower scoreboard valuses have been selected
     * 
     * Saves the temp value (possible score) to the scoreboard
     */
    for (let i = 0; i < lowerSectionIds.length; i++){
        let node = document.getElementById(lowerSectionIds[i]);
        
        node.addEventListener("click", function() {
            console.log("lower: " + lowerSectionValues[i] + ", scored=" + lowerSectionScored[i]);
            if (!lowerSectionScored[i] && round !== 0 && !rolling){
                if (lowerSectionValues[i] === 0){
                    sureLower = i;
                    sureMsg.innerHTML = "Do you want to score 0 points for: " + lowerSectionIds[i] + "?";
                    areYouSure.style.display = "grid";
                } else {
                    lowerSectionScored[i] = true;
                    nextRound();
                }
            }
        });
    }

    sureYesBtn.addEventListener("click", function(){
        if (sureUpper != -1){
            upperSectionScored[sureUpper] = true;
        } else if (sureLower != -1){
            lowerSectionScored[sureLower] = true;
        }
        sureUpper = -1;
        sureLower = -1;
        areYouSure.style.display = "none";
        nextRound();
    });

    sureNoBtn.addEventListener("click", function(){
        areYouSure.style.display = "none";
    });

    /**
     * User has clicked the roll dice button
     * 
     * This rolls the dice and saves the value to diceValues
     * Then calls the calculateDiceScore function to see
     *      what posible scores the user can select from
     */
    rollDice.addEventListener("click", function() {
        console.log("rolled dice");

        if (round < 3 && !rolling){
            rolling = true;

            clearNonScored();
    
            round++;
            rollNumberMsg.innerHTML = "Roll " + round + "/3";
    
            let timesChanged = 0;
    
            let timer = setInterval(function() {
                for (let i = 0; i < dice.length; i++){
                    if (!heldDice[i]){
                        let number = Math.ceil(Math.random() * 6);
                        //console.log(number);
                        document.getElementById(dice[i]).src = "images/die" + number + ".png";
                        diceValues[i] = number;
                    }
                }
    
                if (timesChanged > 10){
                    calculateDiceScore(); 
                    updateScoreboard();
                    rolling = false;
                    clearInterval(timer);
                }
    
                timesChanged++;
            }, 100);
        } else if (round == 3){
            rollMsg.innerHTML = "Max rolls exceeded, please choose a score";
        }
    });

    /**
     * User has selected a score to save and is going to the next round
     */
    function nextRound(){
        console.log("next round");

        if (upperSectionScored.includes(false) || lowerSectionScored.includes(false)){
            areYouSure.style.display = "none";

            updateScoreboard();
            round = 0;
            rollNumberMsg.innerHTML = "Roll " + round + "/3";
            rollMsg.innerHTML = "";
    
            for (let i = 0; i < dice.length; i++){
                heldDice[i] = false;
                document.getElementById(dice[i]).className = "";
            }
    
            clearNonScored();
        } else {
            updateScoreboard();
            rollDice.style.display = "none";
            rollNumberMsg.innerHTML = "";
            rollMsg.innerHTML = "";

            winMsg.style.display = "block";
            winMsg.innerHTML = "CONGRATS " + name + " YOU WON!";
            scoreMsg.innerHTML = "Final score: " + score;
        }
    }

    function clearNonScored(){
        for (let i = 0; i < upperSectionIds.length; i++){
            if (!upperSectionScored[i]){
                upperSectionValues[i] = 0;

                let node = document.getElementById(upperSectionIds[i]);
                node.className = "";
                node.innerHTML = "";
            }
        }

        for (let i = 0; i < lowerSectionIds.length; i++){
            if (!lowerSectionScored[i]){
                lowerSectionValues[i] = 0;

                let node = document.getElementById(lowerSectionIds[i]);
                node.className = "";
                node.innerHTML = "";
            }
        }
    }

    /**
     * Shows the game to the screen
     */
    function showGame() {
        document.getElementById('game').style.display = "grid";
        document.getElementById('dice').style.display = "grid";
        document.getElementById('diceBox').style.display = "grid";
        updateScoreboard();
    }

    /**
     * Hides the game to the screen
     */
    function hideGame() {
        document.getElementById('game').style.display = "none";
        document.getElementById('dice').style.display = "none";
        document.getElementById('diceBox').style.display = "none";
    }

    /**
     * Updates the scoreboard for values that have been chosen to keep as a score
     */
    function updateScoreboard(){
        console.log("updated scoreboard");

        for (let i = 0; i < upperSectionIds.length; i++){

            let node = document.getElementById(upperSectionIds[i]);

            if (upperSectionScored[i]){
                node.className = "";
                node.innerHTML = upperSectionValues[i];
            } else {
                if (upperSectionValues[i] > 0){
                    node.className = "scoreAvailable";
                    node.innerHTML = upperSectionValues[i];
                } else {
                    node.className = "";
                    node.innerHTML = "";
                }
            }
        }

        for (let i = 0; i < lowerSectionIds.length; i++){
            let node = document.getElementById(lowerSectionIds[i]);

            if (lowerSectionScored[i]){
                node.className = "";
                node.innerHTML = lowerSectionValues[i];
            } else {
                if (lowerSectionValues[i] > 0){
                    node.className = "scoreAvailable";
                    node.innerHTML = lowerSectionValues[i];
                } else {
                    node.className = "";
                    node.innerHTML = "";
                }
            }
        }

        let upperScore = 0;
        for (let i = 0; i < upperSectionValues.length; i++){
            if (upperSectionScored[i]){
                upperScore += upperSectionValues[i]
            }
        }
        document.getElementById('sum').innerHTML = upperScore;

        let bonus = 0;
        if (upperScore >= 63){
            bonus = 35;
        }
        document.getElementById('bonus').innerHTML = bonus;

        let lowerScore = 0;
        for (let i = 0; i < lowerSectionValues.length; i++){
            if (lowerSectionScored[i]){
                lowerScore += lowerSectionValues[i]
            }
        }
        score = upperScore + lowerScore + bonus; 
        document.getElementById('total').innerHTML = score;
    }

    /**
     * Calculates sum of a number array
     * 
     * @param {Number} array 
     */
    function calculateSum(array){
        let sum = 0;

        for (let i = 0; i < array.length; i++){
            sum += array[i];
        }

        return sum;
    }

    /**
     * Calculates the possible score for each dice roll
     */
    function calculateDiceScore(){

        // Individual numbers (upper section)
        for (let i = 0; i < upperSectionIds.length; i++){
            let score = 0;
            for (let j = 0; j < diceValues.length; j++){
                if (diceValues[j] == i + 1){
                    score++;
                }
            }
            console.log("I see " + score + " " + (i + 1) + "'s");
            if (!upperSectionScored[i]){
                if (score >= 1){
                    score = score * (i + 1);
                    upperSectionValues[i] = score;
                } else {
                    upperSectionValues[i] = 0;
                }
            }
        }

        // Lower section

        //chance
        if (!lowerSectionScored[6]) {
            lowerSectionValues[6] = calculateSum(diceValues);
        }

        //large and small straight
        if(diceValues.includes(1) && diceValues.includes(2) && diceValues.includes(3) && diceValues.includes(4)){
            console.log("staight A");
            smallStraight();
            if (diceValues.includes(5)){
                largeStraight();
            }
        } else if (diceValues.includes(2) && diceValues.includes(3) && diceValues.includes(4) && diceValues.includes(5)){
            console.log("staight B");
            smallStraight();
            if (diceValues.includes(6)){
                largeStraight();
            }
        } else if (diceValues.includes(3) && diceValues.includes(4) && diceValues.includes(5) && diceValues.includes(6)){
            console.log("staight C");
            smallStraight();
        }

        function smallStraight(){
            if (!lowerSectionScored[3]) {
                lowerSectionValues[3] = 30;
            }
        }

        function largeStraight(){
            if (!lowerSectionScored[4]) {
                lowerSectionValues[4] = 40;
            }
        }

        //3,4 of a kind and yahtzee, full house
        for (let i = 1; i <= 6; i++){
            let kind = 0;
            let maxKind = 0;
            let kindValue = 0;
            for (let j = 0; j <= 5; j++){
                if(diceValues[j] == i){
                    kind++;
                    if (kind >= maxKind){
                        maxKind = kind;
                        kindValue = i;
                        //console.log(kindValue);
                    }
                }
            }
            // 3 of a kind
            if (kind >= 3 && !lowerSectionScored[0]){
                //console.log("three");
                lowerSectionValues[0] = calculateSum(diceValues);
            }

            // 4 of a kind
            if (kind >= 4 && !lowerSectionScored[1]){
                //console.log("four");
                lowerSectionValues[1] = calculateSum(diceValues);
            }

            // yahtzee
            if (kind == 5 && !lowerSectionScored[5]){
                //console.log("yahtzee");
                lowerSectionValues[5] = 50;
            }

            // full house
            if (kind == 3 && !lowerSectionScored[2]){
                for (let i = 1; i <= 6; i++){
                    let fullKind = 0;
                    for (let j = 0; j <= 5; j++){
                        if(diceValues[j] == i && diceValues[j] != kindValue){
                            fullKind++;
                        }
                    }
                    if (fullKind == 2){
                        //console.log("fullhouse");
                        lowerSectionValues[2] = 25;
                    }
                }
            }
        }  
    }
});