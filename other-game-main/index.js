let canvas = document.getElementById('canv');
let ctx = canvas.getContext('2d');

let scoreCanvas = document.getElementById('canvScore').getContext('2d');

let colors = ['#45ff83','#458cff','#e945ff','#8f1c9e','#ff4284','#ff3030'];
let color = colors[Math.floor(Math.random() * colors.length)];

let params = new URLSearchParams(location.search);
let FrameGlitchDeb = 0
if (params.get('hex') !== null) {
    color = '#' + params.get('hex');
}



let position = [200, 450];
let direction = 'LEFT';

let PlayerScore = 0

let PlayerSpeed = 3;
let ObjSpeed = 3;

let BorderKill = false;
let ObjMode = 'Baby';
let GeneratedObj = true;

let ObjColours = ['#b30000','#ed0909','#b81d1d','#730000'];
let ObjColour = '#b30000';
ObjColour = ObjColours[Math.floor(Math.random() * ObjColours.length)];


function swapBorderColor(col) {
    document.getElementById('canv').style.border = '5px solid ' + col;
    document.getElementById('canvScore').style.border = '5px solid ' + col;
}
function ChangeBorderSize(NewSizePx) {
    document.getElementById('canv').style.border = document.getElementById('canv').style.border.replace('5px', NewSizePx); 
    document.getElementById('canvScore').style.border = document.getElementById('canvScore').style.border.replace('5px', NewSizePx); 
}

// struct [ color, xposition ]
let rows = [ 
    [ 
        0, 30
    ], 
    [  
        0, 45
    ] 
];

//Generated Positions
let GenerPos = [10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400]

if (params.get('mode') !== null && params.get('mode') == 'static') {
    ObjMode = 'Static';
    GeneratedObj = false;
}

let zeroKeyed = false;
let GeneratedRows = []
let GeneratedRowsPlaces = []
if (GeneratedObj == true) {
    GeneratedRows.push(GenerPos[Math.floor(Math.random() * GenerPos.length)])
    GeneratedRowsPlaces.push(0)
} else {
    GeneratedRows.push(50);
    GeneratedRowsPlaces.push(0);
}



let topGround = '#24a333';
let underGround = '#4d1919';

//Keybinds
document.onkeydown = e => {
    ///if (direction == 'DEAD') return;

    switch (e.keyCode) {
        case 32: // SPACE
            if (direction == 'WINNER' || direction == 'DEAD') {
                GeneratedRows = [];
                PlayerScore = 0;
                GeneratedRowsPlaces = [];
                ObjMode = 'Baby';
                direction = 'LEFT';
                topGround = '#24a333';
                underGround = '#4d1919';
                swapBorderColor('#293492');
                BorderKill = false; 
                position = [200, 450];
            }
        break;

        case 37: // LEFT
            if (direction == 'WINNER' && !zeroKeyed || direction == 'DEAD') return;
            direction = 'LEFT';
        break;

        case 39: // RIGHT
            if (direction == 'WINNER' && !zeroKeyed || direction == 'DEAD') return;
            direction = 'RIGHT';
        break;

        case 48: // ZEROKEY
            if (direction !== 'WINNER' || zeroKeyed || direction == 'DEAD') return;
            direction = 'LEFT'
            zeroKeyed = true;
            GeneratedRows = [];
            GeneratedRowsPlaces = [];
            swapBorderColor('red');
            ObjMode = 'TrueHyperGodOfInfiniteDeath'
            topGround = '#680606';
            underGround = '#141212';
        break;
    }
}



