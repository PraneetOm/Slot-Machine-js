const prompt = require("prompt-sync")();

const rows = 3;
const cols = 3;

const symbols_count = {
    "🍒": 2,
    "💎": 4,
    "🍋": 6,
    "🔔": 8
}

const symbol_value = {
    "🍒": 5,
    "💎": 4,
    "🍋": 3,
    "🔔": 2
}

const depositeMoney = () => {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: ");
        const depositedAmount = parseFloat(depositAmount);

        if (isNaN(depositedAmount) || depositedAmount <= 0) {
            console.log("Invalid deposit amount, please try again!");
        } else {
            return(depositedAmount);
        }
    }
}

const bettingLines = () => {
    while (true) {
        const nLines = prompt("Enter number of bet lines (1-3): ");
        const lines = parseFloat(nLines);

        if (isNaN(lines) || lines <= 0 || lines > 3) {
            console.log("Invalid line selection, please try again!");
        } else {
            return lines;
        }
    }
}

const bet = (balance, lines) => {
    while (true) {
        const betAmt = prompt("Enter the betting amount: ");
        const currBet = parseFloat(betAmt);

        if (isNaN(currBet) || currBet <= 0 || currBet > balance / lines) {
            console.log("Invalid betting amount, please try again!");
        } else {
            return(currBet);
        }
    }
}

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(symbols_count)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reel = [];
    for (let i = 0; i < cols; i++) {
        reel.push([]);
        const symbols_copy = [...symbols];
        for (let j = 0; j < rows; j++) {
            let random_index = Math.floor(Math.random() * symbols_copy.length);
            const selected_symbol = symbols_copy[random_index];
            reel[i].push(selected_symbol);
            symbols_copy.splice(random_index, 1);
        }
    }
    return reel;
}

const transpose = (matrix) => {
    const T = [];

    for (let i = 0; i < rows; i++) {
        T.push([]);
        for (let j = 0; j < cols; j++) {
            T[i].push(matrix[j][i]);
        }
    }
    return T;
}

const spin_machine_graphic = (pairs) => {
    for (const pair of pairs) {
        const mod_pair = pair.join(" | ");
        console.log(mod_pair);
    }
}

const get_win_or_lose = (currBet, lines, pairs) => {

    let win_amount = 0;

    for (let row = 0; row < lines; row++) {
        const pair = pairs[row];
        let allsame = true;

        for (symbol of pair) {
            if (symbol != pair[0]) {
                allsame = false;
                break;
            }
        }

        if (allsame) {
            win_amount += currBet * symbol_value[pair[0]];
        }
    }

    return win_amount;
}

const game = () => {    
    let balance = depositeMoney();

    while (true) {
        console.log("Current Balance, ₹", balance);

        const conf = prompt("Play Game, Y or N: ");
        if (conf.toLowerCase() !== "y" && conf.toLowerCase() !== "n") {
            console.log("Invalid choice. Enter Y or N.");
            continue;
        }

        if (conf.toLowerCase() == "y") {
            const lines = bettingLines();
            let currBet = bet(balance, lines);
            balance -= currBet * lines;
            const reel = spin();
            const pairs = transpose(reel);
            console.log("\n🎰 SLOT MACHINE 🎰\n");
            spin_machine_graphic(pairs);
            console.log("\n---------------\n");

            const win_amount = get_win_or_lose(currBet, lines, pairs);
            console.log("You Won, ₹", win_amount);
            balance += win_amount;

            if (balance <= 0) {
                console.log("\nInsufficient Balance! \nGame Over.");
                console.log("Your Exit Payout, ₹", balance);
                return;
            }

        } else {
            console.log("\nGame Over.");
            console.log("Your Exit Payout, ₹", balance);
            return;
        }
    }
}

game();