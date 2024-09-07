document.addEventListener("DOMContentLoaded", function () {
    const scoreElement = document.getElementById("strk");
    const imageContainer = document.getElementById("imageContainer");
    const clickImage = document.getElementById("clickImage");
    const progressBarFill = document.getElementById("progressBarFill");
    const energyElement = document.getElementById("energy");

    let tg = window.Telegram.WebApp;
    tg.expand()
  

    let score = parseFloat(localStorage.getItem("strk")) || 5.00;
	let scoreElement = document.getElementById("strk");

	scoreElement.textContent = `STRK: ${score.toFixed(2)}`;
    let clicksRemaining = 50; 
    let isEnergyFull = false;
    let recoveryStartTime = localStorage.getItem('recoveryStartTime') ? parseInt(localStorage.getItem('recoveryStartTime')) : 0;

    clickImage.style.transform = "scale(0.75)";
    energyElement.style.display = "none";

    
    scoreElement.textContent = score.toFixed(2);
    progressBarFill.style.width = (score % 100) + "%";

    function increaseScore(x, y) {
        if (isEnergyFull) return;

        
        clicksRemaining--;

        if (clicksRemaining <= 0) {
            startRecovery();
            return;
        }


        let progress = (score % 100) / 100;
        progressBarFill.style.width = progress * 100 + "%";

        
        clickImage.style.transform = "scale(0.8)";
        setTimeout(() => {
            clickImage.style.transform = "scale(0.75)";
        }, 100);

        createFlyingScore(x, y);
    }

    function createFlyingScore(x, y) {
        const flyingScore = document.createElement("div");
        flyingScore.className = "flying-score";
        flyingScore.textContent = "DEV 🤡 Sell";

        const offsetX = 100;
        const offsetY = 100;
        flyingScore.style.left = x - imageContainer.getBoundingClientRect().left - offsetX + "px";
        flyingScore.style.top = y - imageContainer.getBoundingClientRect().top - offsetY + "px";

        imageContainer.appendChild(flyingScore);

        setTimeout(() => {
            flyingScore.remove();
        }, 100);
    }

    function startRecovery() {
        isEnergyFull = true;
        recoveryStartTime = Date.now();
        localStorage.setItem('recoveryStartTime', recoveryStartTime);
        energyElement.style.display = "block";
        updateEnergyDisplay();
    }

    function updateEnergyDisplay() {
        const recoveryEndTime = recoveryStartTime + (1 * 60 * 60 * 1000);
        const remainingTime = Math.max(0, recoveryEndTime - Date.now());

        if (remainingTime > 0) {
            energyElement.textContent = `Recovery in progress: ${formatTime(remainingTime)}`;
            setTimeout(updateEnergyDisplay, 1000);
        } else {
            
            isEnergyFull = false;
            clicksRemaining = 50;
            energyElement.style.display = "none";
        }
    }

    function formatTime(ms) {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    function handleTouchStart(event) {
        event.preventDefault();

        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            increaseScore(touch.clientX, touch.clientY);
        }
    }

    function handleClick(event) {
        increaseScore(event.clientX, event.clientY);
    }

    
    if ('ontouchstart' in window) {
        imageContainer.addEventListener("touchstart", handleTouchStart);
    } else {
        imageContainer.addEventListener("click", handleClick);
    }
});
