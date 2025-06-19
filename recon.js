function checkReconSelection(buttonParent, allowedIdentities, disallowedIdentities) {
    const buttons = document.querySelectorAll(`${buttonParent} button`);
    for(const button of buttons) {
        let station = undefined
        for(let s = 10; s > 0; s--) {
            if(button.innerText.includes(`${s}`)) {
                station = s-1 //so its 0-indexed
                break
            }
        }
        if(button.classList.contains("toggled")) {
            if(!allowedIdentities.includes(messageIdentities[station]) || disallowedIdentities.includes(messageIdentities[station])) {
                return false
            }
        } else {
            if(allowedIdentities.includes(messageIdentities[station])) {
                return false
            }
        }
    }
    return true
}

const checkRobotSelection = function(){
    let wonAlready = false
    return function() {
        if(wonAlready) {
            return
        }
        const won = checkReconSelection("#reconEasySelectButtons", ['robot'], ['doubleAgent', 'human'])
        if(won) {
            wonAlready = true
            setReconScore(1);
            show("reconRobotIdentifyWin")
            show("reconRobotNextStep")
            hide("reconRobotIdentifyError")
        } else {
            show("reconRobotIdentifyError")
        }
    }
}()

const checkDoubleAgentSelection = function(){
    let wonAlready = false
    return function() {
        if(wonAlready) {
            return
        }
        const won = checkReconSelection("#reconMediumSelectButtons", ['doubleAgent'], ['robot', 'human'])
        if(won) {
            wonAlready = true
            setReconScore(2);
            show("reconDoubleAgentIdentifyWin")
            show("reconDoubleAgentNextStep")
            hide("reconDoubleAgentIdentifyError")
        } else {
            show("reconDoubleAgentIdentifyError")
        }
    }
}()

function showMessage(num) { //num is 1-indexed
    document.getElementById("reconMessageTitle").innerText = `## Message #${num} ##`.slice(0, 16)
    document.getElementById("reconMessageText").innerText = messagesCiphered[num-1]
}

const prevOrNext = function(){
    let currentMessage = 1
    return function(delta) {
        currentMessage += delta
        if(currentMessage > 10) {
            currentMessage -= 10
        } else if(currentMessage < 1) {
            currentMessage += 10
        }
        showMessage(currentMessage)
    }
}()

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("reconMediumSelectButtons").innerHTML = document.getElementById("reconEasySelectButtons").innerHTML
    showMessage(1)
});