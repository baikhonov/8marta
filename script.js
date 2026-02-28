class GreetingCard {
    constructor() {
        this.sets = ['set1', 'set2']; // наборы фоток
        this.currentSetIndex = 0;
        this.openedCount = 0;
        this.openedIndices = new Array(9).fill(false);
        this.isFinished = false; // после второго сета блокируем все действия

        this.grid = document.getElementById('grid');
        this.resetBtn = document.getElementById('resetBtn');

        this.init();
    }

    init() {
        this.createGrid();
        this.loadCleanImages();
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

            const cleanImg = document.createElement('img');
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

    loadCleanImages(forHint = true) {
        const setName = this.sets[this.currentSetIndex];

        this.openedCount = 0;
        this.openedIndices = new Array(9).fill(false);

        for (let i = 0; i < 9; i++) {
            const item = this.grid.children[i];
            const cleanImg = item.querySelector('.card-front img');
            const backImg = item.querySelector('.card-back img');

            // перезаписываем front только если игра не закончена
            if (!this.isFinished) {
                cleanImg.src = `photos/${setName}/clean/${i + 1}.webp`;
            }

            backImg.src = ''; // очищаем letters
            item.classList.remove('flipped');
        }

        // hint-анимация только если игра не закончена
        if (forHint && !this.isFinished) {
            this.grid.querySelectorAll('.grid-item').forEach(item => {
                item.classList.add('hint');
            });
        }
    }

    handleClick(index) {
        if (this.isFinished || this.openedIndices[index]) return;

        this.openedIndices[index] = true;
        this.openedCount++;

        const setName = this.sets[this.currentSetIndex];
        const item = this.grid.children[index];
        const backImg = item.querySelector('.card-back img');

        backImg.src = `photos/${setName}/letters/${index + 1}.webp`;

        // удаляем hint и переворачиваем
        item.classList.remove('hint');
        item.classList.add('flipped');

        if (this.openedCount === 9) {
            // задержка на прочтение букв
            setTimeout(() => this.nextSetOrFinish(), 4000);
        }
    }

    nextSetOrFinish() {
        if (this.currentSetIndex + 1 < this.sets.length) {
            this.currentSetIndex++;
            this.loadCleanImages();
        } else {
            this.isFinished = true;
            this.showFinalGreeting();
        }
    }

    showFinalGreeting() {
        // отключаем клики по сетке
        this.grid.style.pointerEvents = 'none';

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

        setTimeout(() => {
            notification.remove();
            setTimeout(() => {
                window.location.href = "https://t.me/bachata_orsk";
            }, 2000);
        }, 3000);

        // лёгкий bounce всех карточек
        this.grid.querySelectorAll('.card-inner').forEach(inner => {
            inner.style.transition = 'transform 0.3s ease';
            inner.style.transform = 'scale(1.05)';
            setTimeout(() => inner.style.transform = 'scale(1)', 150);
        });
    }

    reset() {
        this.isFinished = false;
        this.currentSetIndex = 0;
        this.loadCleanImages();
        this.grid.style.pointerEvents = 'auto';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GreetingCard();
});