setInterval(() => {
    //Background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 1000, 1000);

    scoreCanvas.fillStyle = 'black';
    scoreCanvas.fillRect(0, 0, 1000, 1000);

    ctx.fillStyle = topGround;
    ctx.fillRect(0, 450+15, 1000, 1000);

    ctx.fillStyle = underGround;
    ctx.fillRect(0, 450+25, 1000, 1000);

    //Player
    ctx.fillStyle = color;
    ctx.fillRect(position[0], position[1], 15, 15);

    let ModeCol = '#a60000';

    scoreCanvas.font = "15px monospace";
    scoreCanvas.fillStyle = '#a60000';
    scoreCanvas.fillText(`Score: ${PlayerScore}`, 20, 40);
    scoreCanvas.fillStyle = ModeCol;
    scoreCanvas.fillText(`Mode: ${ObjMode}`, 20, 70);

    if (position[0] < 0 || position[0] > 400) {
        if (BorderKill == true) {
            direction = 'DEAD';
        } else {
            if (direction == 'LEFT') {
                direction = 'RIGHT'
            } else {
                direction = 'LEFT'
            }
        }
    }

    if (position[0] < -5 || position[0] > 404) {
        direction = 'DEAD';
    }
    
    //Obsticles

    // position[1] = y of player at the top of the palyer
    // position[0] = x of player left line of player
    

    function CheckHitbox(GivenObjPxSize, ObjXPos, ObjYPos) {
        let ObjPxSize = GivenObjPxSize - 1
        
        let BottomObjYPos = ObjYPos + ObjPxSize
        let FarReachObjX = ObjXPos + ObjPxSize
        let BackReachObjX = ObjXPos - ObjPxSize

        //console.log(BackReachObjX, position[0], FarReachObjX)

        if (BottomObjYPos >= position[1]) {
            if (ObjYPos <= position[1]) {
                if (BackReachObjX < position[0]){
                    if (FarReachObjX > position[0]) {
                        //console.log('X: ',BackReachObjX, position[0], FarReachObjX)
                        //console.log('Y: ',BottomObjYPos, position[1])
                        return true;
                    }
                }
            }
        } else {
            return false;
        }         
    }
    
     //Direction Handler
     switch (direction) {
        case 'LEFT':
            position[0] = position[0] - PlayerSpeed;
        break;
        
        case 'RIGHT':
            position[0] = position[0] + PlayerSpeed;
        break;

        case 'DEAD':            
            ctx.font = '50px monospace';
            ctx.fillStyle = '#a60000';
            ctx.fillText('GAME OVER', 63, 262.5)
        break;

        case 'WINNER':
            ctx.font = '50px monospace';
            ctx.fillStyle = '#fcbe03';
            ctx.fillText('YOU WIN!', 63, 262.5)
            swapBorderColor('#fcbe03')
        break;
    }

    if (direction == 'DEAD' || direction == 'WINNER') return;

    function RunRows() {
        GeneratedRows.forEach(function(ObjX, ObjXIndex) {
            let ObjY = GeneratedRowsPlaces[ObjXIndex]
            //console.log(ObjY,ObjXIndex)

            ctx.fillStyle = ObjColour
            ctx.fillRect(ObjX, ObjY, 15, 15);

            if (CheckHitbox(15, ObjX, ObjY)) {
                direction = 'DEAD';       
            }
            GeneratedRowsPlaces[ObjXIndex] = ObjY + ObjSpeed
            
            if (GeneratedRowsPlaces[ObjXIndex] >= 525) {
                PlayerScore = PlayerScore + 1
                GeneratedRows.shift(ObjXIndex)
                GeneratedRowsPlaces.shift(ObjXIndex)
            }

        });
    }

    if (GeneratedObj) {
        switch (ObjMode) {
            case 'Genocide':
                if (Math.floor(Math.random() * 1) == 0) {
                    GeneratedRows.push(GenerPos[Math.floor(Math.random() * GenerPos.length)])
                    GeneratedRowsPlaces.push(0)
                }
    
                RunRows();
            break;
    
            case 'TrueHyperGodOfInfiniteDeath':
                if (Math.floor(Math.random() * 2) == 1) {
                    GeneratedRows.push(GenerPos[Math.floor(Math.random() * GenerPos.length)])
                    GeneratedRowsPlaces.push(0)
                }
    
                RunRows();
            break;
    
            case 'InfiniteDeath':
                if (Math.floor(Math.random() * 3) == 1) {
                    GeneratedRows.push(GenerPos[Math.floor(Math.random() * GenerPos.length)])
                    GeneratedRowsPlaces.push(0)
                }
    
                RunRows();
            break;
    
            case 'Baby':
                if (Math.floor(Math.random() * 30) == 1) {
                    GeneratedRows.push(GenerPos[Math.floor(Math.random() * GenerPos.length)])
                    GeneratedRowsPlaces.push(0)
                }
    
                RunRows();
            break;
            
            case 'Easy':
                if (Math.floor(Math.random() * 20) == 1) {
                    GeneratedRows.push(GenerPos[Math.floor(Math.random() * GenerPos.length)])
                    GeneratedRowsPlaces.push(0)
                }
    
                RunRows();
            break;
    
            case 'Medium':
                if (Math.floor(Math.random() * 15) == 1) {
                    GeneratedRows.push(GenerPos[Math.floor(Math.random() * GenerPos.length)])
                    GeneratedRowsPlaces.push(0)
                }
    
                RunRows();
            break;
    
            case 'Hard':
                if (Math.floor(Math.random() * 8) == 1) {
                    GeneratedRows.push(GenerPos[Math.floor(Math.random() * GenerPos.length)])
                    GeneratedRowsPlaces.push(0)
                }
    
                RunRows();
            break;
    
            case 'Deadly':
                if (Math.floor(Math.random() * 5) == 1) {
                    GeneratedRows.push(GenerPos[Math.floor(Math.random() * GenerPos.length)])
                    GeneratedRowsPlaces.push(0)
                }
    
                RunRows();
            break;
        }
    } else {
        switch (ObjMode) {
            case 'Static':
                GeneratedRows.push(100);
                GeneratedRowsPlaces.push(0);
                GeneratedRows.push(300);
                GeneratedRowsPlaces.push(0);
                GeneratedRows.push(200);
                GeneratedRowsPlaces.push(0);
                GeneratedRows.push(400);
                GeneratedRowsPlaces.push(0);
            break;
        }
        RunRows();
    }



    switch (PlayerScore) {
        case 0:
            ObjMode = 'Baby'
            PlayerSpeed = 3
        break;
        case 5:
            ObjMode = 'Easy'
            PlayerSpeed = 3
        break;
        case 50:
            ObjMode = 'Medium'
            PlayerSpeed = 4
        break;
        case 175:
            ObjMode = 'Hard'
            PlayerSpeed = 5
        break;
        case 350:
            ObjMode = 'Deadly'
            PlayerSpeed = 6
        break;
        case 500:
            ObjMode = 'InfiniteDeath'
            PlayerSpeed = 7
        break;
        case 575:
            if (zeroKeyed) return;
            direction = 'WINNER'
        break;
        case 576:
            ObjMode = 'TrueHyperGodOfInfiniteDeath'
            PlayerSpeed = 7
        break;
        case 900:
            ObjMode = 'Genocide'
            PlayerSpeed = 7
        break;

        default:
            null;
    }

    if (PlayerScore > 499) {
        if (direction != 'WINNER') {
            BorderKill = true
            swapBorderColor('red')
            if (zeroKeyed) {
                swapBorderColor('red')
                if (FrameGlitchDeb == 0) {
                    FrameGlitchDeb = 10
                    swapBorderColor('#6e1818')
                    ChangeBorderSize('6px')
                    ModeCol = '#ad2626'
                } else if (FrameGlitchDeb != 0) {
                    FrameGlitchDeb = FrameGlitchDeb - 1
                    ChangeBorderSize('5px')
                    ModeCol = '#ad2626'
                }
            }
        }
    }

}, 25)

//We have reached the end!
