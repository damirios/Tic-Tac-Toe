
let gameBoard = (function() {
    let board = ["", "", "", "", "", "", "", "", ""];
    const gamecells = document.querySelectorAll('.gamecell');

    const changeTheCell = function(position, sign) {
        gameBoard.board[position] = sign;
        showGameboard();
    };

    const showGameboard = function() {

        for (let i = 0; i < 9; i++) {
            gamecells[i].textContent = gameBoard.board[i];
        }
    };

    const resetGameBoard = function() {
        gameBoard.board = ["", "", "", "", "", "", "", "", ""];
        showGameboard();
    };

    return {board, showGameboard, changeTheCell, resetGameBoard};
})();

function Player(sign) {
    const setMark = function(position) {
        gameBoard.changeTheCell(position, sign);
    };

    return {sign, setMark};
}

let game = (function() {

    const startButton = document.querySelector('.start-btn');
    const resetButton = document.querySelector('.restart-btn');
    const signButton = document.querySelector('.sign-buttons button');
    
    startButton.addEventListener('click', startRound);
    resetButton.addEventListener('click', resetGame);
    signButton.addEventListener('click', changePlayer1Sign);

    let counter = 0;

    function resetGame() {
        gameBoard.resetGameBoard();
        resetGamecellsOccupied();
        unBlockStartButton();
        cleanWinnerWindow();
        hideWinWindow();
        resetPlayersUI();
        resetForm();
        showBlind();
        counter = 0;
    };

    function changePlayer1Sign(e) {
        const button = e.target;
        if (button.classList.contains('X')) {
            button.classList.remove('X');
            button.classList.add('O');
        } else if (button.classList.contains('O')) {
            button.classList.remove('O');
            button.classList.add('X');
        }
    };

    function getPlayers(player1Sign) {
        let players = [];
        const names = document.querySelectorAll('.names-box input');
        names.forEach(name => {
            const player = Player('placeholder');
            if (name.value.trim() == '') {
                player.name = name.placeholder;
                players.push(player);
            } else {
                player.name = name.value;
                players.push(player);
            }
        });

        players = setPlayersSigns(players, player1Sign);
        return players;
    };

    function getCurrentSign() {
        const player1Sign  = document.querySelector('.sign-buttons button').classList.value;
        const players = getPlayers(player1Sign);
        let sign;

        if (counter % 2 == 0) {
            sign = players[0].sign; //first player's sign
        } else {
            sign = players[1].sign; //second player's sign
        }
        counter++;
        return sign;
    };

    function setPlayersSigns(players, player1sign) {
        players[0].sign = player1sign;

        if (player1sign == 'X') {
            players[1].sign = 'O';
        } else if (player1sign == 'O') {
            players[1].sign = 'X';
        }
        return players;
    };

    function showBlind() {
        const blind = document.querySelector('.blind');
        blind.classList.remove('hidden');
    }

    function hideBlind() {
        const blind = document.querySelector('.blind');
        blind.classList.add('hidden');
    }

    function startRound() {
        const player1Sign  = document.querySelector('.sign-buttons button').classList.value;
        const players = getPlayers(player1Sign);
        
        blockStartButton();
        showPlayersUI(players);

        const gamecells = document.querySelectorAll('.gamecell');
        gamecells.forEach(cell => cell.addEventListener('click', setTheMark));

        hideBlind();  
    };

    function blockStartButton() {
        startButton.classList.add('block');
        startButton.removeEventListener('click', startRound);
    };

    function unBlockStartButton() {
        startButton.classList.remove('block');
        startButton.addEventListener('click', startRound);
    };

    function setTheMark(e) {
        const currentCell = e.target;
        const currentBoard = gameBoard.board;
        const currentPosition = currentCell.dataset.index - 1;
        
        if (currentBoard[currentPosition] == '') {
            const currentSign = getCurrentSign();
            gameBoard.changeTheCell(currentPosition, currentSign);
            
            gameBoard.showGameboard;
            currentCell.classList.add('occupied');

            checkForWin(gameBoard.board);
        }
    };

    function checkForWin(board) {
        if ((board[0] != '' && board[0] == board[1] && board[1] == board[2]) ||
        (board[3] != '' && board[3] == board[4] && board[4] == board[5]) ||
        (board[6] != '' && board[6] == board[7] && board[7] == board[8]) ||
        (board[0] != '' && board[0] == board[3] && board[3] == board[6]) ||
        (board[1] != '' && board[1] == board[4] && board[4] == board[7]) ||
        (board[2] != '' && board[2] == board[5] && board[5] == board[8]) ||
        (board[0] != '' && board[0] == board[4] && board[4] == board[8]) ||
        (board[2] != '' && board[2] == board[4] && board[4] == board[6])) {
            //Game Over script
            showGameoverWindow('win', counter);
            return;
        } else if (board.every(checkForDraw)) {
            showGameoverWindow('draw');
        }
    }

    function showGameoverWindow(status, counter) {
        const gameoverWindow = document.createElement('p');
        const players = getPlayers();

        if (status == 'draw') {
            gameoverWindow.textContent = "It's a draw";
        } else if (status == 'win') {
            let winner;
            if (counter % 2 == 0) {
                winner = players[1];
            } else {
                winner = players[0];
            }
            gameoverWindow.textContent = `${winner.name} is winner!`;
        }
        showWinWindow(gameoverWindow);
        showBlind();
    }

    function showWinWindow(gameoverWindow) {
        const winnerWindow = document.querySelector('.winner-window');
        const names = document.querySelector('.names-box');

        winnerWindow.classList.add('active');
        winnerWindow.addEventListener('click', resetGame);

        names.classList.add('hide-names');

        showBlind();
        winnerWindow.appendChild(gameoverWindow);
    }

    function hideWinWindow() {
        const winnerWindow = document.querySelector('.winner-window');
        const names = document.querySelector('.names-box');

        winnerWindow.classList.remove('active');
        names.classList.remove('hide-names');
    }

    function checkForDraw(cell) {
        return cell != '';
    }

    function showPlayersUI(players) {
        const playerOneField = document.querySelector('.left');
        const playerTwoField = document.querySelector('.right');

        for (let i = 0; i < 2; i++) {
            const playerCard = document.createElement('div');
            
            const playerName = document.createElement('p');
            playerName.textContent = 'name: ' + players[i].name;
            
            const playerSign = document.createElement('p');
            playerSign.classList.add('player-sign');
            playerSign.textContent = players[i].sign;

            const playerScore = document.createElement('p');

            playerCard.appendChild(playerName);
            playerCard.appendChild(playerSign);
            playerCard.appendChild(playerScore);

            if (i == 0) {
                playerOneField.appendChild(playerCard);
            } else if (i == 1) {
                playerTwoField.appendChild(playerCard);
            }
        }
    };

    function resetPlayersUI() {
        const playerOneField = document.querySelector('.left');
        const playerTwoField = document.querySelector('.right');

        if (playerOneField.lastElementChild) {
            playerOneField.removeChild(playerOneField.lastElementChild);
        }
        if (playerTwoField.lastElementChild) {
            playerTwoField.removeChild(playerTwoField.lastElementChild);
        }
    };

    function resetForm() {
        const namesForm = document.querySelector('form');
        namesForm.reset();
    };

    function resetGamecellsOccupied() {
        gamecells = document.querySelectorAll('.occupied');
        if (gamecells.length > 0) {
            for (i = 0; i < gamecells.length; i ++) {
                gamecells[i].classList.remove('occupied');
            }
        } 
    };

    function cleanWinnerWindow() {
        const winnerWindowParas = document.querySelectorAll('.winner-window p');
        if (winnerWindowParas.length > 0) {
            for (i = 0; i < winnerWindowParas.length; i++) {
                winnerWindowParas[i].remove(); 
            }
        }
    };

})();