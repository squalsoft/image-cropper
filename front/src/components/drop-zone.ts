export class DropZone {
    private readonly dropArea: HTMLElement;
    private readonly fileInput: HTMLInputElement;
    public handleFile?: (file: File) => void;

    constructor(dropAreaId: string, fileInputId: string)
                {

        const dropEl = document.getElementById(dropAreaId);
        const fileEl = document.getElementById(fileInputId);
        if (!dropEl || !fileEl) throw new Error(`Ошибка разметки. Элемент не найден с id = ${dropAreaId} и id = ${fileInputId}`);
        this.dropArea = dropEl;
        this.fileInput = fileEl as HTMLInputElement;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.dropArea.addEventListener(eventName, this.preventDefaults(), false)
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            this.dropArea.addEventListener(eventName, this.highlight(), false)
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.dropArea.addEventListener(eventName, this.unhighlight(), false)
        });

        this.dropArea.addEventListener('drop', this.handleDrop(), false)
        this.fileInput.addEventListener('change', this.handleFileUploaded(), false);
    }

    private preventDefaults() {
        return function curried_func(e: Event) {

            e.preventDefault()
            e.stopPropagation()
        }
    }

    private handleDrop() {
        const curRefObj = this;
        return function curried_func(e: DragEvent) {
            const dt = e.dataTransfer;
            const files = dt?.files;
            if (files && files.length) curRefObj.handleFile?.(files[0]);
        }
    }

    private handleFileUploaded() {
        const curRefObj = this;
        return function curried_func(e: Event) {
            const files = (e.currentTarget as HTMLInputElement)?.files;
            if (files && files.length) curRefObj.handleFile?.(files[0]);
        }
    }

    private highlight() {
        const curRefObj = this;
        return function curried_func(e: Event) {
            curRefObj.dropArea.classList.add('highlight')
        }
    }

    private unhighlight() {
        const curRefObj = this;
        return function curried_func(e: Event) {
            curRefObj.dropArea.classList.remove('highlight')
        }
    }
}