class GreetingCard {
    constructor() {
        this.currentCycle = 1;
        this.openedCount = 0;
        this.openedIndices = new Array(9).fill(false);

        this.grid = document.getElementById('grid');
        this.resetBtn = document.getElementById('resetBtn');

        this.init();
    }

    init() {
        this.createGrid();
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    createGrid() {
        this.grid.innerHTML = '';

        for (let i = 0; i < 9; i++) {

            const item = document.createElement('div');
            item.className = 'grid-item';

            const inner = document.createElement('div');
            inner.className = 'card-inner';

            const front = document.createElement('div');
            front.className = 'card-face card-front';

            const back = document.createElement('div');
            back.className = 'card-face card-back';

            const photoIndex = i + 1;

            const cleanImg = document.createElement('img');
            cleanImg.src = `photos/clean/${photoIndex}.webp`;

            const letterImg = document.createElement('img');

            front.appendChild(cleanImg);
            back.appendChild(letterImg);

            inner.appendChild(front);
            inner.appendChild(back);
            item.appendChild(inner);

            item.addEventListener('click', () => this.handleClick(i));

            this.grid.appendChild(item);
        }
    }

    handleClick(index) {
        if (this.openedIndices[index]) return;

        this.openedIndices[index] = true;
        this.openedCount++;

        const item = this.grid.children[index];
        const photoIndex = index + 1;
        const cycleFolder = this.currentCycle === 1 ? 'cycle1' : 'cycle2';

        const backImg = item.querySelector('.card-back img');
        backImg.src = `photos/${cycleFolder}/${photoIndex}.webp`;

        item.classList.add('flipped');

        this.checkCycleComplete();
    }

    checkCycleComplete() {
        if (this.openedCount === 9) {

            if (this.currentCycle === 1) {

                // 4 секунды на прочтение
                setTimeout(() => {
                    this.startSecondCycle();
                }, 4000);

            } else {

                setTimeout(() => {
                    this.showFinalGreeting();
                }, 2000);

            }
        }
    }

    startSecondCycle() {
        this.currentCycle = 2;
        this.openedCount = 0;
        this.openedIndices = new Array(9).fill(false);

        // мягкий возврат карточек
        setTimeout(() => {
            for (let i = 0; i < 9; i++) {
                this.grid.children[i].classList.remove('flipped');
            }
        }, 200);
    }

    showFinalGreeting() {
        // Финальное поздравление с анимацией
        const notification = document.createElement('div');
        notification.textContent = '🎉 С 8 марта, девушки! 🎉';
        notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(212, 78, 108, 0.95);
        color: white;
        padding: 20px 30px;
        border-radius: 50px;
        font-size: 20px;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: fadeInOut 3s ease;
    `;

        document.body.appendChild(notification);

        // Убираем уведомление через 3 секунды
        setTimeout(() => {
            notification.remove();
            window.location.href = "https://t.me/bachata_orsk";
        }, 3000);

        // Лёгкий "bounce" для всех карточек
        this.grid.querySelectorAll('.grid-item').forEach((item, i) => {
            item.style.transition = 'transform 0.3s ease';
            item.style.transform = 'scale(1.05)';
            setTimeout(() => item.style.transform = 'scale(1)', 150);
        });
    }

    reset() {
        this.currentCycle = 1;
        this.openedCount = 0;
        this.openedIndices = new Array(9).fill(false);

        for (let i = 0; i < 9; i++) {
            this.grid.children[i].classList.remove('flipped');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GreetingCard();
});