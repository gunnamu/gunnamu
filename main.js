class LottoMachine extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'lotto-machine');

        const numberDisplay = document.createElement('div');
        numberDisplay.setAttribute('class', 'number-display');

        const drawButton = document.createElement('button');
        drawButton.setAttribute('class', 'draw-button');
        drawButton.textContent = 'Draw Numbers';

        this.styleElement = document.createElement('style');

        shadow.appendChild(this.styleElement);
        shadow.appendChild(wrapper);
        wrapper.appendChild(numberDisplay);
        wrapper.appendChild(drawButton);

        drawButton.addEventListener('click', () => this.drawNumbers(numberDisplay));

        this.drawInitialNumbers(numberDisplay);
    }

    connectedCallback() {
        this.updateStyles();
        window.addEventListener('theme-changed', () => this.updateStyles());
    }

    updateStyles() {
        const computedStyle = getComputedStyle(document.documentElement);
        this.styleElement.textContent = `
            .lotto-machine {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .number-display {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
            }
            .number-ball {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1.5rem;
                font-weight: bold;
                color: white;
                background-color: ${computedStyle.getPropertyValue('--primary-color')};
                box-shadow: 0 4px 8px ${computedStyle.getPropertyValue('--shadow-color')};
            }
            .draw-button {
                padding: 10px 20px;
                font-size: 1.2rem;
                color: white;
                background-color: ${computedStyle.getPropertyValue('--secondary-color')};
                border: none;
                border-radius: 8px;
                cursor: pointer;
                box-shadow: 0 4px 8px ${computedStyle.getPropertyValue('--shadow-color')};
                transition: background-color 0.3s;
            }
            .draw-button:hover {
                background-color: #45a049;
            }
        `;
    }

    drawInitialNumbers(display) {
        for (let i = 0; i < 6; i++) {
            const ball = document.createElement('div');
            ball.setAttribute('class', 'number-ball');
            ball.textContent = '-';
            display.appendChild(ball);
        }
    }

    drawNumbers(display) {
        display.innerHTML = '';
        const numbers = this.generateUniqueNumbers(6, 1, 45);
        for (const number of numbers) {
            const ball = document.createElement('div');
            ball.setAttribute('class', 'number-ball');
            ball.textContent = number;
            display.appendChild(ball);
        }
    }

    generateUniqueNumbers(count, min, max) {
        const numbers = new Set();
        while (numbers.size < count) {
            const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            numbers.add(randomNumber);
        }
        return Array.from(numbers);
    }
}

customElements.define('lotto-machine', LottoMachine);

const themeSwitcher = document.getElementById('theme-switcher');
const root = document.documentElement;

function updateThemeSwitcherText() {
    if (root.classList.contains('dark-mode')) {
        themeSwitcher.textContent = '화이트모드';
    } else {
        themeSwitcher.textContent = '블랙모드';
    }
}

themeSwitcher.addEventListener('click', () => {
    root.classList.toggle('dark-mode');
    localStorage.setItem('theme', root.classList.contains('dark-mode') ? 'dark' : 'light');
    updateThemeSwitcherText(); // Update button text after toggling
    window.dispatchEvent(new CustomEvent('theme-changed'));
});

function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        root.classList.add('dark-mode');
    }
    updateThemeSwitcherText(); // Set initial button text
    window.dispatchEvent(new CustomEvent('theme-changed'));
}

loadTheme();
