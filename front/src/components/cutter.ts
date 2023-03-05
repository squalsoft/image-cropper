export class Cutter {
    private readonly canvasElem: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private isDown = false;
    private startX: number = 0;
    private startY: number = 0;
    private imgBuffer?: HTMLImageElement;
    private ratio: number = 1; // Коэффициент сжатия/расширения изображения до границ области отрисовки
    private drawWidth = 500;
    private drawHeight = 500;

    // Размеры прямоугольника выделения
    private rectWidth: number = 0;
    private rectHeight: number = 0;

    public zoneSelected?: (region: Region) => void;

    constructor(id: string) {
        const el = document.getElementById(id);
        if (!el) throw new Error(`Ошибка разметки. Элемент не найден с id = ${id}`);
        this.canvasElem = el as HTMLCanvasElement;

        this.ctx = this.canvasElem.getContext("2d") as CanvasRenderingContext2D;

        // Настройка рисования
        this.canvasElem.addEventListener('mousedown', this.onMouseDown(), false);
        this.canvasElem.addEventListener('mouseup', this.onMouseUp(), false);
        this.canvasElem.addEventListener('mousemove', this.onMouseMove(), false);
        this.canvasElem.addEventListener('mouseout', this.onMouseOut(), false);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    drawImage(file: File, region?: Region) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        const img = new Image();
        this.imgBuffer = img;

        this.drawWidth = 500;
        this.drawHeight = 500;

        // Настройка canvas
        img.onload = () => {
            // Определяем позицию изображения и коэффициент сжатия
            if (img.width > img.height) {
                // Горизонтально
                this.ratio = img.width / this.drawWidth;
                // Меняем высоту пропорционально
                this.drawHeight = img.height / this.ratio;
            } else {
                // Вертикально или квадрат
                this.ratio = img.height / this.drawHeight;
                // Меняем ширину пропорционально
                this.drawWidth = img.width / this.ratio;
            }

            this.canvasElem.width = this.drawWidth;
            this.canvasElem.height = this.drawHeight;
            // Настройка рамки обрезки
            this.ctx.strokeStyle = 'orange';
            this.ctx.lineWidth = 1;

            this.ctx.drawImage(img, 0, 0, this.drawWidth, this.drawHeight);

            if (region && region.width && region.height) {
                this.ctx.strokeRect(region.left / this.ratio, region.top / this.ratio,
                    region.width / this.ratio, region.height / this.ratio);
            }
        };

        // Подгрузка картинки на canvas
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            img.src = reader.result as string;
        }
    }

    onMouseDown() {
        const curRefObj = this;
        return function (e: MouseEvent) {
            curRefObj.startX = e.clientX - curRefObj.ctx.canvas.offsetLeft + window.scrollX;
            curRefObj.startY = e.clientY - curRefObj.ctx.canvas.offsetTop + window.scrollY;

            // Флаг, что началось выделение области мышкой
            curRefObj.isDown = true;
        }
    }

    onMouseUp() {
        const curRefObj = this;
        return function (e: MouseEvent) {
            curRefObj.isDown = false;
            curRefObj.calcRegion();
        }
    }

    onMouseMove() {
        const curRefObj = this;
        return function (e: MouseEvent) {
            if (!curRefObj.isDown) {
                return;
            }

            const mouseX = e.clientX - curRefObj.ctx.canvas.offsetLeft + window.scrollX;
            const mouseY = e.clientY - curRefObj.ctx.canvas.offsetTop + window.scrollY;

            // Очистка канваса
            curRefObj.ctx.clearRect(0, 0, curRefObj.ctx.canvas.width, curRefObj.ctx.canvas.height);
            // Перерисовка картинки
            if (curRefObj.imgBuffer) {
                curRefObj.ctx.drawImage(curRefObj.imgBuffer, 0, 0, curRefObj.drawWidth, curRefObj.drawHeight);
            }

            let width = mouseX - curRefObj.startX;
            let height = mouseY - curRefObj.startY;

            curRefObj.rectWidth = width;
            curRefObj.rectHeight = height;

            // Отрисовка прямоугольника от стартовой позиции до текущей
            curRefObj.ctx.strokeRect(curRefObj.startX, curRefObj.startY, width, height);
        }
    }

    onMouseOut() {
        const curRefObj = this;
        return function (e: MouseEvent) {
            curRefObj.isDown = false;
            curRefObj.calcRegion();
        }
    }

    calcRegion() {
        const region: Region = {
            left: this.startX * this.ratio,
            top: this.startY * this.ratio,
            width: this.rectWidth * this.ratio,
            height: this.rectHeight * this.ratio,
        }

        this.zoneSelected?.(region);
    }
}