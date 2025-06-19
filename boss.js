function setupBoss(endGame) {
    // const bossNetworkingScore = 1
    // const bossManufacturingScore = 1
    // const bossReconScore = 1
    // const bossSecurityScore = 1
    const bossNetworkingScore = networkingScore //comment these when you wanna test effects
    const bossManufacturingScore = manufacturingScore
    const bossReconScore = reconScore
    const bossSecurityScore = securityScore

    const aspectRatio = 0.35838622129; // the visible aspect ratio width/height of a cell

    class Room {
        constructor(size, offset, hasRobot = false, hasComputer = false, visible = false) {
            this.connectingRooms = { north: undefined, east: undefined, south: undefined, west: undefined };
            this.size = size;
            this.offset = offset;
            this.fogged = false;
            this.hasRobot = hasRobot
            this.hasComputer = hasComputer
            this.hasDisabledComputer = false;
            this.visible = visible
        }
        setConnectingRoom(direction, room) {
            this.connectingRooms[direction] = room;
        }
    }

    function connectRooms(r1, r2, direction) {
        let room1 = rooms[r1]
        let room2 = rooms[r2]
        room1.setConnectingRoom(direction, room2);
        switch (direction) {
            case "north":
                room2.setConnectingRoom("south", room1);
                break;
            case "south":
                room2.setConnectingRoom("north", room1);
                break;
            case "east":
                room2.setConnectingRoom("west", room1);
                break;
            case "west":
                room2.setConnectingRoom("east", room1);
                break;
        }
    }

    let gameOver = false

    let startRoom = new Room([7, 3], [42, 27], false, false, true);
    let rooms = [startRoom];

    let roomSizes = [
        [19, 7], [11, 3], [7, 5], [7, 3], [11, 3], [7, 7], [7, 5], [15, 3], [7, 3], [7, 3], [7, 5], [11, 3], [7, 5], [7, 7], [7, 3], [7, 3], [11, 3], [15, 3], [7, 3], [11, 3], [7, 3], [7, 5], [7, 3], [15, 3], [7, 7], [11, 3], [19, 7], [7, 5], [7, 3], [7, 5], [7, 5], [11, 3], [7, 3], [7, 7], [7, 7], [11, 3], [11, 3], [11, 3], [11, 3], [7, 5], [15, 3], [11, 3], [7, 5], [19, 7], [11, 3], [11, 5], [11, 3], [6, 3]
    ];

    //[x,y]
    let roomOffsets = [
        [6, 1], [38, 3], [30, 5], [58, 5], [46, 7], [10, 9], [62, 9], [22, 11], [42, 11], [70, 11], [50, 13], [18, 15], [70, 15], [38, 17], [78, 17], [14, 19], [54, 19], [22, 21], [66, 21], [82, 21], [54, 23], [26, 25], [90, 25], [10, 27], [34, 27], [50, 27], [66, 27], [86, 29], [6, 31], [50, 33], [10, 35], [38, 35], [90, 35], [30, 37], [58, 37], [78, 37], [18, 39], [66, 39], [11, 43], [2, 46], [34, 45], [50, 45], [62, 47], [10, 49], [42, 51], [30, 53], [54, 53], [4, 42]
    ];

    const maxComputersRemaining = 4 - bossNetworkingScore
    let computersRemaining = maxComputersRemaining
    const computerRooms = [1, 27, 44].slice(0, computersRemaining)

    for (let i = 0; i < roomOffsets.length; i++) {
        rooms[i + 1] = new Room(roomSizes[i], roomOffsets[i]);
    }

    const robotRooms = (() => {
        let rand = splitmix32f(cyrb128("boss"))
        let rRooms = []
        if (bossManufacturingScore === 1) {
            var probability = 0.5
        } else if (bossManufacturingScore === 2) {
            var probability = 0.3
        } else {
            var probability = 9 / rooms.length //get approximately 9 robots
        }
        for (let i = 1; i < rooms.length; i++) {
            const r = rand()
            if (r < probability && !computerRooms.includes(i)) {
                rRooms.push(i)
            }
        }
        return rRooms
    })()

    for (const i of robotRooms) {
        rooms[i].hasRobot = true
    }

    for (const i of computerRooms) {
        rooms[i].hasComputer = true
    }

    if (bossReconScore >= 2) {
        for (const room of rooms) {
            room.fogged = true
        }
    }

    {
        // ROOM CONNECTIONS (this took way too long)
        connectRooms(0, 25, "west"); connectRooms(0, 26, "east"); //start
        connectRooms(25, 22, "west"); connectRooms(25, 32, "south"); //room1
        connectRooms(22, 24, "west"); connectRooms(22, 18, "north"); //room2
        connectRooms(24, 29, "south"); //room3
        connectRooms(29, 31, "south"); //room4
        connectRooms(31, 37, "east"); //room5
        connectRooms(37, 39, "south"); connectRooms(37, 34, "east"); //room6
        connectRooms(39, 48, "west"); //room7
        connectRooms(40, 44, "east"); connectRooms(40, 48, "north"); //room8
        connectRooms(44, 46, "east"); //room9
        connectRooms(46, 45, "east"); //room10
        connectRooms(45, 47, "east"); //room11
        connectRooms(47, 43, "north"); //room12
        connectRooms(43, 42, "west"); //room13
        connectRooms(42, 35, "north"); connectRooms(42, 41, "west"); //room14
        connectRooms(35, 38, "east"); connectRooms(35, 30, "west"); //room15
        connectRooms(38, 36, "east"); //room 16
        connectRooms(36, 33, "east"); //room17
        connectRooms(33, 28, "north"); //room18
        connectRooms(28, 27, "west"); connectRooms(28, 23, "north"); //room19
        connectRooms(23, 20, "north"); //room21
        connectRooms(20, 15, "north"); //room22
        connectRooms(15, 13, "west"); //room23
        connectRooms(13, 10, "north"); connectRooms(13, 19, "south"); //room24
        connectRooms(10, 7, "west"); //room25
        connectRooms(7, 4, "north"); //room26
        connectRooms(4, 5, "west"); //room27
        connectRooms(5, 2, "north"); connectRooms(5, 9, "south"); //room28
        connectRooms(2, 3, "west"); //room29
        connectRooms(3, 8, "south"); //room30 
        connectRooms(8, 12, "south"); //room31
        connectRooms(12, 6, "west"); connectRooms(12, 16, "south"); //room32
        connectRooms(6, 1, "north"); //room33
        connectRooms(16, 18, "east"); //room35
        connectRooms(18, 14, "east"); //room36
        connectRooms(9, 11, "east"); //room38
        connectRooms(11, 17, "south"); //room39
        connectRooms(17, 19, "east"); connectRooms(17, 21, "south"); //room40
        connectRooms(21, 26, "south"); //room42
        connectRooms(30, 32, "west"); //room44  
        connectRooms(32, 34, "west"); //room45
        connectRooms(34, 41, "south"); //room46
    }

    let playerPos = [45, 28]
    const maxHealth = 10
    let health = 10
    const playerHealthEmojis = ["🪦", "😣", "😞", "😟", "😕", "😐", "🙂", "😊", "😃", "😄", "😁"]

    const minSteps = 282 //probably slightly inaccurate, but this is about the minimum number of steps
    let timeRemaining = 1
    const timeDecline = bossSecurityScore === 3 ? (1 / minSteps / 3) : //3x optimal allowed
        bossSecurityScore === 2 ? (1 / minSteps / 2.25) : //2.25x optimal allowed
            (1 / minSteps / 1.5) //1.5x optimal allowed
    //const timeDecline = 0.1

    const CellTypes = Object.freeze({
        OUTSIDE: "x",
        WALL: "X",
        INSIDE_VISIBLE: " ",
        INSIDE_INVISIBLE: "-",
        INSIDE_FOGGED: "F",
        CONNECTION: "+",
        CONNECTION_INVISIBLE: "*",
        PLAYER: "P",
        COMPUTER: "C",
        COMPUTER_DISABLED: "c",
        SERVER: "S",
        SERVER_DISABLED: "s",
        ROBOT: "R",
    });

    function getRoomCenter(room) {
        return [room.offset[0] + Math.floor(room.size[0] / 2), room.offset[1] + Math.floor(room.size[1] / 2)]
    }

    let cells = undefined
    function renderToCells() {
        let width = Math.max(...(rooms.map(room => room.offset[0] + room.size[0] + 1)))
        let height = Math.max(...(rooms.map(room => room.offset[1] + room.size[1] + 1)))
        cells = Array.from({ length: height }, () => Array(width).fill(CellTypes.OUTSIDE));
        for (const room of rooms) {
            //carve out room borders
            for (let i = room.offset[1] - 1; i < room.offset[1] + room.size[1] + 1; i++) {
                for (let j = room.offset[0] - 1; j < room.offset[0] + room.size[0] + 1; j++) {
                    cells[i][j] = CellTypes.WALL;
                }
            }
        }
        for (const room of rooms) {
            //carve out rooms
            for (let i = room.offset[1]; i < room.offset[1] + room.size[1]; i++) {
                for (let j = room.offset[0]; j < room.offset[0] + room.size[0]; j++) {
                    cells[i][j] = room.visible ? CellTypes.INSIDE_VISIBLE : room.fogged ? CellTypes.INSIDE_FOGGED : CellTypes.INSIDE_INVISIBLE;
                }
            }
        }
        for (const room of rooms) {
            //add computer and server chars
            if (room.hasComputer && room.visible) {
                const c = room.hasDisabledComputer ? CellTypes.COMPUTER_DISABLED : CellTypes.COMPUTER
                const s = room.hasDisabledComputer ? CellTypes.SERVER_DISABLED : CellTypes.SERVER
                let computerLoc = getRoomCenter(room)
                cells[computerLoc[1]][computerLoc[0]] = c;
                for (delta of [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]]) {
                    const serverLoc = v2Add(computerLoc, delta)
                    cells[serverLoc[1]][serverLoc[0]] = s;
                }
            }
        }
        for (const room of rooms) {
            //add robot chars
            if (room.hasRobot && room.visible) {
                const robotPos = room.offset
                cells[robotPos[1]][robotPos[0]] = CellTypes.ROBOT
            }
        }
        function setConType(list, y, x, cType) {
            if (list[y][x] !== CellTypes.CONNECTION) {
                list[y][x] = cType;
            }
        }
        for (const room of rooms) {
            //draw connections
            let conType = (room.visible || room.fogged) ? CellTypes.CONNECTION : CellTypes.CONNECTION_INVISIBLE;
            for (const [con, cRoom] of Object.entries(room.connectingRooms)) {
                if (cRoom) {
                    switch (con) {
                        case "south":
                            for (let i = Math.max(room.offset[0], cRoom.offset[0]); i < Math.min((room.offset[0] + room.size[0]), (cRoom.offset[0] + cRoom.size[0])); i++) {
                                setConType(cells, room.offset[1] + room.size[1], i, conType);
                            }
                            break;
                        case "north":
                            for (let i = Math.max(room.offset[0], cRoom.offset[0]); i < Math.min((room.offset[0] + room.size[0]), (cRoom.offset[0] + cRoom.size[0])); i++) {
                                setConType(cells, room.offset[1] - 1, i, conType);
                            }
                            break;
                        case "east":
                            for (let i = Math.max(room.offset[1], cRoom.offset[1]); i < Math.min((room.offset[1] + room.size[1]), (cRoom.offset[1] + cRoom.size[1])); i++) {
                                setConType(cells, i, room.offset[0] + room.size[0], conType);
                            }
                            break;
                        case "west":
                            for (let i = Math.max(room.offset[1], cRoom.offset[1]); i < Math.min((room.offset[1] + room.size[1]), (cRoom.offset[1] + cRoom.size[1])); i++) {
                                setConType(cells, i, room.offset[0] - 1, conType);
                            }
                            break;
                    }
                }
            }
        }
        cells[playerPos[1]][playerPos[0]] = CellTypes.PLAYER
    }

    function getRooms(pos) {
        //check for in room
        for (const room of rooms) {
            if (pos[0] >= room.offset[0] && pos[0] < room.offset[0] + room.size[0] && pos[1] >= room.offset[1] && pos[1] < room.offset[1] + room.size[1]) {
                return [room]
            }
        }

        //check for between 2 rooms (connection)
        let room1 = undefined
        for (const room of rooms) {
            if ((pos[0] >= room.offset[0] - 1 && pos[0] < room.offset[0] + room.size[0] + 1 && pos[1] >= room.offset[1] - 1 && pos[1] < room.offset[1] + room.size[1] + 1)
                && !((pos[0] == room.offset[0] - 1 || pos[0] == room.offset[0] + room.size[0]) && (pos[1] == room.offset[1] - 1 || pos[1] == room.offset[1] + room.size[1]))) {
                if (room1 === undefined) {
                    room1 = room
                } else {
                    return [room1, room]
                }
            }
        }
    }

    //both must be odd
    const tableWidth = 45
    const tableHeight = 13
    const tableCellSize = 2
    let tCells = []
    let amountOnFire = 0
    function renderToTable() {
        const playerPosInTable = [(tableWidth - 1) / 2, (tableHeight - 1) / 2]
        const delta = v2Sub(playerPos, playerPosInTable)
        for (let row = 0; row < tCells.length; row++) {
            for (let col = 0; col < tCells[0].length; col++) {
                const cPos = v2Add([col, row], delta)
                let tcText = ""
                if(gameOver) {
                    var fireRand = splitmix32f(row ^ col)()
                }
                if (cPos[0] >= 0 && cPos[0] < cells[0].length && cPos[1] >= 0 && cPos[1] < cells.length) {
                    const cText = cells[cPos[1]][cPos[0]];
                    if (cText === CellTypes.OUTSIDE) {
                        if(!gameOver || fireRand > amountOnFire) {
                            tcText = "<div class='outside'>█</div>"
                        } else {
                            tcText = "<div class='emoji'>🔥</div>";
                        }
                    } else if (cText === CellTypes.WALL) {
                        if(!gameOver || fireRand + 0.5 > amountOnFire) {
                            tcText = "<div class='wall'>█</div>"
                        } else {
                            tcText = "<div class='emoji'>🔥</div>";
                        }
                    } else if (cText === CellTypes.INSIDE_VISIBLE) {
                        if(!gameOver || fireRand + 1 > amountOnFire) {
                            tcText = "<div class='inside-visible'></div>"
                        } else {
                            tcText = "<div class='emoji'>🔥</div>";
                        }
                    } else if (cText === CellTypes.INSIDE_FOGGED) {
                        if(!gameOver || fireRand + 0.75 > amountOnFire) {
                            tcText = "<div class='inside-invisible'>▓</div>"
                        } else {
                            tcText = "<div class='emoji'>🔥</div>";
                        }
                    } else if (cText === CellTypes.CONNECTION) {
                        if(!gameOver || fireRand + 0.75 > amountOnFire) {
                            tcText = "<div class='connection'>░</div>"
                        } else {
                            tcText = "<div class='emoji'>🔥</div>";
                        }
                    } else if (cText === CellTypes.PLAYER) {
                        if(computersRemaining > 0) {
                            tcText += `<div class='emoji'>${playerHealthEmojis[health]}</div>`
                        } else {
                            tcText += `<div class='emoji'>${playerHealthEmojis[10]}</div>`
                        }
                    } else if (cText === CellTypes.CONNECTION_INVISIBLE) {
                        if(!gameOver || fireRand + 0.75 > amountOnFire) {
                            tcText = "<div class='wall'>█</div>";
                        } else {
                            tcText = "<div class='emoji'>🔥</div>";
                        }
                    } else if (cText === CellTypes.INSIDE_INVISIBLE) {
                        if(!gameOver || fireRand + 0.75 > amountOnFire) {
                            tcText = "<div class='wall'>█</div>";
                        } else {
                            tcText = "<div class='emoji'>🔥</div>";
                        }
                    } else if (cText === CellTypes.ROBOT) {
                        if(computersRemaining > 0) {
                            tcText = "<div class='emoji'>🤖</div>";
                        } else {
                            tcText = "<div class='emoji'>🪦</div>";
                        }
                    } else if (cText === CellTypes.COMPUTER) {
                        tcText = "<div class='computer'>🖥️</div>";
                    } else if (cText === CellTypes.COMPUTER_DISABLED) {
                        tcText = "<div class='computer-disabled'>🖥️</div>";
                    } else if (cText === CellTypes.SERVER) {
                        tcText = "<div class='emoji'>🗄️</div>";
                    } else if (cText === CellTypes.SERVER_DISABLED) {
                        tcText = "<div class='emoji'>🔥</div>";
                    }
                }
                tCells[row][col].innerHTML = tcText;
            }
        }
    }

    function getComputerArrows() {
        const currentRooms = getRooms(playerPos)
        let arrows = []
        for (i of computerRooms) {
            if (rooms[i].hasDisabledComputer || currentRooms.includes(rooms[i])) {
                continue
            }
            const pos = getRoomCenter(rooms[i])
            arrows.push(v2Sub(pos, playerPos))
        }
        return arrows
    }

    function makeBorderWithArrows(arrows) {
        const mazeTopOuter = document.getElementById("mazeTopOuter");
        const mazeTopInner = document.getElementById("mazeTopInner");
        const mazeLeftOuter = document.getElementById("mazeLeftOuter");
        const mazeLeftInner = document.getElementById("mazeLeftInner");
        const mazeRightOuter = document.getElementById("mazeRightOuter");
        const mazeRightInner = document.getElementById("mazeRightInner");
        const mazeBottomOuter = document.getElementById("mazeBottomOuter");
        const mazeBottomInner = document.getElementById("mazeBottomInner");

        const cellsHeight = tableHeight * tableCellSize
        const cellsWidth = tableWidth * tableCellSize

        let topTextOuter = Array(cellsWidth + 4).fill(' ')
        let topTextInner = Array(cellsWidth + 4).fill('#'); topTextInner[0] = ' '; topTextInner[topTextInner.length - 1] = ' '
        let bottomTextOuter = topTextOuter.slice()
        let bottomTextInner = topTextInner.slice()
        let leftTextOuter = Array(cellsHeight).fill(' ')
        let leftTextInner = Array(cellsHeight).fill('#');
        let rightTextOuter = leftTextOuter.slice()
        let rightTextInner = leftTextInner.slice()

        //assume center of maze is (0, 0) and each cell has width and height 1
        const bottomY = Math.floor((cellsHeight + 4) / 2)
        const topY = -bottomY
        const rightX = Math.floor((cellsWidth + 4) / 2)
        const leftX = -rightX

        if (bossReconScore === 3) {
            for (const arrow of arrows) {
                if (v2Eq(arrow, [0, 0])) {
                    continue
                }
                let pos = rayRectIntersection(arrow[0], arrow[1], cellsWidth + 4, cellsHeight + 4)
                pos = pos.map(Math.round)

                let char = 'X'
                // const angle = Math.atan2(-arrow[1], arrow[0] * aspectRatio); // negative y because screen coords
                // const deg = (angle * 180 / Math.PI + 360) % 360;
                // if (deg >= 337.5 || deg < 22.5) char = '→';
                // else if (deg >= 22.5 && deg < 67.5) char = '↗';
                // else if (deg >= 67.5 && deg < 112.5) char = '↑';
                // else if (deg >= 112.5 && deg < 157.5) char = '↖';
                // else if (deg >= 157.5 && deg < 202.5) char = '←';
                // else if (deg >= 202.5 && deg < 247.5) char = '↙';
                // else if (deg >= 247.5 && deg < 292.5) char = '↓';
                // else if (deg >= 292.5 && deg < 337.5) char = '↘';
                char = `<span class="mazeArrow">${char}</span>`

                if (pos[1] === topY) {
                    topTextOuter[pos[0] + rightX - 1] = char
                } else if (pos[1] === bottomY) {
                    bottomTextOuter[pos[0] + rightX - 1] = char
                } else if (pos[0] === leftX) {
                    if (pos[1] === topY + 1) {
                        topTextInner[0] = char
                    } else if (pos[1] === bottomY - 1) {
                        bottomTextInner[0] = char
                    } else {
                        leftTextOuter[pos[1] + bottomY - 3] = char
                    }
                } else if (pos[0] === rightX) {
                    if (pos[1] === topY + 1) {
                        topTextInner[topTextInner.length - 1] = char
                    } else if (pos[1] === bottomY - 1) {
                        bottomTextInner[bottomTextInner.length - 1] = char
                    } else {
                        rightTextOuter[pos[1] + bottomY - 3] = char
                    }
                }
            }
        }

        topTextOuter = topTextOuter.join(""); topTextInner = topTextInner.join("")
        bottomTextOuter = bottomTextOuter.join(""); bottomTextInner = bottomTextInner.join("")
        leftTextOuter = leftTextOuter.join("<br>"); leftTextInner = leftTextInner.join("<br>")
        rightTextOuter = rightTextOuter.join("<br>"); rightTextInner = rightTextInner.join("<br>")

        mazeTopOuter.innerHTML = topTextOuter; mazeTopInner.innerHTML = topTextInner;
        mazeBottomOuter.innerHTML = bottomTextOuter; mazeBottomInner.innerHTML = bottomTextInner;
        mazeLeftOuter.innerHTML = leftTextOuter; mazeLeftInner.innerHTML = leftTextInner;
        mazeRightOuter.innerHTML = rightTextOuter; mazeRightInner.innerHTML = rightTextInner;
    }

    halfHealthPrinted = false
    function printHalfHealthWarning() {
        if (!halfHealthPrinted) {
            halfHealthPrinted = true
            document.getElementById("maze-status").innerHTML += `<br><span class='error'>Warning: The AI has breached the school's main server room! Half of your health remains!</span>`
        }
    }

    quarterHealthPrinted = false
    function printQuarterHealthWarning() {
        if (!quarterHealthPrinted) {
            quarterHealthPrinted = true
            document.getElementById("maze-status").innerHTML += `<br><span class='error'>Critical: The AI has compromised the student database and library systems! One quarter of your health remains!</span>`
        }
    }

    function printDeath() {
        document.getElementById("maze-status").innerHTML += `<br><br><span class='error'>The AI has overwhelmed the school's defenses. Total system failure imminent.</span>`
    }

    halfTimePrinted = false
    function printHalfTimeWarning() {
        if (!halfTimePrinted) {
            halfTimePrinted = true
            document.getElementById("maze-status").innerHTML += `<br><span class='error'>Alert: The AI has corrupted the grading system and attendance records! Half of your time remains!</span>`
        }
    }

    quarterTimePrinted = false
    function printQuarterTimeWarning() {
        if (!quarterTimePrinted) {
            quarterTimePrinted = true
            document.getElementById("maze-status").innerHTML += `<br><span class='error'>Emergency: The AI is accessing personal student files and security cameras! One quarter of your time remains!</span>`
        }
    }

    function printOutOfTime() {
        document.getElementById("maze-status").innerHTML += `<br><br><span class='error'>The AI has achieved total control of the school's infrastructure. Mission failed.</span>`
    }

    function updateHealthAndTime(newRoom) {
        if (newRoom !== undefined && newRoom.hasRobot) {
            health -= 1
        }
        timeRemaining = Math.max(0, timeRemaining - timeDecline)
    }

    function updateVisibleAndFogged(rooms) {
        for (const room of rooms) {
            room.visible = true
        }

        if (bossReconScore === 1) { //if higher, all rooms start fogged
            let c = rooms.flatMap(room => Object.values(room.connectingRooms));
            for (const connected of c) {
                if (connected) {
                    connected.fogged = true;
                }
            }
        }
    }

    function getBarColor(amount) {
        const zeroHue = 0
        const maxHue = 120
        return hslToHex(amount * maxHue + (1 - amount) * zeroHue, 100, 50)
    }

    function updateHealthbar() {
        const healthbar = document.getElementById('mazeHealthbar')
        const maxWidth = tableWidth * tableCellSize + 4
        let width = Math.ceil(health / maxHealth * maxWidth)
        if (width === 0) {
            healthbar.innerHTML = '<br>'
        } else {
            healthbar.innerHTML = `<span style='color:${getBarColor(health / maxHealth)}'>${'#'.repeat(width)}</span>`
        }
    }

    function updateTimebar() {
        const timebar = document.getElementById('mazeTimebar')
        const maxWidth = tableWidth * tableCellSize + 4
        let width = 0
        if (timeRemaining > 0) {
            width = 1 + Math.floor(timeRemaining * (maxWidth - 1))
        }
        if (width === 0) {
            timebar.innerHTML = '<br>'
        } else {
            timebar.innerHTML = `<span style='color:${getBarColor(timeRemaining)}'>${'#'.repeat(width)}</span>`
        }
    }

    function updateVisuals(rooms, newRoom) {
        updateVisibleAndFogged(rooms)
        renderToCells();
        renderToTable();
        makeBorderWithArrows(getComputerArrows());
        updateHealthbar()
        updateTimebar()
        if (newRoom !== undefined && newRoom.hasComputer && !newRoom.hasDisabledComputer) {
            printComputerFound()
        }

        if (timeRemaining === 0) {
            printOutOfTime()
        } else if (timeRemaining < 1 / 4) {
            printQuarterTimeWarning()
        } else if (timeRemaining < 1 / 2) {
            printHalfTimeWarning()
        }

        if (health === 0) {
            printDeath()
        } else if (health < maxHealth / 4) {
            printQuarterHealthWarning()
        } else if (health < maxHealth / 2) {
            printHalfHealthWarning()
        }
    }

    const keyToDir = { w: [0, -1], a: [-1, 0], s: [0, 1], d: [1, 0] }
    function move(delta) {
        const newPos = v2Add(playerPos, delta)
        const rooms = getRooms(newPos);
        if (gameOver || rooms === undefined) {
            return [false, rooms, undefined]; //tried to move into a wall or game is over
        }
        let newRoom = undefined
        for (const room of rooms) {
            if (room.visible === false) {
                newRoom = room
                break
            }
        }
        playerPos = v2Add(playerPos, delta)
        return [true, rooms, newRoom]
    }

    function makeReturn(won) {
        return { won, maxComputersRemaining, computersRemaining, maxTime: 1, timeRemaining, maxHealth, health }
    }

    function moveAndUpdate(delta) {
        const [moved, rooms, newRoom] = move(delta);
        if (!moved) {
            return;
        }
        updateHealthAndTime(newRoom)
        updateVisuals(rooms, newRoom)
        if (health === 0 || timeRemaining === 0) {
            gameOver = true
            removeEventListeners()
            renderToCells()
            renderToTable()
            const deathCutscene = setInterval(() => {
                amountOnFire += 0.005
                health = Math.max(0, Math.min(health, Math.floor((1.5 - amountOnFire) * 10 / 1.5)))
                updateHealthbar()
                renderToCells()
                renderToTable()
                if(amountOnFire > 1.1 && health === 0) {
                    endGame(makeReturn(false)) //TODO: decide when this should be shown
                }
                if(amountOnFire > 2) {
                    clearInterval(deathCutscene)
                }
            }, 75)
        }
    }

    function printComputerFound() {
        document.getElementById("maze-status").innerHTML += `<br>Computer #${maxComputersRemaining + 1 - computersRemaining} found! Walk up to it and press E to destroy it.`
    }

    function printComputerDisabled() {
        document.getElementById("maze-status").innerHTML += `<br><span class='win'>Computer #${maxComputersRemaining + 1 - computersRemaining} destroyed!</span>`
    }

    function printRemainingComputers(prefix) {
        if (computersRemaining === 0) {
            document.getElementById("maze-status").innerHTML += `${prefix}<span class='win'>All computers destroyed!<br><br>You win!</span>`
        } else if (computersRemaining === 1) {
            document.getElementById("maze-status").innerHTML += `${prefix}${computersRemaining} computer remains.`
        } else {
            document.getElementById("maze-status").innerHTML += `${prefix}${computersRemaining} computers remain.`
        }
    }

    function tryDisableComputer() {
        const rooms = getRooms(playerPos)
        if (rooms.length === 1 && rooms[0].hasComputer && !rooms[0].hasDisabledComputer && v2DistSquared(getRoomCenter(rooms[0]), playerPos) < 4) {
            rooms[0].hasDisabledComputer = true
            printComputerDisabled()
            computersRemaining--
            printRemainingComputers(' ')
            if (computersRemaining === 0) {
                gameOver = true
                removeEventListeners()
                endGame(makeReturn(true))
            }
        }
    }

    let table = undefined
    function handleKeydown(e) {
        if (["w", "a", "s", "d"].includes(e.key)) {
            moveAndUpdate(keyToDir[e.key])
        } else if (e.key === 'e') {
            tryDisableComputer()
            updateVisuals(getRooms(playerPos))
        }
    }

    function handleClick() {
        table.focus();
    }

    function removeEventListeners() {
        table.removeEventListener("keydown", handleKeydown)
        table.removeEventListener("click", handleClick)
    }

    table = document.createElement("table");
    const tbody = document.createElement("tbody");
    for (let row = 0; row < tableHeight; row++) {
        const tr = document.createElement("tr");
        tCells.push([]);

        for (let col = 0; col < tableWidth; col++) {
            const td = document.createElement("td");
            tr.appendChild(td);

            tCells[row].push(td);
        }

        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    table.setAttribute('tabindex', '0');
    table.addEventListener('keydown', handleKeydown);
    table.addEventListener('click', handleClick);
    document.getElementById("maze").appendChild(table);

    updateVisuals(getRooms(playerPos))
    printRemainingComputers('')
}

