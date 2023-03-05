import {GalleryItem} from '../interfaces/gallery-item';

export class Gallery {
    private readonly gallery: HTMLElement;
    imageId = 0;

    public imageDeleted?: (imageId: number) => void;
    public imageSelected?: (imageId: number) => void;

    constructor(id: string) {
        const el = document.getElementById(id);
        if (!el) throw new Error(`Ошибка разметки. Элемент не найден с id = ${id}`);
        this.gallery = el;
    }

    public deleteFromGallery(imageId: number) {
        const delBtn = this.gallery
            .querySelector(`[data-id="${imageId}"] button`);
        (delBtn as HTMLElement)?.click();
    }

    private deleteFromGalleryHandler(imageId: number) {
        const curObjRef = this;

        return function (evt: Event) {
            const clickedBtn = evt.target;
            if (!clickedBtn) return;
            clickedBtn.removeEventListener('click', curObjRef.deleteFromGalleryHandler(imageId));

            // Удаляем картинку из галереи
            const delSpan = curObjRef.gallery
                .querySelector(`[data-id="${imageId}"]`);
            const img = delSpan
                ?.querySelector(`img`);
            img?.removeEventListener('click', curObjRef.selectImageHandler(imageId));

            curObjRef.gallery.removeChild(delSpan!);
            curObjRef.imageDeleted?.(imageId);
        }
    }

    addToGallery(file: File): number {
        this.imageId++;
        const newImageId = this.imageId;
        const curObjRef = this;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            const span = document.createElement('span');
            span.className = 'gallery-item'
            span.dataset.id = curObjRef.imageId.toString();
            const btn = document.createElement('button');
            btn.innerHTML = 'Удалить';

            btn.addEventListener('click', curObjRef.deleteFromGalleryHandler(newImageId), false);
            const img = document.createElement('img');
            img.src = reader.result as string;
            img.addEventListener('click', curObjRef.selectImageHandler(newImageId), false);

            span.appendChild(btn);
            span.appendChild(img);
            curObjRef.gallery.appendChild(span);
        }

        return this.imageId;
    }

    /**
     * Выделение картинки
     * @param imageId
     */
    private selectImageHandler(imageId: number) {
        const curRefObj = this;
        return function (evt: Event) {
            curRefObj.selectImage(imageId);
        };
    }

    selectImage(imageId: number) {
        // Снять выделение с другой картинки
        const oldImg = this.gallery
            .querySelector(`img.selected`);
        oldImg?.classList.remove('selected');

        // Выделить необходимую картинку
        const img = this.gallery
            .querySelector(`[data-id="${imageId}"] img`);
        img?.classList.add('selected');

        this.imageSelected?.(imageId);
    }
}