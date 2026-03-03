class GreetingCard {
    constructor() {
        this.sets = ['set1', 'set2'];
        this.currentSetIndex = 0;
        this.openedCount = 0;
        this.openedIndices = new Array(9).fill(false);

        this.isFinished = false;
        this.isTransitioning = false;
        this.finalShown = false;
        this.notificationTimeout = null;

        this.grid = document.getElementById('grid');
        this.resetBtn = document.getElementById('resetBtn');
        this.thanksBtn = document.getElementById('thanksBtn');

        this.init();
    }

    init() {
        this.createGrid();
        this.loadCleanImages();
        this.resetBtn.addEventListener('click', () => this.reset());
        this.thanksBtn.addEventListener('click', () => this.thanks());
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
        this.isTransitioning = false;

        this.grid.style.pointerEvents = 'auto';

        for (let i = 0; i < 9; i++) {
            const item = this.grid.children[i];
            const cleanImg = item.querySelector('.card-front img');
            const backImg = item.querySelector('.card-back img');

            if (!this.isFinished) {
                cleanImg.src = `photos/${setName}/clean/${i + 1}.webp`;
            }

            backImg.src = '';
            item.classList.remove('flipped');
        }

        if (forHint && !this.isFinished) {
            this.grid.querySelectorAll('.grid-item').forEach(item => {
                item.classList.add('hint');
            });
        }
    }

    handleClick(index) {
        if (this.isFinished || this.isTransitioning || this.openedIndices[index]) return;

        this.openedIndices[index] = true;
        this.openedCount++;

        const setName = this.sets[this.currentSetIndex];
        const item = this.grid.children[index];
        const backImg = item.querySelector('.card-back img');

        backImg.src = `photos/${setName}/letters/${index + 1}.webp`;

        item.classList.remove('hint');
        item.classList.add('flipped');

        if (this.openedCount === 9) {
            this.isTransitioning = true;
            this.grid.style.pointerEvents = 'none';

            setTimeout(() => this.nextSetOrFinish(), 1000);
        }
    }

    nextSetOrFinish() {
        if (this.currentSetIndex + 1 < this.sets.length) {

            this.currentSetIndex++;
            this.showSetNotification();
            this.loadCleanImages();

        } else {

            if (this.finalShown) return;   // ключевая защита
            this.finalShown = true;

            this.isFinished = true;
            this.showFinalGreeting();
        }
    }

    showSetNotification() {
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }

        const notification = document.createElement('div');
        notification.className = 'cycle-notification';
        notification.textContent = 'Это ещё не всё 😉';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 15px 25px;
            border-radius: 50px;
            font-size: 18px;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            border: 2px solid white;
        `;

        document.body.appendChild(notification);

        this.notificationTimeout = setTimeout(() => {
            notification.remove();
            this.notificationTimeout = null;
        }, 2000);
    }

    showFinalGreeting() {
        const notification = document.createElement('div');
        notification.textContent = 'Вы у нас самые лучшие! Спасибо за то, что вы есть ❤️';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 15px 25px;
            border-radius: 50px;
            font-size: 18px;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            border: 2px solid white;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
            this.showThanksButton();
        }, 4000);
    }

    showResetButton() {
        this.resetBtn.classList.add('show');
    }

    showThanksButton() {
        this.thanksBtn.classList.add('show');
    }

    reset() {
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
            this.notificationTimeout = null;
        }

        document.querySelectorAll('.cycle-notification').forEach(el => el.remove());

        this.isFinished = false;
        this.isTransitioning = false;
        this.finalShown = false;
        this.currentSetIndex = 0;

        this.loadCleanImages();
    }

    thanks() {
        window.location.href = "https://t.me/bachata_orsk";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GreetingCard();
});