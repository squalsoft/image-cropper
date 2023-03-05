import {GalleryItem} from '../interfaces/gallery-item';
import {Gallery} from './gallery';
import {DropZone} from './drop-zone';
import {Tabs} from './tabs';
import {Cutter} from './cutter';
import {LoadButton} from './load-button';
import {IButton} from '../interfaces/button';
import {Uploader} from '../interfaces/uploader';
import {IHidable} from '../interfaces/hidable';

/**
 * Редактор изображений
 */
export class ImageEditor {
    private selectedImageId = 0; // По дефолту не выделено
    private images: GalleryItem[] = [];

    constructor(private readonly gallery: Gallery,
                private readonly dropZone: DropZone,
                private readonly tabs: Tabs,
                private readonly cutter: Cutter,
                private readonly loadButton: IButton,
                private readonly clearButton: IButton,
                private readonly uploader: Uploader,
                private readonly successLabel: IHidable) {
        dropZone.handleFile = this.handleFile();
        tabs.tabOpened = this.tabOpened();
        cutter.zoneSelected = this.zoneSelected();
        gallery.imageDeleted = this.imageDeleted();
        gallery.imageSelected = this.imageSelected();
        loadButton.process = this.uploadImages();
        clearButton.process = this.clearAll();
    }

    /**
     * Очистка до начального состояния
     */
    clearAll() {
        return async () => {
            for (const img of this.images) {
                this.gallery.deleteFromGallery(img.imageId);
            }
            this.images = [];

            this.loadButton.show();
            this.clearButton.hide();
            this.successLabel.hide();
            // Открываем вкладку по умолчанию
            this.tabs.openFirstTab();
        }
    }

    /**
     * Обработчик загрузки картинок на сервер
     */
    uploadImages() {
        return async () => {
            if (!this.images.length) return;

            try {
                for (const img of this.images) {
                    if (!img.region) continue;
                    await this.uploader.uploadFileForCut(img.file, img.region);
                }

                this.loadButton.hide();
                this.clearButton.show();
                this.successLabel.show();
            } catch (err) {
                alert(`Ошибка отправки запроса на сервер: ${err}`);
            }
        }
    }

    /**
     * Обработчик открытия вкладки
     * @param tabName
     */
    tabOpened() {
        return (tabName: string) => {
            // Для вкладки редактора выбираем первую картинку, если не было выбрано ранее
            if (tabName === 'edit-file') {
                if (!this.images.length) return;
                if (!this.selectedImageId) this.gallery.selectImage(this.images[0].imageId);
            }
        }
    }

    /**
     * Обработка загрузки файла
     * @param file
     */
    handleFile() {
        return (file: File) => {
            const newImageId = this.gallery.addToGallery(file);
            this.images.push({imageId: newImageId, file})
        }
    }

    /**
     * Удаление файла из галереи
     * @param imageId
     */
    imageDeleted() {
        return (imageId: number) => {
            this.images = this.images.filter(img => img.imageId !== imageId);
            if (this.selectedImageId === imageId) {
                this.selectedImageId = 0;
                this.cutter.clear();
            }
        }
    }

    imageSelected() {
        return (imageId: number) => {
            this.selectedImageId = imageId;

            const curImg = this.images.find(img => img.imageId == this.selectedImageId);
            if (!curImg) return;

            // Надо отрисовать выбранную картинку
            this.cutter.drawImage(curImg.file, curImg.region);
        }
    }

    zoneSelected() {
        return (region: Region) => {
            const curImg = this.images.find(img => img.imageId == this.selectedImageId);
            if (!curImg) return;
            curImg.region = region;
        }
    }

    init() {
        this.clearAll()();
    }
}