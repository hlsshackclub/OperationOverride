function makeEnding() {
  console.log(endingState)

  const titleElement = document.getElementById("endingTitle")
  const messageElement = document.getElementById("endingMessage")
  if (!endingState) {
    titleElement.textContent = "System Error"
    messageElement.innerHTML = "<p>Unable to determine mission outcome. Please try again.</p>"
    return
  }

  const { won, maxComputersRemaining, computersRemaining, timeRemaining, health } = endingState
  if (won) {
    titleElement.textContent = "MISSION ACCOMPLISHED"
    titleElement.style.color = "#00ff00"
    titleElement.style.backgroundColor = "#000000"

    const computersDestroyed = maxComputersRemaining - computersRemaining
    const timePercent = timeRemaining * 100

    const stationScores = [networkingScore, manufacturingScore, reconScore, securityScore]
    const hardStations = stationScores.filter(score => score === 3).length
    const victoryMessage = `
            <p>The AI has been defeated. Heart Lake Secondary School is secure.</p>
            <br>
            <p>Mission Statistics:</p>
            <p>AI Computers Destroyed: <span class="win">${computersDestroyed}/${maxComputersRemaining}</span></p>
            <p>Health Remaining: <span class="win">${health}/10</span></p>
            <p>Time Remaining: <span class="win">${(timePercent).toFixed(1)}%</span></p>
            <p>Hard Challenges Completed: <span class="win">${hardStations}</span></p>
        `

    messageElement.innerHTML = victoryMessage
  } else {
    titleElement.textContent = "MISSION FAILED"
    titleElement.style.color = "#ff0000"
    titleElement.style.backgroundColor = "#000000"

    const computersDestroyed = maxComputersRemaining - computersRemaining
    const timePercent = timeRemaining * 100

    const stationScores = [networkingScore, manufacturingScore, reconScore, securityScore]
    const hardStations = stationScores.filter(score => score === 3).length

    let defeatCause = ""
    if (health === 0 && timeRemaining > 0) {
      defeatCause = "Health depleted"
    } else if (timeRemaining === 0 && health > 0) {
      defeatCause = "Time expired"
    } else {
      defeatCause = "Health and time depleted"
    }
    const defeatMessage = `
            <p>The AI maintains control of Heart Lake Secondary School.</p>
            <p>Cause of failure: ${defeatCause}</p>
            <br>
            <p>Final Statistics:</p>
            <p>AI Computers Destroyed: <span class="error">${computersDestroyed}/${maxComputersRemaining}</span></p>
            <p>Final Health: <span class="error">${health}/10</span></p>
            <p>Time Remaining: <span class="error">${(timePercent).toFixed(1)}%</span></p>
            <p>Hard Challenges Completed: <span class="error">${hardStations}</span></p>
        `

    messageElement.innerHTML = defeatMessage
  }
}