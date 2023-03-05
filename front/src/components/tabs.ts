export class Tabs {
    private readonly tabs: HTMLElement;
    public tabOpened?: (tabName: string) => void;

    constructor(id: string)
                 {
        const el = document.getElementById(id);
        if (!el) throw new Error(`Ошибка разметки. Элемент не найден с id = ${id}`);
        this.tabs = el;

        const tablinks = el.getElementsByClassName("tablinks");
        for (let i = 0; i < tablinks.length; i++) {
            tablinks[i].addEventListener('click', this.openTab(), false);
        }
    }

    private openTab() {
        const curRefObj = this;
        return function (e: Event) {
            const clickedBtn = e.currentTarget as HTMLHtmlElement;
            if (!clickedBtn) return;

            const targetTab = clickedBtn.dataset.target;
            if (!targetTab) return;

            const tabcontent = document.getElementsByClassName("tabcontent");
            for (let i = 0; i < tabcontent.length; i++) {
                (tabcontent[i] as HTMLElement).style.display = "none";
            }

            const tablinks = document.getElementsByClassName("tablinks");
            for (let i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }

            const tabEl = document.getElementById(targetTab);
            if (!tabEl) return;

            tabEl.style.display = "block";
            clickedBtn.className += " active";

            curRefObj.tabOpened?.(targetTab);
        }
    }

    openFirstTab() {
        (this.tabs.querySelector("#default-open") as HTMLElement)?.click();
    }
}