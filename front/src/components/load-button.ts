import {IButton} from '../interfaces/button';

export class LoadButton implements IButton {
    private readonly btn: HTMLButtonElement;
    public process?: () => Promise<void>;

    constructor(id: string) {
        const el = document.getElementById(id);
        if (!el) throw new Error(`Ошибка разметки. Элемент не найден с id = ${id}`);
        this.btn = el as HTMLButtonElement;

        this.btn.addEventListener('click', this.load(), false);
    }

    hide() {
        this.btn.style.display = 'none';
    }

    show() {
        this.btn.style.display = '';
    }

    private load() {
        return () => {
            this.btn.classList.toggle('button--loading');
            this.process?.().finally(() => this.btn.classList.toggle('button--loading'));
        }
    }
}