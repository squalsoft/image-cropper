import {IHidable} from '../interfaces/hidable';

export class Label implements IHidable{
    private readonly label: HTMLElement;
    constructor(id: string) {
        const el = document.getElementById(id);
        if (!el) throw new Error(`Ошибка разметки. Элемент не найден с id = ${id}`);
        this.label = el;
    }

    hide() {
        this.label.style.display = 'none';
    }

    show() {
        this.label.style.display = '';
    }
}