function setupBossPrep() {
    const effects = ["Effects of completing challenges on the boss fight:"]
    
    if (networkingScore === 1) {
        effects.push("Networking (Easy): You must deactivate 3 AI computers in the maze")
    } else if (networkingScore === 2) {
        effects.push("Networking (Medium): One computer is already gone! You must deactivate 2 AI computers in the maze")
    } else if (networkingScore === 3) {
        effects.push("Networking (Hard): Two computers are already gone! You only need to deactivate 1 AI computer in the maze")
    }
    
    if (manufacturingScore === 1) {
        effects.push("Manufacturing (Easy): Many hostile robots patrol the maze")
    } else if (manufacturingScore === 2) {
        effects.push("Manufacturing (Medium): Fewer hostile robots patrol the maze")
    } else if (manufacturingScore === 3) {
        effects.push("Manufacturing (Hard): Very few hostile robots patrol the maze")
    }
    
    if (reconScore === 1) {
        effects.push("Recon (Easy): Basic maze access granted")
    } else if (reconScore === 2) {
        effects.push("Recon (Medium): Enhanced fog of war allowing you to see layout of all rooms")
    } else if (reconScore === 3) {
        effects.push("Recon (Hard): X's on the edge of the screen point towards computer rooms")
    }
    
    if (securityScore === 1) {
        effects.push("Security (Easy): Basic time limit for the maze")
    } else if (securityScore === 2) {
        effects.push("Security (Medium): Extended time limit (1.5x normal)")
    } else if (securityScore === 3) {
        effects.push("Security (Hard): Maximum time limit (2x normal)")
    }
    
    document.getElementById("bossfightEffects").innerHTML = effects.join("<br>")
}

function setupBossStation() {
    setupBossPrep()
    setupBoss(endingData => {
        endingState = endingData
        makeEnding()
        show("seeEndingButton")
    })
}