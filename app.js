document.addEventListener("DOMContentLoaded", function () {
    const scoreElement = document.getElementById("score");
    const imageContainer = document.getElementById("imageContainer");
    const clickImage = document.getElementById("clickImage");
    const progressBarFill = document.getElementById("progressBarFill");
  
    let tg = window.Telegram.WebApp;
    tg.expand();

	clickImage.style.transform = "scale(0.95)";
    document.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    });

    let score = parseFloat(localStorage.getItem("strk")) || 5.00;

    
    function updateScoreDisplay() {
        scoreElement.textContent = `STRK: ${score.toFixed(2)}$`;
        progressBarFill.style.width = (score / 5.00) * 100 + "%";
    }

    
    updateScoreDisplay();
	
		

    function decreaseScore(x, y) {
        if (score > 0.00) {
            score -= 0.01;
            localStorage.setItem("strk", score.toFixed(2)); // Сохранение в localStorage
            updateScoreDisplay();
            createFlyingText(x, y);
        }

        if (score <= 0.00) {
            score = 0.00;
            startRecovery();
        }
		
		clickImage.style.transform = "scale(1)";
        setTimeout(() => {
            clickImage.style.transform = "scale(0.95)";
        }, 100);

        createFlyingScore(x, y);
    }

    function createFlyingText(x, y) {
        const flyingText = document.createElement("div");
        flyingText.className = "flying-text";
        flyingText.textContent = "Dev🤡Sell";

        
        const offsetX = 50;
        const offsetY = 50;
        flyingText.style.left = x - imageContainer.getBoundingClientRect().left - offsetX + "px";
        flyingText.style.top = y - imageContainer.getBoundingClientRect().top - offsetY + "px";

        imageContainer.appendChild(flyingText);

        
        setTimeout(() => {
            flyingText.remove();
        }, 1000);
    }
	
    function startRecovery() {
        const recoveryRatePerDay = 0.30;
        const recoveryInterval = 24 * 60 * 60 * 1000; // 24 часа в миллисекундах

        let lastRecoveryTime = localStorage.getItem('lastRecoveryTime') ? parseInt(localStorage.getItem('lastRecoveryTime')) : Date.now();
        
        const recovery = setInterval(() => {
            const now = Date.now();
            const elapsed = now - lastRecoveryTime;
            const recoveryAmount = (elapsed / recoveryInterval) * recoveryRatePerDay;

            if (score < 5.00) {
                score += recoveryAmount;
                if (score > 5.00) score = 5.00;

                localStorage.setItem('lastRecoveryTime', now);
                updateScoreDisplay();
            } else {
                clearInterval(recovery); // Останавливаем восстановление при достижении 5.00
            }
        }, 1000); // Проверяем каждые 1 секунду
    }

    function handleTouchStart(event) {
        event.preventDefault();
        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            decreaseScore(touch.clientX, touch.clientY);
        }
    }

    function handleClick(event) {
        decreaseScore(event.clientX, event.clientY);
    }

    // Добавляем события клика и касания
    if ('ontouchstart' in window) {
        imageContainer.addEventListener("touchstart", handleTouchStart);
    } else {
        imageContainer.addEventListener("click", handleClick);
    }
});
