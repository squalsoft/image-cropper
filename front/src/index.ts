import {add} from './utils';
import './css/styles.css';
import './css/tabs.css';
import {GalleryItem} from './interfaces/gallery-item';

let ctx: CanvasRenderingContext2D;
let isDown = false;
let startX: number;
let startY: number;
let currentFile: File;
let imgBuffer: HTMLImageElement;
const items: GalleryItem[] = [];

function init() {
    // TODO: планирую выделить 3 класса: табы, дроп-зона, галерея, выбор зоны обрезки, которые внедрять в
    // главный класс редактора, а также туда внедрять сервис загрузки файлов на сервер.
    // Пока тут жуткая каша, которую надо организовать по классам и тут их инициализировать

    const canvasElem = document.getElementById("canvas-image") as HTMLCanvasElement;

    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].addEventListener('click', openTab, false);
    }

    const dropArea = document.getElementById('drop-area');
    const fileElem = document.getElementById('file-elem') as HTMLInputElement;
    if (!dropArea || !fileElem || !canvasElem) {
        alert('Ошибка разметки');
        return;
    }
    ctx = canvasElem.getContext("2d") as CanvasRenderingContext2D;

    // Настройка рамки обрезки
    ctx.strokeStyle = 'orange';
    ctx.lineWidth = 1;

    // Настройка рисования
    canvasElem.addEventListener('mousedown', onMouseDown,false);
    canvasElem.addEventListener('mouseup', onMouseUp,false);
    canvasElem.addEventListener('mousemove', onMouseMove,false);
    canvasElem.addEventListener('mouseout', onMouseOut,false);

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false)
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false)
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false)
    });

    dropArea.addEventListener('drop', handleDrop, false)
    fileElem.addEventListener('change', handleFileUploaded, false);

    function handleDrop(e: DragEvent) {
        const dt = e.dataTransfer;
        const files = dt?.files;
        if (files && files.length) handleFile(files[0]);
    }

    function handleFileUploaded(e: Event) {
        const files = (e.currentTarget as HTMLInputElement)?.files;
        if (files && files.length) handleFile(files[0]);
    }

    function highlight(e: Event) {
        dropArea?.classList.add('highlight')
    }

    function unhighlight(e: Event) {
        dropArea?.classList.remove('highlight')
    }


    // const form = document.querySelector("form");
    // form?.addEventListener("submit", submitHandler);

    document.getElementById("default-open")?.click();
}

// Canvas ============
function drawImage(){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const img = new Image();
    imgBuffer = img;
    // Настройка canvas
    img.onload = function(){
        ctx.drawImage(img, 0, 0, 500, 500);
    };

    // Подгрузка картинки на canvas
    const reader = new FileReader();
    reader.readAsDataURL(currentFile);
    reader.onloadend = function () {
        img.src = reader.result as string;
    }
}

// function getMousePosition(e: MouseEvent) {
//     var p = $(e.target).offset(),
//         x = Math.round((e.clientX || e.pageX) - p.left),
//         y = Math.round((e.clientY || e.pageY) - p.top);
//     return { x: x, y: y };
// };
function onMouseDown(e: MouseEvent){
    startX = e.clientX - ctx.canvas.offsetLeft;
    startY = e.clientY - ctx.canvas.offsetTop;

    // set a flag indicating the drag has begun
    isDown = true;
}
function onMouseUp(e: MouseEvent){
    isDown = false;
}
function onMouseMove(e: MouseEvent) {
    if (!isDown) {
        return;
    }

    const mouseX = e.clientX - ctx.canvas.offsetLeft;
    const mouseY = e.clientY - ctx.canvas.offsetTop;

    // Очистка канваса
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Перерисовка картинки
    ctx.drawImage(imgBuffer, 0, 0, 500, 500);

    var width = mouseX - startX;
    var height = mouseY - startY;

    // draw a new rect from the start position
    // to the current mouse position
    ctx.strokeRect(startX, startY, width, height);
}
function onMouseOut(e: MouseEvent) {
    isDown = false;
}

// ============

function preventDefaults(e: Event) {
    e.preventDefault()
    e.stopPropagation()
}

function handleFile(file: File) {
    items.push({file});
    previewFile(file);
    currentFile = file;
    drawImage();
}

function previewFile(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
        const span = document.createElement('span');
        span.className = 'gallery-item'
        const btn = document.createElement('button');
        btn.innerHTML = 'Удалить';
        btn.addEventListener('click', ()=>{}, false);
        const img = document.createElement('img');
        img.src = reader.result as string;

        span.appendChild(btn);
        span.appendChild(img);
        document.getElementById('gallery')?.appendChild(span);
    }
}

// function submitHandler(e: Event) {
//     e.preventDefault();
//     const a = document.querySelector("input[name='a']") as HTMLInputElement;
//     const b = document.querySelector("input[name='b']") as HTMLInputElement;
//     const result = add(Number(a.value), Number(b.value));
//     const resultElement = document.querySelector("p");
//     if (resultElement) {
//         resultElement.textContent = result.toString();
//     }
// }
// Вкладки
function openTab(e: Event) {
    const clickedBtn = e.currentTarget as HTMLHtmlElement;
    if(!clickedBtn) return;

    const targetTab = clickedBtn.dataset.target;
    if(!targetTab) return;

    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        (tabcontent[i] as HTMLElement).style.display = "none";
    }

    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    const tabEl = document.getElementById(targetTab);
    if(!tabEl) return;

    tabEl.style.display = "block";
    clickedBtn.className += " active";
}

init();





